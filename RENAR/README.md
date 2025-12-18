# RENAR (Rede Nacional de Representações do Sistema Confederativo do Comércio)

---

## 📖 Visão Geral

A **Rede Nacional de Representações do Sistema Confederativo do Comércio (RENAR)** é uma iniciativa da Confederação Nacional do Comércio de Bens, Serviços e Turismo (CNC) que visa fortalecer a representatividade institucional do Sistema Comércio no Brasil.  
Este repositório contém o **projeto web** da RENAR, desenvolvido em **Next.js** com autenticação via **NextAuth + Azure AD B2C (GIAC)**, design system CNC e ferramentas modernas de validação e formulários.

---

## 🎯 Objetivos do Sistema

- Disponibilizar informações sobre representantes da CNC em órgãos consultivos e deliberativos (nacionais e internacionais).
- Permitir que federações, sindicatos e empresários acompanhem cargos, mandatos e tempo de exercício.
- Facilitar o alinhamento entre as ações institucionais do Sistema CNC-Sesc-Senac.
- Oferecer capacitação e ferramentas digitais para atuação mais eficiente dos representantes.

---

## 🛠️ Stack Tecnológica

Este projeto foi construído utilizando:

- **[Next.js](https://nextjs.org/)** – Framework React para front-end e back-end integrados.
- **[NextAuth.js](https://next-auth.js.org/)** – Autenticação integrada com **Azure AD B2C (GIAC)**.
- **[TailwindCSS](https://tailwindcss.com/)** – Estilização utilitária.
- **[@cnc-ti/layout-basic](https://www.npmjs.com/)** – Biblioteca de layout e design system unificado da CNC, utilizada em todos os projetos.
- **[Zod](https://zod.dev/)** – Validações tipadas de dados e variáveis de ambiente.
- **[React Hook Form](https://react-hook-form.com/)** – Gerenciamento de formulários performático.

---

## 🚀 Como Executar o Projeto

### 1. Pré-requisitos

- Node.js (>= 18)
- Yarn ou npm

### 2. Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://CNC-TI@dev.azure.com/CNC-TI/Representa%C3%A7%C3%B5es/_git/Renar-frontend
cd Renar-frontend
yarn install
# ou
npm install
```

## 3. Variáveis de Ambiente

Crie um arquivo .env.local na raiz do projeto com as seguintes variáveis:

```txt
NEXT_PUBLIC_API_URL=http://localhost:3334
NEXT_PUBLIC_API_HOST=localhost
AZURE_AD_B2C_TENANT_NAME=seu-tenant
AZURE_AD_B2C_CLIENT_ID=seu-client-id
AZURE_AD_B2C_CLIENT_SECRET=seu-client-secret
AZURE_AD_B2C_PRIMARY_USER_FLOW=B2C_1_SignIn
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=sua-chave-secreta
```

### Descrição das Variáveis:

- **`NEXT_PUBLIC_API_URL`**: URL base da API backend (ex: `http://localhost:3334` em desenvolvimento)
- **`NEXT_PUBLIC_API_HOST`**: Hostname da API para configuração de imagens do Next.js (ex: `localhost` em desenvolvimento, `api.renar.gov.br` em produção)
- **`AZURE_AD_B2C_TENANT_NAME`**: Nome do tenant do Azure AD B2C
- **`AZURE_AD_B2C_CLIENT_ID`**: ID do cliente da aplicação no Azure AD B2C
- **`AZURE_AD_B2C_CLIENT_SECRET`**: Chave secreta do cliente
- **`AZURE_AD_B2C_PRIMARY_USER_FLOW`**: Fluxo de usuário principal (ex: `B2C_1_SignIn`)
- **`NEXTAUTH_URL`**: URL da aplicação frontend (ex: `http://localhost:3001` em desenvolvimento)
- **`NEXTAUTH_SECRET`**: Chave secreta para criptografia do NextAuth

> As variáveis são validadas com Zod para evitar erros de configuração.

## 4. Executando em Desenvolvimento

```bash
yarn dev
# ou
npm run dev
```

> A aplicação estará disponível em http://localhost:3000.

## 5. Build de Produção

```bash
yarn build
yarn start
# ou
npm run build && npm run start
```
