/***********************
 * CONFIGURAÇÃO
 ***********************/
const API = 'https://controledecontratos-production.up.railway.app';

// Estado em memória
let contratos = [];
let centrosCusto = [];
let contasContabeis = [];
let editingId = null;

/***********************
 * UTIL
 ***********************/
async function apiGet(path) {
  const r = await fetch(`${API}${path}`);
  if (!r.ok) throw new Error(`GET ${path} falhou: ${r.status}`);
  return r.json();
}
async function apiSend(path, method, body) {
  const r = await fetch(`${API}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {})
  });
  if (!r.ok) {
    const txt = await r.text().catch(()=> '');
    throw new Error(`${method} ${path} falhou: ${r.status} ${txt}`);
  }
  return r.status === 204 ? null : r.json();
}
async function apiSendForm(path, formData) {
  const r = await fetch(`${API}${path}`, { method: 'POST', body: formData });
  if (!r.ok) throw new Error(`POST form ${path} falhou: ${r.status}`);
  return r.json();
}
function toBRL(n) {
  return Number(n||0).toLocaleString('pt-BR',{minimumFractionDigits:2});
}

/***********************
 * INICIALIZAÇÃO
 ***********************/
document.addEventListener('DOMContentLoaded', async function () {
  try {
    await initializeData();

    // filtros
    document.getElementById('btnAplicarFiltros')?.addEventListener('click', applyFilters);
    document.getElementById('btnLimparFiltros')?.addEventListener('click', clearFilters);
    document.getElementById('btnRelatorio')?.addEventListener('click', baixarRelatorio);

    // atualiza alertas a cada 30s
    setInterval(checkAlerts, 30000);
  } catch (e) {
    console.error(e);
    showAlert('Erro ao carregar dados da API. Verifique a conexão.', 'danger');
  }
});

async function initializeData() {
  try {
    const [centrosRes, contasRes, contratosRes] = await Promise.allSettled([
      apiGet('/centros'),
      apiGet('/contas'),
      apiGet('/contratos'),
    ]);

    centrosCusto    = centrosRes.status === 'fulfilled' ? centrosRes.value : [];
    contasContabeis = contasRes.status === 'fulfilled' ? contasRes.value  : [];
    contratos       = contratosRes.status === 'fulfilled' ? contratosRes.value : [];

    if (centrosRes.status === 'rejected')  showAlert('Não foi possível carregar Centros de Custo.', 'warning');
    if (contasRes.status  === 'rejected')  showAlert('Não foi possível carregar Contas Contábeis.', 'warning');
    if (contratosRes.status=== 'rejected') showAlert('Não foi possível carregar Contratos. Os demais dados foram carregados.', 'warning');

    populateFiltroCentro();
    updateTables();
    updateStats();
    checkAlerts();

  } catch (err) {
    console.error('Falha inesperada ao inicializar dados:', err);
    showAlert('Erro ao carregar dados da API. Verifique a conexão.', 'danger');
  }
}

/***********************
 * ABAS
 ***********************/
function showTab(tabName, elOrEvent) {
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

  let btn = null;
  if (elOrEvent && elOrEvent.currentTarget) btn = elOrEvent.currentTarget;
  else if (elOrEvent instanceof HTMLElement) btn = elOrEvent;

  if (btn) btn.classList.add('active');

  const content = document.getElementById(tabName);
  if (content) content.classList.add('active');
}

/***********************
 * MODAIS
 ***********************/
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.style.display = 'block';

  if (modalId === 'contratoModal') {
    updateCentroCustoOptions();
    updateContaContabilOptions();
  }
}
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.style.display = 'none';

  const formId = modalId.replace('Modal', 'Form');
  const form = document.getElementById(formId);
  if (form) form.reset();

  editingId = null;

  if (modalId === 'contratoModal') document.getElementById('contratoModalTitle').textContent = 'Novo Contrato';
  if (modalId === 'centroModal')   document.getElementById('centroModalTitle').textContent   = 'Novo Centro de Custo';
  if (modalId === 'contaModal')    document.getElementById('contaModalTitle').textContent    = 'Nova Conta Contábil';
}
window.addEventListener('click', e => {
  if (e.target.classList?.contains('modal')) e.target.style.display = 'none';
});

/***********************
 * DROPDOWNS CONTRATO
 ***********************/
function updateCentroCustoOptions() {
  const select = document.getElementById('centroCustoContrato');
  if (!select) return;
  select.innerHTML = '<option value="">Selecione um centro de custo</option>';
  centrosCusto.forEach(centro => {
    const opt = document.createElement('option');
    opt.value = centro.id;
    opt.textContent = `${centro.codigo} - ${centro.nome}`;
    select.appendChild(opt);
  });
}
function updateContaContabilOptions() {
  const select = document.getElementById('contaContabil');
  if (!select) return;
  select.innerHTML = '<option value="">Selecione uma conta contábil</option>';
  contasContabeis.forEach(conta => {
    const opt = document.createElement('option');
    opt.value = conta.id;
    opt.textContent = `${conta.codigo} - ${conta.descricao}`;
    select.appendChild(opt);
  });
}

/***********************
 * FILTROS + RELATÓRIO
 ***********************/
function populateFiltroCentro() {
  const sel = document.getElementById('filtroCentro');
  if (!sel) return;
  const current = sel.value;
  sel.innerHTML = '<option value="">Todos</option>';
  centrosCusto.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.codigo} - ${c.nome}`;
    sel.appendChild(opt);
  });
  if (current) sel.value = current;
}

function buildContratosQueryFromFilters() {
  const params = new URLSearchParams();
  const st = document.getElementById('filtroStatus')?.value || '';
  const cc = document.getElementById('filtroCentro')?.value || '';
  const di = document.getElementById('filtroInicio')?.value || '';
  const dv = document.getElementById('filtroFim')?.value || '';

  // mapeia para a API
  if (st === 'ativo')     params.set('ativo', 'true');
  if (st === 'inativo')   params.set('ativo', 'false');
  if (st === 'vencendo')  params.set('status', 'VENCE_EM_30_DIAS');
  if (st === 'vencido')   params.set('status', 'VENCIDO');
  if (cc) params.set('centro', cc);
  if (di) params.set('vencimentoDe', di);   // usamos o campo "Início" como "vencimento a partir de"
  if (dv) params.set('vencimentoAte', dv);

  const qs = params.toString();
  return '/contratos' + (qs ? `?${qs}` : '');
}

async function applyFilters() {
  const path = buildContratosQueryFromFilters();
  try {
    contratos = await apiGet(path);
    updateTables(); updateStats(); checkAlerts();
  } catch (e) {
    console.error(e);
    showAlert('Falha ao aplicar filtros.', 'danger');
  }
}

async function clearFilters() {
  document.getElementById('filtroStatus').value = '';
  document.getElementById('filtroCentro').value = '';
  document.getElementById('filtroInicio').value = '';
  document.getElementById('filtroFim').value = '';
  await applyFilters();
}

async function baixarRelatorio() {
  try {
    const path = buildContratosQueryFromFilters(); // reaproveita os filtros
    const url = `${API}/relatorios/contratos${path.includes('?') ? path.slice(path.indexOf('?')) : ''}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error('Relatório indisponível.');
    const blob = await r.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `contratos_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
  } catch (e) {
    console.error(e);
    showAlert('Erro ao gerar relatório.', 'danger');
  }
}

/***********************
 * TABELAS
 ***********************/
function updateTables() {
  updateContratosTable();
  updateCentrosTable();
  updateContasTable();
}

function updateContratosTable() {
  const tbody = document.querySelector('#contratosTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  contratos.forEach(contrato => {
    const centro = centrosCusto.find(c => c.id === contrato.centroCusto);
    const pct = (Number(contrato.saldoUtilizado) / Number(contrato.valorTotal)) * 100;
    const diasVencimento = Math.ceil((new Date(contrato.dataVencimento) - new Date()) / (1000 * 60 * 60 * 24));

    let statusClass = 'badge-success';
    let statusText  = 'Ativo';
    if (contrato.ativo === false) { statusClass = 'badge';         statusText = 'Inativo'; }
    else if (diasVencimento <= 0) { statusClass = 'badge-danger';  statusText = 'Vencido'; }
    else if (diasVencimento <= 30){ statusClass = 'badge-warning'; statusText = 'Vencendo'; }
    else if (pct >= 90)            { statusClass = 'badge-warning'; statusText = 'Saldo Baixo'; }

    tbody.innerHTML += `
      <tr>
        <td>${contrato.numero}</td>
        <td>${contrato.fornecedor}</td>
        <td>${centro ? centro.nome : 'N/A'}</td>
        <td>R$ ${toBRL(contrato.valorTotal)}</td>
        <td>
          <div>R$ ${toBRL(contrato.saldoUtilizado)}</div>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${Math.min(pct,100)}%; background:${pct>90?'var(--danger)':'var(--accent)'}"></div>
          </div>
          <small>${isFinite(pct)?pct.toFixed(1):'0.0'}% utilizado</small>
        </td>
        <td>${new Date(contrato.dataVencimento).toLocaleDateString('pt-BR')}</td>
        <td><span class="badge ${statusClass}">${statusText}</span></td>
        <td style="white-space:nowrap">
          <button class="btn"             style="padding:6px 12px;margin-right:5px" onclick="viewContrato(${contrato.id})">Visualizar</button>
          <button class="btn btn-warning" style="padding:6px 12px;margin-right:5px" onclick="editContrato(${contrato.id})">Editar</button>
          <button class="btn btn-danger"  style="padding:6px 12px;margin-right:5px" onclick="deleteContrato(${contrato.id})">Excluir</button>
          <button class="btn"             style="padding:6px 12px" onclick="openMovModal(${contrato.id})">Movimentar</button>
        </td>
      </tr>`;
  });
}

function updateCentrosTable() {
  const tbody = document.querySelector('#centrosTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  centrosCusto.forEach(centro => {
    tbody.innerHTML += `
      <tr>
        <td>${centro.codigo}</td>
        <td>${centro.nome}</td>
        <td>${centro.responsavel}</td>
        <td>${centro.email}</td>
        <td>
          <button class="btn btn-warning" style="padding:6px 12px;margin-right:5px" onclick="editCentro(${centro.id})">Editar</button>
          <button class="btn btn-danger"  style="padding:6px 12px;margin-right:5px" onclick="deleteCentro(${centro.id})">Excluir</button>
        </td>
      </tr>`;
  });
}

function updateContasTable() {
  const tbody = document.querySelector('#contasTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  contasContabeis.forEach(conta => {
    tbody.innerHTML += `
      <tr>
        <td>${conta.codigo}</td>
        <td>${conta.descricao}</td>
        <td>${conta.tipo}</td>
        <td>
          <button class="btn btn-warning" style="padding:6px 12px;margin-right:5px" onclick="editConta(${conta.id})">Editar</button>
          <button class="btn btn-danger"  style="padding:6px 12px;margin-right:5px" onclick="deleteConta(${conta.id})">Excluir</button>
        </td>
      </tr>`;
  });
}

/***********************
 * ESTATÍSTICAS & ALERTAS
 ***********************/
function updateStats() {
  const totalContratos   = contratos.length;
  const contratosAtivos  = contratos.filter(c => c.ativo !== false && new Date(c.dataVencimento) > new Date()).length;
  const contratosVencendo= contratos.filter(c => c.ativo !== false && Math.ceil((new Date(c.dataVencimento)-new Date())/(1000*60*60*24)) <= 30 && Math.ceil((new Date(c.dataVencimento)-new Date())/(1000*60*60*24)) > 0).length;
  const contratosEstouro = contratos.filter(c => (Number(c.saldoUtilizado) / Number(c.valorTotal)) * 100 > 100).length;

  document.getElementById('totalContratos').textContent   = totalContratos;
  document.getElementById('contratosAtivos').textContent  = contratosAtivos;
  document.getElementById('contratosVencendo').textContent= contratosVencendo;
  document.getElementById('contratosEstouro').textContent = contratosEstouro;
}

function checkAlerts() {
  const div = document.getElementById('alerts');
  if (!div) return;
  div.innerHTML = '';

  const vencendo = contratos.filter(c => c.ativo !== false && Math.ceil((new Date(c.dataVencimento)-new Date())/(1000*60*60*24)) <= 30 && Math.ceil((new Date(c.dataVencimento)-new Date())/(1000*60*60*24)) > 0);
  if (vencendo.length) {
    const el = document.createElement('div');
    el.className = 'alert alert-warning';
    el.innerHTML = `<strong>⚠️ Atenção!</strong> ${vencendo.length} contrato(s) vencendo nos próximos 30 dias:
      ${vencendo.map(c => `<br>• ${c.numero} - ${c.fornecedor} (vence em ${Math.ceil((new Date(c.dataVencimento)-new Date())/(1000*60*60*24))} dias)`).join('')}`;
    div.appendChild(el);
  }

  const estouro = contratos.filter(c => (Number(c.saldoUtilizado) / Number(c.valorTotal)) * 100 > 100);
  if (estouro.length) {
    const el = document.createElement('div');
    el.className = 'alert alert-danger';
    el.innerHTML = `<strong>🚨 Crítico!</strong> ${estouro.length} contrato(s) com estouro de saldo:
      ${estouro.map(c => `<br>• ${c.numero} - ${c.fornecedor} (${((Number(c.saldoUtilizado)/Number(c.valorTotal))*100).toFixed(1)}% utilizado)`).join('')}`;
    div.appendChild(el);
  }

  const saldoBaixo = contratos.filter(c => {
    const p = (Number(c.saldoUtilizado) / Number(c.valorTotal)) * 100;
    return p > 90 && p <= 100;
  });
  if (saldoBaixo.length) {
    const el = document.createElement('div');
    el.className = 'alert alert-warning';
    el.innerHTML = `<strong>⚠️ Saldo Baixo!</strong> ${saldoBaixo.length} contrato(s) com saldo próximo do limite:
      ${saldoBaixo.map(c => `<br>• ${c.numero} - ${c.fornecedor} (${((Number(c.saldoUtilizado)/Number(c.valorTotal))*100).toFixed(1)}% utilizado)`).join('')}`;
    div.appendChild(el);
  }
}

/***********************
 * VISUALIZAR CONTRATO
 ***********************/
async function viewContrato(id){
  const c = contratos.find(x => x.id === id);
  if(!c) return;

  // dados
  const centro = centrosCusto.find(k => k.id === c.centroCusto);
  const conta  = contasContabeis.find(k => k.id === c.contaContabil);
  const diasVenc = Math.ceil((new Date(c.dataVencimento) - new Date()) / (1000*60*60*24));
  let statusText = 'Ativo';
  if (c.ativo === false) statusText = 'Inativo';
  else if (diasVenc <= 0) statusText = 'Vencido';
  else if (diasVenc <= 30) statusText = 'Vencendo';
  const el = (id)=>document.getElementById(id);
  el('viewNumero').textContent = c.numero;
  el('viewFornecedor').textContent = c.fornecedor;
  el('viewStatus').textContent = statusText;
  el('viewCentro').textContent = centro ? `${centro.codigo} - ${centro.nome}` : 'N/A';
  el('viewConta').textContent  = conta ? `${conta.codigo} - ${conta.descricao}` : 'N/A';
  el('viewAtivo').textContent  = c.ativo ? 'Sim' : 'Não';
  el('viewValor').textContent  = 'R$ ' + toBRL(c.valorTotal);
  el('viewSaldo').textContent  = 'R$ ' + toBRL(c.saldoUtilizado);
  el('viewVenc').textContent   = new Date(c.dataVencimento).toLocaleDateString('pt-BR');
  el('viewObs').textContent    = c.observacoes || '-';

  // anexos
  const filesDiv = el('viewFiles');
  filesDiv.innerHTML = 'Carregando...';
  try{
    const lista = await apiGet(`/contratos/${id}/arquivos`);
    if(!lista.length){ filesDiv.textContent = 'Sem anexos.'; }
    else{
      filesDiv.innerHTML = '';
      lista.forEach(a=>{
        const link = document.createElement('a');
        link.href = `${API}${a.url}`;
        link.target = '_blank';
        link.rel = 'noopener';
        link.className = 'btn';
        link.textContent = a.nome_arquivo || 'Arquivo';
        filesDiv.appendChild(link);
      });
    }
  }catch(_){
    filesDiv.textContent = 'Falha ao carregar anexos.';
  }

  openModal('viewModal');
}

/***********************
 * CRUD CONTRATOS
 ***********************/
function editContrato(id) {
  const c = contratos.find(x => x.id === id);
  if (!c) return;
  editingId = id;
  document.getElementById('contratoModalTitle').textContent = 'Editar Contrato';
  document.getElementById('numeroContrato').value       = c.numero;
  document.getElementById('fornecedor').value           = c.fornecedor;
  document.getElementById('centroCustoContrato').value  = c.centroCusto;
  document.getElementById('contaContabil').value        = c.contaContabil;
  document.getElementById('valorTotal').value           = Number(c.valorTotal);
  document.getElementById('saldoUtilizado').value       = Number(c.saldoUtilizado);
  document.getElementById('dataInicio').value           = c.dataInicio?.slice(0,10) || '';
  document.getElementById('dataVencimento').value       = c.dataVencimento?.slice(0,10) || '';
  document.getElementById('observacoes').value          = c.observacoes || '';
  document.getElementById('ativo').value                = (c.ativo === false ? 'false' : 'true');
  openModal('contratoModal');
}

async function deleteContrato(id) {
  if (!confirm('Tem certeza que deseja excluir este contrato?')) return;
  await apiSend(`/contratos/${id}`, 'DELETE');
  contratos = await apiGet(buildContratosQueryFromFilters());
  updateTables(); updateStats(); checkAlerts();
  showAlert('Contrato excluído com sucesso!', 'success');
}

/***********************
 * CRUD CENTROS & CONTAS
 ***********************/
function editCentro(id) {
  const c = centrosCusto.find(x => x.id === id);
  if (!c) return;
  editingId = id;
  document.getElementById('centroModalTitle').textContent = 'Editar Centro de Custo';
  document.getElementById('codigoCentro').value = c.codigo;
  document.getElementById('nomeCentro').value  = c.nome;
  document.getElementById('responsavel').value = c.responsavel;
  document.getElementById('emailResponsavel').value = c.email;
  openModal('centroModal');
}
async function deleteCentro(id) {
  const usados = contratos.filter(c => c.centroCusto === id);
  if (usados.length > 0) { alert(`Não é possível excluir: usado por ${usados.length} contrato(s).`); return; }
  if (!confirm('Excluir centro de custo?')) return;
  await apiSend(`/centros/${id}`, 'DELETE');
  centrosCusto = await apiGet('/centros');
  populateFiltroCentro();
  updateTables();
  showAlert('Centro de custo excluído!', 'success');
}

function editConta(id) {
  const c = contasContabeis.find(x => x.id === id);
  if (!c) return;
  editingId = id;
  document.getElementById('contaModalTitle').textContent = 'Editar Conta Contábil';
  document.getElementById('codigoConta').value = c.codigo;
  document.getElementById('descricaoConta').value = c.descricao;
  document.getElementById('tipoConta').value = c.tipo;
  openModal('contaModal');
}
async function deleteConta(id) {
  const usados = contratos.filter(c => c.contaContabil === id);
  if (usados.length > 0) { alert(`Não é possível excluir: usada por ${usados.length} contrato(s).`); return; }
  if (!confirm('Excluir conta contábil?')) return;
  await apiSend(`/contas/${id}`, 'DELETE');
  contasContabeis = await apiGet('/contas');
  updateTables();
  showAlert('Conta contábil excluída!', 'success');
}

/***********************
 * MOVIMENTAÇÕES
 ***********************/
function openMovModal(contratoId) {
  document.getElementById('movContratoId').value = contratoId;
  document.getElementById('movTipo').value  = 'saida';
  document.getElementById('movValor').value = '';
  document.getElementById('movData').value  = new Date().toISOString().slice(0,10);
  document.getElementById('movObs').value   = '';
  openModal('movModal');
}
document.getElementById('movForm')?.addEventListener('submit', async function(e){
  e.preventDefault();
  const id = document.getElementById('movContratoId').value;
  const tipoTela = document.getElementById('movTipo').value; // 'saida' | 'ajuste'
  const payload = {
    tipo: (tipoTela === 'saida' ? 'PAGAMENTO' : 'AJUSTE'),
    observacao: document.getElementById('movObs').value || null,
    valorDelta: parseFloat(document.getElementById('movValor').value) || 0
  };
  try {
    await apiSend(`/contratos/${id}/movimentos`, 'POST', payload);
    contratos = await apiGet(buildContratosQueryFromFilters());
    updateTables(); updateStats(); checkAlerts();
    closeModal('movModal');
    showAlert('Movimentação lançada!', 'success');
  } catch (err) {
    console.error(err);
    showAlert('Erro ao lançar movimentação.', 'danger');
  }
});

/***********************
 * ALERTAS TEMPORÁRIOS
 ***********************/
function showAlert(message, type = 'success') {
  const container = document.getElementById('alerts');
  if (!container) return;
  const el = document.createElement('div');
  el.className = `alert alert-${type}`;
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => el.remove(), 5000);
}

/***********************
 * SUBMISSÃO DE FORMULÁRIOS
 ***********************/
document.getElementById('contratoForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();

  const ativo = document.getElementById('ativo').value === 'true';
  const data = {
    numero: document.getElementById('numeroContrato').value,
    fornecedor: document.getElementById('fornecedor').value,
    centroCusto: parseInt(document.getElementById('centroCustoContrato').value),
    contaContabil: parseInt(document.getElementById('contaContabil').value),
    valorTotal: parseFloat(document.getElementById('valorTotal').value),
    saldoUtilizado: parseFloat(document.getElementById('saldoUtilizado').value) || 0,
    dataInicio: document.getElementById('dataInicio').value,
    dataVencimento: document.getElementById('dataVencimento').value,
    observacoes: document.getElementById('observacoes').value || null,
    ativo
  };

  const fileInput = document.getElementById('anexo');
  const hasFile = fileInput && fileInput.files && fileInput.files[0];

  try {
    let saved;
    if (editingId) {
      saved = await apiSend(`/contratos/${editingId}`, 'PUT', data);
      showAlert('Contrato atualizado com sucesso!', 'success');
    } else {
      saved = await apiSend('/contratos', 'POST', data);
      showAlert('Contrato criado com sucesso!', 'success');
    }

    if (hasFile && (saved?.id || saved?.ok)) {
      const fd = new FormData();
      fd.append('file', fileInput.files[0]);
      const id = editingId || saved.id;
      try { await apiSendForm(`/contratos/${id}/anexos`, fd); } catch (_) {}
    }

    contratos = await apiGet(buildContratosQueryFromFilters());
    updateTables(); updateStats(); checkAlerts();
    closeModal('contratoModal');
  } catch (err) {
    console.error(err);
    showAlert('Erro ao salvar contrato.', 'danger');
  }
});

document.getElementById('centroForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();

  const data = {
    codigo: document.getElementById('codigoCentro').value,
    nome: document.getElementById('nomeCentro').value,
    responsavel: document.getElementById('responsavel').value,
    email: document.getElementById('emailResponsavel').value
  };

  try {
    if (editingId) {
      await apiSend(`/centros/${editingId}`, 'PUT', data);
      showAlert('Centro de custo atualizado!', 'success');
    } else {
      await apiSend('/centros', 'POST', data);
      showAlert('Centro de custo criado!', 'success');
    }
    centrosCusto = await apiGet('/centros');
    populateFiltroCentro();
    updateTables();
    closeModal('centroModal');
  } catch (err) {
    console.error(err);
    showAlert('Erro ao salvar centro de custo.', 'danger');
  }
});

document.getElementById('contaForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();

  const data = {
    codigo: document.getElementById('codigoConta').value,
    descricao: document.getElementById('descricaoConta').value,
    tipo: document.getElementById('tipoConta').value
  };

  try {
    if (editingId) {
      await apiSend(`/contas/${editingId}`, 'PUT', data);
      showAlert('Conta contábil atualizada!', 'success');
    } else {
      await apiSend('/contas', 'POST', data);
      showAlert('Conta contábil criada!', 'success');
    }
    contasContabeis = await apiGet('/contas');
    updateTables();
    closeModal('contaModal');
  } catch (err) {
    console.error(err);
    showAlert('Erro ao salvar conta contábil.', 'danger');
  }
});

/***********************
 * EXPORE FUNÇÕES
 ***********************/
window.showTab = showTab;
window.openModal = openModal;
window.closeModal = closeModal;
window.viewContrato = viewContrato;
window.editContrato = editContrato;
window.deleteContrato = deleteContrato;
window.editCentro   = editCentro;
window.deleteCentro = deleteCentro;
window.editConta    = editConta;
window.deleteConta  = deleteConta;
window.openMovModal = openMovModal;