// server.js – API Express para Controle de Contratos
// Funcionalidades: centros, contas, contratos (CRUD + filtros + CSV),
// movimentos, anexos, health, dbcheck, files estáticos

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// === Postgres (Railway/Local) ===
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// === uploads (armazenamento em disco) ===
const UP_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UP_DIR)) fs.mkdirSync(UP_DIR);
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UP_DIR),
  filename: (_, file, cb) => {
    const ts = Date.now();
    const safe = file.originalname.replace(/[^\w.\-]+/g, '_');
    cb(null, `${ts}_${safe}`);
  }
});
const upload = multer({ storage });

// ===== Health + DB check =====
app.get('/health', (req, res) => res.json({ ok: true }));
app.get('/dbcheck', async (req, res) => {
  try {
    const r = await pool.query('select current_database() db, current_user usr');
    res.json({ ok: true, db: r.rows[0].db, user: r.rows[0].usr });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// ===== Servir arquivos enviados =====
app.get('/files/:name', (req, res) => {
  const filePath = path.join(UP_DIR, path.basename(req.params.name));
  if (!fs.existsSync(filePath)) return res.status(404).send('Arquivo não encontrado');
  res.sendFile(filePath);
});

/* =============================================================================
   CENTROS DE CUSTO
============================================================================= */

app.get('/centros', async (req, res) => {
  const r = await pool.query(
    'select id, codigo, nome, responsavel, email from centros_custo order by id desc'
  );
  res.json(r.rows);
});

app.post('/centros', async (req, res) => {
  const { codigo, nome, responsavel, email } = req.body;
  const r = await pool.query(
    'insert into centros_custo (codigo, nome, responsavel, email) values ($1,$2,$3,$4) returning *',
    [codigo, nome, responsavel || null, email || null]
  );
  res.json(r.rows[0]);
});

app.put('/centros/:id', async (req, res) => {
  const { id } = req.params;
  const { codigo, nome, responsavel, email } = req.body;
  const r = await pool.query(
    'update centros_custo set codigo=$1, nome=$2, responsavel=$3, email=$4 where id=$5 returning *',
    [codigo, nome, responsavel || null, email || null, id]
  );
  res.json(r.rows[0]);
});

app.delete('/centros/:id', async (req, res) => {
  await pool.query('delete from centros_custo where id=$1', [req.params.id]);
  res.json({ ok: true });
});

/* =============================================================================
   CONTAS CONTÁBEIS
============================================================================= */

app.get('/contas', async (req, res) => {
  const r = await pool.query(
    'select id, codigo, descricao, tipo from contas_contabeis order by id desc'
  );
  res.json(r.rows);
});

app.post('/contas', async (req, res) => {
  const { codigo, descricao, tipo } = req.body;
  const r = await pool.query(
    'insert into contas_contabeis (codigo, descricao, tipo) values ($1,$2,$3) returning *',
    [codigo, descricao, (tipo || 'DESPESA').toUpperCase()]
  );
  res.json(r.rows[0]);
});

app.put('/contas/:id', async (req, res) => {
  const { id } = req.params;
  const { codigo, descricao, tipo } = req.body;
  const r = await pool.query(
    'update contas_contabeis set codigo=$1, descricao=$2, tipo=$3 where id=$4 returning *',
    [codigo, descricao, (tipo || 'DESPESA').toUpperCase(), id]
  );
  res.json(r.rows[0]);
});

app.delete('/contas/:id', async (req, res) => {
  await pool.query('delete from contas_contabeis where id=$1', [req.params.id]);
  res.json({ ok: true });
});

/* =============================================================================
   CONTRATOS
   Tabela esperada:
   id, numero, fornecedor, centro_custo_id, conta_contabil_id,
   valor numeric, saldo_utilizado numeric, data_inicio date, data_fim date,
   observacoes text, ativo boolean
============================================================================= */

function buildWhere(q) {
  const wh = [];
  const ps = [];
  let n = 1;

  if (q.status && q.status !== 'todos') {
    if (q.status === 'ativos') wh.push('ativo = true');
    if (q.status === 'inativos') wh.push('ativo = false');
    if (q.status === 'vencendo30')
      wh.push("ativo = true and data_fim <= (current_date + interval '30 days')");
    if (q.status === 'estouro')
      wh.push('coalesce(saldo_utilizado,0) > coalesce(valor,0)');
  }
  if (q.centroId) {
    wh.push(`centro_custo_id = $${n++}`); ps.push(q.centroId);
  }
  if (q.inicioDe) {
    wh.push(`data_inicio >= $${n++}`); ps.push(q.inicioDe);
  }
  if (q.vencAte) {
    wh.push(`data_fim <= $${n++}`); ps.push(q.vencAte);
  }
  return { where: wh.length ? (' where ' + wh.join(' and ')) : '', params: ps };
}

app.get('/contratos', async (req, res) => {
  const { where, params } = buildWhere(req.query);
  const r = await pool.query(
    `select id, numero, fornecedor, centro_custo_id, conta_contabil_id,
            coalesce(valor,0) valor, coalesce(saldo_utilizado,0) saldo_utilizado,
            data_inicio, data_fim, observacoes, coalesce(ativo,true) ativo
       from contratos
     ${where}
     order by id desc`,
    params
  );
  res.json(r.rows);
});

app.get('/contratos/:id', async (req, res) => {
  const r = await pool.query('select * from contratos where id=$1', [req.params.id]);
  if (!r.rows[0]) return res.status(404).json({ error: 'Contrato não encontrado' });
  res.json(r.rows[0]);
});

app.get('/contratos/report', async (req, res) => {
  const { where, params } = buildWhere(req.query);
  const r = await pool.query(
    `select numero, fornecedor,
            (select codigo||' - '||nome from centros_custo cc where cc.id = c.centro_custo_id) centro,
            valor, saldo_utilizado, data_inicio, data_fim,
            case when coalesce(ativo,true) then 'ATIVO' else 'INATIVO' end status
       from contratos c
     ${where}
     order by id desc`,
    params
  );
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="contratos.csv"');
  res.write('numero,fornecedor,centro,valor,saldo_utilizado,data_inicio,data_fim,status\n');
  r.rows.forEach(row => {
    const d = [
      row.numero, row.fornecedor, row.centro,
      row.valor, row.saldo_utilizado,
      (row.data_inicio || '').toISOString?.().slice(0,10) || row.data_inicio,
      (row.data_fim    || '').toISOString?.().slice(0,10) || row.data_fim,
      row.status
    ].map(v => (v==null?'':String(v).replace(/"/g,'""')));
    res.write(d.join(',') + '\n');
  });
  res.end();
});

app.post('/contratos', async (req, res) => {
  const {
    numero, fornecedor, centro_custo_id, conta_contabil_id,
    valor, data_inicio, data_fim, observacoes, ativo
  } = req.body;
  const r = await pool.query(
    `insert into contratos
      (numero, fornecedor, centro_custo_id, conta_contabil_id, valor, saldo_utilizado,
       data_inicio, data_fim, observacoes, ativo)
     values ($1,$2,$3,$4,$5,0,$6,$7,$8,$9)
     returning *`,
    [numero, fornecedor, centro_custo_id, conta_contabil_id, valor || 0,
     data_inicio, data_fim, observacoes || null, (ativo !== false)]
  );
  res.json(r.rows[0]);
});

app.put('/contratos/:id', async (req, res) => {
  const { id } = req.params;
  const {
    numero, fornecedor, centro_custo_id, conta_contabil_id,
    valor, saldo_utilizado, data_inicio, data_fim, observacoes, ativo
  } = req.body;
  const r = await pool.query(
    `update contratos set
        numero=$1, fornecedor=$2, centro_custo_id=$3, conta_contabil_id=$4,
        valor=$5, saldo_utilizado=$6, data_inicio=$7, data_fim=$8,
        observacoes=$9, ativo=$10
      where id=$11
      returning *`,
    [numero, fornecedor, centro_custo_id, conta_contabil_id,
     valor, saldo_utilizado, data_inicio, data_fim, observacoes || null, !!ativo, id]
  );
  res.json(r.rows[0]);
});

app.delete('/contratos/:id', async (req, res) => {
  await pool.query('delete from contratos where id=$1', [req.params.id]);
  res.json({ ok: true });
});

/* =============================================================================
   MOVIMENTOS
   Tabela: contrato_movimentos (id, contrato_id, tipo, valor, observacao, data_movimento, criado_em)
============================================================================= */

app.get('/contratos/:id/movimentos', async (req, res) => {
  const r = await pool.query(
    'select id, contrato_id, tipo, valor, observacao, data_movimento, criado_em from contrato_movimentos where contrato_id=$1 order by id desc',
    [req.params.id]
  );
  res.json(r.rows);
});

app.post('/contratos/:id/movimentos', async (req, res) => {
  const id = req.params.id;
  const { tipo, valor, observacao, data_movimento } = req.body;
  const r = await pool.query(
    `insert into contrato_movimentos
      (contrato_id, tipo, valor, observacao, data_movimento, criado_em)
     values ($1,$2,$3,$4,$5, now())
     returning *`,
    [id, (tipo || 'USO').toUpperCase(), valor || 0, observacao || null, data_movimento || new Date()]
  );

  // atualiza saldo no contrato para USO/ESTORNO
  if ((tipo || '').toUpperCase() === 'USO') {
    await pool.query('update contratos set saldo_utilizado = coalesce(saldo_utilizado,0) + $1 where id=$2', [valor || 0, id]);
  } else if ((tipo || '').toUpperCase() === 'ESTORNO') {
    await pool.query('update contratos set saldo_utilizado = greatest(0, coalesce(saldo_utilizado,0) - $1) where id=$2', [valor || 0, id]);
  }

  res.json(r.rows[0]);
});

/* =============================================================================
   ANEXOS
   Tabela: contrato_arquivos (id, contrato_id, nome_arquivo, url, criado_em)
============================================================================= */

app.get('/contratos/:id/arquivos', async (req, res) => {
  const r = await pool.query(
    'select id, contrato_id, nome_arquivo, url, criado_em from contrato_arquivos where contrato_id=$1 order by id desc',
    [req.params.id]
  );

  // se abrir direto no browser, exibir uma listinha
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    const html = `
      <!doctype html><meta charset="utf-8">
      <title>Anexos do Contrato ${req.params.id}</title>
      <h3>Anexos do Contrato #${req.params.id}</h3>
      <ul>
        ${r.rows.map(a=>`<li><a href="${a.url}" target="_blank" rel="noopener">${a.nome_arquivo}</a></li>`).join('') || '<li>Nenhum anexo</li>'}
      </ul>`;
    res.send(html);
    return;
  }

  res.json(r.rows);
});

app.post('/contratos/:id/arquivos', upload.array('arquivos', 10), async (req, res) => {
  const files = req.files || [];
  const id = req.params.id;
  const inserted = [];
  for (const f of files) {
    const url = `/files/${f.filename}`;
    const nome = f.originalname;
    const r = await pool.query(
      'insert into contrato_arquivos (contrato_id, nome_arquivo, url, criado_em) values ($1,$2,$3, now()) returning *',
      [id, nome, url]
    );
    inserted.push(r.rows[0]);
  }
  res.json({ ok: true, files: inserted });
});

app.delete('/contratos/:id/arquivos/:arqId', async (req, res) => {
  const r = await pool.query('delete from contrato_arquivos where id=$1 returning url', [req.params.arqId]);
  const url = r.rows[0]?.url;
  if (url) {
    const file = path.join(UP_DIR, path.basename(url));
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }
  res.json({ ok: true });
});

// ===== start =====
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('API ouvindo na porta', PORT));
