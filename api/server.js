// server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

/* ========== CORS ========== */
const allowList =
  (process.env.CORS_ORIGIN || '')
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
    credentials: false
  })
);

app.use(express.json());

/* ========== Postgres (Railway) ========== */
const isLocal =
  process.env.DATABASE_URL &&
  (process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1'));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocal ? false : { rejectUnauthorized: false }
});

async function pingDB() {
  const { rows } = await pool.query('SELECT 1 AS ok');
  return rows[0].ok === 1;
}

/* ========== Helpers ========== */
function httpErr(res, err, status = 500) {
  console.error(err);
  return res.status(status).json({
    error: 'Erro interno',
    detail: err.detail || err.message || String(err)
  });
}

/* ========== Healthcheck ========== */
app.get('/health', async (req, res) => {
  try {
    await pingDB();
    res.json({ ok: true });
  } catch (err) {
    httpErr(res, err);
  }
});

/* ====================================================================== */
/* =======================   CENTROS DE CUSTO   ========================= */
/* ====================================================================== */

// GET todos
app.get('/centros', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, codigo, nome, responsavel, email FROM centros_custo ORDER BY id DESC'
    );
    res.json(rows);
  } catch (err) {
    httpErr(res, err);
  }
});

// POST criar
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
    // Unique key
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Código de centro já existe', detail: err.detail });
    }
    httpErr(res, err);
  }
});

// PUT atualizar
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

// DELETE apagar
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

/* ====================================================================== */
/* =======================   CONTAS CONTÁBEIS   ========================= */
/* ====================================================================== */

// GET todos
app.get('/contas', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, codigo, descricao, tipo FROM contas_contabeis ORDER BY id DESC'
    );
    res.json(rows);
  } catch (err) {
    httpErr(res, err);
  }
});

// POST criar
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

// PUT atualizar
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

// DELETE apagar
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

/* ====================================================================== */
/* ============================   CONTRATOS   ============================ */
/* ====================================================================== */

// LISTAR CONTRATOS
app.get('/contratos', async (req, res) => {
  try {
    const q = await pool.query(`
      SELECT
        c.id,
        c.numero,
        c.fornecedor,
        c.centro_custo_id  AS "centroCusto",
        c.conta_contabil_id AS "contaContabil",
        c.valor            AS "valorTotal",
        c.saldo_utilizado  AS "saldoUtilizado",
        c.data_inicio      AS "dataInicio",
        c.data_fim         AS "dataVencimento",
        c.descricao        AS "observacoes"
      FROM contratos c
      ORDER BY c.id DESC
    `);
    res.json(q.rows);
  } catch (err) {
    console.error('GET /contratos error:', err);
    res.status(500).json({ error: 'Erro interno', detail: err.detail || err.message });
  }
});

// CRIAR CONTRATO
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
      observacoes
    } = req.body;

    const ins = await pool.query(
      `INSERT INTO contratos
         (numero, fornecedor, centro_custo_id, conta_contabil_id, valor, saldo_utilizado, data_inicio, data_fim, descricao)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
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
        observacoes || null
      ]
    );

    res.json({ ok: true, id: ins.rows[0].id });
  } catch (err) {
    console.error('POST /contratos error:', err);
    res.status(500).json({ error: 'Erro interno', detail: err.detail || err.message });
  }
});

// ATUALIZAR CONTRATO
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
      observacoes
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
              descricao=$9
        WHERE id=$10`,
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
        id
      ]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error('PUT /contratos error:', err);
    res.status(500).json({ error: 'Erro interno', detail: err.detail || err.message });
  }
});

// EXCLUIR CONTRATO
app.delete('/contratos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await pool.query('DELETE FROM contratos WHERE id=$1', [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /contratos error:', err);
    res.status(500).json({ error: 'Erro interno', detail: err.detail || err.message });
  }
});

/* ========== 404 padrão ========== */
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

/* ========== Start ========== */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
