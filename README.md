# Controle de Contratos

Agora todo o sistema pode rodar apenas como front-end estatico: os dados sao gravados no `localStorage` do navegador, sem necessidade de API ou banco externo. Cada usuario va e manipula os registros armazenados no proprio dispositivo.

## Como rodar
1. Instale as dependencias apenas uma vez:
   ```bash
   npm install
   ```
2. Gere a pasta `dist/` sempre que fizer ajustes:
   ```bash
   npm run build
   ```
3. Sirva o conteudo de `dist/` com qualquer servidor estatico (ou abra o `index.html` diretamente):
   ```bash
   npx serve dist
   ```
   Depois acesse o endereco mostrado (ex.: `http://localhost:3000`). Nao ha necessidade de iniciar um backend nem de configurar banco de dados.

Os registros ficam limitados ao navegador/host em que o sistema foi aberto. Para limpar ou migrar os dados, basta usar as ferramentas do navegador para remover o `localStorage` (ex.: DevTools > Application > Local Storage > remover `cnc_local_db_v1`).

## Scripts disponiveis
- `npm run build`: recria `dist/` com os arquivos HTML/CSS/JS prontos para deploy.
- `npm run start` / `npm run api:start`: mantidos apenas para compatibilidade; sobem a antiga API Node se voce quiser reaproveitar um banco Postgres.
- `npm run dev` / `npm run api:dev`: idem acima, mas com `nodemon`.

## Observacoes
- Caso o PowerShell bloqueie `npm`, execute os comandos via `cmd.exe` ou ajuste a ExecutionPolicy.
- Para reativar o backend opcional, configure `api/.env` (veja `api/.env.local.example`) e execute `npm run dev` normalmente. O front detecta automaticamente `localhost` e direciona as chamadas para a API local, mas isso nao e mais necessario para uso basico.




