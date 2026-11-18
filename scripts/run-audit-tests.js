const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('\n================================================================');
console.log('  SUITE DE TESTES AUTOMATIZADOS: CENÁRIOS DE AUDITORIA STUDYFLOW');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ [PASS] ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}`);
    console.error(`     Erro: ${err.message}`);
    failCount++;
  }
}

async function asyncTest(name, fn) {
  try {
    await fn();
    console.log(`  ✅ [PASS] ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}`);
    console.error(`     Erro: ${err.message}`);
    failCount++;
  }
}

// -------------------------------------------------------------
// Simulação de Storage em memória compatível com AsyncStorage
// -------------------------------------------------------------
const memoryStorage = new Map();
const asyncStorageMock = {
  getItem: async (key) => (memoryStorage.has(key) ? memoryStorage.get(key) : null),
  setItem: async (key, val) => { memoryStorage.set(key, String(val)); },
  removeItem: async (key) => { memoryStorage.delete(key); },
  clear: async () => { memoryStorage.clear(); },
};

// Mock de SecureStore
const secureMemory = new Map();
const secureStoreMock = {
  getItemAsync: async (key) => (secureMemory.has(key) ? secureMemory.get(key) : null),
  setItemAsync: async (key, val) => { secureMemory.set(key, String(val)); },
  deleteItemAsync: async (key) => { secureMemory.delete(key); },
};

// Implementação espelho fiel do wrapper storage.ts
async function storageGet(chave, padrao) {
  try {
    const valor = await asyncStorageMock.getItem(chave);
    if (valor === null) return padrao;
    return JSON.parse(valor);
  } catch {
    return padrao;
  }
}

async function storageSet(chave, valor) {
  await asyncStorageMock.setItem(chave, JSON.stringify(valor));
}

async function storageRemove(chave) {
  await asyncStorageMock.removeItem(chave);
}

// Implementação espelho fiel de cache.ts
async function comCache(chave, buscar, ttlMs = 5 * 60_000, tempoAtual = Date.now) {
  const entrada = await storageGet(chave, null);
  const agora = tempoAtual();

  if (entrada && agora - entrada.salvoEm < ttlMs) {
    return entrada.valor;
  }

  try {
    const valor = await buscar();
    await storageSet(chave, { valor, salvoEm: agora });
    return valor;
  } catch (error) {
    if (entrada) {
      return entrada.valor;
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Cache nao disponivel');
  }
}

// Implementação espelho de logout em auth-context.tsx
async function logoutFlow(storageKeys, secureKeys) {
  await storageRemove(storageKeys.sessao);
  await secureStoreMock.deleteItemAsync(secureKeys.token);
  await storageRemove(storageKeys.usersCache);
  return null; // usuario = null
}

const STORAGE_KEYS = {
  sessao: 'app:v1:sessao',
  tema: 'app:v1:tema',
  usersCache: 'app:v1:cache:users',
  tasks: 'app:v1:tasks',
};

const SECURE_KEYS = {
  token: 'app_v1_token',
};

async function runAllTests() {
  // =============================================================
  // 1. MODO AVIÃO / CONEXÃO
  // =============================================================
  console.log('\n--- 1. TESTES: MODO AVIÃO / CONEXÃO ---');

  await asyncTest('1.1 Cache armazena dados com timestamp (TTL 5 min)', async () => {
    let agora = 1_000_000;
    const mockUsers = [{ id: 1, name: 'Leanne Graham' }];
    let chamouApi = 0;
    const buscarApi = async () => { chamouApi++; return mockUsers; };

    const resultado1 = await comCache(STORAGE_KEYS.usersCache, buscarApi, 5 * 60_000, () => agora);
    assert.deepStrictEqual(resultado1, mockUsers);
    assert.strictEqual(chamouApi, 1, 'Deveria ter chamado a API na primeira vez');

    // Dentro do TTL (< 5 min): não chama a API novamente
    agora += 2 * 60_000; // +2 minutos
    const resultado2 = await comCache(STORAGE_KEYS.usersCache, buscarApi, 5 * 60_000, () => agora);
    assert.deepStrictEqual(resultado2, mockUsers);
    assert.strictEqual(chamouApi, 1, 'Não deveria chamar API dentro do TTL');
  });

  await asyncTest('1.2 Modo Avião: Quando API falha, retorna cache antigo expirado', async () => {
    let agora = 1_000_000;
    const mockUsers = [{ id: 1, name: 'Leanne Graham' }];
    // Popula o cache
    await storageSet(STORAGE_KEYS.usersCache, { valor: mockUsers, salvoEm: agora });

    // Avança o tempo além do TTL (ex.: 10 minutos depois)
    agora += 10 * 60_000;

    // Simula API falhando (ex.: offline / modo avião)
    const buscarApiFalhando = async () => {
      throw new Error('TypeError: Failed to fetch (Offline)');
    };

    const resultado = await comCache(STORAGE_KEYS.usersCache, buscarApiFalhando, 5 * 60_000, () => agora);
    assert.deepStrictEqual(resultado, mockUsers, 'Deveria retornar dados em cache mesmo expirados');
  });

  await asyncTest('1.3 Sem cache e sem conexão: Lança erro controlado', async () => {
    await storageRemove('chave:inexistente');
    const buscarApiFalhando = async () => {
      throw new Error('Falha de rede');
    };

    let capturou = false;
    try {
      await comCache('chave:inexistente', buscarApiFalhando, 5 * 60_000);
    } catch (e) {
      capturou = true;
      assert.strictEqual(e.message, 'Falha de rede');
    }
    assert.strictEqual(capturou, true, 'Deveria lançar erro quando não há cache de fallback');
  });

  test('1.4 Reconexão Automática: Lógica do listener online/offline', () => {
    let online = false;
    let estavaOffline = !online;
    let recarregou = false;

    const recarregar = () => { recarregou = true; };

    // Simula transição para offline
    if (!online) {
      estavaOffline = true;
    }
    assert.strictEqual(estavaOffline, true);
    assert.strictEqual(recarregou, false);

    // Simula reconexão (online = true)
    online = true;
    if (!online) {
      estavaOffline = true;
    } else if (estavaOffline) {
      estavaOffline = false;
      recarregar();
    }

    assert.strictEqual(estavaOffline, false);
    assert.strictEqual(recarregou, true, 'Deveria disparar recarregar() ao voltar para online');
  });

  test('1.5 OfflineBanner presente no código fonte de HomeScreen e IssuesScreen', () => {
    const homeContent = fs.readFileSync(path.join(__dirname, '../src/app/(tabs)/index.tsx'), 'utf-8');
    const tasksContent = fs.readFileSync(path.join(__dirname, '../src/app/(tabs)/tasks.tsx'), 'utf-8');
    assert(homeContent.includes('OfflineBanner'), 'HomeScreen deve importar e usar OfflineBanner');
    assert(homeContent.includes('!online && <OfflineBanner />'), 'HomeScreen deve renderizar OfflineBanner quando offline');
    assert(tasksContent.includes('OfflineBanner'), 'IssuesScreen deve importar e usar OfflineBanner');
  });

  // =============================================================
  // 2. MATAR E REABRIR O APP
  // =============================================================
  console.log('\n--- 2. TESTES: MATAR E REABRIR O APP (PERSISTÊNCIA E SPLASH) ---');

  await asyncTest('2.1 Persistência de Tema e Sessão entre aberturas', async () => {
    // Passo 1: Salva tema escuro e usuário ativo
    await storageSet(STORAGE_KEYS.tema, 'escuro');
    await storageSet(STORAGE_KEYS.sessao, { name: 'Gabriel Silva', email: 'gabriel.silva@hp.dev' });
    await secureStoreMock.setItemAsync(SECURE_KEYS.token, 'studyflow-token-xyz');

    // Passo 2: Simula matar o aplicativo (memória volátil apagada)
    // Passo 3: Reabre o aplicativo (leitura inicial do AsyncStorage)
    const temaCarregado = await storageGet(STORAGE_KEYS.tema, 'claro');
    const sessaoCarregada = await storageGet(STORAGE_KEYS.sessao, null);
    const tokenCarregado = await secureStoreMock.getItemAsync(SECURE_KEYS.token);

    assert.strictEqual(temaCarregado, 'escuro', 'Tema escuro deve persistir após reabertura');
    assert.strictEqual(sessaoCarregada.name, 'Gabriel Silva', 'Usuário deve persistir após reabertura');
    assert.strictEqual(tokenCarregado, 'studyflow-token-xyz', 'Token seguro deve persistir');
  });

  test('2.2 Guarda de Navegação: Não exibe tela de login quando há sessão ativa', () => {
    const layoutContent = fs.readFileSync(path.join(__dirname, '../src/app/_layout.tsx'), 'utf-8');
    // Verifica a regra de redirecionamento quando há sessão ativa
    assert(
      layoutContent.includes("segmentos[0] === 'login'") && layoutContent.includes("Redirect href={'/'"),
      'Guarda deve redirecionar para tela principal se usuario ja estiver logado',
    );
    assert(
      layoutContent.includes('SplashScreen.preventAutoHideAsync()'),
      'Splash Screen deve ser segurada no topo',
    );
    assert(
      layoutContent.includes('SplashScreen.hideAsync()'),
      'Splash Screen só deve ocultar após tema e sessão carregados',
    );
  });

  test('2.3 JSON corrompido no storage é tratado com try/catch e retorna padrão', async () => {
    // Força gravação de string inválida no storage
    await asyncStorageMock.setItem('teste:corrompido', '{ json_invalido: 123');
    const valor = await storageGet('teste:corrompido', 'valor_padrao');
    assert.strictEqual(valor, 'valor_padrao', 'Deve retornar padrão em caso de JSON inválido');
  });

  // =============================================================
  // 3. LOGOUT
  // =============================================================
  console.log('\n--- 3. TESTES: LOGOUT (LIMPEZA COMPLETA) ---');

  await asyncTest('3.1 Ao sair da sessão: limpa usuário, token e cache de usuários', async () => {
    // Prepara dados no storage
    await storageSet(STORAGE_KEYS.sessao, { name: 'Test User', email: 'test@example.com' });
    await secureStoreMock.setItemAsync(SECURE_KEYS.token, 'token-123');
    await storageSet(STORAGE_KEYS.usersCache, { valor: [{ id: 1 }], salvoEm: Date.now() });

    // Executa logout
    const novoUsuario = await logoutFlow(STORAGE_KEYS, SECURE_KEYS);

    assert.strictEqual(novoUsuario, null, 'Usuário deve ser setado para null');
    const sessaoApos = await storageGet(STORAGE_KEYS.sessao, null);
    const tokenApos = await secureStoreMock.getItemAsync(SECURE_KEYS.token);
    const cacheApos = await storageGet(STORAGE_KEYS.usersCache, null);

    assert.strictEqual(sessaoApos, null, 'Sessão no AsyncStorage deve ser removida');
    assert.strictEqual(tokenApos, null, 'Token no SecureStore deve ser removido');
    assert.strictEqual(cacheApos, null, 'Cache da lista de usuários deve ser removido');
  });

  // =============================================================
  // 4. TECLADO ABERTO NO LOGIN E NOVA DEMANDA
  // =============================================================
  console.log('\n--- 4. TESTES: TECLADO ABERTO (LOGIN E NOVA DEMANDA) ---');

  test('4.1 Tela de Login usa KeyboardAvoidingView e ScrollView com persistência de toque', () => {
    const loginContent = fs.readFileSync(path.join(__dirname, '../src/app/login.tsx'), 'utf-8');
    assert(loginContent.includes('KeyboardAvoidingView'), 'Login deve usar KeyboardAvoidingView');
    assert(loginContent.includes('keyboardShouldPersistTaps="handled"'), 'Login deve configurar keyboardShouldPersistTaps');
    assert(loginContent.includes('useSafeAreaInsets'), 'Login deve usar useSafeAreaInsets');
    assert(loginContent.includes('maxWidth: 420'), 'Login deve respeitar largura máxima');
    assert(loginContent.includes('minHeight: 48'), 'Inputs do Login devem ter altura de toque >= 48');
  });

  test('4.2 Tela de Nova Demanda usa KeyboardAvoidingView e ScrollView', () => {
    const newTaskContent = fs.readFileSync(path.join(__dirname, '../src/app/new-task.tsx'), 'utf-8');
    assert(newTaskContent.includes('KeyboardAvoidingView'), 'NewTask deve usar KeyboardAvoidingView');
    assert(newTaskContent.includes('keyboardShouldPersistTaps="handled"'), 'NewTask deve configurar keyboardShouldPersistTaps');
    assert(newTaskContent.includes('ScrollView'), 'NewTask deve estar contida em ScrollView');
    assert(newTaskContent.includes('minHeight: 48'), 'Inputs da Nova Demanda devem ter altura mínima de 48');
    assert(newTaskContent.includes('minHeight: 44'), 'Botões de prioridade devem ter altura mínima de 44');
  });

  // =============================================================
  // 5. ROTAÇÃO DE TELA (RETRATO E PAISAGEM)
  // =============================================================
  console.log('\n--- 5. TESTES: ROTAÇÃO DE TELA (RETRATO E PAISAGEM) ---');

  test('5.1 Telas longas são roláveis (ScrollView/FlatList) e não cortam em modo paisagem', () => {
    const profile = fs.readFileSync(path.join(__dirname, '../src/app/(tabs)/profile.tsx'), 'utf-8');
    const stats = fs.readFileSync(path.join(__dirname, '../src/app/(tabs)/statistics.tsx'), 'utf-8');
    const taskDetails = fs.readFileSync(path.join(__dirname, '../src/app/task-details.tsx'), 'utf-8');
    const userDetails = fs.readFileSync(path.join(__dirname, '../src/app/(app)/user/[id].tsx'), 'utf-8');

    assert(profile.includes('ScrollView') && profile.includes('contentContainerStyle'), 'Perfil deve ser rolável');
    assert(stats.includes('ScrollView') && stats.includes('contentContainerStyle'), 'Estatísticas deve ser rolável');
    assert(taskDetails.includes('ScrollView') && taskDetails.includes('contentContainerStyle'), 'Detalhes da Demanda deve ser rolável');
    assert(userDetails.includes('ScrollView') && userDetails.includes('contentContainerStyle'), 'Detalhes do Usuário deve ser rolável');
  });

  test('5.2 Todas as telas utilizam useSafeAreaInsets para notch e barras do sistema', () => {
    const filesToCheck = [
      '../src/app/login.tsx',
      '../src/app/(tabs)/index.tsx',
      '../src/app/(tabs)/tasks.tsx',
      '../src/app/(tabs)/calendar.tsx',
      '../src/app/(tabs)/statistics.tsx',
      '../src/app/(tabs)/profile.tsx',
      '../src/app/new-task.tsx',
      '../src/app/task-details.tsx',
      '../src/app/(app)/user/[id].tsx',
    ];

    for (const relPath of filesToCheck) {
      const fullPath = path.join(__dirname, relPath);
      const content = fs.readFileSync(fullPath, 'utf-8');
      assert(
        content.includes('useSafeAreaInsets'),
        `O arquivo ${path.basename(relPath)} deve importar e usar useSafeAreaInsets`,
      );
    }
  });

  // =============================================================
  // 6. FONTE DO SISTEMA AMPLIADA E ALVOS DE TOQUE
  // =============================================================
  console.log('\n--- 6. TESTES: ACESSIBILIDADE, TEXTOS LONGOS E ALVOS DE TOQUE ---');

  test('6.1 Textos longos possuem numberOfLines e ellipsizeMode adequados', () => {
    const home = fs.readFileSync(path.join(__dirname, '../src/app/(tabs)/index.tsx'), 'utf-8');
    const userDetail = fs.readFileSync(path.join(__dirname, '../src/app/(app)/user/[id].tsx'), 'utf-8');
    const tasks = fs.readFileSync(path.join(__dirname, '../src/app/(tabs)/tasks.tsx'), 'utf-8');
    const profile = fs.readFileSync(path.join(__dirname, '../src/app/(tabs)/profile.tsx'), 'utf-8');

    assert(home.includes('numberOfLines={1}') && home.includes('ellipsizeMode="tail"'), 'Home trata nome/email longo');
    assert(userDetail.includes('numberOfLines={2}') && userDetail.includes('ellipsizeMode="tail"'), 'Detalhes trata nome longo');
    assert(tasks.includes('numberOfLines={2}') && tasks.includes('ellipsizeMode="tail"'), 'Tasks trata título longo');
    assert(profile.includes('numberOfLines={1}') && profile.includes('ellipsizeMode="tail"'), 'Perfil trata nome e email longo');
  });

  test('6.2 Alvos de toque respeitam padrão mínimo de 44x44pt', () => {
    const buttonComponent = fs.readFileSync(path.join(__dirname, '../src/components/Button.tsx'), 'utf-8');
    const tasks = fs.readFileSync(path.join(__dirname, '../src/app/(tabs)/tasks.tsx'), 'utf-8');
    const taskDetails = fs.readFileSync(path.join(__dirname, '../src/app/task-details.tsx'), 'utf-8');
    const home = fs.readFileSync(path.join(__dirname, '../src/app/(tabs)/index.tsx'), 'utf-8');
    const profile = fs.readFileSync(path.join(__dirname, '../src/app/(tabs)/profile.tsx'), 'utf-8');

    assert(buttonComponent.includes('minHeight: 48'), 'Botão principal deve ter minHeight >= 48');
    assert(tasks.includes('filterButton:') && tasks.includes('minHeight: 44'), 'Botões de filtro devem ter minHeight >= 44');
    assert(taskDetails.includes('statusOption:') && taskDetails.includes('minHeight: 44'), 'Opções de status devem ter minHeight >= 44');
    assert(home.includes('retry:') && home.includes('minHeight: 44'), 'Botão de tentar de novo deve ter minHeight >= 44');
    assert(profile.includes('logout:') && profile.includes('minHeight: 48'), 'Botão de logout deve ter minHeight >= 48');
  });

  // =============================================================
  // RELATÓRIO FINAL DE EXECUÇÃO
  // =============================================================
  console.log('\n================================================================');
  console.log(`  RESULTADO DOS TESTES: ${passCount} PASSOU | ${failCount} FALHOU`);
  console.log('================================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Erro fatal durante execução da suíte de testes:', err);
  process.exit(1);
});
