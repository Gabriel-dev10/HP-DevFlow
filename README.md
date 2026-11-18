# HP DevFlow

Aplicativo mobile para acompanhamento de atividades e demandas de desenvolvimento.

O HP DevFlow organiza issues, projetos, responsáveis, prazos e status de entrega em um fluxo inspirado no trabalho de equipes que usam GitLab.

## Tecnologias

- Expo
- React Native
- TypeScript
- Expo Router

## Funcionalidades

- Dashboard de issues atribuídas
- Projetos e progresso por projeto
- Filtros por status de desenvolvimento
- Detalhes de issues com referência GitLab simulada
- Criação de novas demandas
- Fluxo Backlog, Em desenvolvimento, Em revisão e Concluído
- Atividades recentes e progresso de entregas
- Perfil profissional do desenvolvedor

## Melhorias da P2

### API e usuários

- Consumo da API JSONPlaceholder com o serviço `api`.
- Lista de usuários com estados de carregamento, erro, lista vazia e sucesso.
- Atualização da lista ao puxar a tela.
- Tela de detalhes com nome, e-mail e cidade do usuário.

### Armazenamento local

- Wrapper tipado sobre o `AsyncStorage`.
- Dados corrompidos são substituídos pelo valor padrão.
- Hook `usePersistedState` para guardar dados ao alterar.

### Tema

- Tema claro e escuro persistidos no app.
- Switch de modo escuro na tela de Perfil.
- Telas, cartões, textos, navegação e barra de status acompanham o tema.
- Splash permanece ativo até tema e sessão serem carregados.

### Sessão

- Usuário salvo no `AsyncStorage`.
- Token salvo no `SecureStore`, somente em plataformas não web.
- Logout limpa sessão, token e cache.
- Login não aparece novamente enquanto houver sessão ativa.

### Cache e conexão

- Cache da lista de usuários com TTL de 5 minutos.
- Cache antigo exibido quando a API falha.
- Banner “Você está offline”.
- Reconexão atualiza a lista automaticamente.

