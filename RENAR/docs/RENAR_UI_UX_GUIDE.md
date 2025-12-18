# Guia de UI/UX do RENAR (por telas e rotinas)

Este documento descreve COMO cada tela foi montada (composicao visual, blocos, componentes e comportamento), no estilo "blueprint" para replicar a mesma ideia em outro sistema.

Ele complementa o guia tecnico/arquitetural (`docs/RENAR_FRONTEND_GUIDE.md`) com foco em UI, UX e Design.

---

## 1) Shell padrao do sistema (presente em todas as rotas privadas)

Todas as rotas dentro de `src/app/(private)` compartilham o mesmo "shell":

- Menu lateral (Sidebar) fixo a esquerda
  - Implementacao: `src/components/layouts/main.tsx`
  - Cor e identidade: usa classe `cnc-bg-primary-800` (azul escuro do design system CNC).
  - Posicao: `fixed left-0 top-0` com `z-40`.
  - Largura no desktop quando aberto: `md:w-[280px]`.
  - Comportamento:
    - Em mobile, o sidebar abre/fecha cobrindo a tela (o codigo alterna `w-screen`).
    - Abertura/fechamento e controlado por `collapsed` em `useMain` (`src/components/layouts/_hooks/use-main.ts`).

- Header superior (Top bar)
  - Implementacao: `src/components/layouts/main.tsx` via `@cnc-ti/layout-basic`.
  - Elementos:
    - Botao de abrir menu (hamburguer).
    - Perfil do usuario + acoes:
      - "Trocar entidades" (abre modal)
      - "Sair" (chama `signOut()` do NextAuth)

- Area de conteudo
  - O conteudo da rota (`children`) e renderizado em `<main className="flex-1">`.
  - Quando o sidebar esta aberto, o conteudo desloca a direita com `pl-[280px]`.

### 1.1) Menu (itens e agrupamentos)

O menu e montado por um array (`sidebarMenuItems`) em `src/components/layouts/main.tsx`.

UI/UX:
- Itens em lista vertical (icone + texto).
- Grupos colapsaveis ("Operacional", "Parametros").
- Estados:
  - Item desabilitado: `opacity: 0.6` + `pointerEvents: none`.
  - Filtro de visibilidade por role: so renderiza se `menu.role.includes(userRole)`.

---

## 2) Padroes visuais (design repetivel)

### 2.1) Tela de modulo (Acesso rapido)

E a tela de entrada de quase todos os modulos (ex: Representacoes, Atividades, Categoria etc.).

Composicao:
- Cabecalho da pagina: `PageHeader` (wrapper local em `src/components/layouts/ui/page-header/index.tsx`)
- Container central: `Container` (`src/components/layouts/container.tsx`)
- Grid de acoes (responsivo):
  - `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`

Cartoes de acao:
- Componente: `CartaoAcaoPagina` (`src/components/layouts/ui/cards/cartao-acao-pagina.tsx`)
- Aparencia:
  - `border` + `rounded` + `p-5`
  - Conteudo centralizado (`flex flex-col items-center justify-center p-6`)
  - Icone grande (ex: `className="size-14"`) em azul (`text-blue-600`)
  - Hover com sombra (`hover:shadow-md`)

UX:
- Reduz carga cognitiva: 2 acoes principais (Criar / Buscar) como atalhos.
- Funciona como "hub" do modulo antes de telas densas (formularios/listas).

### 2.2) Tela de busca/listagem

Composicao tipica:
- Header com titulo + CTA (botao "Novo...")
- Bloco de filtros com fundo cinza claro
  - `BuscaContainer` (`src/components/layouts/busca-container.tsx`) ou `SearchBarContainer` (`src/components/layouts/search-bar-container.tsx`)
  - Aparencia: `px-8 py-10 border-b mb-8 bg-gray-50`
- Resultados em grid/lista + estados (loading/empty)
  - `ResultContainer` (`src/components/layouts/resultContainer.tsx`)
  - Empty state com icone e mensagem (ex: `FolderOpenIcon`)

UX:
- Filtros destacados em area dedicada (scan rapido).
- Resultados abaixo, com metadados (quantidade total/encontrados).
- Persistencia de filtros via URL (query string) em varios modulos.

### 2.3) Tela de cadastro/edicao (formulario)

Padrao recorrente:
- `PageHeader` com `goBack`.
- Area branca com padding:
  - `div className="mx-auto max-sm:w-screen p-6 bg-white"`
- Form com grid responsivo para inputs.
- Botao salvar alinhado a direita + separador superior:
  - `border-t border-gray-200 pt-4` + `justify-end`
- Feedback por modal:
  - Sucesso/erro via `sweetalert2` (`Swal.fire`)

Secoes colapsaveis:
- Componente: `CustomCollapse` (`src/components/layouts/ui/collapse/index.tsx`)
- UX: reduz o tamanho percebido do formulario e permite foco por bloco.

Abas (Tabs):
- `TabsComponent` (`src/components/layouts/ui/tabs/index.tsx`)
- UX:
  - Divide cadastro complexo em etapas.
  - Aba ativa persistida via query string (`?tab=`), permitindo link direto.
  - Em alguns fluxos, abas ficam `disabled` ate a entidade ser criada.

---

## 3) Telas publicas (sem menu)

Rotas em `src/app/(public)` nao usam o shell do app logado.

### 3.1) Sessao expirada / token expirado

- Rotas: `/denied` e `/denied/token-expired`
- Implementacao:
  - `src/app/(public)/denied/page.tsx`
  - `src/app/(public)/denied/token-expired/page.tsx`
- UI:
  - Layout centralizado (`h-screen flex items-center justify-center`)
  - Mensagem + CTA "Entrar"
  - Acao: `signIn("azure-ad-b2c", { callbackUrl: "/" })`

---

## 4) Rotinas por menu (o que o usuario ve e como foi montado)

Esta secao lista telas por modulo, com:
1) Como a tela se apresenta (UI/UX)
2) Quais componentes montam a tela (arquivos e blocos)

Nota: todas as rotas abaixo estao em `src/app/(private)`, portanto herdam o Menu + Header descritos na secao 1.

### 4.0) Mapa completo de telas (inventario)

Use esta tabela como indice: ela mostra as rotas privadas e a peca principal que renderiza a UI.

| Rota | Tipo de tela (UX) | Entrada (componente principal) |
| --- | --- | --- |
| `/` | Home (placeholder) | `src/app/(private)/page.tsx` |
| `/representacoes` | Acesso rapido | `src/components/representacoes/index.tsx` |
| `/representacoes/busca` | Busca/Listagem | `src/components/representacoes/busca-representacoes.tsx` |
| `/representacoes/novo` | Cadastro (Tabs + Form) | `src/app/(private)/representacoes/novo/page.tsx` |
| `/representacoes/editar/[id]` | Edicao (Tabs) | `src/app/(private)/representacoes/editar/[id]/page.tsx` |
| `/representacoes/[id]` | Visualizacao | `src/app/(private)/representacoes/[id]/page.tsx` |
| `/representantes` | Acesso rapido | `src/app/(private)/representantes/page.tsx` |
| `/representantes/buscar` | Busca/Listagem | `src/components/pages/representantes/buscar/pagina-busca-representantes.tsx` |
| `/representantes/novo` | Cadastro | `src/components/representantes/RepresentantesContent.tsx` |
| `/representantes/editar` | Edicao | `src/components/representantes/RepresentantesContent.tsx` |
| `/representantes/[id]` | Visualizacao | `src/components/representantes/VisualizacaoRepresentante.tsx` |
| `/orgaos` | Acesso rapido | `src/app/(private)/orgaos/page.tsx` |
| `/orgaos/busca` | Busca/Listagem | `src/components/orgaos/busca/busca-orgaos.tsx` |
| `/orgaos/novo` | Cadastro (Tabs) | `src/app/(private)/orgaos/novo/page.tsx` |
| `/orgaos/[id]/editar` | Edicao | `src/components/orgaos/editar-orgao.tsx` |
| `/orgaos/[id]` | Visualizacao | `src/app/(private)/orgaos/[id]/page.tsx` |
| `/atividades` | Acesso rapido | `src/components/atividades/acesso-rapido-atividades.tsx` |
| `/atividades/buscar` | Busca/Listagem | `src/components/atividades/busca/busca-atividades.tsx` |
| `/atividades/novo` | Cadastro | `src/app/(private)/atividades/novo/page.tsx` |
| `/atividades/editar/[id]` | Edicao | `src/components/atividades/formularios/formulario-nova-atividade.tsx` |
| `/atividades/[id]` | Visualizacao | `src/components/atividades/visualizacao/visualizacao.tsx` |
| `/mandatos` | Acesso rapido | `src/app/(private)/mandatos/page.tsx` |
| `/mandatos/busca` | Busca/Listagem | `src/app/(private)/mandatos/busca/page.tsx` |
| `/mandatos/novo` | Cadastro | `src/app/(private)/mandatos/novo/page.tsx` |
| `/mandatos/[id]/editar` | Edicao | `src/components/mandatos/editar-mandato.tsx` |
| `/mandatos/[id]/visualizar` | Visualizacao | `src/components/mandatos/visualizacao/visualizar-mandato.tsx` |
| `/cargos` | Acesso rapido | `src/app/(private)/cargos/page.tsx` |
| `/cargos/buscar` | Busca/Listagem | `src/components/cargos/busca/busca-cargos.tsx` |
| `/cargos/novo` | Cadastro | `src/app/(private)/cargos/novo/page.tsx` |
| `/cargos/[id]/editar` | Edicao | `src/components/cargos/editar-cargo.tsx` |
| `/cargos/[id]` | Visualizacao | `src/components/cargos/visualizar-cargo.tsx` |
| `/categorias` | Acesso rapido | `src/components/categoria/acesso-rapido-categoria.tsx` |
| `/categorias/buscar` | Busca/Listagem | `src/components/categoria/listagem/listegem-categoria.tsx` |
| `/categorias/novo` | Cadastro | `src/components/categoria/formularios/FormularioCategoria.tsx` |
| `/categorias/editar/[id]` | Edicao | `src/components/categoria/formularios/FormularioCategoria.tsx` |
| `/categorias/[id]` | Visualizacao | `src/components/categoria/visualizar/visualizar-categoria.tsx` |
| `/funcoes` | Acesso rapido | `src/components/funcoes/acesso-rapido-funcoes.tsx` |
| `/funcoes/buscar` | Busca/Listagem | `src/components/funcoes/listagem/listegem-funcoes.tsx` |
| `/funcoes/novo` | Cadastro | `src/components/funcoes/formularios/formulario-novo-funcoes.tsx` |
| `/funcoes/editar/[id]` | Edicao | `src/components/funcoes/formularios/formulario-novo-funcoes.tsx` |
| `/funcoes/[id]` | Visualizacao | `src/components/funcoes/visualizar/visualizar-funcao.tsx` |
| `/texto-web` | Acesso rapido | `src/components/textoWeb/acesso-rapido-texto-web.tsx` |
| `/texto-web/buscar` | Busca/Listagem | `src/components/textoWeb/listagem/listegem-texto-web.tsx` |
| `/texto-web/novo` | Cadastro | `src/app/(private)/texto-web/novo/page.tsx` |
| `/texto-web/editar/[id]` | Edicao | `src/app/(private)/texto-web/editar/[id]/page.tsx` |
| `/texto-web/[id]` | Visualizacao | `src/components/textoWeb/visualizar/visualizar-texto-web.tsx` |
| `/tipo-perfil` | Acesso rapido | `src/app/(private)/tipo-perfil/page.tsx` |
| `/tipo-perfil/buscar` | Busca/Listagem | `src/components/atuacoes/busca/busca-atuacoes.tsx` |
| `/tipo-perfil/novo` | Cadastro | `src/app/(private)/tipo-perfil/novo/page.tsx` |
| `/tipo-perfil/[id]/editar` | Edicao | `src/components/atuacoes/editar-atuacao.tsx` |
| `/tipo-perfil/[id]` | Visualizacao | `src/components/atuacoes/visualizar-atuacao.tsx` |
| `/tipo-reuniao` | Acesso rapido | `src/components/tipo-reuniao/acesso-rapido-tipo-reuniao.tsx` |
| `/tipo-reuniao/buscar` | Busca/Listagem | `src/components/tipo-reuniao/listagem/listegem-tipo-reuniao.tsx` |
| `/tipo-reuniao/novo` | Cadastro | `src/app/(private)/tipo-reuniao/novo/page.tsx` |
| `/tipo-reuniao/editar/[id]` | Edicao | `src/app/(private)/tipo-reuniao/editar/[id]/page.tsx` |
| `/tipo-reuniao/[id]` | Visualizacao | `src/components/tipo-reuniao/visualizar/visualizar-tipo-reuniao.tsx` |
| `/tipos-mandato` | Acesso rapido | `src/app/(private)/tipos-mandato/page.tsx` |
| `/tipos-mandato/busca` | Busca/Listagem | `src/components/tipos-mandato/busca-tipos-mandato.tsx` |
| `/tipos-mandato/novo` | Cadastro | `src/app/(private)/tipos-mandato/novo/page.tsx` |
| `/tipos-mandato/[id]/editar` | Edicao | `src/components/tipos-mandato/formularios/formulario-edicao-tipo-mandato.tsx` |
| `/tipos-mandato/[id]` | Visualizacao | `src/components/tipos-mandato/visualizacao/visualizacao-tipo-mandato.tsx` |
| `/tipos-orgaos` | Acesso rapido | `src/app/(private)/tipos-orgaos/page.tsx` |
| `/tipos-orgaos/busca` | Busca/Listagem | `src/components/tipo-orgaos/busca/busca-tipo-orgaos.tsx` |
| `/tipos-orgaos/novo` | Cadastro | `src/app/(private)/tipos-orgaos/novo/page.tsx` |
| `/tipos-orgaos/[id]/editar` | Edicao | `src/components/tipo-orgaos/editar-tipo-orgao.tsx` |
| `/tipos-orgaos/[id]` | Visualizacao | `src/components/tipo-orgaos/visualizacao/visualizar-tipo-orgao.tsx` |
| `/area-tematica` | Acesso rapido | `src/components/area-tematica/acesso-rapido-area-tematica.tsx` |
| `/area-tematica/buscar` | Busca/Listagem | `src/components/area-tematica/listagem/listegem-area-tematica.tsx` |
| `/area-tematica/novo` | Cadastro | `src/components/area-tematica/formularios/formulario-area-tematica.tsx` |
| `/area-tematica/editar/[id]` | Edicao | `src/components/area-tematica/formularios/formulario-area-tematica.tsx` |
| `/area-tematica/[id]` | Visualizacao | `src/components/area-tematica/visualizar/visualizar-area-tematica.tsx` |
| `/prioridade-representacao` | Acesso rapido | `src/components/prioridade-representacao/acesso-rapido-prioridade-representacao.tsx` |
| `/prioridade-representacao/buscar` | Busca/Listagem | `src/components/prioridade-representacao/listagem/listegem-prioridade-representacao.tsx` |
| `/prioridade-representacao/novo` | Cadastro | `src/app/(private)/prioridade-representacao/novo/page.tsx` |
| `/prioridade-representacao/editar/[id]` | Edicao | `src/app/(private)/prioridade-representacao/editar/[id]/page.tsx` |
| `/prioridade-representacao/[id]` | Visualizacao | `src/components/prioridade-representacao/visualizar/visualizar-prioridade-representacao.tsx` |
| `/motivos-cancelamento` | Acesso rapido | `src/app/(private)/motivos-cancelamento/page.tsx` |
| `/motivos-cancelamento/busca` | Busca/Listagem | `src/components/motivos-cancelamento/busca-motivos-cancelamento.tsx` |
| `/motivos-cancelamento/novo` | Cadastro | `src/app/(private)/motivos-cancelamento/novo/page.tsx` |
| `/motivos-cancelamento/[id]/editar` | Edicao | `src/components/motivos-cancelamento/formularios/formulario-edicao-motivo-cancelamento.tsx` |
| `/motivos-cancelamento/[id]` | Visualizacao | `src/components/motivos-cancelamento/visualizacao/visualizar-motivo-cancelamento.tsx` |

---

### 4.1.0) Home (/)

UI/UX:
- Hoje a home e um placeholder (tela vazia). O usuario navega pelos modulos via menu lateral.

Montagem:
- Rota: `src/app/(private)/page.tsx`
- Retorna um componente vazio (`<> </>`), sem conteudo.

### 4.1) Representacoes

#### 4.1.1) /representacoes (Acesso rapido)

UI/UX (como aparece):
- Titulo "Representacoes" no topo (PageHeader).
- Dois cards centrais com fundo branco:
  - "Criar Representacao"
  - "Buscar Representacao"
- Cards com icone grande e texto centralizado; hover com sombra.

Montagem (componentes):
- Rota: `src/app/(private)/representacoes/page.tsx`
- Componente: `src/components/representacoes/index.tsx` (`AcessoRapidoRepresentacao`)
- Blocos:
  - `PageHeader`
  - `Container`
  - Grid responsivo
  - `CartaoAcaoPagina` (Link para `/representacoes/novo` e `/representacoes/busca`)

#### 4.1.2) /representacoes/busca (Buscar Representacoes)

UI/UX (como aparece):
- Header com:
  - Botao "voltar"
  - Titulo + descricao ("Buscar Representacoes")
  - CTA a direita: "Nova representacao"
- Area de filtros com fundo `bg-gray-50`, separada por borda inferior.
- Resultados em grid de cards; cada card tem acoes (ver/editar/excluir).
- Estados:
  - Loading: skeleton (`GradeRepresetacaoCarregando`)
  - Vazio: bloco com icone (Folder) e mensagem orientando a usar filtros.

Montagem (componentes):
- Rota: `src/app/(private)/representacoes/busca/page.tsx`
- Entrada: `src/components/representacoes/busca-representacoes.tsx`
- Header da busca: `src/components/representacoes/cabecalhos/cabecalho-busca.tsx`
  - Usa `PageHeader` do `@cnc-ti/layout-basic` + `ButtonBack` local.
- Filtros: `src/components/representacoes/busca/campos-busca.tsx`
  - Usa `BuscaContainer` (fundo cinza, padding alto).
  - Inputs:
    - `TextField` (nome)
    - `Combobox` (entidade, situacao, tipo, area tematica)
  - CTA: `ButtonSearch` (mostra loading).
- Resultados: `src/components/representacoes/grades/grade-representacoes.tsx`
  - `ResultMetadata` + `ResultContainer`
  - Card por item: `src/components/representacoes/items/item-represetacao.tsx`
    - Mostra sigla + badge de status (cores por status)
    - Acoes no rodape:
      - Visualizar -> `/representacoes/[id]`
      - Editar -> `/representacoes/editar/[id]`
      - Excluir -> abre modal
- Persistencia de filtro na URL:
  - `useQueryString` em `busca-representacoes.tsx` e `campos-busca.tsx`

#### 4.1.3) /representacoes/novo (Criar Representacao)

UI/UX (como aparece):
- PageHeader com titulo "Cadastro Representacao", descricao e botao voltar.
- Um bloco branco com padding contendo abas (Tabs).
  - Primeira aba habilitada: "Dados Principais"
  - Outras abas inicialmente desabilitadas (fluxo em etapas)
- Form em secoes colapsaveis:
  - "Dados Cadastrais"
  - "Representacao"
- Botao "Salvar alteracoes" a direita, com spinner quando salvando.
- Feedback via `Swal.fire` em erro/sucesso.

Montagem (componentes):
- Rota: `src/app/(private)/representacoes/novo/page.tsx`
  - `PageHeader` (wrapper local)
  - `TabsComponent` (`src/components/layouts/ui/tabs/index.tsx`)
- Conteudo da aba "Dados Principais":
  - `src/components/representacoes/formularios/formulario-dados-principais-criacao.tsx`
  - Form state: `react-hook-form` + `zodResolver`
  - Secoes:
    - `SecaoDadosCadastrais` (`src/components/representacoes/formularios/sections/secao-dados-cadastrais.tsx`)
      - `CustomCollapse` com titulo em destaque (`text-2xl font-bold cnc-text-brand-blue-600`)
      - Select "Entidade" desabilitado (fixo no fluxo)
    - `SecaoDadosRepresentacao` (`src/components/representacoes/formularios/sections/secao-dados-representacao.tsx`)
      - Grid de inputs (nome/numero/sigla)
      - Select "Vinculado(a)" com busca (debounce + loading)
      - Radios para Situacao e Tipo (caixas com borda e padding)
  - Acao "Salvar":
    - `ButtonSave` (`src/components/layouts/ui/buttons/button-save/button-save.tsx`)
    - Spinner + texto "Salvando..." durante request
  - Pos-salvar:
    - Em sucesso: redireciona para `/representacoes/editar/[id]`

---

### 4.2) Representantes

#### 4.2.1) /representantes (Acesso rapido)

UI/UX:
- Header "Representantes".
- Dois cards (Criar / Buscar) no grid, seguindo o mesmo padrao visual do acesso rapido.

Montagem:
- Rota: `src/app/(private)/representantes/page.tsx`
- Blocos: `PageHeader` + `Container` + `CartaoAcaoPagina` (grid responsivo).

#### 4.2.2) /representantes/buscar (Buscar Representantes)

UI/UX:
- Header com titulo/descricao e CTA "Novo Representante".
- Bloco de filtros destacado.
- Resultados em grid de cards; empty state quando nao ha resultados.

Montagem:
- Rota: `src/app/(private)/representantes/buscar/page.tsx`
- Pagina: `src/components/pages/representantes/buscar/pagina-busca-representantes.tsx`
- Pecas:
  - `PageHeader` (com CTA)
  - `SearchBarContainer` (`src/components/layouts/search-bar-container.tsx`)
  - Barra de busca: `src/components/layouts/representantes/barra-busca-representantes.tsx`
  - Resultados: `src/components/layouts/representantes/lista-resultados-representantes.tsx`
    - `ResultMetadata` (`src/components/shared/metadata-result.tsx`)
    - `ResultContainer` (`src/components/layouts/resultContainer.tsx`)

#### 4.2.3) /representantes/novo e /representantes/editar (Cadastro/Edicao)

UI/UX:
- Fluxo de cadastro/edicao mais longo (multi-secoes), com validacao e feedback.

Montagem:
- Rotas:
  - `src/app/(private)/representantes/novo/page.tsx`
  - `src/app/(private)/representantes/editar/page.tsx`
- Componente raiz (ambos): `src/components/representantes/RepresentantesContent.tsx`

#### 4.2.4) /representantes/[id] (Visualizacao)

UI/UX:
- Tela de leitura, com secoes de informacoes e hierarquia visual por titulos.

Montagem:
- Rota: `src/app/(private)/representantes/[id]/page.tsx`
- Componente: `src/components/representantes/VisualizacaoRepresentante.tsx`

---

### 4.3) Orgaos

#### 4.3.1) /orgaos (Acesso rapido)

UI/UX:
- PageHeader "Orgaos" (no codigo usa `goBack`).
- Dois cards brancos (Criar / Buscar).

Montagem:
- Rota: `src/app/(private)/orgaos/page.tsx`
- Blocos: `PageHeader` + `Container` + `CartaoAcaoPagina`.

#### 4.3.2) /orgaos/busca (Buscar Orgaos)

UI/UX:
- Header com voltar + titulo/descricao + CTA "Novo Orgao".
- Filtros em bloco cinza (`bg-gray-50`) via `SearchBarContainer`.
- Resultados em grid; estados de loading e vazio.

Montagem:
- Rota: `src/app/(private)/orgaos/busca/page.tsx`
- Entrada: `src/components/orgaos/busca/busca-orgaos.tsx`
- Pecas:
  - Cabecalho: `src/components/orgaos/cabecalhos/cabecalho-busca-orgaos.tsx`
  - Filtros: `src/components/orgaos/busca/campos-busca-orgaos.tsx`
  - Grade: `src/components/orgaos/grades/grade-orgaos.tsx`

#### 4.3.3) /orgaos/novo (Cadastro com Tabs)

UI/UX:
- PageHeader com voltar.
- Area branca com padding contendo Tabs:
  - "Dados Principais" (habilitada)
  - "Vinculacoes" (desabilitada no inicio)
- Form dividido em secoes, com rodape de acao "Salvar" a direita.

Montagem:
- Rota: `src/app/(private)/orgaos/novo/page.tsx`
- Tabs: `TabsComponent` (`src/components/layouts/ui/tabs/index.tsx`)
- Form principal: `src/components/orgaos/formularios/formulario-criacao-orgao.tsx`
  - Secoes: `SecaoDadosCadastraisOrgaos` e `SecaoDadosOrgao`
  - Feedback: `Swal.fire` (sucesso/erro)

#### 4.3.4) /orgaos/[id]/editar (Edicao)

Montagem:
- Rota: `src/app/(private)/orgaos/[id]/editar/page.tsx`
- Componente: `src/components/orgaos/editar-orgao.tsx`

#### 4.3.5) /orgaos/[id] (Visualizacao)

Montagem:
- Rota: `src/app/(private)/orgaos/[id]/page.tsx`
- UI inclui botoes/acoes locais e leitura de dados por secoes.

---

### 4.4) Atividades

#### 4.4.1) /atividades (Acesso rapido)

UI/UX:
- PageHeader "Atividades".
- Dois cards (Criar / Buscar) como atalhos.

Montagem:
- Rota: `src/app/(private)/atividades/page.tsx`
- Componente: `src/components/atividades/acesso-rapido-atividades.tsx`

#### 4.4.2) /atividades/buscar (Buscar Atividades)

UI/UX:
- Header com voltar + titulo/descricao + CTA "Nova Atividade".
- Filtros persistidos via query string (URL).
- Resultados em grid; modal de exclusao; estados de loading/empty.

Montagem:
- Rota: `src/app/(private)/atividades/buscar/page.tsx`
- Entrada: `src/components/atividades/busca/busca-atividades.tsx`
  - Cabecalho: `src/components/atividades/busca/cabecalho-busca-atividades.tsx`
  - Campos: `src/components/atividades/busca/campos-busca-atividade.tsx`
  - Grade: `src/components/atividades/grade/grade-atividades.tsx`

#### 4.4.3) /atividades/novo (Cadastro)

Montagem:
- Rota: `src/app/(private)/atividades/novo/page.tsx`
- Normalmente segue padrao PageHeader + area branca + form do modulo.

#### 4.4.4) /atividades/editar/[id] (Edicao)

Montagem:
- Rota: `src/app/(private)/atividades/editar/[id]/page.tsx`
- Form: `src/components/atividades/formularios/formulario-nova-atividade.tsx`

#### 4.4.5) /atividades/[id] (Visualizacao)

Montagem:
- Rota: `src/app/(private)/atividades/[id]/page.tsx`
- Componente: `src/components/atividades/visualizacao/visualizacao.tsx`

---

### 4.5) Mandatos/Eventos

#### 4.5.1) /mandatos (Acesso rapido)

UI/UX:
- PageHeader + grid com dois cards (Criar / Buscar).

Montagem:
- Rota: `src/app/(private)/mandatos/page.tsx`
- Usa `CartaoAcaoPagina` como atalho para `/mandatos/novo` e `/mandatos/busca`.

#### 4.5.2) /mandatos/busca (Buscar Mandatos)

UI/UX:
- Header com voltar + titulo/descricao + CTA "Novo Mandato".
- Filtros com fundo cinza (`bg-gray-50`), com varios campos.
- Resultados em grid/lista; estados de loading/empty; persistencia via URL.

Montagem:
- Rota: `src/app/(private)/mandatos/busca/page.tsx`
- Entrada: `src/components/mandatos/busca-mandatos.tsx`
  - `CamposBuscaMandatos` (`src/components/mandatos/busca/campos-busca.tsx`)
  - `CabecalhoBuscaMandatos` (`src/components/mandatos/cabecalhos/cabecalho-busca.tsx`)
  - `GradeMandatos` (`src/components/mandatos/grades/grade-mandatos.tsx`)
  - Loading: `src/components/mandatos/grid-mandatos-skeleton.tsx`

#### 4.5.3) /mandatos/novo (Cadastro)

UI/UX:
- PageHeader com voltar.
- Area branca com padding + formulario do modulo.

Montagem:
- Rota: `src/app/(private)/mandatos/novo/page.tsx`

#### 4.5.4) /mandatos/[id]/editar e /mandatos/[id]/visualizar

Montagem:
- Edicao: `src/app/(private)/mandatos/[id]/editar/page.tsx` -> `src/components/mandatos/editar-mandato.tsx`
- Visualizacao: `src/app/(private)/mandatos/[id]/visualizar/page.tsx` -> `src/components/mandatos/visualizacao/visualizar-mandato.tsx`

---

### 4.6) Cargos

Padrao do modulo:
- Acesso rapido (Criar/Buscar) com cards.
- Busca com filtros + grid de itens.
- Cadastro/Edicao com form simples (poucos campos), botao salvar e feedback via Swal.

Rotas e montagem:
- `/cargos`: `src/app/(private)/cargos/page.tsx` (PageHeader + `CartaoAcaoPagina`)
- `/cargos/buscar`: `src/components/cargos/busca/busca-cargos.tsx`
- `/cargos/novo`: `src/app/(private)/cargos/novo/page.tsx`
  - Form: `src/components/cargos/formularios/formulario-novo-cargo.tsx`
  - Validacao: Zod + react-hook-form
  - Acao: `ButtonSave`
- `/cargos/[id]/editar`: `src/components/cargos/editar-cargo.tsx`
- `/cargos/[id]`: `src/components/cargos/visualizar-cargo.tsx`

---

### 4.7) Categorias

Padrao do modulo:
- Acesso rapido com cards.
- Listagem/busca (tabela/grid) com filtros.
- Cadastro/Edicao em formulario reaproveitavel.

Rotas e montagem:
- `/categorias`: `src/components/categoria/acesso-rapido-categoria.tsx`
- `/categorias/buscar`: `src/components/categoria/listagem/listegem-categoria.tsx`
- `/categorias/novo` e `/categorias/editar/[id]`: `src/components/categoria/formularios/FormularioCategoria.tsx`
- `/categorias/[id]`: `src/components/categoria/visualizar/visualizar-categoria.tsx`

---

### 4.8) Funcoes

Padrao do modulo:
- Acesso rapido com cards.
- Listagem/busca.
- Cadastro/Edicao com formulario reaproveitado.

Rotas e montagem:
- `/funcoes`: `src/components/funcoes/acesso-rapido-funcoes.tsx`
- `/funcoes/buscar`: `src/components/funcoes/listagem/listegem-funcoes.tsx`
- `/funcoes/novo` e `/funcoes/editar/[id]`: `src/components/funcoes/formularios/formulario-novo-funcoes.tsx`
- `/funcoes/[id]`: `src/components/funcoes/visualizar/visualizar-funcao.tsx`

---

### 4.9) Texto Web

#### 4.9.1) /texto-web (Acesso rapido)

UI/UX:
- PageHeader + dois cards (Criar / Buscar).

Montagem:
- `src/components/textoWeb/acesso-rapido-texto-web.tsx`

#### 4.9.2) /texto-web/buscar (Listagem)

Montagem:
- `src/components/textoWeb/listagem/listegem-texto-web.tsx`

#### 4.9.3) /texto-web/novo e /texto-web/editar/[id] (Cadastro/Edicao)

UI/UX:
- Form com spacing maior (usa `p-10 space-y-6`), bom para campos de texto longos.
- Campos de texto e textarea, com salvar no rodape.

Montagem:
- Novo: `src/app/(private)/texto-web/novo/page.tsx`
- Editar: `src/app/(private)/texto-web/editar/[id]/page.tsx`
- Form reutilizado: `src/components/textoWeb/formularios/FormularioTextoWeb.tsx`
  - Campos: `TextField` + `TextAreaField`
  - Acao: `ButtonSave` com loading
  - Feedback: `Swal.fire`

#### 4.9.4) /texto-web/[id] (Visualizacao)

Montagem:
- `src/components/textoWeb/visualizar/visualizar-texto-web.tsx`

---

### 4.10) Tipo Perfil (Atuacoes)

Observacao UX:
- Apesar da rota ser `/tipo-perfil`, os componentes do modulo estao em `src/components/atuacoes/*`.

Rotas e montagem:
- `/tipo-perfil/buscar`: `src/components/atuacoes/busca/busca-atuacoes.tsx`
- `/tipo-perfil/novo`: `src/app/(private)/tipo-perfil/novo/page.tsx` (form em `src/components/atuacoes/formularios/*`)
- `/tipo-perfil/[id]/editar`: `src/components/atuacoes/editar-atuacao.tsx`
- `/tipo-perfil/[id]`: `src/components/atuacoes/visualizar-atuacao.tsx`

---

### 4.11) Tipos de Mandato

Padrao do modulo:
- Acesso rapido (Criar/Buscar) com cards.
- Busca/listagem com filtros e grid/tabela.
- Cadastro/Edicao com formulario simples + salvar.

Rotas e montagem:
- `/tipos-mandato`: `src/app/(private)/tipos-mandato/page.tsx`
- `/tipos-mandato/busca`: `src/components/tipos-mandato/busca-tipos-mandato.tsx`
- `/tipos-mandato/novo`: `src/app/(private)/tipos-mandato/novo/page.tsx` (PageHeader + area branca)
- `/tipos-mandato/[id]/editar`: `src/components/tipos-mandato/formularios/formulario-edicao-tipo-mandato.tsx`
- `/tipos-mandato/[id]`: `src/components/tipos-mandato/visualizacao/visualizacao-tipo-mandato.tsx`

---

### 4.12) Tipos de Orgaos

Padrao do modulo:
- Acesso rapido (Criar/Buscar).
- Busca/listagem.
- Cadastro com form simples (PageHeader + `bg-white p-6` + `ButtonSave`).

Rotas e montagem:
- `/tipos-orgaos`: `src/app/(private)/tipos-orgaos/page.tsx`
- `/tipos-orgaos/busca`: `src/components/tipo-orgaos/busca/busca-tipo-orgaos.tsx`
- `/tipos-orgaos/novo`: `src/app/(private)/tipos-orgaos/novo/page.tsx` -> `src/components/tipo-orgaos/formularios/formulario-novo-tipo-orgao.tsx`
- `/tipos-orgaos/[id]/editar`: `src/components/tipo-orgaos/editar-tipo-orgao.tsx`
- `/tipos-orgaos/[id]`: `src/components/tipo-orgaos/visualizacao/visualizar-tipo-orgao.tsx`

---

### 4.13) Area Tematica

Padrao do modulo:
- Acesso rapido (Criar/Buscar).
- Listagem/busca.
- Cadastro/Edicao em formulario reaproveitado.

Rotas e montagem:
- `/area-tematica`: `src/components/area-tematica/acesso-rapido-area-tematica.tsx`
- `/area-tematica/buscar`: `src/components/area-tematica/listagem/listegem-area-tematica.tsx`
- `/area-tematica/novo` e `/area-tematica/editar/[id]`: `src/components/area-tematica/formularios/formulario-area-tematica.tsx`
- `/area-tematica/[id]`: `src/components/area-tematica/visualizar/visualizar-area-tematica.tsx`

---

### 4.14) Prioridade de Representacao

Padrao do modulo:
- Acesso rapido (Criar/Buscar).
- Listagem/busca.
- Cadastro/Edicao com PageHeader + area branca e formulario do modulo.

Rotas e montagem:
- `/prioridade-representacao`: `src/components/prioridade-representacao/acesso-rapido-prioridade-representacao.tsx`
- `/prioridade-representacao/buscar`: `src/components/prioridade-representacao/listagem/listegem-prioridade-representacao.tsx`
- `/prioridade-representacao/novo`: `src/app/(private)/prioridade-representacao/novo/page.tsx`
- `/prioridade-representacao/editar/[id]`: `src/app/(private)/prioridade-representacao/editar/[id]/page.tsx`
- `/prioridade-representacao/[id]`: `src/components/prioridade-representacao/visualizar/visualizar-prioridade-representacao.tsx`

---

### 4.15) Motivos de Cancelamento

Padrao do modulo:
- Acesso rapido (Criar/Buscar).
- Busca/listagem.
- Cadastro/Edicao com PageHeader + area branca, form e feedback via Swal.

Rotas e montagem:
- `/motivos-cancelamento`: `src/app/(private)/motivos-cancelamento/page.tsx`
- `/motivos-cancelamento/busca`: `src/components/motivos-cancelamento/busca-motivos-cancelamento.tsx`
- `/motivos-cancelamento/novo`: `src/app/(private)/motivos-cancelamento/novo/page.tsx` -> `src/components/motivos-cancelamento/formularios/formulario-criacao-motivo-cancelamento.tsx`
- `/motivos-cancelamento/[id]/editar`: `src/components/motivos-cancelamento/formularios/formulario-edicao-motivo-cancelamento.tsx`
- `/motivos-cancelamento/[id]`: `src/components/motivos-cancelamento/visualizacao/visualizar-motivo-cancelamento.tsx`

---

### 4.16) Tipo Reuniao

Padrao do modulo:
- Acesso rapido (Criar/Buscar).
- Listagem/busca.
- Cadastro/Edicao com PageHeader + area branca e formulario.

Rotas e montagem:
- `/tipo-reuniao`: `src/components/tipo-reuniao/acesso-rapido-tipo-reuniao.tsx`
- `/tipo-reuniao/buscar`: `src/components/tipo-reuniao/listagem/listegem-tipo-reuniao.tsx`
- `/tipo-reuniao/novo`: `src/app/(private)/tipo-reuniao/novo/page.tsx`
- `/tipo-reuniao/editar/[id]`: `src/app/(private)/tipo-reuniao/editar/[id]/page.tsx`
- `/tipo-reuniao/[id]`: `src/components/tipo-reuniao/visualizar/visualizar-tipo-reuniao.tsx`

---

## 5) Checklist para replicar o mesmo UX em outro sistema

Se voce quer criar outro sistema "com a mesma cara e fluxo", replique:

1. Shell fixo com sidebar azul + header superior (`Main`).
2. Home por modulo com "Acesso rapido" (2 cards: Criar/Buscar).
3. Busca com:
   - Header + CTA "Novo"
   - Bloco de filtros em `bg-gray-50`
   - Resultados em grid com empty state e loading state
4. Cadastro/Edicao com:
   - PageHeader com voltar
   - Area branca com padding
   - Secoes colapsaveis (quando formulario crescer)
   - Tabs (quando cadastro tiver multiplas etapas)
5. Feedback consistente:
   - `Swal.fire` para mensagens curtas (sucesso/erro)
   - Botoes com estado de loading (spinner)
