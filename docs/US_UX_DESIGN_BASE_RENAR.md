# Guia de US, UX e Design (base RENAR)

Este documento descreve os padrões de **US (User Stories)**, **UX** e **Design System** que aplicamos no projeto `controle_de_contratos`, inspirados no sistema **RENAR**, para servir como referência e acelerar a manutenção/implementação de frontends em outros sistemas.

> Escopo: padrões de layout, navegação, componentes, estados de tela e comportamento (consulta/edição), com foco em consistência visual e previsibilidade.

---

## 1) Objetivo e princípios

### Objetivo
- Padronizar a experiência (look & feel) para “parecer RENAR”: simples, limpo, corporativo, com hierarquia clara.
- Reduzir dúvidas do usuário: títulos consistentes, ações previsíveis, feedback claro.
- Garantir componentes reutilizáveis: busca/listagem, cadastro, visualização/consulta, ações por item.

### Princípios UX
- **Uma tela, um título**: evitar duplicidade de cabeçalhos (topbar vs conteúdo).
- **Ação sempre visível e com rótulo/tooltip**: botões pequenos, mas autoexplicativos.
- **Estados explícitos**: vazio, carregando, erro, sucesso.
- **Consulta ≠ Edição**: modo consulta bloqueia alterações; modo edição habilita ações.
- **Responsivo por padrão**: sidebar recolhível no mobile, tabelas viram “cards” quando necessário.

---

## 2) User Stories (US) e critérios de aceite

### US-01 — Acessar o módulo “Contratos”
**Como** usuário, **quero** entrar no módulo de Contratos **para** escolher entre criar ou buscar contratos.

Critérios de aceite:
- Exibir cards de ação (ex.: “Criar Contrato”, “Buscar Contratos”).
- Layout consistente com RENAR: card com ícone, título, subtítulo e clique na área inteira.
- Título do módulo exibido no conteúdo (sem duplicidade no topo).

### US-02 — Buscar contratos com filtros
**Como** usuário, **quero** filtrar contratos **para** localizar rapidamente um registro.

Critérios de aceite:
- Filtros: fornecedor, número, status (e outros quando aplicável).
- Botões: “Pesquisar” e “Limpar”.
- Resultado: contador, estado vazio (“Nenhum contrato encontrado”), cards/tabela.

### US-03 — Visualizar (Consulta) um contrato
**Como** usuário, **quero** visualizar um contrato **para** ver exatamente os dados cadastrados, sem risco de alterar.

Critérios de aceite:
- Ao clicar em “Visualizar”, abrir a tela de contrato com dados preenchidos.
- Campos desabilitados e sem botão de salvar.
- Aba “Movimentos” habilita apenas se houver movimentações.
- Aba “Anexos” habilita apenas se houver anexos.

### US-04 — Editar um contrato
**Como** usuário, **quero** editar um contrato **para** atualizar dados existentes.

Critérios de aceite:
- Ao clicar em “Editar”, abrir a tela com dados preenchidos.
- Botão “Salvar alterações” presente.
- Abas “Movimentos” e “Anexos” habilitadas (para permitir incluir/gerenciar).

### US-05 — Registrar movimentação em contrato
**Como** usuário, **quero** registrar movimentações **para** acompanhar saldos e histórico.

Critérios de aceite:
- Lista de movimentações exibida com data, tipo, valor e observação.
- Em edição: permitir adicionar movimentação.
- Atualizar/mostrar a lista após inserir.

### US-06 — Gerenciar anexos de contrato
**Como** usuário, **quero** anexar documentos **para** manter evidências e arquivos do contrato.

Critérios de aceite:
- Exibir lista de anexos com link para abrir.
- Em consulta: anexos visíveis, sem ação de remover/adicionar.
- Em edição: upload e remoção habilitados.

---

## 3) Arquitetura de informação e navegação

### Shell (estrutura RENAR-like)
Padrão de “casca” do sistema:
- **Sidebar fixa** no desktop (menu principal).
- **Topbar** simples no topo (informação de ambiente/usuário).
- **Conteúdo** com `content-padding` e cabeçalho de página.

### Sidebar (menu)
Regras:
- Itens do menu são links com área clicável confortável.
- Estado ativo destacado.
- Ícones no padrão RENAR (traço/line + monocromático), consistentes entre páginas.

Implementação (referência):
- Ícones do menu via `.nav-icon` com `background-image` (SVG data URI) em `css/styles.css`.

### Botão “hamburger”
Regra:
- **Oculto no desktop** (sidebar já visível).
- **Visível apenas no mobile** para abrir/fechar sidebar.

---

## 4) Design System (tokens e estilo)

### Cores (tokens)
Tokens usados (base RENAR) em `css/styles.css`:
- `--primary-color`: azul principal (ex.: `#00247D`)
- `--primary-dark`: variação para hover/ênfase
- `--secondary-color`: dourado (ex.: `#AD841F`)
- `--accent-color`: verde (ex.: `#25CF60`)
- `--text-primary` / `--text-secondary`
- `--border-color`, `--bg-light`

Regras:
- Azuis para ações primárias.
- Verde para “sucesso/ativo”.
- Vermelho apenas para destrutivo/erro.
- Bordas leves, fundos claros, alto contraste no texto.

### Tipografia
- Fonte padrão: `Montserrat` (com fallback para fontes do sistema).
- Títulos: peso 700/800, cor neutra/escura.
- Textos auxiliares: cinza (secundário), tamanho menor.

### Espaçamento e densidade
Diretriz:
- Layout “arejado”, porém eficiente.
- Espaçamentos comuns: 10–18px (gap/padding), bordas suaves, `radius` moderado.

---

## 5) Componentes e padrões de tela

### 5.1) Cabeçalho de página (Page Titlebar)
Uso:
- Voltar (`back-btn`), `h1` e subtítulo, ações à direita (ex.: “Novo contrato”).

Regras:
- Ações importantes no topo (ex.: criar).
- Botões do titlebar ligeiramente menores para não competir com o conteúdo.

### 5.2) Cards de ação (landing do módulo)
Uso:
- Entrada do módulo (ex.: `contratos-modulo.html`): cards grandes, clicáveis.

Regras:
- Ícone grande (mas não exagerado), título e subtítulo.
- Tamanho reduzido para ficar mais próximo do RENAR (sem “blocos gigantes”).

### 5.3) Listagem (cards/tabela)
Uso:
- Busca com filtros e resultados.

Regras:
- Mostrar `contador`.
- Ter estado vazio (mensagem clara + call to action).
- Em telas pequenas, preferir cards ou tabela responsiva.

### 5.4) Botões de ação por item
Exemplo (contratos): visualizar, editar, excluir, movimentar.

Regras:
- Visualizar: abre modo consulta.
- Editar: abre modo edição.
- Excluir: destrutivo, pedir confirmação.
- Movimentar: abre/mostra movimentos.

### 5.5) Formulários (cadastro/edição)
Regras:
- Campos obrigatórios com `*`.
- Mensagens de validação logo abaixo do campo.
- Botões no rodapé do formulário.

Modo **Consulta**:
- Campos desabilitados.
- Sem “Salvar”.
- Abas só habilitam se houver conteúdo (movimentos/anexos).

Modo **Edição**:
- Campos habilitados.
- “Salvar alterações” visível.
- Abas habilitadas para permitir gestão de movimentos/anexos.

### 5.6) Abas (Dados / Movimentos / Anexos)
Regras:
- Aba “Dados Principais” sempre ativa.
- Movimentos/Anexos habilitam com base no modo e/ou existência de dados.
- Não usar abas “fake” (sempre desabilitadas) sem justificativa.

### 5.7) Collapse (seções expansíveis)
Uso:
- Agrupar blocos do formulário (“Dados cadastrais”, “Contrato”, etc.).

Regras:
- Indicador visual (seta) deve ser símbolo correto, não código (ex.: `\25BE`).
- Estado aberto/fechado com rotação suave.

---

## 6) Iconografia e branding

### Ícones (padrão RENAR)
Diretrizes:
- Ícones “line” (traço), simples, sem volumes.
- Cor consistente com o contexto (menu em branco sobre azul; ações em azul/verde/vermelho).
- Mesma família visual (não misturar estilos diferentes na mesma área).

### Favicon / ícone do sistema
Regras:
- Definir `favicon` em todas as páginas.
- Preferir PNG (boa compatibilidade) e SVG como fallback quando possível.

Implementação:
- `img/favicon.png` (logo CNC) + `img/logo.svg` como alternativa.
- Links no `<head>` de todas as páginas.

---

## 7) Padrões de feedback e erros

Regras:
- **Sucesso**: mensagem curta, clara, não invasiva.
- **Erro**: explicar próximo passo (“verifique conexão”, “tente novamente”).
- **Vazio**: instruir o usuário (ajuste filtros / cadastre um novo).

---

## 8) Acessibilidade (mínimo esperado)

Checklist:
- Botões com `aria-label` quando forem apenas ícone.
- Links e botões com área clicável adequada.
- Contraste suficiente (texto vs fundo).
- Estado desabilitado perceptível (visual + `aria-disabled`).

---

## 9) Fluxos implementados neste projeto (referência prática)

### Consulta/Edição (contratos)
- Listagem abre:
  - Consulta: `novo-contrato.html?id=123&readonly=1&from=contratos`
  - Edição: `novo-contrato.html?id=123&from=contratos`

### Movimentos e anexos
- Consulta: mostra, mas bloqueia alterações.
- Edição: permite adicionar movimento e anexar/remover arquivos.

---

## 10) Boas práticas de manutenção

### Organização
- Manter tokens em um único lugar (`:root` do CSS).
- Evitar duplicar UI no “topo” e no “conteúdo” (título).
- Consolidar padrões repetidos (menu/sidebar) para reduzir divergência entre páginas.

### Build / distribuição
- O projeto usa `scripts/build.js` para gerar `dist/`.
- Sempre que mudar HTML/CSS/JS, regenerar `dist/` para publicar/servir o estático.

---

## 11) Checklist rápido (para novos módulos)

- Sidebar: item novo com ícone no padrão.
- Landing do módulo: 2–3 cards de ação.
- Busca: filtros + estado vazio + contador.
- Cadastro: validação + salvar/cancelar.
- Consulta: read-only + sem salvar.
- Ações por item: visualizar/editar/excluir (+ ações específicas do domínio).
- Responsivo: sidebar mobile + tabela/cards.
- Favicon e branding presentes.

