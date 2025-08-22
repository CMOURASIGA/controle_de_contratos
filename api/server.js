// server.js – API Express para Controle de Contratos
// Rotas: health/dbcheck, centros, contas, contratos (+movimentos, +arquivos)

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { Pool } = require('pg');

require('dotenv').config();

const app = express();
app.use(cors({ origin: true }));   // libere geral para validar; restrinja depois
app.use(express.json());

// === Postgres (Railway) ===
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// === uploads em disco ===
const UP = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UP)) fs.mkdirSync(UP);
const storage = multer.diskStorage({
  destination: (req, file, cb)=> cb(null, UP),
  filename: (req, file, cb)=> {
    const ts = Date.now();
    const safe = file.originalname.replace(/[^\w.\-]+/g,'_');
    cb(null, `${ts}_${safe}`);
  }
});
const upload = multer({ storage });

// === Health ===
app.get('/health', (req,res)=> res.json({ ok:true }));
app.get('/dbcheck', async (req,res)=>{
  try{
    const r = await pool.query('select current_database() db, current_user usr');
    res.json({ ok:true, db:r.rows[0].db, user:r.rows[0].usr });
  }catch(e){ res.status(500).json({ ok:false, error:String(e) }); }
});

// === Arquivo estático /files/:name ===
app.get('/files/:name', (req,res)=>{
  const fp = path.join(UP, path.basename(req.params.name));
  if (!fs.existsSync(fp)) return res.status(404).send('Arquivo não encontrado');
  res.sendFile(fp);
});

/* ================= CENTROS ================= */
app.get('/centros', async (req,res)=>{
  const r = await pool.query('select id, codigo, nome, responsavel, email from centros_custo order by id desc');
  res.json(r.rows);
});
app.post('/centros', async (req,res)=>{
  const { codigo, nome, responsavel, email } = req.body;
  const r = await pool.query(
    'insert into centros_custo (codigo, nome, responsavel, email) values ($1,$2,$3,$4) returning *',
    [codigo, nome, responsavel || null, email || null]
  );
  res.json(r.rows[0]);
});
app.delete('/centros/:id', async (req,res)=>{
  await pool.query('delete from centros_custo where id=$1', [req.params.id]);
  res.json({ ok:true });
});

/* ================= CONTAS ================= */
app.get('/contas', async (req,res)=>{
  const r = await pool.query('select id, codigo, descricao, tipo from contas_contabeis order by id desc');
  res.json(r.rows);
});
app.post('/contas', async (req,res)=>{
  const { codigo, descricao, tipo } = req.body;
  const r = await pool.query(
    'insert into contas_contabeis (codigo, descricao, tipo) values ($1,$2,$3) returning *',
    [codigo, descricao, (tipo || 'DESPESA').toUpperCase()]
  );
  res.json(r.rows[0]);
});
app.delete('/contas/:id', async (req,res)=>{
  await pool.query('delete from contas_contabeis where id=$1', [req.params.id]);
  res.json({ ok:true });
});

/* ================= CONTRATOS =================
   Schema esperado (colunas principais):
   - id serial, numero text, fornecedor text, centro_custo_id int,
     conta_contabil_id int, valor numeric, saldo_utilizado numeric,
     data_inicio date, data_fim date, observacoes text, ativo boolean
*/
function buildContratosWhere(q){
  const where = [];
  const params = [];
  let p = 1;

  if (q.status && q.status !== 'todos'){
    // status: ativos | vencendo30 | estouro | inativos
    if (q.status === 'ativos') {
      where.push(`ativo = true`);
    } else if (q.status === 'vencendo30'){
      where.push(`ativo = true AND data_fim <= (current_date + interval '30 days')`);
    } else if (q.status === 'estouro'){
      where.push(`COALESCE(saldo_utilizado,0) > COALESCE(valor,0)`);
    } else if (q.status === 'inativos'){
      where.push(`ativo = false`);
    }
  }
  if (q.centroId){ where.push(`centro_custo_id = $${p++}`); params.push(q.centroId); }
  if (q.inicioDe){ where.push(`data_inicio >= $${p++}`); params.push(q.inicioDe); }
  if (q.vencAte){ where.push(`data_fim <= $${p++}`); params.push(q.vencAte); }

  const sql = where.length ? (' WHERE ' + where.join(' AND ')) : '';
  return { sql, params };
}

app.get('/contratos', async (req,res)=>{
  const { sql, params } = buildContratosWhere(req.query);
  const r = await pool.query(
    `select id, numero, fornecedor, centro_custo_id, conta_contabil_id,
            coalesce(valor,0) valor, coalesce(saldo_utilizado,0) saldo_utilizado,
            data_inicio, data_fim, observacoes, coalesce(ativo,true) ativo
       from contratos
     ${sql}
     order by id desc`,
    params
  );
  res.json(r.rows);
});

app.get('/contratos/report', async (req,res)=>{
  const { sql, params } = buildContratosWhere(req.query);
  const r = await pool.query(
    `select numero, fornecedor,
            (select codigo||' - '||nome from centros_custo c where c.id = contratos.centro_custo_id) as centro,
            valor, saldo_utilizado, data_inicio, data_fim, case when ativo then 'ATIVO' else 'INATIVO' end as status
       from contratos
     ${sql}
     order by id desc`,
    params
  );
  res.setHeader('Content-Type','text/csv; charset=utf-8');
  res.setHeader('Content-Disposition','attachment; filename="contratos.csv"');
  res.write('numero,fornecedor,centro,valor,saldo_utilizado,data_inicio,data_fim,status\n');
  r.rows.forEach(row=>{
    const line = [
      row.numero, row.fornecedor, row.centro,
      row.valor, row.saldo_utilizado, row.data_inicio?.toISOString?.().slice(0,10) || row.data_inicio,
      row.data_fim?.toISOString?.().slice(0,10) || row.data_fim, row.status
    ].map(v => (v==null?'':String(v).replace(/"/g,'""')));
    res.write(line.join(',')+'\n');
  });
  res.end();
});

app.post('/contratos', async (req,res)=>{
  const {
    numero, fornecedor, centro_custo_id, conta_contabil_id,
    valor, data_inicio, data_fim, observacoes, ativo
  } = req.body;
  const r = await pool.query(
    `insert into contratos
      (numero, fornecedor, centro_custo_id, conta_contabil_id, valor, saldo_utilizado,
       data_inicio, data_fim, observacoes, ativo)
     values ($1,$2,$3,$4,$5,0,$6,$7,$8,$9) returning *`,
    [numero, fornecedor, centro_custo_id, conta_contabil_id, valor || 0,
     data_inicio, data_fim, observacoes || null, (ativo !== false)]
  );
  res.json(r.rows[0]);
});

app.put('/contratos/:id', async (req,res)=>{
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
      where id=$11 returning *`,
    [numero, fornecedor, centro_custo_id, conta_contabil_id,
     valor, saldo_utilizado, data_inicio, data_fim, observacoes || null, !!ativo, id]
  );
  res.json(r.rows[0]);
});

app.delete('/contratos/:id', async (req,res)=>{
  await pool.query('delete from contratos where id=$1', [req.params.id]);
  res.json({ ok:true });
});

/* ===== Movimentos =====
   tabela contrato_movimentos (id, contrato_id, tipo, valor, observacao, data_movimento, criado_em)
*/
app.get('/contratos/:id/movimentos', async (req,res)=>{
  const r = await pool.query(
    'select id, contrato_id, tipo, valor, observacao, data_movimento, criado_em from contrato_movimentos where contrato_id=$1 order by id desc',
    [req.params.id]
  );
  res.json(r.rows);
});
app.post('/contratos/:id/movimentos', async (req,res)=>{
  const { tipo, valor, observacao, data_movimento } = req.body;
  const id = req.params.id;
  const r = await pool.query(
    `insert into contrato_movimentos (contrato_id, tipo, valor, observacao, data_movimento, criado_em)
     values ($1,$2,$3,$4,$5, now()) returning *`,
    [id, (tipo||'USO').toUpperCase(), valor||0, observacao||null, data_movimento||new Date()]
  );
  // atualiza saldo_utilizado quando o tipo é USO/ESTORNO
  if ((tipo||'').toUpperCase() === 'USO') {
    await pool.query('update contratos set saldo_utilizado = coalesce(saldo_utilizado,0) + $1 where id=$2', [valor||0, id]);
  } else if ((tipo||'').toUpperCase() === 'ESTORNO') {
    await pool.query('update contratos set saldo_utilizado = greatest(0, coalesce(saldo_utilizado,0) - $1) where id=$2', [valor||0, id]);
  }
  res.json(r.rows[0]);
});

/* ===== Arquivos =====
   tabela contrato_arquivos (id, contrato_id, nome_arquivo, url, criado_em)
*/
app.get('/contratos/:id/arquivos', async (req,res)=>{
  const id = req.params.id;
  const r = await pool.query(
    'select id, contrato_id, nome_arquivo, url, criado_em from contrato_arquivos where contrato_id=$1 order by id desc',
    [id]
  );
  // se aceitou "visualizar anexos" via nova aba, render simples:
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    const list = r.rows.map(a => `<li><a href="${a.url}" target="_blank" rel="noopener">${a.nome_arquivo}</a></li>`).join('');
    res.send(`<!doctype html><meta charset="utf-8"><title>Anexos</title><h3>Anexos do Contrato ${id}</h3><ul>${list||'<li>Nenhum anexo</li>'}</ul>`);
    return;
  }
  res.json(r.rows);
});
app.post('/contratos/:id/arquivos', upload.array('arquivos', 10), async (req,res)=>{
  const id = req.params.id;
  const files = req.files || [];
  const inserted = [];
  for (const f of files){
    const url = `/files/${f.filename}`;
    const nome = f.originalname;
    const r = await pool.query(
      'insert into contrato_arquivos (contrato_id, nome_arquivo, url, criado_em) values ($1,$2,$3, now()) returning *',
      [id, nome, url]
    );
    inserted.push(r.rows[0]);
  }
  res.json({ ok:true, files: inserted });
});

// start
const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=> console.log('API rodando na porta', PORT));
