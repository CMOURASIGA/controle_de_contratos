// ===== API BASE autodetect =====
const API_BASE = (() => {
  const isLocal = location.origin.startsWith('file:') ||
                  location.hostname === 'localhost' ||
                  location.hostname === '127.0.0.1';
  // troque aqui pela URL da sua API no Railway
  const PROD = 'https://controledecontratos-production.up.railway.app';
  return isLocal ? PROD : '';
})();

async function apiGet(path) {
  const r = await fetch(API_BASE + path);
  if (!r.ok) throw new Error(`GET ${path} -> ${r.status}`);
  return r.json();
}
async function apiPost(path, body, opt = {}) {
  const isFD = body instanceof FormData;
  const r = await fetch(API_BASE + path, {
    method: opt.method || 'POST',
    body: isFD ? body : JSON.stringify(body),
    headers: isFD ? undefined : { 'Content-Type': 'application/json' },
  });
  if (!r.ok) throw new Error(`POST ${path} -> ${r.status}`);
  return r.json();
}
async function apiPut(path, body)   { return apiPost(path, body, { method:'PUT' }); }
async function apiDelete(path)      {
  const r = await fetch(API_BASE + path, { method:'DELETE' });
  if (!r.ok) throw new Error(`DELETE ${path} -> ${r.status}`);
  return r.json();
}

// ===== estado em memória =====
let centros = [];
let contas  = [];
let contratos = [];

// ===== helpers =====
function fmtMoney(v) {
  if (v == null) return '-';
  return v.toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
}
function el(tag, attrs={}, ...children){
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else e.setAttribute(k,v);
  });
  children.forEach(c => e.appendChild(typeof c === 'string'? document.createTextNode(c): c));
  return e;
}

// ===== abas =====
function showTab(tabId, ev) {
  document.querySelectorAll('.tabs .nav-tab').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
  if (ev?.currentTarget) ev.currentTarget.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}
function wireTabs() {
  const ids = ['tab-contratos','tab-centros','tab-contas'];
  document.querySelectorAll('.tabs .nav-tab').forEach((btn, idx)=>{
    btn.addEventListener('click', (e)=> showTab(ids[idx], e));
  });
}

// ===== carregamento inicial =====
async function loadStatic() {
  [centros, contas] = await Promise.all([ apiGet('/centros'), apiGet('/contas') ]);
  // select filtros
  const sCentro = document.getElementById('fCentro');
  sCentro.innerHTML = '<option value="">Todos</option>' +
    centros.map(c=>`<option value="${c.id}">${c.codigo} - ${c.nome}</option>`).join('');
  // selects modal contrato
  const ctrCentro = document.getElementById('ctrContratoCentro');
  ctrCentro.innerHTML = centros.map(c=>`<option value="${c.id}">${c.codigo} - ${c.nome}</option>`).join('');
  const ctrConta = document.getElementById('ctrContratoConta');
  ctrConta.innerHTML = contas.map(c=>`<option value="${c.id}">${c.codigo} - ${c.descricao}</option>`).join('');
}

async function loadContratos() {
  const qs = new URLSearchParams();
  const st = document.getElementById('fStatus').value;
  const c  = document.getElementById('fCentro').value;
  const i  = document.getElementById('fInicio').value;
  const v  = document.getElementById('fVenc').value;
  if (st && st!=='todos') qs.set('status', st);
  if (c) qs.set('centroId', c);
  if (i) qs.set('inicioDe', i);
  if (v) qs.set('vencAte', v);

  contratos = await apiGet('/contratos' + (qs.toString()? ('?'+qs.toString()):''));
  renderContratos();
  updateKpis();
}

function updateKpis(){
  document.getElementById('kpiTotal').textContent  = contratos.length;
  document.getElementById('kpiAtivos').textContent = contratos.filter(c=>c.ativo).length;
  const hoje = new Date();
  const em30 = new Date(); em30.setDate(hoje.getDate()+30);
  document.getElementById('kpiVenc30').textContent =
    contratos.filter(c=> new Date(c.data_fim) <= em30 && c.ativo).length;
  document.getElementById('kpiEstouro').textContent =
    contratos.filter(c=> Number(c.saldo_utilizado) > Number(c.valor)).length;
}

function renderContratos() {
  const tb = document.querySelector('#tblContratos tbody');
  tb.innerHTML = '';
  contratos.forEach(ct=>{
    const centro = centros.find(x=>x.id===ct.centro_custo_id);
    const tr = el('tr', {},
      el('td', {}, ct.numero || '-'),
      el('td', {}, ct.fornecedor || '-'),
      el('td', {}, centro? `${centro.codigo} - ${centro.nome}` : '-'),
      el('td', {}, fmtMoney(Number(ct.valor || 0))),
      el('td', {}, fmtMoney(Number(ct.saldo_utilizado || 0))),
      el('td', {}, (ct.data_fim || '').split('T')[0] || '-'),
      el('td', {}, ct.ativo ? 'Ativo' : 'Inativo'),
      el('td', {},
        el('div', {class:'btn-group btn-group-sm'},
          el('button', {class:'btn btn-outline-primary', title:'Visualizar', onclick:`window.open('${API_BASE}/contratos/${ct.id}/arquivos','_blank')`}, 'Anexos'),
          el('button', {class:'btn btn-outline-danger', title:'Excluir', onclick:`deleteContrato(${ct.id})`}, 'Excluir')
        )
      )
    );
    tb.appendChild(tr);
  });
}

async function deleteContrato(id){
  if(!confirm('Confirma excluir o contrato?')) return;
  await apiDelete(`/contratos/${id}`);
  await loadContratos();
}

function wireFilters(){
  document.getElementById('btnAplicar').addEventListener('click', loadContratos);
  document.getElementById('btnLimpar').addEventListener('click', async ()=>{
    document.getElementById('fStatus').value='todos';
    document.getElementById('fCentro').value='';
    document.getElementById('fInicio').value='';
    document.getElementById('fVenc').value='';
    await loadContratos();
  });
  document.getElementById('btnCsv').addEventListener('click', ()=>{
    const qs = new URLSearchParams();
    const st = document.getElementById('fStatus').value;
    const c  = document.getElementById('fCentro').value;
    const i  = document.getElementById('fInicio').value;
    const v  = document.getElementById('fVenc').value;
    if (st && st!=='todos') qs.set('status', st);
    if (c) qs.set('centroId', c);
    if (i) qs.set('inicioDe', i);
    if (v) qs.set('vencAte', v);
    window.open(API_BASE + '/contratos/report' + (qs.toString()?('?'+qs.toString()):''), '_blank');
  });
}

// ===== centros / contas =====
function renderCentros(){
  const tb = document.querySelector('#tblCentros tbody');
  tb.innerHTML = centros.map(c=>`
    <tr>
      <td>${c.codigo}</td><td>${c.nome}</td><td>${c.responsavel||'-'}</td><td>${c.email||'-'}</td>
      <td><button class="btn btn-sm btn-outline-danger" onclick="deleteCentro(${c.id})">Excluir</button></td>
    </tr>`).join('');
}
async function deleteCentro(id){
  if(!confirm('Excluir centro?')) return;
  await apiDelete('/centros/'+id);
  centros = await apiGet('/centros');
  renderCentros();
  await loadStatic(); // recarrega selects
}
function renderContas(){
  const tb = document.querySelector('#tblContas tbody');
  tb.innerHTML = contas.map(c=>`
    <tr>
      <td>${c.codigo}</td><td>${c.descricao}</td><td>${c.tipo}</td>
      <td><button class="btn btn-sm btn-outline-danger" onclick="deleteConta(${c.id})">Excluir</button></td>
    </tr>`).join('');
}
async function deleteConta(id){
  if(!confirm('Excluir conta contábil?')) return;
  await apiDelete('/contas/'+id);
  contas = await apiGet('/contas');
  renderContas();
  await loadStatic();
}

// ===== modais: novo contrato / centro / conta =====
function wireModals(){
  const mdlContrato = new bootstrap.Modal('#mdlContrato');
  document.getElementById('btnNovoContrato').addEventListener('click', ()=> mdlContrato.show());
  document.getElementById('btnSalvarContrato').addEventListener('click', async ()=>{
    const form = document.getElementById('formContrato');
    const data = Object.fromEntries(new FormData(form).entries());
    data.ativo = document.getElementById('contratoAtivo').checked ? true : false;
    // cria contrato
    const novo = await apiPost('/contratos', data);
    // anexos
    const files = document.getElementById('anexosContrato').files;
    if (files && files.length){
      const fd = new FormData();
      [...files].forEach(f=> fd.append('arquivos', f, f.name));
      await apiPost(`/contratos/${novo.id}/arquivos`, fd);
    }
    form.reset();
    document.getElementById('contratoAtivo').checked = true;
    mdlContrato.hide();
    await loadContratos();
  });

  const mdlCentro = new bootstrap.Modal('#mdlCentro');
  document.getElementById('btnNovoCentro').addEventListener('click', ()=> mdlCentro.show());
  document.getElementById('btnSalvarCentro').addEventListener('click', async ()=>{
    const data = Object.fromEntries(new FormData(document.getElementById('formCentro')).entries());
    await apiPost('/centros', data);
    mdlCentro.hide();
    centros = await apiGet('/centros'); renderCentros(); await loadStatic();
  });

  const mdlConta = new bootstrap.Modal('#mdlConta');
  document.getElementById('btnNovaConta').addEventListener('click', ()=> mdlConta.show());
  document.getElementById('btnSalvarConta').addEventListener('click', async ()=>{
    const data = Object.fromEntries(new FormData(document.getElementById('formConta')).entries());
    await apiPost('/contas', data);
    mdlConta.hide();
    contas = await apiGet('/contas'); renderContas(); await loadStatic();
  });
}

// ===== boot =====
document.addEventListener('DOMContentLoaded', async ()=>{
  wireTabs();
  wireFilters();
  wireModals();
  await loadStatic();
  renderCentros();
  renderContas();
  await loadContratos();
});
