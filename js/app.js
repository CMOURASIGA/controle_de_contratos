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
  try {
    const r = await fetch(`${API}${path}`);
    if (!r.ok) throw new Error(`GET ${path} falhou: ${r.status}`);
    return r.json();
  } catch (error) {
    console.error('Erro na requisição GET:', error);
    throw error;
  }
}

async function apiSend(path, method, body) {
  try {
    const r = await fetch(`${API}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {})
    });
    if (!r.ok) {
      const txt = await r.text().catch(() => '');
      throw new Error(`${method} ${path} falhou: ${r.status} ${txt}`);
    }
    return r.status === 204 ? null : r.json();
  } catch (error) {
    console.error(`Erro na requisição ${method}:`, error);
    throw error;
  }
}

async function apiSendForm(path, formData) {
  try {
    const r = await fetch(`${API}${path}`, { method: 'POST', body: formData });
    if (!r.ok) throw new Error(`POST form ${path} falhou: ${r.status}`);
    return r.json();
  } catch (error) {
    console.error('Erro no envio do formulário:', error);
    throw error;
  }
}

function toBRL(n) {
  return Number(n || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

/***********************
 * INICIALIZAÇÃO
 ***********************/
document.addEventListener('DOMContentLoaded', async function () {
  try {
    await initializeData();
    setupEventListeners();
    
    // Atualiza alertas a cada 30s
    setInterval(checkAlerts, 30000);
  } catch (e) {
    console.error('Erro na inicialização:', e);
    showAlert('Erro ao carregar dados da API. Verifique a conexão.', 'danger');
  }
});

function setupEventListeners() {
  // Filtros
  document.getElementById('btnAplicarFiltros')?.addEventListener('click', applyFilters);
  document.getElementById('btnLimparFiltros')?.addEventListener('click', clearFilters);
  document.getElementById('btnRelatorio')?.addEventListener('click', baixarRelatorio);
  document.getElementById('btnNovoContrato')?.addEventListener('click', () => {
    editingId = null;
    document.getElementById('contratoForm').reset();
    document.getElementById('contratoModalTitle').textContent = 'Novo Contrato';
    openModal('contratoModal');
  });

  // Formulários
  document.getElementById('contratoForm')?.addEventListener('submit', handleContratoSubmit);
  document.getElementById('centroForm')?.addEventListener('submit', handleCentroSubmit);
  document.getElementById('contaForm')?.addEventListener('submit', handleContaSubmit);
  document.getElementById('movForm')?.addEventListener('submit', handleMovSubmit);
  
  // Validação e pré-visualização de anexos
  document.getElementById('anexosContrato')?.addEventListener('change', updateAnexosPreview);
  document.querySelectorAll('#contratoForm input, #contratoForm select, #contratoForm textarea').forEach(el => {
    el.addEventListener('input', () => el.classList.remove('invalid'));
  });
}

async function initializeData() {
  try {
    console.log('Inicializando dados...');
    
    // Primeiro, tenta carregar os dados básicos
    centrosCusto = await apiGet('/centros').catch(err => {
      console.error('Erro ao carregar centros:', err);
      showAlert('Não foi possível carregar Centros de Custo.', 'warning');
      return [];
    });

    contasContabeis = await apiGet('/contas').catch(err => {
      console.error('Erro ao carregar contas:', err);
      showAlert('Não foi possível carregar Contas Contábeis.', 'warning');
      return [];
    });

    contratos = await apiGet('/contratos').catch(err => {
      console.error('Erro ao carregar contratos:', err);
      showAlert('Não foi possível carregar Contratos.', 'warning');
      return [];
    });

    console.log('Dados carregados:', { contratos: contratos.length, centros: centrosCusto.length, contas: contasContabeis.length });

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

  // Reset titles
  if (modalId === 'contratoModal') document.getElementById('contratoModalTitle').textContent = 'Novo Contrato';
  if (modalId === 'centroModal') document.getElementById('centroModalTitle').textContent = 'Novo Centro de Custo';
  if (modalId === 'contaModal') document.getElementById('contaModalTitle').textContent = 'Nova Conta Contábil';
}

// Fechar modal clicando fora
window.addEventListener('click', e => {
  if (e.target.classList?.contains('modal')) {
    e.target.style.display = 'none';
  }
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
function buildContratosQueryFromFilters() {
  const params = new URLSearchParams();
  const fornecedor = document.getElementById('filtroFornecedor')?.value?.trim() || '';
  const numero = document.getElementById('filtroNumero')?.value?.trim() || '';
  const status = document.getElementById('filtroStatus')?.value || '';
  const vencimentoDe = document.getElementById('filtroVencimentoDe')?.value || '';
  const vencimentoAte = document.getElementById('filtroVencimentoAte')?.value || '';

  // Mapeia para a API
  if (fornecedor) params.set('fornecedor', fornecedor);
  if (numero) params.set('q', numero); // usando q para busca geral
  if (status === 'ativo') params.set('ativo', 'true');
  if (status === 'inativo') params.set('ativo', 'false');
  if (status === 'vencendo') params.set('status', 'VENCE_EM_30_DIAS');
  if (status === 'vencido') params.set('status', 'VENCIDO');
  if (vencimentoDe) params.set('vencimentoDe', vencimentoDe);
  if (vencimentoAte) params.set('vencimentoAte', vencimentoAte);

  const qs = params.toString();
  return '/contratos' + (qs ? `?${qs}` : '');
}

async function applyFilters() {
  try {
    const path = buildContratosQueryFromFilters();
    console.log('Aplicando filtros:', path);
    contratos = await apiGet(path);
    updateTables();
    updateStats();
    checkAlerts();
    showAlert('Filtros aplicados com sucesso!', 'success');
  } catch (e) {
    console.error('Erro ao aplicar filtros:', e);
    showAlert('Falha ao aplicar filtros.', 'danger');
  }
}

async function clearFilters() {
  try {
    document.getElementById('filtroFornecedor').value = '';
    document.getElementById('filtroNumero').value = '';
    document.getElementById('filtroStatus').value = '';
    document.getElementById('filtroVencimentoDe').value = '';
    document.getElementById('filtroVencimentoAte').value = '';
    
    contratos = await apiGet('/contratos');
    updateTables();
    updateStats();
    checkAlerts();
    showAlert('Filtros limpos!', 'success');
  } catch (e) {
    console.error('Erro ao limpar filtros:', e);
    showAlert('Erro ao limpar filtros.', 'danger');
  }
}

async function baixarRelatorio() {
  try {
    const path = buildContratosQueryFromFilters();
    const queryString = path.includes('?') ? path.slice(path.indexOf('?')) : '';
    const url = `${API}/relatorios/contratos${queryString}`;
    
    const r = await fetch(url);
    if (!r.ok) throw new Error('Relatório indisponível.');
    
    const blob = await r.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `contratos_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    
    showAlert('Relatório baixado com sucesso!', 'success');
  } catch (e) {
    console.error('Erro ao gerar relatório:', e);
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

  if (contratos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:20px; color:var(--text-secondary)">Nenhum contrato encontrado</td></tr>';
    return;
  }

  contratos.forEach(contrato => {
    const centro = centrosCusto.find(c => c.id === contrato.centroCusto);
    const pct = contrato.valorTotal ? (Number(contrato.saldoUtilizado) / Number(contrato.valorTotal)) * 100 : 0;
    const diasVencimento = Math.ceil((new Date(contrato.dataVencimento) - new Date()) / (1000 * 60 * 60 * 24));

    let statusClass = 'badge-success';
    let statusText = 'Ativo';
    
    if (contrato.ativo === false) {
      statusClass = 'badge';
      statusText = 'Inativo';
    } else if (diasVencimento <= 0) {
      statusClass = 'badge-danger';
      statusText = 'Vencido';
    } else if (diasVencimento <= 30) {
      statusClass = 'badge-warning';
      statusText = 'Vencendo';
    } else if (pct >= 90) {
      statusClass = 'badge-warning';
      statusText = 'Saldo Baixo';
    }

    tbody.innerHTML += `
      <tr>
        <td>${contrato.numero || 'N/A'}</td>
        <td>${contrato.fornecedor || 'N/A'}</td>
        <td>${centro ? centro.nome : 'N/A'}</td>
        <td>R$ ${toBRL(contrato.valorTotal)}</td>
        <td>
          <div>R$ ${toBRL(contrato.saldoUtilizado)}</div>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${Math.min(pct, 100)}%; background:${pct > 90 ? 'var(--danger-color)' : 'var(--accent-color)'}"></div>
          </div>
          <small>${isFinite(pct) ? pct.toFixed(1) : '0.0'}% utilizado</small>
        </td>
        <td>${contrato.dataVencimento ? new Date(contrato.dataVencimento).toLocaleDateString('pt-BR') : 'N/A'}</td>
        <td><span class="badge ${statusClass}">${statusText}</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn" onclick="editContrato(${contrato.id})">Editar</button>
            <button class="btn danger" onclick="deleteContrato(${contrato.id})">Excluir</button>
            <button class="btn success" onclick="openMovModal(${contrato.id})">Movimentar</button>
          </div>
        </td>
      </tr>`;
  });
}

function updateCentrosTable() {
  const tbody = document.querySelector('#centrosTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (centrosCusto.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px; color:var(--text-secondary)">Nenhum centro de custo encontrado</td></tr>';
    return;
  }

  centrosCusto.forEach(centro => {
    tbody.innerHTML += `
      <tr>
        <td>${centro.codigo || 'N/A'}</td>
        <td>${centro.nome || 'N/A'}</td>
        <td>${centro.responsavel || 'N/A'}</td>
        <td>${centro.email || 'N/A'}</td>
        <td>
          <div class="action-buttons">
            <button class="btn warn" onclick="editCentro(${centro.id})">Editar</button>
            <button class="btn danger" onclick="deleteCentro(${centro.id})">Excluir</button>
          </div>
        </td>
      </tr>`;
  });
}

function updateContasTable() {
  const tbody = document.querySelector('#contasTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (contasContabeis.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px; color:var(--text-secondary)">Nenhuma conta contábil encontrada</td></tr>';
    return;
  }

  contasContabeis.forEach(conta => {
    tbody.innerHTML += `
      <tr>
        <td>${conta.codigo || 'N/A'}</td>
        <td>${conta.descricao || 'N/A'}</td>
        <td>${conta.tipo || 'N/A'}</td>
        <td>
          <div class="action-buttons">
            <button class="btn warn" onclick="editConta(${conta.id})">Editar</button>
            <button class="btn danger" onclick="deleteConta(${conta.id})">Excluir</button>
          </div>
        </td>
      </tr>`;
  });
}

/***********************
 * ESTATÍSTICAS & ALERTAS
 ***********************/
function updateStats() {
  const totalContratos = contratos.length;
  const contratosAtivos = contratos.filter(c => c.ativo !== false && new Date(c.dataVencimento) > new Date()).length;
  const contratosVencendo = contratos.filter(c => {
    if (c.ativo === false) return false;
    const dias = Math.ceil((new Date(c.dataVencimento) - new Date()) / (1000 * 60 * 60 * 24));
    return dias <= 30 && dias > 0;
  }).length;
  const contratosEstouro = contratos.filter(c => {
    if (!c.valorTotal) return false;
    return (Number(c.saldoUtilizado) / Number(c.valorTotal)) * 100 > 100;
  }).length;

  document.getElementById('totalContratos').textContent = totalContratos;
  document.getElementById('contratosAtivos').textContent = contratosAtivos;
  document.getElementById('contratosVencendo').textContent = contratosVencendo;
  document.getElementById('contratosEstouro').textContent = contratosEstouro;
}

function checkAlerts() {
  const div = document.getElementById('alerts');
  if (!div) return;

  // Limpa alertas existentes (mas mantém os temporários)
  div.querySelectorAll('.alert:not([data-temporary])').forEach(el => el.remove());

  const vencendo = contratos.filter(c => {
    if (c.ativo === false) return false;
    const dias = Math.ceil((new Date(c.dataVencimento) - new Date()) / (1000 * 60 * 60 * 24));
    return dias <= 30 && dias > 0;
  });

  if (vencendo.length) {
    const el = document.createElement('div');
    el.className = 'alert alert-warning';
    el.innerHTML = `<strong>⚠️ Atenção!</strong> ${vencendo.length} contrato(s) vencendo nos próximos 30 dias:
      ${vencendo.map(c => {
        const dias = Math.ceil((new Date(c.dataVencimento) - new Date()) / (1000 * 60 * 60 * 24));
        return `<br>• ${c.numero || 'S/N'} - ${c.fornecedor || 'N/A'} (vence em ${dias} dias)`;
      }).join('')}`;
    div.appendChild(el);
  }

  const estouro = contratos.filter(c => {
    if (!c.valorTotal) return false;
    return (Number(c.saldoUtilizado) / Number(c.valorTotal)) * 100 > 100;
  });

  if (estouro.length) {
    const el = document.createElement('div');
    el.className = 'alert alert-danger';
    el.innerHTML = `<strong>🚨 Crítico!</strong> ${estouro.length} contrato(s) com estouro de saldo:
      ${estouro.map(c => {
        const pct = ((Number(c.saldoUtilizado) / Number(c.valorTotal)) * 100).toFixed(1);
        return `<br>• ${c.numero || 'S/N'} - ${c.fornecedor || 'N/A'} (${pct}% utilizado)`;
      }).join('')}`;
    div.appendChild(el);
  }

  const saldoBaixo = contratos.filter(c => {
    if (!c.valorTotal) return false;
    const p = (Number(c.saldoUtilizado) / Number(c.valorTotal)) * 100;
    return p > 90 && p <= 100;
  });

  if (saldoBaixo.length) {
    const el = document.createElement('div');
    el.className = 'alert alert-warning';
    el.innerHTML = `<strong>⚠️ Saldo Baixo!</strong> ${saldoBaixo.length} contrato(s) com saldo próximo do limite:
      ${saldoBaixo.map(c => {
        const pct = ((Number(c.saldoUtilizado) / Number(c.valorTotal)) * 100).toFixed(1);
        return `<br>• ${c.numero || 'S/N'} - ${c.fornecedor || 'N/A'} (${pct}% utilizado)`;
      }).join('')}`;
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
  document.getElementById('numeroContrato').value = c.numero || '';
  document.getElementById('fornecedor').value = c.fornecedor || '';
  document.getElementById('centroCustoContrato').value = c.centroCusto || '';
  document.getElementById('contaContabil').value = c.contaContabil || '';
  document.getElementById('valorTotal').value = Number(c.valorTotal) || 0;
  document.getElementById('saldoUtilizado').value = Number(c.saldoUtilizado) || 0;
  document.getElementById('dataInicio').value = c.dataInicio?.slice(0, 10) || '';
  document.getElementById('dataVencimento').value = c.dataVencimento?.slice(0, 10) || '';
  document.getElementById('observacoes').value = c.observacoes || '';
  document.getElementById('contratoAtivo').checked = c.ativo !== false;
  
  openModal('contratoModal');
}

async function deleteContrato(id) {
  if (!confirm('Tem certeza que deseja excluir este contrato?')) return;
  
  try {
    await apiSend(`/contratos/${id}`, 'DELETE');
    
    // Recarrega a lista com os filtros atuais
    const path = buildContratosQueryFromFilters();
    contratos = await apiGet(path);
    
    updateTables();
    updateStats();
    checkAlerts();
    showAlert('Contrato excluído com sucesso!', 'success');
  } catch (e) {
    console.error('Erro ao excluir contrato:', e);
    showAlert('Erro ao excluir contrato.', 'danger');
  }
}

/***********************
 * CRUD CENTROS & CONTAS
 ***********************/
function editCentro(id) {
  const c = centrosCusto.find(x => x.id === id);
  if (!c) return;

  editingId = id;
  document.getElementById('centroModalTitle').textContent = 'Editar Centro de Custo';
  document.getElementById('codigoCentro').value = c.codigo || '';
  document.getElementById('nomeCentro').value = c.nome || '';
  document.getElementById('responsavel').value = c.responsavel || '';
  document.getElementById('emailResponsavel').value = c.email || '';
  
  openModal('centroModal');
}

async function deleteCentro(id) {
  const usados = contratos.filter(c => c.centroCusto === id);
  if (usados.length > 0) {
    alert(`Não é possível excluir: usado por ${usados.length} contrato(s).`);
    return;
  }
  
  if (!confirm('Excluir centro de custo?')) return;
  
  try {
    await apiSend(`/centros/${id}`, 'DELETE');
    centrosCusto = await apiGet('/centros');
    updateTables();
    showAlert('Centro de custo excluído!', 'success');
  } catch (e) {
    console.error('Erro ao excluir centro:', e);
    showAlert('Erro ao excluir centro de custo.', 'danger');
  }
}

function editConta(id) {
  const c = contasContabeis.find(x => x.id === id);
  if (!c) return;

  editingId = id;
  document.getElementById('contaModalTitle').textContent = 'Editar Conta Contábil';
  document.getElementById('codigoConta').value = c.codigo || '';
  document.getElementById('descricaoConta').value = c.descricao || '';
  document.getElementById('tipoConta').value = c.tipo || '';
  
  openModal('contaModal');
}

async function deleteConta(id) {
  const usados = contratos.filter(c => c.contaContabil === id);
  if (usados.length > 0) {
    alert(`Não é possível excluir: usada por ${usados.length} contrato(s).`);
    return;
  }
  
  if (!confirm('Excluir conta contábil?')) return;
  
  try {
    await apiSend(`/contas/${id}`, 'DELETE');
    contasContabeis = await apiGet('/contas');
    updateTables();
    showAlert('Conta contábil excluída!', 'success');
  } catch (e) {
    console.error('Erro ao excluir conta:', e);
    showAlert('Erro ao excluir conta contábil.', 'danger');
  }
}

/***********************
 * MOVIMENTAÇÕES
 ***********************/
function openMovModal(contratoId) {
  document.getElementById('movContratoId').value = contratoId;
  document.getElementById('movTipo').value = 'saida';
  document.getElementById('movValor').value = '';
  document.getElementById('movData').value = new Date().toISOString().slice(0, 10);
  document.getElementById('movObs').value = '';
  
  // Carrega movimentações existentes
  loadMovimentacoes(contratoId);
  
  openModal('movModal');
}

async function loadMovimentacoes(contratoId) {
  try {
    const movimentos = await apiGet(`/contratos/${contratoId}/movimentos`);
    const tbody = document.getElementById('tbMov');
    if (!tbody) return;

    tbody.innerHTML = '';
    
    if (movimentos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:10px; color:var(--text-secondary)">Nenhuma movimentação encontrada</td></tr>';
      return;
    }

    movimentos.forEach(mov => {
      tbody.innerHTML += `
        <tr>
          <td>${mov.criadoEm ? new Date(mov.criadoEm).toLocaleDateString('pt-BR') : 'N/A'}</td>
          <td>${mov.tipo || 'N/A'}</td>
          <td>R$ ${toBRL(mov.valorDelta)}</td>
          <td>${mov.observacao || '-'}</td>
        </tr>`;
    });
  } catch (e) {
    console.error('Erro ao carregar movimentações:', e);
    const tbody = document.getElementById('tbMov');
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:10px; color:var(--danger-color)">Erro ao carregar movimentações</td></tr>';
    }
  }
}

/***********************
 * MANIPULADORES DE FORMULÁRIO
 ***********************/
async function handleContratoSubmit(e) {
  e.preventDefault();

  const ativo = document.getElementById('contratoAtivo').checked;
  const data = {
    numero: document.getElementById('numeroContrato').value,
    fornecedor: document.getElementById('fornecedor').value,
    centroCusto: parseInt(document.getElementById('centroCustoContrato').value) || null,
    contaContabil: parseInt(document.getElementById('contaContabil').value) || null,
    valorTotal: parseFloat(document.getElementById('valorTotal').value) || 0,
    saldoUtilizado: parseFloat(document.getElementById('saldoUtilizado').value) || 0,
    dataInicio: document.getElementById('dataInicio').value || null,
    dataVencimento: document.getElementById('dataVencimento').value || null,
    observacoes: document.getElementById('observacoes').value || null,
    ativo
  };

  try {
    if (editingId) {
      await apiSend(`/contratos/${editingId}`, 'PUT', data);
      showAlert('Contrato atualizado com sucesso!', 'success');
    } else {
      await apiSend('/contratos', 'POST', data);
      showAlert('Contrato criado com sucesso!', 'success');
    }

    // Recarrega dados
    const path = buildContratosQueryFromFilters();
    contratos = await apiGet(path);
    updateTables();
    updateStats();
    checkAlerts();
    closeModal('contratoModal');
  } catch (err) {
    console.error('Erro ao salvar contrato:', err);
    showAlert('Erro ao salvar contrato.', 'danger');
  }
}

async function handleCentroSubmit(e) {
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
    console.error('Erro ao salvar centro:', err);
    showAlert('Erro ao salvar centro de custo.', 'danger');
  }
}

async function handleContaSubmit(e) {
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
    console.error('Erro ao salvar conta:', err);
    showAlert('Erro ao salvar conta contábil.', 'danger');
  }
}

async function handleMovSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('movContratoId').value;
  const tipoTela = document.getElementById('movTipo').value;
  const payload = {
    tipo: (tipoTela === 'saida' ? 'PAGAMENTO' : 'AJUSTE'),
    observacao: document.getElementById('movObs').value || null,
    valorDelta: parseFloat(document.getElementById('movValor').value) || 0
  };

  try {
    await apiSend(`/contratos/${id}/movimentos`, 'POST', payload);
    
    // Recarrega dados
    const path = buildContratosQueryFromFilters();
    contratos = await apiGet(path);
    updateTables();
    updateStats();
    checkAlerts();
    
    // Recarrega as movimentações no modal
    await loadMovimentacoes(id);
    
    // Limpa o formulário
    document.getElementById('movValor').value = '';
    document.getElementById('movObs').value = '';
    
    showAlert('Movimentação lançada!', 'success');
  } catch (err) {
    console.error('Erro ao lançar movimentação:', err);
    showAlert('Erro ao lançar movimentação.', 'danger');
  }
}

/***********************
 * ALERTAS TEMPORÁRIOS
 ***********************/
function showAlert(message, type = 'success') {
  const container = document.getElementById('alerts');
  if (!container) return;

  const el = document.createElement('div');
  el.className = `alert alert-${type}`;
  el.setAttribute('data-temporary', 'true');
  el.textContent = message;
  
  container.appendChild(el);
  
  setTimeout(() => {
    if (el.parentNode) {
      el.remove();
    }
  }, 5000);
}

/***********************
 * EXPORTAR FUNÇÕES GLOBAIS
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
window.openMovModal = openMovModal;