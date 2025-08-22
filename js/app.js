// ===== API base autodetect (local usa a URL do Railway para testes rápidos) =====
const API_BASE = (() => {
  const isLocal = location.origin.startsWith('file:') ||
                  location.hostname === 'localhost' ||
                  location.hostname === '127.0.0.1';
  // TROQUE pelo seu domínio da API no Railway
  const PROD = 'https://controledecontratos-production.up.railway.app';
  return isLocal ? PROD : '';
})();

// ===== util de request =====
async function api(path, opts = {}) {
  const r = await fetch(API_BASE + path, opts);
  if (!r.ok) {
    let txt;
    try { txt = await r.text(); } catch { txt = String(r.status); }
    throw new Error(`${opts.method || 'GET'} ${path} -> ${r.status} ${txt}`);
  }
  const ct = r.headers.get('content-type') || '';
  if (ct.includes('application/json')) return r.json();
  return r.text();
}
const apiGet = (p) => api(p);
const apiPost = (p, body) => api(p, {
  method: 'POST',
  headers: body instanceof FormData ? undefined : { 'Content-Type': 'application/json' },
  body: body instanceof FormData ? body : JSON.stringify(body)
});
const apiPut  = (p, body) => api(p, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
});
const apiDel  = (p) => api(p, { method:'DELETE' });

// ===== estado =====
let centros = [];
let contas  = [];
let contratos = [];
let contratoAtivoId = null; // para modais

// ===== helpers =====
const fmtMoney = (v) => (v==null ? '-' : Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}));
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const el = (t, a={}, ...c) => {
  const e = document.createElement(t);
  for (const k in a) {
    if (k === 'class') e.className = a[k];
    else if (k === 'html') e.innerHTML = a[k];
    else e.setAttribute(k, a[k]);
  }
  c.forEach(x => e.appendChild(typeof x === 'string' ? document.createTextNode(x) : x));
  return e;
};

// ===== navegação entre abas =====
function wireTabs(){
  const ids = ['tab-contratos','tab-centros','tab-contas'];
  $$('.nav-tab').forEach((btn, i)=>{
    btn.addEventListener('click', (ev)=>{
      $$('.nav-tab').forEach(b=>b.classList.remove('active'));
      $$('.tab-content').forEach(c=>c.classList.remove('active'));
      ev.currentTarget.classList.add('active');
      $('#'+ids[i]).classList.add('active');
    });
  });
}

// ===== KPIs =====
function updateKpis() {
  $('#kpiTotal').textContent  = contratos.length;
  $('#kpiAtivos').textContent = contratos.filter(c => c.ativo).length;
  const hoje = new Date();
  const em30 = new Date(); em30.setDate(hoje.getDate()+30);
  $('#kpiVenc30').textContent = contratos.filter(c => c.ativo && new Date(c.data_fim) <= em30).length;
  $('#kpiEstouro').textContent = contratos.filter(c => Number(c.saldo_utilizado) > Number(c.valor)).length;
}

// ===== filtros + carregamento =====
async function loadStatic(){
  [centros, contas] = await Promise.all([ apiGet('/centros'), apiGet('/contas') ]);

  // selects de filtros e do modal de contrato
  const sCentro = $('#fCentro');
  sCentro.innerHTML = `<option value="">Todos</option>` +
    centros.map(c=>`<option value="${c.id}">${c.codigo} - ${c.nome}</option>`).join('');

  $('#ctrContratoCentro').innerHTML = centros.map(c=>`<option value="${c.id}">${c.codigo} - ${c.nome}</option>`).join('');
  $('#ctrContratoConta').innerHTML  = contas.map(c=>`<option value="${c.id}">${c.codigo} - ${c.descricao}</option>`).join('');

  renderCentros();
  renderContas();
}

async function loadContratos(){
  const qs = new URLSearchParams();
  const st = $('#fStatus').value;
  const c  = $('#fCentro').value;
  const i  = $('#fInicio').value;
  const v  = $('#fVenc').value;
  if (st && st!=='todos') qs.set('status', st);
  if (c) qs.set('centroId', c);
  if (i) qs.set('inicioDe', i);
  if (v) qs.set('vencAte', v);

  contratos = await apiGet('/contratos' + (qs.toString()? ('?'+qs.toString()):''));
  renderContratos();
  updateKpis();
}

function wireFilters(){
  $('#btnAplicar').addEventListener('click', loadContratos);
  $('#btnLimpar').addEventListener('click', async ()=>{
    $('#fStatus').value='todos'; $('#fCentro').value='';
    $('#fInicio').value=''; $('#fVenc').value='';
    await loadContratos();
  });
  $('#btnCsv').addEventListener('click', ()=>{
    const qs = new URLSearchParams();
    const st = $('#fStatus').value;
    const c  = $('#fCentro').value;
    const i  = $('#fInicio').value;
    const v  = $('#fVenc').value;
    if (st && st!=='todos') qs.set('status', st);
    if (c) qs.set('centroId', c);
    if (i) qs.set('inicioDe', i);
    if (v) qs.set('vencAte', v);
    window.open(API_BASE + '/contratos/report' + (qs.toString()?('?'+qs.toString()):''), '_blank');
  });
}

// ===== renderizações =====
function renderContratos(){
  const tb = $('#tblContratos tbody');
  tb.innerHTML = '';
  contratos.forEach(ct=>{
    const cc = centros.find(z=>z.id===ct.centro_custo_id);
    const tr = el('tr',{},
      el('td',{}, ct.numero || '-'),
      el('td',{}, ct.fornecedor || '-'),
      el('td',{}, cc? `${cc.codigo} - ${cc.nome}` : '-'),
      el('td',{}, fmtMoney(ct.valor)),
      el('td',{}, fmtMoney(ct.saldo_utilizado)),
      el('td',{}, (ct.data_fim||'').toString().slice(0,10)),
      el('td',{}, ct.ativo ? 'Ativo' : 'Inativo'),
      el('td',{},
        el('div',{class:'btn-group btn-group-sm'},
          el('button',{class:'btn btn-outline-primary',title:'Visualizar/Editar',
                       onclick:`openContrato(${ct.id})`},'Abrir'),
          el('button',{class:'btn btn-outline-secondary',title:'Anexos',
                       onclick:`window.open('${API_BASE}/contratos/${ct.id}/arquivos','_blank')`},'Anexos'),
          el('button',{class:'btn btn-outline-danger',title:'Excluir',
                       onclick:`deleteContrato(${ct.id})`},'Excluir')
        )
      )
    );
    tb.appendChild(tr);
  });
}

function renderCentros(){
  const tb = $('#tblCentros tbody');
  tb.innerHTML = centros.map(c=>`
    <tr>
      <td>${c.codigo}</td><td>${c.nome}</td><td>${c.responsavel||'-'}</td><td>${c.email||'-'}</td>
      <td>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-primary" onclick="editCentro(${c.id})">Editar</button>
          <button class="btn btn-outline-danger" onclick="deleteCentro(${c.id})">Excluir</button>
        </div>
      </td>
    </tr>`).join('');
}

function renderContas(){
  const tb = $('#tblContas tbody');
  tb.innerHTML = contas.map(c=>`
    <tr>
      <td>${c.codigo}</td><td>${c.descricao}</td><td>${c.tipo}</td>
      <td>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-primary" onclick="editConta(${c.id})">Editar</button>
          <button class="btn btn-outline-danger" onclick="deleteConta(${c.id})">Excluir</button>
        </div>
      </td>
    </tr>`).join('');
}

// ===== contratos: criar/editar/abrir =====
const mdlContrato = () => bootstrap.Modal.getOrCreateInstance('#mdlContrato');
const mdlMov = () => bootstrap.Modal.getOrCreateInstance('#mdlMov');

$('#btnNovoContrato').addEventListener('click', ()=> {
  $('#tituloContrato').textContent = 'Novo Contrato';
  $('#formContrato').reset();
  $('#areaAnexosExistentes').style.display = 'none';
  $('#btnMovimentos').style.display = 'none';
  $('#btnInativar').style.display = 'none';
  contratoAtivoId = null;
  $('#contratoAtivo').checked = true;
  mdlContrato().show();
});

$('#btnSalvarContrato').addEventListener('click', async ()=>{
  const f = $('#formContrato');
  const data = Object.fromEntries(new FormData(f).entries());
  data.ativo = $('#contratoAtivo').checked;

  let saved;
  if (data.id) {
    saved = await apiPut('/contratos/'+data.id, data);
  } else {
    saved = await apiPost('/contratos', data);
  }

  // upload anexos (se houver)
  const files = $('#anexosContrato').files;
  if (files && files.length){
    const fd = new FormData();
    [...files].forEach(f => fd.append('arquivos', f, f.name));
    await apiPost(`/contratos/${saved.id}/arquivos`, fd);
  }

  mdlContrato().hide();
  await loadContratos();
});

async function openContrato(id){
  const ct = await apiGet('/contratos/'+id);
  contratoAtivoId = id;

  // preencher modal
  $('#tituloContrato').textContent = `Contrato #${ct.id}`;
  const f = $('#formContrato');
  f.reset();
  f.id.value = ct.id;
  f.numero.value = ct.numero || '';
  f.fornecedor.value = ct.fornecedor || '';
  f.centro_custo_id.value = ct.centro_custo_id || '';
  f.conta_contabil_id.value = ct.conta_contabil_id || '';
  f.valor.value = ct.valor || 0;
  f.data_inicio.value = (ct.data_inicio || '').toString().slice(0,10);
  f.data_fim.value    = (ct.data_fim    || '').toString().slice(0,10);
  f.observacoes.value = ct.observacoes || '';
  $('#contratoAtivo').checked = !!ct.ativo;

  // botões especiais
  const btnInativar = $('#btnInativar');
  btnInativar.style.display = '';
  btnInativar.textContent = ct.ativo ? 'Inativar' : 'Reativar';
  btnInativar.onclick = async ()=>{
    await apiPut('/contratos/'+id, { ...ct, ativo: !ct.ativo });
    mdlContrato().hide();
    await loadContratos();
  };

  // movimentos
  $('#btnMovimentos').style.display = '';
  $('#btnMovimentos').onclick = ()=> openMovimentos(id);

  // anexos existentes
  await loadAnexosExistentes(id);

  mdlContrato().show();
}

async function deleteContrato(id){
  if(!confirm('Excluir contrato?')) return;
  await apiDel('/contratos/'+id);
  await loadContratos();
}

// ===== anexos (listagem e remover) =====
async function loadAnexosExistentes(id){
  const area = $('#areaAnexosExistentes');
  const ul = $('#listaAnexos');
  const list = await apiGet(`/contratos/${id}/arquivos`);
  ul.innerHTML = '';
  if(!list.length){ area.style.display='none'; return; }
  list.forEach(a=>{
    const li = el('li',{class:'list-group-item d-flex justify-content-between align-items-center break-word'},
      el('a',{href:a.url, target:'_blank', rel:'noopener'}, a.nome_arquivo),
      el('button',{class:'btn btn-sm btn-outline-danger', onclick:`removeAnexo(${id},${a.id})`},'Remover')
    );
    ul.appendChild(li);
  });
  area.style.display='';
}
async function removeAnexo(contratoId, arqId){
  if(!confirm('Remover anexo?')) return;
  await apiDel(`/contratos/${contratoId}/arquivos/${arqId}`);
  await loadAnexosExistentes(contratoId);
}

// ===== movimentos =====
async function openMovimentos(id){
  contratoAtivoId = id;
  $('#tbMov').innerHTML = '';
  const movs = await apiGet(`/contratos/${id}/movimentos`);
  movs.forEach(m=>{
    $('#tbMov').appendChild(
      el('tr',{},
        el('td',{}, (m.data_movimento || '').toString().slice(0,10)),
        el('td',{}, m.tipo),
        el('td',{}, fmtMoney(m.valor)),
        el('td',{}, m.observacao || '')
      )
    );
  });
  mdlMov().show();
}
$('#btnAddMov').addEventListener('click', async ()=>{
  const data = Object.fromEntries(new FormData($('#formMov')).entries());
  data.valor = Number(data.valor || 0);
  if (!contratoAtivoId) return;
  await apiPost(`/contratos/${contratoAtivoId}/movimentos`, data);
  $('#formMov').reset();
  await openMovimentos(contratoAtivoId);
  await loadContratos(); // atualiza saldo utilizado na lista
});

// ===== centros =====
$('#btnNovoCentro').addEventListener('click', async ()=>{
  const codigo = prompt('Código do Centro:');
  if(!codigo) return;
  const nome = prompt('Nome do Centro:');
  if(!nome) return;
  const responsavel = prompt('Responsável (opcional):') || '';
  const email = prompt('Email (opcional):') || '';
  await apiPost('/centros', { codigo, nome, responsavel, email });
  centros = await apiGet('/centros'); renderCentros(); await loadStatic(); // recarrega selects
});
async function editCentro(id){
  const c = centros.find(x=>x.id===id);
  if(!c) return;
  const codigo = prompt('Código do Centro:', c.codigo); if(!codigo) return;
  const nome = prompt('Nome do Centro:', c.nome); if(!nome) return;
  const responsavel = prompt('Responsável:', c.responsavel || '') || '';
  const email = prompt('Email:', c.email || '') || '';
  await apiPut('/centros/'+id, { codigo, nome, responsavel, email });
  centros = await apiGet('/centros'); renderCentros(); await loadStatic();
}
async function deleteCentro(id){
  if(!confirm('Excluir centro?')) return;
  await apiDel('/centros/'+id);
  centros = await apiGet('/centros'); renderCentros(); await loadStatic();
}

// ===== contas =====
$('#btnNovaConta').addEventListener('click', async ()=>{
  const codigo = prompt('Código da Conta:'); if(!codigo) return;
  const descricao = prompt('Descrição:'); if(!descricao) return;
  const tipo = (prompt('Tipo (DESPESA/RECEITA):','DESPESA') || 'DESPESA').toUpperCase();
  await apiPost('/contas', { codigo, descricao, tipo });
  contas = await apiGet('/contas'); renderContas(); await loadStatic();
});
async function editConta(id){
  const c = contas.find(x=>x.id===id);
  if(!c) return;
  const codigo = prompt('Código:', c.codigo); if(!codigo) return;
  const descricao = prompt('Descrição:', c.descricao); if(!descricao) return;
  const tipo = (prompt('Tipo (DESPESA/RECEITA):', c.tipo) || c.tipo).toUpperCase();
  await apiPut('/contas/'+id, { codigo, descricao, tipo });
  contas = await apiGet('/contas'); renderContas(); await loadStatic();
}
async function deleteConta(id){
  if(!confirm('Excluir conta?')) return;
  await apiDel('/contas/'+id);
  contas = await apiGet('/contas'); renderContas(); await loadStatic();
}

// ===== boot =====
document.addEventListener('DOMContentLoaded', async ()=>{
  wireTabs();
  wireFilters();
  await loadStatic();
  await loadContratos();
});
