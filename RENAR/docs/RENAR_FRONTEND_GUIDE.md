# RENAR Frontend - Guia de Arquitetura, Menus e Componentes

Este documento descreve a estrutura do frontend do RENAR (Next.js App Router), detalhando:

- Como a aplicacao e organizada (rotas, layouts e providers)
- Como o menu lateral e montado e como aplicar regras de acesso
- Padroes de paginas (acessos rapidos, busca/listagem, formularios)
- Como replicar a mesma abordagem em um novo sistema

Objetivo: servir como referencia para evolucoes do RENAR e como um "template mental" para construir outro sistema com a mesma experiencia e organizacao.

---

## 1) Stack e bibliotecas principais

- Next.js 15 (App Router): rotas em `src/app/*` com layouts por pasta.
- NextAuth (Azure AD B2C): autenticacao, sessao e refresh de tokens.
- @tanstack/react-query: cache e controle de requests no client.
- React Hook Form: formularios e validacao client-side.
- Zod: validacao de variaveis de ambiente.
- TailwindCSS + @cnc-ti/layout-basic: design system/layout base (Sidebar, Header, PageHeader etc.).
- react-toastify e sweetalert2: feedback visual (toasts e modais).

### Scripts (package.json)

- `npm run dev`: sobe o Next em desenvolvimento (`next dev --turbopack`).
- `npm run build`: build de producao (`next build --turbopack`).
- `npm run start`: sobe o servidor do build (`next start`).
- `npm run lint`: roda ESLint.

---

## 2) Estrutura de pastas (visao macro)

### `src/app` (rotas)

- `src/app/layout.tsx`: layout raiz (fontes, CSS global, providers globais).
- `src/app/(private)/*`: rotas autenticadas (grupo "private"; nao aparece na URL).
- `src/app/(public)/*`: rotas publicas (ex: telas de "sessao expirada").
- `src/app/api/*`: endpoints do Next (ex: NextAuth).

### `src/components` (UI por dominio + layout)

- `src/components/layouts/*`: layout, containers, header, sidebar, componentes utilitarios.
- `src/components/<dominio>/*`: componentes por modulo (ex: `atividades`, `orgaos`, `mandatos`).
- `src/components/shared/*`: componentes reutilizaveis entre modulos.

### `src/services` (integracao com API)

- `src/services/api.ts`: helpers `fetch` com Bearer token (server/client).
- `src/services/*.service.ts`: servicos por dominio (CRUD e integracoes).

### `src/hooks` (regras de tela/consulta)

- Hooks por dominio (ex: `src/hooks/representantes/*`) e hooks utilitarios (query params, debounce etc.).
- `src/hooks/useSessionEntity.tsx`: centraliza leitura da sessao e "entidade/role".

### `src/lib` (auth, env e tipos)

- `src/lib/env.ts`: validacao de variaveis de ambiente via Zod.
- `src/lib/nextAuth/*`: configuracao do NextAuth e servicos do Azure B2C.

---

## 3) Rotas e rotinas do sistema (mapa funcional)

O RENAR organiza cada dominio em um "modulo" com paginas tipicas:

1. Acesso rapido (cards para acoes principais)
2. Busca/Listagem (filtros + grid/lista + acoes)
3. Novo/Cadastro (formulario)
4. Detalhe/Visualizacao (quando aplicavel)
5. Edicao (quando aplicavel)

### 3.1) Rotas privadas (App Router)

As rotas abaixo existem em `src/app/(private)` (o prefixo `(private)` nao aparece na URL):

- Representacoes
  - `/representacoes`
  - `/representacoes/busca`
  - `/representacoes/novo`
  - `/representacoes/[id]`
  - `/representacoes/editar/[id]`
- Representantes
  - `/representantes`
  - `/representantes/buscar`
  - `/representantes/novo`
  - `/representantes/[id]`
  - `/representantes/editar`
- Orgaos
  - `/orgaos`
  - `/orgaos/busca`
  - `/orgaos/novo`
  - `/orgaos/[id]`
  - `/orgaos/[id]/editar`
- Atividades
  - `/atividades`
  - `/atividades/buscar`
  - `/atividades/novo`
  - `/atividades/[id]`
  - `/atividades/editar/[id]`
- Operacional (Mandatos/Eventos)
  - `/mandatos`
  - `/mandatos/busca`
  - `/mandatos/novo`
  - `/mandatos/[id]/editar`
  - `/mandatos/[id]/visualizar`
- Parametros
  - Motivos de Cancelamento
    - `/motivos-cancelamento`
    - `/motivos-cancelamento/busca`
    - `/motivos-cancelamento/novo`
    - `/motivos-cancelamento/[id]`
    - `/motivos-cancelamento/[id]/editar`
  - Tipos de Mandato
    - `/tipos-mandato`
    - `/tipos-mandato/busca`
    - `/tipos-mandato/novo`
    - `/tipos-mandato/[id]`
    - `/tipos-mandato/[id]/editar`
  - Texto Web
    - `/texto-web`
    - `/texto-web/buscar`
    - `/texto-web/novo`
    - `/texto-web/[id]`
    - `/texto-web/editar/[id]`
  - Tipo Perfil
    - `/tipo-perfil`
    - `/tipo-perfil/buscar`
    - `/tipo-perfil/novo`
    - `/tipo-perfil/[id]`
    - `/tipo-perfil/[id]/editar`
  - Categoria
    - `/categorias`
    - `/categorias/buscar`
    - `/categorias/novo`
    - `/categorias/[id]`
    - `/categorias/editar/[id]`
  - Cargos
    - `/cargos`
    - `/cargos/buscar`
    - `/cargos/novo`
    - `/cargos/[id]`
    - `/cargos/[id]/editar`
  - Tipo Orgao
    - `/tipos-orgaos`
    - `/tipos-orgaos/busca`
    - `/tipos-orgaos/novo`
    - `/tipos-orgaos/[id]`
    - `/tipos-orgaos/[id]/editar`
  - Area Tematica
    - `/area-tematica`
    - `/area-tematica/buscar`
    - `/area-tematica/novo`
    - `/area-tematica/[id]`
    - `/area-tematica/editar/[id]`
  - Prioridade de Representacao
    - `/prioridade-representacao`
    - `/prioridade-representacao/buscar`
    - `/prioridade-representacao/novo`
    - `/prioridade-representacao/[id]`
    - `/prioridade-representacao/editar/[id]`
  - Funcoes
    - `/funcoes`
    - `/funcoes/buscar`
    - `/funcoes/novo`
    - `/funcoes/[id]`
    - `/funcoes/editar/[id]`
  - Tipos de Reuniao
    - `/tipo-reuniao`
    - `/tipo-reuniao/buscar`
    - `/tipo-reuniao/novo`
    - `/tipo-reuniao/[id]`
    - `/tipo-reuniao/editar/[id]`

### 3.2) Rotas publicas

Localizadas em `src/app/(public)`:

- `/denied`: sessao ausente/expirada (botao "Entrar").
- `/denied/token-expired`: refresh token expirado (forca novo login).

---

## 4) Menu lateral e navegacao

O menu lateral e definido em `src/components/layouts/main.tsx` como um array de itens (`sidebarMenuItems`) com:

- `title`: nome exibido
- `url`: rota alvo
- `icon`: classe FontAwesome (string)
- `enable`: habilita/desabilita o item
- `children`: submenu (quando colapsavel)
- `role`: lista de roles permitidas (ex: `admin`, `basic`)

### 4.1) Grupos atuais do menu

- Itens diretos: Home, Representacoes, Representantes, Orgaos, Atividades
- Grupo Operacional: Mandatos/Eventos
- Grupo Parametros: Motivos de Cancelamento, Tipos de Mandato, Texto Web, Tipo Perfil, Categoria, Cargos, Tipo Orgao, Area Tematica, Prioridade de Representacao, Funcoes, Tipos de Reuniao

### 4.2) Controle de acesso no menu (role-based)

No render do menu, o item so aparece se:

- `menu.role.includes(userRole)`

O `userRole` vem de `src/hooks/useSessionEntity.tsx`.

Importante: esconder no menu nao e o mesmo que proteger a rota. Para protecao real, veja a secao de middleware/layout protegido.

---

## 5) Layouts, providers e shell da aplicacao

### 5.1) Layout raiz

`src/app/layout.tsx`:

- Importa CSS global (`@cnc-ti/layout-basic/styles` e `src/styles/globals.css`)
- Importa `src/lib/env` (validacao de env no boot)
- Monta o `ReactQueryProvider` (global)

### 5.2) Layout privado (app autenticada)

`src/app/(private)/layout.tsx`:

- Empilha providers usados no app logado:
  - `AppProvider` (inclui `SessionProvider` do NextAuth)
  - `ReactQueryProvider` (wrapper do TanStack Query)
  - `DrawerProvider` e `ModalProvider`
  - `ToastContainer` (feedback)
  - `Main` (shell: sidebar + header + conteudo)

### 5.3) Main (Sidebar + Header + Conteudo)

`src/components/layouts/main.tsx`:

- Sidebar colapsavel (itens + subitens).
- Header com perfil e acoes (trocar entidade / sair).
- Modal "Trocar entidades" (hook de sessao + react-hook-form).
- Tratamento de expiracao de refresh token: `useMain` observa `session.error` e aciona `signOut` com redirect para `/denied/token-expired`.

---

## 6) Padroes de componentes de pagina

### 6.1) Acesso rapido (blocos de acesso)

Padrao: cabecalho + grid de cards, cada card aponta para uma rotina (novo/buscar).

- Componente-chave: `src/components/layouts/ui/cards/cartao-acao-pagina.tsx`
- Estrutura tipica:
  - `PageHeader` + `Container`
  - `CartaoAcaoPagina` em grid responsivo

Exemplo real: `src/components/atividades/acesso-rapido-atividades.tsx`

### 6.2) Busca/Listagem

Padrao: cabecalho com acoes + barra de busca + resultado (grid/lista) + metadados.

Pecas comuns:

- `PageHeader`: titulo/descricao e area de acoes
  - `src/components/layouts/ui/page-header/index.tsx`
- `SearchBarContainer`: wrapper visual para filtros
  - `src/components/layouts/search-bar-container.tsx`
- `ResultMetadata`: "X encontrados" + dicas
  - `src/components/shared/metadata-result.tsx`
- `ResultContainer`: grid responsivo para cards
  - `src/components/layouts/resultContainer.tsx`

Exemplo completo: `src/components/pages/representantes/buscar/pagina-busca-representantes.tsx`

### 6.3) Formularios (novo e editar)

Padrao recorrente:

- `react-hook-form` como estado do formulario
- Componentes de campo do `@cnc-ti/layout-basic` (inputs, selects, etc.)
- Envio chama um service (`src/services/<dominio>.service.ts`) e atualiza cache/feedback.

---

## 7) Integracao com API (services + helpers)

### 7.1) Helpers de request autenticado

`src/services/api.ts` fornece:

- `httpAuthServer(path, init?)`: `fetch` no server com Bearer (usa `getServerSession`).
- `httpAuthClient(path, init?)`: `fetch` no client com Bearer (usa `getSession`).

Padrao esperado para cada modulo:

1. Criar `src/services/<dominio>.service.ts` com funcoes CRUD
2. Criar hook de tela (`src/hooks/<dominio>/*`) para orquestrar queries/mutations e estados
3. Usar esse hook nos componentes de pagina

---

## 8) Autenticacao, sessao e seguranca (NextAuth + middleware)

### 8.1) NextAuth (Azure AD B2C)

Arquivos principais:

- `src/app/api/auth/[...nextauth]/route.ts`: handler NextAuth.
- `src/lib/nextAuth/config.ts`: `authOptions` (provider, callbacks, secret).
- `src/lib/nextAuth/services/auth.b2c.ts`: extracao de claims do `id_token`, refresh do token.

Pontos de atencao:

- O token do usuario (B2C) e persistido em `session.id_token`.
- O callback `jwt` trata refresh token quando necessario e marca `token.error = "refresh-token-expired"` se falhar.

### 8.2) Middleware de protecao global

`src/middleware.ts`:

- Intercepta todas as rotas (`matcher: ["/:path*"]`).
- Se a sessao/cookie nao existir: reescreve para `/denied`.
- Se refresh token expirou: redireciona para `/denied/token-expired`.
- Decodifica o token com `NEXTAUTH_SECRET` (fallback para env quando necessario).

Esse middleware e o guardiao de acesso. Mesmo que alguem tente acessar uma rota diretamente, cai nas telas publicas quando nao ha sessao valida.

### 8.3) Protecao por role (server-side)

`src/components/layouts/protected-layout/protected-layout.tsx`:

- Faz `getServerSession(authOptions)`
- Checa `session.company.role`
- Se nao autorizado: `redirect("/")`

Como usar (padrao recomendado):

- Criar um `layout.tsx` dentro do modulo e envolver o `children` com `ProtectedLayout`, passando `allowedRoles`.

---

## 9) Variaveis de ambiente (env)

- Template: `.env.example`
- Arquivo local recomendado: `.env.local`
- Validacao: `src/lib/env.ts` (Zod)

Variaveis principais:

- `NEXT_PUBLIC_API_URL`: base da API.
- `NEXTAUTH_URL`: URL publica do frontend (atencao a porta em dev).
- `NEXTAUTH_SECRET`: segredo de criptografia do NextAuth.
- `AZURE_AD_B2C_*`: parametros do tenant/provedor.

Observacao: em desenvolvimento, se a porta mudar (ex: 3000 -> 3001), ajuste `NEXTAUTH_URL` para a mesma porta para evitar warnings/redirects incorretos.

## 9.1) Configuracoes do Next (imagens e build)

`next.config.ts` contem:

- `images.remotePatterns`: libera carregar imagens remotas do host da API (extraido de `NEXT_PUBLIC_API_URL`).
- `output: "standalone"`: facilita deploy.

---

## 10) Como replicar essa arquitetura em outro sistema (receita)

### 10.1) Passo a passo para adicionar um novo modulo CRUD

Suponha um modulo novo chamado "conselhos":

1. Rotas
   - Criar `src/app/(private)/conselhos/page.tsx` (acesso rapido)
   - Criar `src/app/(private)/conselhos/buscar/page.tsx`
   - Criar `src/app/(private)/conselhos/novo/page.tsx`
   - (opcional) `src/app/(private)/conselhos/[id]/page.tsx` e `.../editar/[id]/page.tsx`
2. Componentes
   - Criar `src/components/conselhos/acesso-rapido-conselhos.tsx` com `CartaoAcaoPagina`
   - Criar componentes de busca/listagem e cards (similar a `representantes`)
3. Service
   - Criar `src/services/conselhos.service.ts`
   - Usar `httpAuthClient`/`httpAuthServer` para centralizar Bearer token
4. Hook
   - Criar `src/hooks/conselhos/use-conselhos.ts` para:
     - states: `isLoading`, `total`, `items`
     - acoes: `buscar`, `criar`, `editar`, `excluir`
     - (opcional) react-query `useQuery`/`useMutation`
5. Menu
   - Adicionar item em `src/components/layouts/main.tsx` em `sidebarMenuItems`
6. Permissoes
   - Definir `role` no menu e, se necessario, proteger por role com `ProtectedLayout`.
7. UX e feedback
   - Adicionar toast para sucesso/erro e SweetAlert para confirmacoes de exclusao.

### 10.2) Padroes de UX que valem manter

- Sempre ter uma "home do modulo" com Acesso Rapido (reduz cliques e da clareza).
- Busca sempre com:
  - Cabecalho (titulo, descricao, CTA "Novo")
  - Area de filtros destacada (`SearchBarContainer`)
  - Resultados em grid/lista + metadados (`ResultMetadata`)
- Componentes pequenos e focados por dominio (evita "mega paginas").

---

## 11) Pontos de atencao para evolucao

- Existem providers de React Query duplicados (em `src/providers/react-query.tsx` e `src/infra/tanStack/ReactQueryWrapper.tsx`). Em um projeto novo, padronize em um unico provider/export.
- Alguns nomes de rotas variam (`buscar` vs `busca`). Se for iniciar um sistema novo, escolha um padrao unico e replique.
