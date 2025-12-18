// server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { newDb } = require('pg-mem');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
let pool;
let usingMemoryDB = false;

/* ===================== CORS ===================== */
const allowList = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

function isOriginAllowed(origin) {
  if (!origin) return true; // curl/postman
  if (allowList.length === 0) return true; // sem restriaao => permite todos
  if (allowList.includes('*')) return true; // curinga explacito
  if (allowList.includes(origin)) return true; // match exato
  // match por prefixo para permitir qualquer porta (ex.: http://localhost, http://172.23.64.1)
  for (const a of allowList) {
    if (!a) continue;
    if (origin.startsWith(a)) return true;
    // tambam aceita sufixo '*' explicitado (ex.: http://localhost:*)
    if (a.endsWith('*') && origin.startsWith(a.slice(0, -1))) return true;
  }
  return false;
}

app.use(
  cors({
    origin: (origin, cb) => {
      if (isOriginAllowed(origin)) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
  })
);

app.use(express.json());

/* =========== Postgres / pg-mem bootstrap =========== */
function shouldUseMemoryDB() {
  const driver = (process.env.DB_DRIVER || '').toLowerCase();
  if (['pgmem', 'memory', 'mem', 'inmemory'].includes(driver)) return true;
  const url = process.env.DATABASE_URL || '';
  if (!url) return true;
  if (url.startsWith('pgmem://')) return true;
  return false;
}

function resolveSSLConfig(dbUrlSource = process.env.DATABASE_URL) {
  const explicit = (process.env.PGSSLMODE || process.env.PG_SSL || '').toLowerCase();
  if (explicit === 'disable' || explicit === 'off' || explicit === 'false') return false;
  if (explicit === 'require' || explicit === 'on' || explicit === 'true') {
    return { rejectUnauthorized: false };
  }

  try {
    const dbUrl = new URL(dbUrlSource);
    const sslMode = (dbUrl.searchParams.get('sslmode') || '').toLowerCase();
    if (sslMode === 'require' || sslMode === 'verify-full' || sslMode === 'verify-ca') {
      return { rejectUnauthorized: false };
    }
    const host = (dbUrl.hostname || '').toLowerCase();
    const localHosts = ['localhost', '127.0.0.1', '::1'];
    const isLocalHost =
      !host ||
      localHosts.includes(host) ||
      host.endsWith('.local') ||
      host === 'host.docker.internal';
    return isLocalHost ? false : { rejectUnauthorized: false };
  } catch (err) {
    console.warn('Could not parse DATABASE_URL for SSL detection:', err.message);
    return false;
  }
}

function createMemoryPool() {
  const db = newDb({ autoCreateForeignKeyIndices: true });
  db.public.registerFunction({
    name: 'now',
    returns: 'timestamp',
    implementation: () => new Date(),
  });
  const adapter = db.adapters.createPg();
  const { Pool: MemPool } = adapter;
  usingMemoryDB = true;
  console.warn('[db] Usando banco em memoria (pg-mem). Os dados serao perdidos ao reiniciar o servidor.');
  return new MemPool();
}

async function bootstrapPool() {
  if (shouldUseMemoryDB()) {
    pool = createMemoryPool();
    return;
  }

  try {
    const candidate = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: resolveSSLConfig(),
    });
    await candidate.query("SET TIME ZONE 'America/Sao_Paulo'");
    await candidate.query('SELECT 1');
    pool = candidate;
    usingMemoryDB = false;
    console.log('[db] Conectado ao Postgres.');
  } catch (err) {
    console.error('[db] Falha ao conectar ao Postgres:', err.message);
    console.warn('[db] Alternando para banco em memoria. Defina DB_DRIVER=pgmem para ocultar este aviso.');
    pool = createMemoryPool();
  }
}

/* =========== Uploads (anexos) =========== */
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({ dest: uploadDir });
app.use('/files', express.static(uploadDir));

app.get('/', (_req, res) => res.json({ ok: true }));

/* =========== Helpers comuns =========== */
function httpErr(res, err, status = 500) {
  console.error(err);
  res.status(status).json({
    error: 'Erro interno',
    detail: err.detail || err.message || String(err),
  });
}

async function pingDB() {
  if (!pool) throw new Error('DB pool ainda nao inicializado');
  const { rows } = await pool.query('SELECT 1 AS ok');
  return rows[0].ok === 1;
}

/* =========== Bootstrap de esquema (idempotente) =========== */
async function ensureSchema() {
  const timestampDefault = usingMemoryDB ? "NOW()" : "(NOW() AT TIME ZONE 'America/Sao_Paulo')";
  await pool.query(`
    CREATE TABLE IF NOT EXISTS centros_custo (
      id SERIAL PRIMARY KEY,
      codigo TEXT UNIQUE NOT NULL,
      nome TEXT NOT NULL,
      responsavel TEXT,
      email TEXT
    );

    CREATE TABLE IF NOT EXISTS contas_contabeis (
      id SERIAL PRIMARY KEY,
      codigo TEXT UNIQUE NOT NULL,
      descricao TEXT NOT NULL,
      tipo TEXT
    );

    CREATE TABLE IF NOT EXISTS contratos (
      id SERIAL PRIMARY KEY,
      numero TEXT,
      fornecedor TEXT,
      centro_custo_id INT REFERENCES centros_custo(id) ON DELETE SET NULL,
      conta_contabil_id INT REFERENCES contas_contabeis(id) ON DELETE SET NULL,
      valor NUMERIC DEFAULT 0,
      saldo_utilizado NUMERIC DEFAULT 0,
      data_inicio DATE,
      data_fim DATE,
      descricao TEXT,
      ativo BOOLEAN NOT NULL DEFAULT true
    );
    CREATE INDEX IF NOT EXISTS idx_contratos_centro ON contratos (centro_custo_id);
    CREATE INDEX IF NOT EXISTS idx_contratos_conta ON contratos (conta_contabil_id);

    -- contratos: garantir flag ativo e default do saldo
    ALTER TABLE contratos
      ADD COLUMN IF NOT EXISTS ativo boolean NOT NULL DEFAULT true;
    ALTER TABLE contratos
      ALTER COLUMN saldo_utilizado SET DEFAULT 0;

    -- movimentaaaes
    CREATE TABLE IF NOT EXISTS contrato_movimentos (
      id           SERIAL PRIMARY KEY,
      contrato_id  INT NOT NULL REFERENCES contratos(id) ON DELETE CASCADE,
      tipo         TEXT NOT NULL,    -- PAGAMENTO, AJUSTE, INATIVACAO, ATIVACAO, RENOVACAO, ANEXO
      observacao   TEXT,
      valor        NUMERIC DEFAULT 0,
      criado_em    TIMESTAMPTZ NOT NULL DEFAULT ${timestampDefault}
    );
    CREATE INDEX IF NOT EXISTS idx_contrato_movimentos_contrato_id
      ON contrato_movimentos (contrato_id);

    -- anexos
    CREATE TABLE IF NOT EXISTS contrato_arquivos (
      id           SERIAL PRIMARY KEY,
      contrato_id  INT NOT NULL REFERENCES contratos(id) ON DELETE CASCADE,
      nome_arquivo TEXT NOT NULL,
      url          TEXT NOT NULL,
      criado_em    TIMESTAMPTZ NOT NULL DEFAULT ${timestampDefault}
    );
    CREATE INDEX IF NOT EXISTS idx_contrato_arquivos_contrato_id
      ON contrato_arquivos (contrato_id);
  `);
}

/* =========== Healthcheck =========== */
app.get('/health', async (_req, res) => {
  try {
    await pingDB();
    res.json({ ok: true });
  } catch (err) {
    httpErr(res, err);
  }
});

/* =================================================================== */
/* =======================   CENTROS DE CUSTO   ====================== */
/* =================================================================== */

app.get('/centros', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, codigo, nome, responsavel, email FROM centros_custo ORDER BY id DESC'
    );
    res.json(rows);
  } catch (err) {
    httpErr(res, err);
  }
});

app.post('/centros', async (req, res) => {
  try {
    const { codigo, nome, responsavel, email } = req.body;
    const sql = `
      INSERT INTO centros_custo (codigo, nome, responsavel, email)
      VALUES ($1, $2, $3, $4)
      RETURNING id, codigo, nome, responsavel, email
    `;
    const { rows } = await pool.query(sql, [codigo, nome, responsavel || null, email || null]);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Cadigo de centro ja existe', detail: err.detail });
    }
    httpErr(res, err);
  }
});

app.put('/centros/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, nome, responsavel, email } = req.body;
    const sql = `
      UPDATE centros_custo
         SET codigo = $1,
             nome = $2,
             responsavel = $3,
             email = $4
       WHERE id = $5
      RETURNING id, codigo, nome, responsavel, email
    `;
    const { rows } = await pool.query(sql, [codigo, nome, responsavel || null, email || null, id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Centro nao encontrado' });
    res.json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Cadigo de centro ja existe', detail: err.detail });
    }
    httpErr(res, err);
  }
});

app.delete('/centros/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const del = await pool.query('DELETE FROM centros_custo WHERE id=$1', [id]);
    if (del.rowCount === 0) return res.status(404).json({ error: 'Centro nao encontrado' });
    res.json({ ok: true });
  } catch (err) {
    httpErr(res, err);
  }
});

/* =================================================================== */
/* =======================   CONTAS CONTaBEIS   ====================== */
/* =================================================================== */

app.get('/contas', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, codigo, descricao, tipo FROM contas_contabeis ORDER BY id DESC'
    );
    res.json(rows);
  } catch (err) {
    httpErr(res, err);
  }
});

app.post('/contas', async (req, res) => {
  try {
    const { codigo, descricao, tipo } = req.body;
    const sql = `
      INSERT INTO contas_contabeis (codigo, descricao, tipo)
      VALUES ($1, $2, $3)
      RETURNING id, codigo, descricao, tipo
    `;
    const { rows } = await pool.query(sql, [codigo, descricao, tipo]);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Cadigo de conta ja existe', detail: err.detail });
    }
    httpErr(res, err);
  }
});

app.put('/contas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, descricao, tipo } = req.body;
    const sql = `
      UPDATE contas_contabeis
         SET codigo = $1,
             descricao = $2,
             tipo = $3
       WHERE id = $4
      RETURNING id, codigo, descricao, tipo
    `;
    const { rows } = await pool.query(sql, [codigo, descricao, tipo, id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Conta nao encontrada' });
    res.json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Cadigo de conta ja existe', detail: err.detail });
    }
    httpErr(res, err);
  }
});

app.delete('/contas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const del = await pool.query('DELETE FROM contas_contabeis WHERE id=$1', [id]);
    if (del.rowCount === 0) return res.status(404).json({ error: 'Conta nao encontrada' });
    res.json({ ok: true });
  } catch (err) {
    httpErr(res, err);
  }
});

/* =================================================================== */
/* ============================   CONTRATOS   ========================= */
/* =================================================================== */

/* monta WHERE de filtros */
function buildWhere(req) {
  const q = {
    ativo: req.query.ativo,
    status: req.query.status || (req.query.vencendo30 ? 'VENCE_EM_30_DIAS' : undefined),
    centro: req.query.centro,
    conta: req.query.conta,
    fornecedor: req.query.fornecedor,
    q: req.query.q,
    vencimentoDe: req.query.vencimentoDe || req.query.inicioDesde,
    vencimentoAte: req.query.vencimentoAte,
  };

  const where = [];
  const params = [];

  if (typeof q.ativo !== 'undefined') {
    params.push(String(q.ativo).toLowerCase() === 'true');
    where.push(`c.ativo = $${params.length}`);
  }

  if (q.status) {
    const idx = params.push(String(q.status).toUpperCase());
    where.push(`
      CASE
        WHEN NOT c.ativo THEN 'INATIVO'
        WHEN c.data_fim < CURRENT_DATE THEN 'VENCIDO'
        WHEN c.data_fim <= CURRENT_DATE + INTERVAL '30 days' THEN 'VENCE_EM_30_DIAS'
        ELSE 'ATIVO'
      END = $${idx}
    `);
  }

  if (q.centro) {
    params.push(Number(q.centro));
    where.push(`c.centro_custo_id = $${params.length}`);
  }
  if (q.conta) {
    params.push(Number(q.conta));
    where.push(`c.conta_contabil_id = $${params.length}`);
  }
  if (q.fornecedor) {
    params.push(`%${q.fornecedor}%`);
    where.push(`c.fornecedor ILIKE $${params.length}`);
  }
  if (q.q) {
    params.push(`%${q.q}%`);
    where.push(
      `(c.numero ILIKE $${params.length} OR c.descricao ILIKE $${params.length} OR c.fornecedor ILIKE $${params.length})`
    );
  }
  if (q.vencimentoDe) {
    params.push(q.vencimentoDe);
    where.push(`c.data_fim >= $${params.length}`);
  }
  if (q.vencimentoAte) {
    params.push(q.vencimentoAte);
    where.push(`c.data_fim <= $${params.length}`);
  }

  return { whereSQL: where.length ? `WHERE ${where.join(' AND ')}` : '', params };
}

/* LISTAR */
app.get('/contratos', async (req, res) => {
  try {
    const { whereSQL, params } = buildWhere(req);
    const qres = await pool.query(
      `
      SELECT
        c.id,
        c.numero,
        c.fornecedor,
        c.centro_custo_id   AS "centroCusto",
        c.conta_contabil_id  AS "contaContabil",
        c.valor              AS "valorTotal",
        c.saldo_utilizado    AS "saldoUtilizado",
        c.data_inicio        AS "dataInicio",
        c.data_fim           AS "dataVencimento",
        c.descricao          AS "observacoes",
        c.ativo              AS "ativo",
        CASE
          WHEN NOT c.ativo THEN 'INATIVO'
          WHEN c.data_fim < CURRENT_DATE THEN 'VENCIDO'
          WHEN c.data_fim <= CURRENT_DATE + INTERVAL '30 days' THEN 'VENCE_EM_30_DIAS'
          ELSE 'ATIVO'
        END                  AS "status"
      FROM contratos c
      ${whereSQL}
      ORDER BY c.id DESC
      `,
      params
    );
    res.json(qres.rows);
  } catch (err) {
    httpErr(res, err);
  }
});

/* OBTER POR ID */
app.get('/contratos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'ID invalido' });

    const { rows } = await pool.query(
      `
      SELECT
        c.id,
        c.numero,
        c.fornecedor,
        c.centro_custo_id    AS "centroCusto",
        c.conta_contabil_id  AS "contaContabil",
        c.valor              AS "valorTotal",
        c.saldo_utilizado    AS "saldoUtilizado",
        c.data_inicio        AS "dataInicio",
        c.data_fim           AS "dataVencimento",
        c.descricao          AS "observacoes",
        c.ativo              AS "ativo"
      FROM contratos c
      WHERE c.id = $1
      `,
      [id]
    );

    if (!rows.length) return res.status(404).json({ error: 'Contrato nao encontrado' });
    res.json(rows[0]);
  } catch (err) {
    httpErr(res, err);
  }
});

/* CRIAR */
app.post('/contratos', async (req, res) => {
  try {
    const {
      numero, fornecedor, centroCusto, contaContabil,
      valorTotal, saldoUtilizado, dataInicio, dataVencimento,
      observacoes, ativo,
    } = req.body;

    const ins = await pool.query(
      `INSERT INTO contratos
         (numero, fornecedor, centro_custo_id, conta_contabil_id, valor, saldo_utilizado, data_inicio, data_fim, descricao, ativo)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING id`,
      [
        numero || null, fornecedor || null,
        centroCusto || null, contaContabil || null,
        valorTotal || 0, saldoUtilizado || 0,
        dataInicio || null, dataVencimento || null,
        observacoes || null,
        typeof ativo === 'boolean' ? ativo : true,
      ]
    );
    res.status(201).json({ ok: true, id: ins.rows[0].id });
  } catch (err) {
    httpErr(res, err);
  }
});

/* ATUALIZAR */
app.put('/contratos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const {
      numero, fornecedor, centroCusto, contaContabil,
      valorTotal, saldoUtilizado, dataInicio, dataVencimento,
      observacoes, ativo,
    } = req.body;

    await pool.query(
      `UPDATE contratos
          SET numero=$1, fornecedor=$2, centro_custo_id=$3, conta_contabil_id=$4,
              valor=$5, saldo_utilizado=$6, data_inicio=$7, data_fim=$8, descricao=$9, ativo=$10
        WHERE id=$11`,
      [
        numero || null, fornecedor || null,
        centroCusto || null, contaContabil || null,
        valorTotal || 0, saldoUtilizado || 0,
        dataInicio || null, dataVencimento || null,
        observacoes || null,
        typeof ativo === 'boolean' ? ativo : true,
        id,
      ]
    );
    res.json({ ok: true });
  } catch (err) {
    httpErr(res, err);
  }
});

/* EXCLUIR */
app.delete('/contratos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await pool.query('DELETE FROM contratos WHERE id=$1', [id]);
    res.json({ ok: true });
  } catch (err) {
    httpErr(res, err);
  }
});

/* =========== Aaaes de status (inativar/ativar/renovar) =========== */
app.post('/contratos/:id/inativar', async (req, res) => {
  const id = Number(req.params.id);
  const { motivo } = req.body || {};
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('UPDATE contratos SET ativo=false WHERE id=$1', [id]);
    await client.query(
      `INSERT INTO contrato_movimentos (contrato_id, tipo, observacao, valor)
       VALUES ($1, 'INATIVACAO', $2, 0)`,
      [id, motivo || null]
    );
    await client.query('COMMIT');
    res.json({ ok: true });
  } catch (err) {
    await client.query('ROLLBACK');
    httpErr(res, err);
  } finally {
    client.release();
  }
});

app.post('/contratos/:id/ativar', async (req, res) => {
  const id = Number(req.params.id);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('UPDATE contratos SET ativo=true WHERE id=$1', [id]);
    await client.query(
      `INSERT INTO contrato_movimentos (contrato_id, tipo, observacao, valor)
       VALUES ($1, 'ATIVACAO', NULL, 0)`,
      [id]
    );
    await client.query('COMMIT');
    res.json({ ok: true });
  } catch (err) {
    await client.query('ROLLBACK');
    httpErr(res, err);
  } finally {
    client.release();
  }
});

app.post('/contratos/:id/renovar', async (req, res) => {
  const id = Number(req.params.id);
  const { novaDataFim, valorAdicional, observacao } = req.body || {};
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    if (valorAdicional && Number(valorAdicional) !== 0) {
      await client.query('UPDATE contratos SET valor = COALESCE(valor,0) + $1 WHERE id=$2', [
        Number(valorAdicional), id,
      ]);
    }
    if (novaDataFim) {
      await client.query('UPDATE contratos SET data_fim = $1 WHERE id=$2', [novaDataFim, id]);
    }

    await client.query(
      `INSERT INTO contrato_movimentos (contrato_id, tipo, observacao, valor)
       VALUES ($1, 'RENOVACAO', $2, 0)`,
      [id, observacao || null]
    );

    await client.query('COMMIT');
    res.json({ ok: true });
  } catch (err) {
    await client.query('ROLLBACK');
    httpErr(res, err);
  } finally {
    client.release();
  }
});

/* =========== Movimentaaaes =========== */
app.get('/contratos/:id/movimentos', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { rows } = await pool.query(
      `SELECT id, contrato_id, tipo, observacao, valor AS "valorDelta",
              criado_em AS "criadoEm"
         FROM contrato_movimentos
        WHERE contrato_id = $1
        ORDER BY id DESC`,
      [id]
    );
    res.json(rows);
  } catch (err) {
    httpErr(res, err);
  }
});

app.post('/contratos/:id/movimentos', async (req, res) => {
  const id = Number(req.params.id);
  const { tipo, observacao, valorDelta } = req.body || {};
  if (!tipo) return res.status(400).json({ error: 'Campo "tipo" a obrigatario' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `INSERT INTO contrato_movimentos (contrato_id, tipo, observacao, valor)
       VALUES ($1,$2,$3,$4)
       RETURNING id`,
      [id, tipo, observacao || null, Number(valorDelta || 0)]
    );

    if (valorDelta && Number(valorDelta) !== 0) {
      await client.query(
        'UPDATE contratos SET saldo_utilizado = COALESCE(saldo_utilizado,0) + $1 WHERE id=$2',
        [Number(valorDelta), id]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ ok: true, id: rows[0].id });
  } catch (err) {
    await client.query('ROLLBACK');
    httpErr(res, err);
  } finally {
    client.release();
  }
});

/* Rotas compataveis com nomes antigos */
app.get('/contratos/:id/movimentacoes', (req, res) => app._router.handle(
  { ...req, url: `/contratos/${req.params.id}/movimentos`, method: 'GET' }, res
));
app.post('/contratos/:id/movimentacoes', (req, res) => app._router.handle(
  { ...req, url: `/contratos/${req.params.id}/movimentos`, method: 'POST' }, res
));

/* =========== Upload e listagem de anexos =========== */
app.post('/contratos/:id/anexos', upload.single('file'), async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!req.file) return res.status(400).json({ error: 'Arquivo nao enviado' });

    const url = `/files/${req.file.filename}`;
    const nome = req.file.originalname || req.file.filename;

    await pool.query(
      `INSERT INTO contrato_arquivos (contrato_id, nome_arquivo, url)
       VALUES ($1,$2,$3)`,
      [id, nome, url]
    );

    await pool.query(
      `INSERT INTO contrato_movimentos (contrato_id, tipo, observacao, valor)
       VALUES ($1, 'ANEXO', $2, 0)`,
      [id, `Upload de anexo: ${nome}`]
    );

    res.status(201).json({ ok: true, url, nome });
  } catch (err) {
    httpErr(res, err);
  }
});

app.get('/contratos/:id/arquivos', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { rows } = await pool.query(
      `SELECT id, contrato_id, nome_arquivo, url, criado_em
         FROM contrato_arquivos
        WHERE contrato_id = $1
        ORDER BY id DESC`,
      [id]
    );
    res.json(rows);
  } catch (err) {
    httpErr(res, err);
  }
});

app.delete('/contratos/:id/arquivos/:arquivoId', async (req, res) => {
  try {
    const contratoId = Number(req.params.id);
    const arquivoId = Number(req.params.arquivoId);

    const { rows } = await pool.query(
      'DELETE FROM contrato_arquivos WHERE id=$1 AND contrato_id=$2 RETURNING url, nome_arquivo',
      [arquivoId, contratoId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Arquivo nao encontrado' });
    }

    const filePath = path.join(uploadDir, path.basename(rows[0].url));
    fs.unlink(filePath, () => {});

    await pool.query(
      `INSERT INTO contrato_movimentos (contrato_id, tipo, observacao, valor)
       VALUES ($1, 'ANEXO', $2, 0)`,
      [contratoId, `Remoaao de anexo: ${rows[0].nome_arquivo}`]
    );

    res.status(204).end();
  } catch (err) {
    httpErr(res, err);
  }
});
/* ======================== DASHBOARD ======================== */
app.get('/dashboard/metrics', async (_req, res) => {
  try {
    const statusSql = `
      SELECT
        CASE
          WHEN NOT c.ativo THEN 'INATIVO'
          WHEN c.data_fim < CURRENT_DATE THEN 'VENCIDO'
          WHEN c.data_fim <= CURRENT_DATE + INTERVAL '30 days' THEN 'VENCE_EM_30_DIAS'
          ELSE 'ATIVO'
        END AS status,
        COUNT(*) AS total
      FROM contratos c
      GROUP BY 1
    `;
    const statusRes = await pool.query(statusSql);
    const statusContratos = {};
    statusRes.rows.forEach(r => {
      statusContratos[r.status] = Number(r.total);
    });

    const evolucaoSql = `
      SELECT to_char(date_trunc('month', criado_em), 'YYYY-MM') AS mes,
             SUM(valor) AS valor
        FROM contrato_movimentos
       WHERE tipo = 'PAGAMENTO'
       GROUP BY 1
       ORDER BY 1
    `;
    const pagRes = await pool.query(evolucaoSql);
    const evolucaoPagamentos = pagRes.rows.map(r => ({
      mes: r.mes,
      valor: Number(r.valor || 0),
    }));

    const fornecedorSql = `
      SELECT fornecedor, SUM(valor) AS valor
        FROM contratos
       GROUP BY fornecedor
       ORDER BY fornecedor
    `;
    const fornRes = await pool.query(fornecedorSql);
    const topFornecedores = fornRes.rows.map(r => ({
      fornecedor: r.fornecedor,
      total: Number(r.valor || 0),
    }));

    res.json({
      // Estrutura pensada para graficos:
      // {
      //   statusContratos: { ATIVO: 10, VENCIDO: 2, ... },
      //   evolucaoPagamentos: [ { mes: '2024-01', valor: 123.45 }, ... ],
      //   topFornecedores: [ { fornecedor: 'Acme', total: 999.99 }, ... ]
      // }
      statusContratos,
      evolucaoPagamentos,
      topFornecedores,
    });
  } catch (err) {
    httpErr(res, err);
  }
});
/* =========== Relatario CSV =========== */
app.get('/relatorios/contratos', async (req, res) => {
  try {
    const { whereSQL, params } = buildWhere(req);
    const { rows } = await pool.query(
      `
      SELECT
        c.id, c.numero, c.fornecedor,
        c.valor AS valor_total, c.saldo_utilizado,
        c.data_inicio, c.data_fim, c.ativo
      FROM contratos c
      ${whereSQL}
      ORDER BY c.id DESC
      `,
      params
    );

    const head = ['id','numero','fornecedor','valor_total','saldo_utilizado','data_inicio','data_fim','ativo'];
    const csv = [
      head.join(';'),
      ...rows.map(r =>
        [
          r.id,
          r.numero ?? '',
          r.fornecedor ?? '',
          String(r.valor_total ?? '').replace('.', ','),
          String(r.saldo_utilizado ?? '').replace('.', ','),
          r.data_inicio ?? '',
          r.data_fim ?? '',
          r.ativo ? 'SIM' : 'NAO',
        ].join(';')
      ),
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="contratos.csv"');
    res.send(csv);
  } catch (err) {
    httpErr(res, err);
  }
});

/* =========== Start =========== */
const PORT = process.env.PORT || 3000;

async function start() {
  await bootstrapPool();
  await ensureSchema();
  app.listen(PORT, () => {
    const mode = usingMemoryDB ? 'pg-mem (in-memory)' : 'Postgres';
    console.log(`API on http://localhost:${PORT} [${mode}]`);
  });
}

start()
  .then(() => {
    process.on('SIGINT', () => {
      console.log('\nEncerrando API...');
      if (pool && typeof pool.end === 'function') {
        pool.end().finally(() => process.exit(0));
      } else {
        process.exit(0);
      }
    });
  })
  .catch(err => {
    console.error('Falha ao iniciar API:', err);
    process.exit(1);
  });






