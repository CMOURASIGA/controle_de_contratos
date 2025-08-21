// server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

/* ========== CORS ========== */
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

/* ---- bootstrap de esquema (idempotente) ---- */
async function ensureSchema() {
  await pool.query(`
    -- coluna para ativação/inativação
    ALTER TABLE contratos
      ADD COLUMN IF NOT EXISTS ativo boolean NOT NULL DEFAULT true;

    -- saldo_utilizado padrão
    ALTER TABLE contratos
      ALTER COLUMN saldo_utilizado SET DEFAULT 0;

    -- tabela de movimentações (log) com possível anexo por URL
    CREATE TABLE IF NOT EXISTS contrato_movimentos (
      id             SERIAL PRIMARY KEY,
      contrato_id    INT NOT NULL REFERENCES contratos(id) ON DELETE CASCADE,
      tipo           TEXT NOT NULL,  -- ex: PAGAMENTO, AJUSTE, INATIVACAO, ATIVACAO, RENOVACAO etc.
      descricao      TEXT,
      valor_delta    NUMERIC DEFAULT 0, -- impacto no saldo_utilizado (positivo soma no utilizado)
      anexo_url      TEXT,
      criado_em      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- índice simples para consultas por contrato
    CREATE INDEX IF NOT EXISTS idx_contrato_movimentos_contrato_id
      ON contrato_movimentos (contrato_id);
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

/**
 * GET /contratos
 * Filtros (querystring):
 *  - ativo=true|false
 *  - status=ATIVO|INATIVO|VENCIDO|VENCE_EM_30_DIAS
 *  - centro=<id>
 *  - conta=<id>
 *  - fornecedor=<texto>
 *  - q=<busca livre em numero/descricao/fornecedor>
 *  - vencimentoDe=YYYY-MM-DD
 *  - vencimentoAte=YYYY-MM-DD
 */
app.get('/contratos', async (req, res) => {
  try {
    const {
      ativo,
      status,
      centro,
      conta,
      fornecedor,
      q,
      vencimentoDe,
      vencimentoAte
    } = req.query;

    const where = [];
    const params = [];

    // ativo
    if (typeof ativo !== 'undefined') {
      params.push(String(ativo).toLowerCase() === 'true');
      where.push(`c.ativo = $${params.length}`);
    }

    // status calculado
    if (status) {
      const idx = params.push(status.toUpperCase());
      where.push(`
        CASE
          WHEN NOT c.ativo THEN 'INATIVO'
          WHEN c.data_fim < CURRENT_DATE THEN 'VENCIDO'
          WHEN c.data_fim <= CURRENT_DATE + INTERVAL '30 days' THEN 'VENCE_EM_30_DIAS'
          ELSE 'ATIVO'
        END = $${idx}
      `);
    }

    if (centro) {
      params.push(Number(centro));
      where.push(`c.centro_custo_id = $${params.length}`);
    }
    if (conta) {
      params.push(Number(conta));
      where.push(`c.conta_contabil_id = $${params.length}`);
    }
    if (fornecedor) {
      params.push(`%${fornecedor}%`);
      where.push(`c.fornecedor ILIKE $${params.length}`);
    }
    if (q) {
      params.push(`%${q}%`);
      where.push(`(c.numero ILIKE $${params.length} OR c.descricao ILIKE $${params.length} OR c.fornecedor ILIKE $${params.length})`);
    }
    if (vencimentoDe) {
      params.push(vencimentoDe);
      where.push(`c.data_fim >= $${params.length}`);
    }
    if (vencimentoAte) {
      params.push(vencimentoAte);
      where.push(`c.data_fim <= $${params.length}`);
    }

    const whereSQL = where.length ? `WHERE ${where.join(' AND ')}` : '';

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
      observacoes,
      ativo
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
        typeof ativo === 'boolean' ? ativo : true
      ]
    );

    res.status(201).json({ ok: true, id: ins.rows[0].id });
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
      observacoes,
      ativo
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

/* --------- Ações de status --------- */

// Inativar
app.post('/contratos/:id/inativar', async (req, res) => {
  const id = Number(req.params.id);
  const { motivo } = req.body || {};
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('UPDATE contratos SET ativo=false WHERE id=$1', [id]);
    await client.query(
      `INSERT INTO contrato_movimentos (contrato_id, tipo, descricao, valor_delta)
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

// Ativar
app.post('/contratos/:id/ativar', async (req, res) => {
  const id = Number(req.params.id);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('UPDATE contratos SET ativo=true WHERE id=$1', [id]);
    await client.query(
      `INSERT INTO contrato_movimentos (contrato_id, tipo, descricao, valor_delta)
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

// Renovar (atualiza data_fim e, opcionalmente, soma valor)
app.post('/contratos/:id/renovar', async (req, res) => {
  const id = Number(req.params.id);
  const { novaDataFim, valorAdicional, observacao } = req.body || {};
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    if (valorAdicional && Number(valorAdicional) !== 0) {
      await client.query(
        'UPDATE contratos SET valor = COALESCE(valor,0) + $1 WHERE id=$2',
        [Number(valorAdicional), id]
      );
    }
    if (novaDataFim) {
      await client.query(
        'UPDATE contratos SET data_fim = $1 WHERE id=$2',
        [novaDataFim, id]
      );
    }

    await client.query(
      `INSERT INTO contrato_movimentos (contrato_id, tipo, descricao, valor_delta)
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

/* --------- Movimentações (log + anexos via URL) --------- */

// Listar movimentos
app.get('/contratos/:id/movimentos', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { rows } = await pool.query(
      `SELECT id, contrato_id, tipo, descricao, valor_delta AS "valorDelta",
              anexo_url AS "anexoUrl", criado_em AS "criadoEm"
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

// Criar movimento (impacta saldo_utilizado se valorDelta informado)
app.post('/contratos/:id/movimentos', async (req, res) => {
  const id = Number(req.params.id);
  const { tipo, descricao, valorDelta, anexoUrl } = req.body || {};
  if (!tipo) return res.status(400).json({ error: 'Campo "tipo" é obrigatório' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `INSERT INTO contrato_movimentos (contrato_id, tipo, descricao, valor_delta, anexo_url)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id`,
      [id, tipo, descricao || null, Number(valorDelta || 0), anexoUrl || null]
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

/* ========== 404 padrão ========== */
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

/* ========== Start ========== */
const PORT = process.env.PORT || 8080;
ensureSchema()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Falha ao iniciar por erro de schema:', err);
    process.exit(1);
  });
