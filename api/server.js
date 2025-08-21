// server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

/* ================= CORS ================= */
const allowList = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // curl/postman
      if (allowList.length === 0 || allowList.includes(origin)) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
  })
);

app.use(express.json());

/* ========== Postgres (SSL por ambiente) ========== */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

/* -------- uploads (anexos) -------- */
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir });
app.use('/files', express.static(uploadDir));

/* ---- bootstrap de esquema (idempotente) ---- */
async function ensureSchema() {
  await pool.query(`
    ALTER TABLE contratos
      ADD COLUMN IF NOT EXISTS ativo boolean NOT NULL DEFAULT true;

    ALTER TABLE contratos
      ALTER COLUMN saldo_utilizado SET DEFAULT 0;

    CREATE TABLE IF NOT EXISTS contrato_movimentos (
      id           SERIAL PRIMARY KEY,
      contrato_id  INT NOT NULL REFERENCES contratos(id) ON DELETE CASCADE,
      tipo         TEXT NOT NULL,  -- PAGAMENTO, AJUSTE, INATIVACAO, ATIVACAO, RENOVACAO, ANEXO
      observacao   TEXT,
      valor        NUMERIC DEFAULT 0,
      criado_em    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_contrato_movimentos_contrato_id
      ON contrato_movimentos (contrato_id);

    CREATE TABLE IF NOT EXISTS contrato_arquivos (
      id           SERIAL PRIMARY KEY,
      contrato_id  INT NOT NULL REFERENCES contratos(id) ON DELETE CASCADE,
      nome_arquivo TEXT NOT NULL,
      url          TEXT NOT NULL,
      criado_em    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_contrato_arquivos_contrato_id
      ON contrato_arquivos (contrato_id);
  `);
}

async function pingDB() {
  const { rows } = await pool.query('SELECT 1 AS ok');
  return rows[0].ok === 1;
}

/* ========== Helpers ========== */
function httpErr(res, err, status = 500) {
  console.error(err);
  return res.status(status).json({
    error: 'Erro interno',
    detail: err.detail || err.message || String(err),
  });
}

/* ========== Healthcheck ========== */
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
      return res.status(409).json({ error: 'Código de centro já existe', detail: err.detail });
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
    if (rows.length === 0) return res.status(404).json({ error: 'Centro não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Código de centro já existe', detail: err.detail });
    }
    httpErr(res, err);
  }
});

app.delete('/centros/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const del = await pool.query('DELETE FROM centros_custo WHERE id=$1', [id]);
    if (del.rowCount === 0) return res.status(404).json({ error: 'Centro não encontrado' });
    res.json({ ok: true });
  } catch (err) {
    httpErr(res, err);
  }
});

/* =================================================================== */
/* =======================   CONTAS CONTÁBEIS   ====================== */
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
      return res.status(409).json({ error: 'Código de conta já existe', detail: err.detail });
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
    if (rows.length === 0) return res.status(404).json({ error: 'Conta não encontrada' });
    res.json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Código de conta já existe', detail: err.detail });
    }
    httpErr(res, err);
  }
});

app.delete('/contas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const del = await pool.query('DELETE FROM contas_contabeis WHERE id=$1', [id]);
    if (del.rowCount === 0) return res.status(404).json({ error: 'Conta não encontrada' });
    res.json({ ok: true });
  } catch (err) {
    httpErr(res, err);
  }
});

/* =================================================================== */
/* ============================   CONTRATOS   ========================= */
/* =================================================================== */

/** constrói WHERE e params para /contratos e /relatorios/contratos */
function buildWhere(req) {
  const q = {
    ativo: req.query.ativo,
    status: req.query.status || (req.query.vencendo30 ? 'VENCE_EM_30_DIAS' : undefined),
    centro: req.query.centro,
    conta: req.query.conta,
    fornecedor: req.query.fornecedor,
    q: req.query.q,
    vencimentoDe: req.query.vencimentoDe || req.query.inicioDesde, // compat
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

/** GET /contratos (lista + filtros) */
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

/** POST /contratos */
app.post('/contratos', async (req, res) => {
  try {
    const {
      numero,
      fornecedor,
      centroCusto,
      contaContabil,
      valorTotal,
      saldoUtilizado,
      dataInicio,
      dataVencimento,
      observacoes,
      ativo,
    } = req.body;

    const ins = await pool.query(
      `INSERT INTO contratos
         (numero, fornecedor, centro_custo_id, conta_contabil_id, valor, saldo_utilizado, data_inicio, data_fim, descricao, ativo)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING id`,
      [
        numero || null,
        fornecedor || null,
        centroCusto || null,
        contaContabil || null,
        valorTotal || 0,
        saldoUtilizado || 0,
        dataInicio || null,
        dataVencimento || null,
        observacoes || null,
        typeof ativo === 'boolean' ? ativo : true,
      ]
    );

    res.status(201).json({ ok: true, id: ins.rows[0].id });
  } catch (err) {
    httpErr(res, err);
  }
});

/** PUT /contratos/:id */
app.put('/contratos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const {
      numero,
      fornecedor,
      centroCusto,
      contaContabil,
      valorTotal,
      saldoUtilizado,
      dataInicio,
      dataVencimento,
      observacoes,
      ativo,
    } = req.body;

    await pool.query(
      `UPDATE contratos
          SET numero=$1,
              fornecedor=$2,
              centro_custo_id=$3,
              conta_contabil_id=$4,
              valor=$5,
              saldo_utilizado=$6,
              data_inicio=$7,
              data_fim=$8,
              descricao=$9,
              ativo=$10
        WHERE id=$11`,
      [
        numero || null,
        fornecedor || null,
        centroCusto || null,
        contaContabil || null,
        valorTotal || 0,
        saldoUtilizado || 0,
        dataInicio || null,
        dataVencimento || null,
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

/** DELETE /contratos/:id */
app.delete('/contratos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await pool.query('DELETE FROM contratos WHERE id=$1', [id]);
    res.json({ ok: true });
  } catch (err) {
    httpErr(res, err);
  }
});

/* --------- Ações de status --------- */
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
        Number(valorAdicional),
        id,
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

/* --------- Movimentações --------- */
const getMovements = async (req, res) => {
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
};

const postMovement = async (req, res) => {
  const id = Number(req.params.id);
  const { tipo, observacao, valorDelta } = req.body || {};
  if (!tipo) return res.status(400).json({ error: 'Campo "tipo" é obrigatório' });

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
};

app.get('/contratos/:id/movimentos', getMovements);
app.post('/contratos/:id/movimentos', postMovement);
/* compat com rotas antigas */
app.get('/contratos/:id/movimentacoes', getMovements);
app.post('/contratos/:id/movimentacoes', postMovement);

/* --------- Upload de anexo --------- */
app.post('/contratos/:id/anexos', upload.single('file'), async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!req.file) return res.status(400).json({ error: 'Arquivo não enviado' });

    const url = `/files/${req.file.filename}`;
    const nome = req.file.originalname || req.file.filename;

    // guarda o arquivo na tabela própria
    await pool.query(
      `INSERT INTO contrato_arquivos (contrato_id, nome_arquivo, url)
       VALUES ($1,$2,$3)`,
      [id, nome, url]
    );

    // registra um movimento (sem estourar colunas)
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

/* --------- Relatório CSV --------- */
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

    const head = [
      'id',
      'numero',
      'fornecedor',
      'valor_total',
      'saldo_utilizado',
      'data_inicio',
      'data_fim',
      'ativo',
    ];
    const csv = [
      head.join(';'),
      ...rows.map(r =>
        [
          r.id,
          r.numero ?? '',
          r.fornecedor ?? '',
          r.valor_total ?? 0,
          r.saldo_utilizado ?? 0,
          r.data_inicio ? new Date(r.data_inicio).toISOString().slice(0, 10) : '',
          r.data_fim ? new Date(r.data_fim).toISOString().slice(0, 10) : '',
          r.ativo ? 'true' : 'false',
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

/* ========== 404 padrão ========== */
app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

/* ========== Start ========== */
const PORT = process.env.PORT || 8080;
ensureSchema()
  .then(() => {
    app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
  })
  .catch(err => {
    console.error('Falha ao iniciar por erro de schema:', err);
    process.exit(1);
  });
