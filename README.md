# StudyFlow (HP DevFlow) — Aplicativo Híbrido

Aplicativo mobile em **React Native com Expo** voltado para o acompanhamento de atividades, projetos e demandas técnicas de desenvolvimento de software. A lista de membros do time é consumida de uma API pública externa (**JSONPlaceholder**) com camada inteligente de cache offline, enquanto a gestão de demandas, preferências e sessão são persistidas localmente de forma segura.

> **Trabalho da disciplina de Aplicativos Híbridos (Univassouras).**

---

## Como executar

### Pré-requisitos
- Node.js (versão 20 ou superior)
- npm ou yarn
- Aplicativo **Expo Go** instalado no celular físico (Android ou iOS) ou emulador/simulador configurado

### 1. Instalação das dependências
```bash
npm install
```

### 2. Inicialização do aplicativo
```bash
npx expo start
```
- **No celular físico:** Abra o app Expo Go e leia o código QR exibido no terminal. (Se os aparelhos estiverem em redes isoladas, use `npx expo start --tunnel`).
- **No emulador Android:** Pressione `a` no terminal.
- **No simulador iOS:** Pressione `i` no terminal.
- **No navegador (Web):** Pressione `w` no terminal ou execute `npx expo start --web`.

### 3. Credenciais de demonstração
Para acessar o aplicativo na tela de login, você pode usar qualquer e-mail e senha válidos:

| Campo | Valor de Demonstração |
| :--- | :--- |
| **E-mail** | `gabriel.silva@hp.dev` (ou qualquer e-mail válido com `@`) |
| **Senha** | Qualquer senha (ex.: `123456`) |

### 4. Execução dos testes automatizados
O projeto conta com uma suíte de testes de integração automatizados cobrindo os cenários de auditoria da disciplina (offline, cache, persistência, logout, responsividade e acessibilidade):
```bash
npm test
```

Para validação estática de tipagem e formatação:
```bash
npx tsc --noEmit
npx eslint .
```

---

## Arquitetura do Aplicativo

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       DISPOSITIVO MÓVEL (EXPO / REACT NATIVE)               │
├─────────────────────────────────────────────────────────────────────────────┤
│  Telas & Rotas (Expo Router v57)                                            │
│  ├── Login & Splash Guard (_layout.tsx)                                     │
│  ├── Abas: Dashboard / Issues / Projetos / Estatísticas / Perfil            │
│  └── Pilha Interna: Detalhes do Usuário / Detalhes da Issue / Nova Demanda  │
├──────────────────────────────────────┬──────────────────────────────────────┤
│  Estado Global & Contextos           │  Hooks Especializados                │
│  ├── AuthContext (Sessão & Logout)   │  ├── useFetch (Loading/Erro/Dados)   │
│  ├── ThemeContext (Claro / Escuro)   │  ├── useOnline (NetInfo Listener)    │
│  └── TaskContext (Demandas Kanban)   │  └── usePersistedState (AsyncSync)   │
├──────────────────────────────────────┴──────────────────────────────────────┤
│  Camada de Serviços & Armazenamento                                         │
│  ├── api.ts          ──► Cliente HTTP REST (JSONPlaceholder)                │
│  ├── cache.ts        ──► Cache com TTL (5 min) e Fallback Stale-While-Error │
│  ├── storage.ts      ──► AsyncStorage Tipado (Generics + Fallback Seguro)   │
│  └── seguro.ts       ──► SecureStore Criptografado (Keychain / Keystore)    │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼ HTTPS / JSON
                     ┌───────────────────────────────────┐
                     │ API JSONPlaceholder               │
                     │ (https://jsonplaceholder.typicode.com)
                     └───────────────────────────────────┘
```

---

## Telas do Aplicativo

| Rota | Arquivo | Descrição e Funcionalidade |
| :--- | :--- | :--- |
| `/login` | `src/app/login.tsx` | Autenticação com validação de campos, teclado adaptativo e feedback de erro |
| `/` | `src/app/index.tsx` | Redirecionador inteligente baseado no estado da sessão |
| `/(tabs)` | `src/app/(tabs)/index.tsx` | **Dashboard / Usuários:** Lista de usuários da equipe vinda da API, com pull-to-refresh, 4 estados e banner offline |
| `/(tabs)/tasks` | `src/app/(tabs)/tasks.tsx` | **Issues:** Demandas de desenvolvimento com filtros de fluxo (Backlog, Em dev, Revisão, Concluído) |
| `/(tabs)/calendar` | `src/app/(tabs)/calendar.tsx` | **Projetos:** Visão consolidada por projeto, métricas de conclusão e barras de progresso |
| `/(tabs)/statistics` | `src/app/(tabs)/statistics.tsx` | **Estatísticas:** Taxa de entrega, cartões de métricas responsivos e histórico de alterações |
| `/(tabs)/profile` | `src/app/(tabs)/profile.tsx` | **Perfil:** Dados da conta, avatar dinâmico com iniciais, alternador de modo escuro e botão de saída |
| `/user/[id]` | `src/app/(app)/user/[id].tsx` | **Detalhes do Usuário:** Nome, e-mail e cidade do membro da equipe, com suporte a cache offline |
| `/new-task` | `src/app/new-task.tsx` | **Nova Demanda:** Formulário de criação de issue com teclado adaptativo e seleção de prioridade |
| `/task-details/[id]` | `src/app/task-details.tsx` | **Detalhes da Issue:** Descrição técnica, alteração de status do fluxo, responsável e link GitLab simulado |

---

## Navegação (Expo Router)

- **Pilha Raiz (`app/_layout.tsx`):**
  - Mantém a Splash Screen ativa (`SplashScreen.preventAutoHideAsync()`) até que tema e sessão estejam completamente hidratados.
  - O componente `Guarda` protege a navegação: se o usuário não estiver autenticado, força o redirecionamento para `/login`. Se já estiver logado, impede a abertura da tela de login redirecionando para a área principal.
  - Elimina flashes de tela branca com `contentStyle: { backgroundColor: cores.background }`.
- **Layout de Abas (`(tabs)/_layout.tsx`):**
  - Gerencia as 5 seções principais com ícones temáticos (`lucide-react-native`).
  - Barra de abas com cores ativas e inativas sincronizadas com o tema corrente.
- **Pilha de Telas Internas (`(app)/_layout.tsx`):**
  - Cabeçalhos nativos adaptados dinamicamente com as cores de superfície e texto do tema.

---

## APIs Consumidas e Resiliência de Rede

| API / Serviço | Tipo | Finalidade |
| :--- | :--- | :--- |
| **JSONPlaceholder** (`/users`, `/users/:id`) | REST / JSON | Catálogo de membros da equipe e desenvolvedores associados |
| **NetInfo** (`@react-native-community/netinfo`) | Event Listener Nativo | Detecção em tempo real do estado da conexão à internet |

### Estratégia Offline-First:
1. **Cache com TTL (5 minutos):** Toda requisição à lista de usuários grava o payload e o timestamp de gravação no `AsyncStorage`. Requisições subsequentes dentro da janela de 5 minutos são resolvidas instantaneamente sem tráfego de rede.
2. **Fallback Gracioso (Modo Avião):** Se a requisição de rede falhar (ex.: sem sinal ou modo avião ativado), o app recupera e exibe a última resposta válida do cache, mesmo que expirada.
3. **Banner "Você está offline":** Exibido de forma destacada e acessível quando a conexão é perdida.
4. **Reconexão Autônoma:** Ao detectar o retorno da conectividade através do hook `useOnline`, a tela de usuários atualiza seus dados automaticamente sem exigir ação do usuário.

---

## Armazenamento Local e Segurança

| Onde | Mecanismo | O que é armazenado |
| :--- | :--- | :--- |
| **Cofre Seguro** | `expo-secure-store` (`services/seguro.ts`) | Token de sessão (`app_v1_token`) criptografado no Keychain (iOS) ou Keystore (Android). Desabilitado em web para prevenir vulnerabilidades de LocalStorage. |
| **Armazenamento Local** | `AsyncStorage` (`services/storage.ts`) | Objeto do usuário logado (`app:v1:sessao`), preferência de tema (`app:v1:tema`), lista de demandas (`app:v1:tasks`) e cache de requisições (`app:v1:cache:users`). |

### Características de Segurança e Robustez:
- **Wrapper Tipado Genérico:** O módulo `storage.ts` expõe métodos genéricos `get<T>` e `set<T>`, garantindo type-safety em tempo de compilação.
- **Tratamento de Dados Corrompidos:** Se o conteúdo no armazenamento local for adulterado ou apresentar JSON inválido, o wrapper captura o erro silenciosamente via `try/catch` e retorna o valor padrão sem travar a aplicação.
- **Logout Seguro e Atômico:** Ao sair da conta, o método `sair()` limpa simultaneamente a sessão, o token do cofre seguro e o cache de dados em disco.

---

## Responsividade Mobile e Acessibilidade

Todas as telas do aplicativo foram auditadas e adequadas às diretrizes de interface mobile (Apple HIG e Android Material):

- **Safe Area Insets:** Todas as telas utilizam o hook `useSafeAreaInsets` (`react-native-safe-area-context`) para respeitar entalhes (*notch*), barra de status superior e barra de gestos inferior (*home indicator*).
- **Tratamento de Teclado:** Os formulários (`login.tsx` e `new-task.tsx`) utilizam `KeyboardAvoidingView` com ajuste por plataforma (`padding` no iOS) e contêineres `ScrollView` com `keyboardShouldPersistTaps="handled"`, evitando que o teclado sobreponha campos ou bloqueie toques.
- **Rolagem e Orientação Paisagem:** Telas de conteúdo extenso utilizam `ScrollView` com `flexGrow: 1`, garantindo que nenhum botão ou texto seja truncado quando o aparelho for rotacionado para o modo horizontal ou utilizado em telas compactas (ex.: 360x640).
- **Alvos de Toque (≥44pt):** Botões de ação, filtros de status, opções de fluxo e botões de repetição respeitam o tamanho mínimo de toque de 44x44pt.
- **Escala de Fonte:** Textos dinâmicos sensíveis a tamanhos grandes contam com `numberOfLines` e `ellipsizeMode="tail"`.

---

## Organização do Código

```text
StudyFlow/
├── assets/                     # Ícones, splash screens e imagens
├── scripts/
│   ├── run-audit-tests.js      # Suíte de testes automatizados de auditoria
│   └── reset-project.js        # Script de inicialização padrão do template
├── src/
│   ├── app/                    # Rotas da aplicação (Expo Router)
│   │   ├── (app)/              # Grupo de telas autenticadas e pilha interna
│   │   │   ├── user/[id].tsx   # Detalhes do usuário
│   │   │   └── _layout.tsx     # Pilha temática interna
│   │   ├── (auth)/             # Redirecionamento de autenticação
│   │   ├── (tabs)/             # Navegação por abas principais
│   │   │   ├── index.tsx       # Dashboard / Usuários (API + Cache)
│   │   │   ├── tasks.tsx       # Issues (Filtros de desenvolvimento)
│   │   │   ├── calendar.tsx    # Projetos e progresso
│   │   │   ├── statistics.tsx  # Estatísticas e histórico
│   │   │   ├── profile.tsx     # Perfil e modo escuro
│   │   │   └── _layout.tsx     # Configuração da barra de abas
│   │   ├── _layout.tsx         # Layout raiz (Splash, Theme & Auth Guard)
│   │   ├── login.tsx           # Tela de autenticação
│   │   ├── new-task.tsx        # Criação de demanda
│   │   └── task-details.tsx    # Detalhes da demanda
│   ├── components/             # Componentes reutilizáveis (Button, OfflineBanner)
│   ├── data/                   # Contextos de estado (Auth, Theme, Tasks)
│   ├── hooks/                  # Hooks customizados (useFetch, useOnline, usePersistedState)
│   ├── services/               # Clientes de API, Cache, SecureStore e Storage
│   ├── theme/                  # Tokens de cores (claro/escuro) e espaçamentos
│   └── types/                  # Definições de tipos TypeScript
├── package.json                # Dependências e scripts do projeto
├── tsconfig.json               # Configurações do TypeScript
└── app.json                    # Configurações do Expo
```
