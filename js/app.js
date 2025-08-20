/***********************
 * CONFIGURAÇÃO
 ***********************/
const API = 'https://SEU-APP.up.railway.app'; // <- troque pela URL da sua API

// Estado em memória (carregado da API)
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
  if (!r.ok) throw new Error(`${method} ${path} falhou: ${r.status}`);
  return r.status === 204 ? null : r.json();
}

/***********************
 * INICIALIZAÇÃO
 ***********************/
document.addEventListener('DOMContentLoaded', async function () {
  try {
    await initializeData();
    // atualiza alertas a cada 30s
    setInterval(checkAlerts, 30000);
  } catch (e) {
    console.error(e);
    showAlert('Erro ao carregar dados da API. Verifique a conexão.', 'danger');
  }
});

async function initializeData() {
  // Carrega centros, contas e contratos da API
  const [centros, contas, contrs] = await Promise.all([
    apiGet('/centros'),
    apiGet('/contas'),
    apiGet('/contratos'),
  ]);

  centrosCusto = centros;
  contasContabeis = contas;
  contratos = contrs;

  updateTables();
  updateStats();
  checkAlerts();
}

/***********************
 * ABAS
 ***********************/
function showTab(tabName, el) {
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

  const btn = el || (typeof event !== 'undefined' ? (event.currentTarget || event.target) : null);
  if (btn && btn.classList) btn.classList.add('active');

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

  if (modalId === 'contratoModal') {
    document.getElementById('contratoModalTitle').textContent = 'Novo Contrato';
  } else if (modalId === 'centroModal') {
    document.getElementById('centroModalTitle').textContent = 'Novo Centro de Custo';
  } else if (modalId === 'contaModal') {
    document.getElementById('contaModalTitle').textContent = 'Nova Conta Contábil';
  }
}

// Fecha modal clicando fora
window.addEventListener('click', function (e) {
  if (e.target.classList && e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
  }
});

/***********************
 * DROPDOWNS DO CONTRATO
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
    const percentualUtilizado = (Number(contrato.saldoUtilizado) / Number(contrato.valorTotal)) * 100;
    const diasVencimento = Math.ceil((new Date(contrato.dataVencimento) - new Date()) / (1000 * 60 * 60 * 24));

    let statusClass = 'badge-success';
    let statusText = 'Ativo';

    if (diasVencimento <= 0) {
      statusClass = 'badge-danger';
      statusText = 'Vencido';
    } else if (diasVencimento <= 30) {
      statusClass = 'badge-warning';
      statusText = 'Vencendo';
    } else if (percentualUtilizado >= 90) {
      statusClass = 'badge-warning';
      statusText = 'Saldo Baixo';
    }

    const row = `
      <tr>
        <td>${contrato.numero}</td>
        <td>${contrato.fornecedor}</td>
        <td>${centro ? centro.nome : 'N/A'}</td>
        <td>R$ ${Number(contrato.valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        <td>
          <div>R$ ${Number(contrato.saldoUtilizado).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${Math.min(percentualUtilizado,100)}%; background:${percentualUtilizado>90?'var(--danger-color)':'var(--accent-color)'}"></div>
          </div>
          <small>${isFinite(percentualUtilizado)?percentualUtilizado.toFixed(1):'0.0'}% utilizado</small>
        </td>
        <td>${new Date(contrato.dataVencimento).toLocaleDateString('pt-BR')}</td>
        <td><span class="badge ${statusClass}">${statusText}</span></td>
        <td>
          <button class="btn btn-warning" style="padding:6px 12px;margin-right:5px" onclick="editContrato(${contrato.id})">Editar</button>
          <button class="btn btn-danger" style="padding:6px 12px" onclick="deleteContrato(${contrato.id})">Excluir</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

function updateCentrosTable() {
  const tbody = document.querySelector('#centrosTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  centrosCusto.forEach(centro => {
    const row = `
      <tr>
        <td>${centro.codigo}</td>
        <td>${centro.nome}</td>
        <td>${centro.responsavel}</td>
        <td>${centro.email}</td>
        <td>
          <button class="btn btn-warning" style="padding:6px 12px;margin-right:5px" onclick="editCentro(${centro.id})">Editar</button>
          <button class="btn btn-danger" style="padding:6px 12px" onclick="deleteCentro(${centro.id})">Excluir</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

function updateContasTable() {
  const tbody = document.querySelector('#contasTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  contasContabeis.forEach(conta => {
    const row = `
      <tr>
        <td>${conta.codigo}</td>
        <td>${conta.descricao}</td>
        <td>${conta.tipo}</td>
        <td>
          <button class="btn btn-warning" style="padding:6px 12px;margin-right:5px" onclick="editConta(${conta.id})">Editar</button>
          <button class="btn btn-danger" style="padding:6px 12px" onclick="deleteConta(${conta.id})">Excluir</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

/***********************
 * ESTATÍSTICAS
 ***********************/
function updateStats() {
  const totalContratos = contratos.length;

  const contratosAtivos = contratos.filter(c => new Date(c.dataVencimento) > new Date()).length;

  const contratosVencendo = contratos.filter(c => {
    const vencimento = new Date(c.dataVencimento);
    const hoje = new Date();
    const dias = Math.ceil((vencimento - hoje) / (1000 * 60 * 60 * 24));
    return dias <= 30 && dias > 0;
  }).length;

  const contratosEstouro = contratos.filter(c => (Number(c.saldoUtilizado) / Number(c.valorTotal)) * 100 > 100).length;

  document.getElementById('totalContratos').textContent = totalContratos;
  document.getElementById('contratosAtivos').textContent = contratosAtivos;
  document.getElementById('contratosVencendo').textContent = contratosVencendo;
  document.getElementById('contratosEstouro').textContent = contratosEstouro;
}

/***********************
 * ALERTAS
 ***********************/
function checkAlerts() {
  const div = document.getElementById('alerts');
  if (!div) return;
  div.innerHTML = '';

  // Vencendo em 30 dias
  const vencendo = contratos.filter(c => {
    const venc = new Date(c.dataVencimento);
    const hoje = new Date();
    const dias = Math.ceil((venc - hoje) / (1000 * 60 * 60 * 24));
    return dias <= 30 && dias > 0;
  });
  if (vencendo.length > 0) {
    const el = document.createElement('div');
    el.className = 'alert alert-warning';
    el.innerHTML = `<strong>⚠️ Atenção!</strong> ${vencendo.length} contrato(s) vencendo nos próximos 30 dias:
      ${vencendo.map(c => `<br>• ${c.numero} - ${c.fornecedor} (vence em ${Math.ceil((new Date(c.dataVencimento) - new Date()) / (1000*60*60*24))} dias)`).join('')}`;
    div.appendChild(el);
  }

  // Estouro
  const estouro = contratos.filter(c => (Number(c.saldoUtilizado) / Number(c.valorTotal)) * 100 > 100);
  if (estouro.length > 0) {
    const el = document.createElement('div');
    el.className = 'alert alert-danger';
    el.innerHTML = `<strong>🚨 Crítico!</strong> ${estouro.length} contrato(s) com estouro de saldo:
      ${estouro.map(c => `<br>• ${c.numero} - ${c.fornecedor} (${((Number(c.saldoUtilizado) / Number(c.valorTotal)) * 100).toFixed(1)}% utilizado)`).join('')}`;
    div.appendChild(el);
  }

  // Saldo baixo
  const saldoBaixo = contratos.filter(c => {
    const p = (Number(c.saldoUtilizado) / Number(c.valorTotal)) * 100;
    return p > 90 && p <= 100;
  });
  if (saldoBaixo.length > 0) {
    const el = document.createElement('div');
    el.className = 'alert alert-warning';
    el.innerHTML = `<strong>⚠️ Saldo Baixo!</strong> ${saldoBaixo.length} contrato(s) com saldo próximo do limite:
      ${saldoBaixo.map(c => `<br>• ${c.numero} - ${c.fornecedor} (${((Number(c.saldoUtilizado) / Number(c.valorTotal)) * 100).toFixed(1)}% utilizado)`).join('')}`;
    div.appendChild(el);
  }
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

  openModal('contratoModal');
}

async function deleteContrato(id) {
  if (!confirm('Tem certeza que deseja excluir este contrato?')) return;
  await apiSend(`/contratos/${id}`, 'DELETE');
  contratos = await apiGet('/contratos');
  updateTables(); updateStats(); checkAlerts();
  showAlert('Contrato excluído com sucesso!', 'success');
}

/***********************
 * CRUD CENTROS
 ***********************/
function editCentro(id) {
  const c = centrosCusto.find(x => x.id === id);
  if (!c) return;
  editingId = id;
  document.getElementById('centroModalTitle').textContent = 'Editar Centro de Custo';
  document.getElementById('codigoCentro').value = c.codigo;
  document.getElementById('nomeCentro').value = c.nome;
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
  updateTables();
  showAlert('Centro de custo excluído!', 'success');
}

/***********************
 * CRUD CONTAS
 ***********************/
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

  const data = {
    numero: document.getElementById('numeroContrato').value,
    fornecedor: document.getElementById('fornecedor').value,
    centroCusto: parseInt(document.getElementById('centroCustoContrato').value),
    contaContabil: parseInt(document.getElementById('contaContabil').value),
    valorTotal: parseFloat(document.getElementById('valorTotal').value),
    saldoUtilizado: parseFloat(document.getElementById('saldoUtilizado').value) || 0,
    dataInicio: document.getElementById('dataInicio').value,
    dataVencimento: document.getElementById('dataVencimento').value,
    observacoes: document.getElementById('observacoes').value || null
  };

  try {
    if (editingId) {
      await apiSend(`/contratos/${editingId}`, 'PUT', data);
      showAlert('Contrato atualizado com sucesso!', 'success');
    } else {
      await apiSend('/contratos', 'POST', data);
      showAlert('Contrato criado com sucesso!', 'success');
    }
    contratos = await apiGet('/contratos');
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
 * EXPORE FUNÇÕES PARA O HTML
 ***********************/
window.showTab = showTab;
window.openModal = openModal;
window.closeModal = closeModal;
window.editContrato = editContrato;
window.deleteContrato = deleteContrato;
window.editCentro = editCentro;
window.deleteCentro = deleteCentro;
window.editConta = editConta;
window.deleteConta = deleteConta;
