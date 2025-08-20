// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

/* =============================
   Conexão Postgres (SSL cond.)
   - Se usar DATABASE_URL interna (postgres.railway.internal): SSL off
   - Se usar URL pública ou outro host: SSL on (rejectUnauthorized: false)
================================*/
const isInternal = process.env.DATABASE_URL?.includes("railway.internal");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isInternal ? false : { rejectUnauthorized: false },
});

// Helper para query
const q = (text, params = []) => pool.query(text, params);

// App
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",").map(s => s.trim())
      : "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());

/* =============================
   Util: wrapper async
================================*/
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* =============================
   Healthcheck
================================*/
app.get(
  "/health",
  asyncHandler(async (_, res) => {
    await q("SELECT 1");
    res.json({ ok: true });
  })
);

/* =============================
   CENTROS DE CUSTO
================================*/
app.get(
  "/centros",
  asyncHandler(async (_, res) => {
    const r = await q("SELECT * FROM centros_custo ORDER BY id");
    res.json(r.rows);
  })
);

app.post(
  "/centros",
  asyncHandler(async (req, res) => {
    const { codigo, nome, responsavel, email } = req.body;
    if (!codigo || !nome || !responsavel || !email)
      return res.status(400).json({ error: "Campos obrigatórios faltando." });

    const r = await q(
      `INSERT INTO centros_custo (codigo, nome, responsavel, email)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [codigo, nome, responsavel, email]
    );
    res.status(201).json(r.rows[0]);
  })
);

app.put(
  "/centros/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const { codigo, nome, responsavel, email } = req.body;
    const r = await q(
      `UPDATE centros_custo
         SET codigo=$1, nome=$2, responsavel=$3, email=$4
       WHERE id=$5 RETURNING *`,
      [codigo, nome, responsavel, email, id]
    );
    if (!r.rows[0]) return res.status(404).json({ error: "Não encontrado" });
    res.json(r.rows[0]);
  })
);

app.delete(
  "/centros/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    await q("DELETE FROM centros_custo WHERE id=$1", [id]);
    res.sendStatus(204);
  })
);

/* =============================
   CONTAS CONTÁBEIS
================================*/
app.get(
  "/contas",
  asyncHandler(async (_, res) => {
    const r = await q("SELECT * FROM contas_contabeis ORDER BY id");
    res.json(r.rows);
  })
);

app.post(
  "/contas",
  asyncHandler(async (req, res) => {
    const { codigo, descricao, tipo } = req.body;
    if (!codigo || !descricao || !tipo)
      return res.status(400).json({ error: "Campos obrigatórios faltando." });

    const r = await q(
      `INSERT INTO contas_contabeis (codigo, descricao, tipo)
       VALUES ($1,$2,$3) RETURNING *`,
      [codigo, descricao, tipo]
    );
    res.status(201).json(r.rows[0]);
  })
);

app.put(
  "/contas/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const { codigo, descricao, tipo } = req.body;
    const r = await q(
      `UPDATE contas_contabeis
         SET codigo=$1, descricao=$2, tipo=$3
       WHERE id=$4 RETURNING *`,
      [codigo, descricao, tipo, id]
    );
    if (!r.rows[0]) return res.status(404).json({ error: "Não encontrado" });
    res.json(r.rows[0]);
  })
);

app.delete(
  "/contas/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    await q("DELETE FROM contas_contabeis WHERE id=$1", [id]);
    res.sendStatus(204);
  })
);

/* =============================
   CONTRATOS
================================*/
app.get(
  "/contratos",
  asyncHandler(async (_, res) => {
    const r = await q(
      `SELECT
         c.id, c.numero, c.fornecedor,
         c.centro_custo_id   AS "centroCusto",
         c.conta_contabil_id AS "contaContabil",
         c.valor_total       AS "valorTotal",
         c.saldo_utilizado   AS "saldoUtilizado",
         c.data_inicio       AS "dataInicio",
         c.data_vencimento   AS "dataVencimento",
         c.observacoes       AS "observacoes"
       FROM contratos c
       ORDER BY c.id DESC`
    );
    res.json(r.rows);
  })
);

app.post(
  "/contratos",
  asyncHandler(async (req, res) => {
    const d = req.body;
    const obrig = [
      d.numero,
      d.fornecedor,
      d.centroCusto,
      d.contaContabil,
      d.valorTotal,
      d.dataInicio,
      d.dataVencimento,
    ];
    if (obrig.some((v) => v === undefined || v === null || v === ""))
      return res.status(400).json({ error: "Campos obrigatórios faltando." });

    const r = await q(
      `INSERT INTO contratos
        (numero, fornecedor, centro_custo_id, conta_contabil_id,
         valor_total, saldo_utilizado, data_inicio, data_vencimento, observacoes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id`,
      [
        d.numero,
        d.fornecedor,
        Number(d.centroCusto),
        Number(d.contaContabil),
        Number(d.valorTotal),
        Number(d.saldoUtilizado || 0),
        d.dataInicio,
        d.dataVencimento,
        d.observacoes || null,
      ]
    );
    res.status(201).json({ id: r.rows[0].id });
  })
);

app.put(
  "/contratos/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const d = req.body;
    await q(
      `UPDATE contratos SET
         numero=$1, fornecedor=$2, centro_custo_id=$3, conta_contabil_id=$4,
         valor_total=$5, saldo_utilizado=$6, data_inicio=$7, data_vencimento=$8, observacoes=$9
       WHERE id=$10`,
      [
        d.numero,
        d.fornecedor,
        Number(d.centroCusto),
        Number(d.contaContabil),
        Number(d.valorTotal),
        Number(d.saldoUtilizado || 0),
        d.dataInicio,
        d.dataVencimento,
        d.observacoes || null,
        id,
      ]
    );
    res.sendStatus(204);
  })
);

app.delete(
  "/contratos/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    await q("DELETE FROM contratos WHERE id=$1", [id]);
    res.sendStatus(204);
  })
);

/* =============================
   404 e Error Handler
================================*/
app.use((req, res) => res.status(404).json({ error: "Rota não encontrada" }));

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Erro interno", detail: err.message });
});

/* =============================
   Start
================================*/
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`API rodando na porta ${port}`));
