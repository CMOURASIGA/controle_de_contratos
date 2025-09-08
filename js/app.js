/***********************
 * CONFIGURAÇÃO
 ***********************/
// Determine API base URL from global or build-time configuration
let API =
  (typeof window !== 'undefined' && window.API_BASE) ||
  (typeof process !== 'undefined' && process.env && process.env.API_BASE) ||
  'https://controledecontratos-production.up.railway.app';

// Estado em memÃ³ria
let contratos = [];
let centrosCusto = [];
let contasContabeis = [];
let editingId = null;
let chartStatus, chartEvolucao, chartFornecedores;

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

// Máscara e normalização para datas dd/mm/aaaa
function addDateMaskFor(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.setAttribute('inputmode', 'numeric');
  el.setAttribute('placeholder', 'dd/mm/aaaa');
  el.addEventListener('input', () => {
    let v = el.value.replace(/\D/g, '').slice(0, 8);
    if (v.length >= 5) v = v.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
    else if (v.length >= 3) v = v.replace(/(\d{2})(\d{1,2})/, '$1/$2');
    el.value = v;
  });
  el.addEventListener('blur', () => {
    if (typeof formatBRInput === 'function' && el.value.trim() === '') {
      // deixa vazio ao sair, sem auto-preencher
      return;
    }
  });
}

/***********************
 * INICIALIZAÇÃO
 ***********************/
document.addEventListener('DOMContentLoaded', async function () {
  try {
    await initializeData();
    setupEventListeners();
    // Preenche selects do contrato quando presentes (novo/editar)
    updateCentroCustoOptions();
    updateContaContabilOptions();
    // Define valores padrÃ£o de datas respeitando UTC-3 quando presentes
    if (typeof formatYMD === 'function') {
      const di = document.getElementById('dataInicio');
      const dv = document.getElementById('dataVencimento');
      if (di && !di.value) di.value = formatYMD(brNow());
      if (dv && !dv.value) dv.value = '';
    }
    
    // Atualiza alertas a cada 30s
    setInterval(checkAlerts, 30000);
  } catch (e) {
    console.error('Erro na inicialização:', e);
    showAlert('Erro ao carregar dados da API. Verifique a conexão.', 'danger');
  }
});

function updateAnexosPreview(e) {
  const input = e.target;
  if (!input) return;

  const previewId = 'anexosPreview';
  let preview = document.getElementById(previewId);

  if (!preview) {
    preview = document.createElement('ul');
    preview.id = previewId;
    preview.style.marginTop = '8px';
    input.insertAdjacentElement('afterend', preview);
  }

  preview.innerHTML = '';

  const files = Array.from(input.files || []);
  if (files.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'Nenhum arquivo selecionado';
    preview.appendChild(li);
    return;
  }

  files.forEach(file => {
    const li = document.createElement('li');
    const sizeKB = (file.size / 1024).toFixed(1);
    li.textContent = `${file.name} (${sizeKB} KB)`;
    preview.appendChild(li);
  });
}

async function loadDashboard() {
  try {
    updateDashboardMetrics();
    const data = await apiGet('/dashboard/metrics');

    // Status dos contratos
    const statusCtx = document.getElementById('chartStatus')?.getContext('2d');
    if (statusCtx) {
      chartStatus?.destroy();
      chartStatus = new Chart(statusCtx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(data.statusContratos || {}),
          datasets: [{
            data: Object.values(data.statusContratos || {}),
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#0ea5e9', '#c4933d']
          }]
        }
      });
    }

    // EvoluÃ§Ã£o de valores pagos
    const evoCtx = document.getElementById('chartEvolucao')?.getContext('2d');
    if (evoCtx) {
      chartEvolucao?.destroy();
      chartEvolucao = new Chart(evoCtx, {
        type: 'line',
        data: {
          labels: (data.evolucaoPagamentos || []).map(p => p.mes),
          datasets: [{
            label: 'Valores Pagos',
            data: (data.evolucaoPagamentos || []).map(p => p.valor),
            borderColor: '#4169e1',
            backgroundColor: 'rgba(65,105,225,0.1)',
            tension: 0.1
          }]
        }
      });
    }

    // Top fornecedores
    const topCtx = document.getElementById('chartFornecedores')?.getContext('2d');
    if (topCtx) {
      chartFornecedores?.destroy();
      chartFornecedores = new Chart(topCtx, {
        type: 'bar',
        data: {
          labels: (data.topFornecedores || []).map(f => f.fornecedor),
          datasets: [{
            label: 'Total Pago',
            data: (data.topFornecedores || []).map(f => f.total),
            backgroundColor: '#c4933d'
          }]
        },
        options: {
          plugins: { legend: { display: false } }
        }
      });
    }
  } catch (err) {
    console.error('Erro ao carregar dashboard:', err);
    showAlert('Erro ao carregar métricas do dashboard.', 'danger');
  }
}

function setupEventListeners() {
  // Filtros
  document.getElementById('btnAplicarFiltros')?.addEventListener('click', applyFilters);
  document.getElementById('btnLimparFiltros')?.addEventListener('click', clearFilters);
  document.getElementById('navNovoContrato')?.addEventListener('click', () => {
    window.location.href = 'novo-contrato.html';
  });

  // formulários
  document.getElementById('contratoForm')?.addEventListener('submit', handleContratoSubmit);
  document.getElementById('centroForm')?.addEventListener('submit', handleCentroSubmit);
  document.getElementById('contaForm')?.addEventListener('submit', handleContaSubmit);
  document.getElementById('movForm')?.addEventListener('submit', handleMovSubmit);
  
  // Dashboard
  document.getElementById('tabDashboard')?.addEventListener('click', loadDashboard);
  
  // Validação e pré-visualização de anexos
  document.getElementById('anexosContrato')?.addEventListener('change', updateAnexosPreview);
  document.querySelectorAll('#contratoForm input, #contratoForm select, #contratoForm textarea').forEach(el => {
    el.addEventListener('input', () => {
      el.classList.remove('invalid');
      const err = el.nextElementSibling;
      if (err && err.classList.contains('error')) err.textContent = '';
  });
  });
  // Ajuste visual de campos de data para formato BR
  ['dataInicio','dataVencimento','movData'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.setAttribute('placeholder','dd/mm/aaaa');
      if (typeof formatBRInput==='function' && !el.value) el.value = id==='movData' ? formatBRInput(brNow()) : el.value;
    }
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
  document.querySelectorAll('.nav-item').forEach(t => t.classList.remove('active'));
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
  if (modalId === 'contaModal') document.getElementById('contaModalTitle').textContent = 'Nova Conta contábil';
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
 * FILTROS + RELATÃ“RIO
 ***********************/
function buildContratosQueryFromFilters() {
  const params = new URLSearchParams();
  const fornecedor = document.getElementById('filtroFornecedor')?.value?.trim() || '';
  const numero = document.getElementById('filtroNumero')?.value?.trim() || '';
  const status = document.getElementById('filtroStatus')?.value || '';
  let vencimentoDe = document.getElementById('filtroVencimentoDe')?.value || '';
  let vencimentoAte = document.getElementById('filtroVencimentoAte')?.value || '';
  // Converte dd/mm/aaaa -> YYYY-MM-DD se necessário
  if (typeof parseBRToYMD === 'function') {
    const br = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (br.test(vencimentoDe)) vencimentoDe = parseBRToYMD(vencimentoDe);
    if (br.test(vencimentoAte)) vencimentoAte = parseBRToYMD(vencimentoAte);
  }

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
    a.download = `contratos_${formatISO(brNow()).slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    
    showAlert('Relatório baixado com sucesso!', 'success');
  } catch (e) {
    console.error('Erro ao gerar Relatório:', e);
    showAlert('Erro ao gerar Relatório.', 'danger');
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
    const diasVencimento = Math.ceil((toBRDate(contrato.dataVencimento) - brNow()) / (1000 * 60 * 60 * 24));

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
        <td>${contrato.dataVencimento ? formatBR(contrato.dataVencimento) : 'N/A'}</td>
        <td><span class="badge ${statusClass}">${statusText}</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn" onclick="viewAnexos(${contrato.id})">Visualizar</button>          
            <button class="btn" onclick="editContrato(${contrato.id})">Editar</button>
            <button class="btn danger" onclick="deleteContrato(${contrato.id})">Excluir</button>
            <button class="btn success" onclick="openMovModal(${contrato.id})">Movimentar</button>
          </div>
        </td>
      </tr>`;
  });
}

async function viewAnexos(id) {
  try {
    const anexos = await apiGet(`/contratos/${id}/arquivos`);
    const lista = document.getElementById('listaAnexosModal');
    if (!lista) return;

    lista.innerHTML = '';

    if (!anexos || anexos.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'Nenhum anexo encontrado';
      lista.appendChild(li);
    } else {
      anexos.forEach(arq => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = `${API}${arq.url}`;
        link.textContent = arq.nome_arquivo || 'Arquivo';
        link.target = '_blank';
        li.appendChild(link);
        lista.appendChild(li);
      });
    }

    openModal('anexosModal');
  } catch (err) {
    console.error('Erro ao carregar anexos:', err);
    showAlert('Erro ao carregar anexos.', 'danger');
  }
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
 * ESTATÃSTICAS & ALERTAS
 ***********************/
function updateDashboardMetrics() {
  const ativos = contratos.filter(c => c.ativo !== false);
  const totalContratos = ativos.length;
  const totalValor = ativos.reduce((sum, c) => sum + Number(c.valorTotal || 0), 0);
  const totalFornecedores = new Set(ativos.map(c => c.fornecedor)).size;

  const contratosEl = document.getElementById('dashContratos');
  if (contratosEl) contratosEl.textContent = totalContratos;

  const valorEl = document.getElementById('dashValor');
  if (valorEl) valorEl.textContent = `R$ ${toBRL(totalValor)}`;

  const fornecedoresEl = document.getElementById('dashFornecedores');
  if (fornecedoresEl) fornecedoresEl.textContent = totalFornecedores;
}
function updateStats() {
  // Skip if dashboard stat elements are not present on this page
  const elTotal = document.getElementById('totalContratos');
  const elAtivos = document.getElementById('contratosAtivos');
  const elVencendo = document.getElementById('contratosVencendo');
  const elEstouro = document.getElementById('contratosEstouro');
  if (!elTotal && !elAtivos && !elVencendo && !elEstouro) return;

  const totalContratos = contratos.length;
  const contratosAtivos = contratos.filter(c => c.ativo !== false && toBRDate(c.dataVencimento) > brNow()).length;
  const contratosVencendo = contratos.filter(c => {
    if (c.ativo === false) return false;
    const dias = Math.ceil((toBRDate(c.dataVencimento) - brNow()) / (1000 * 60 * 60 * 24));
    return dias <= 30 && dias > 0;
  }).length;
  const contratosEstouro = contratos.filter(c => {
    if (!c.valorTotal) return false;
    return (Number(c.saldoUtilizado) / Number(c.valorTotal)) * 100 > 100;
  }).length;

  if (elTotal) elTotal.textContent = totalContratos;
  if (elAtivos) elAtivos.textContent = contratosAtivos;
  if (elVencendo) elVencendo.textContent = contratosVencendo;
  if (elEstouro) elEstouro.textContent = contratosEstouro;
}

function checkAlerts() {
  const div = document.getElementById('alerts');
  if (!div) return;

  // Limpa alertas existentes (mas mantém os temporários)
  div.querySelectorAll('.alert:not([data-temporary])').forEach(el => el.remove());

  const vencendo = contratos.filter(c => {
    if (c.ativo === false) return false;
    const dias = Math.ceil((toBRDate(c.dataVencimento) - brNow()) / (1000 * 60 * 60 * 24));
    return dias <= 30 && dias > 0;
  });

  if (vencendo.length) {
    const el = document.createElement('div');
    el.className = 'alert alert-warning';
    el.innerHTML = `<strong>⚠️ Atenção!</strong> ${vencendo.length} contrato(s) vencendo nos próximos 30 dias:
      ${vencendo.map(c => {
        const dias = Math.ceil((toBRDate(c.dataVencimento) - brNow()) / (1000 * 60 * 60 * 24));
        return `<br>â€¢ ${c.numero || 'S/N'} - ${c.fornecedor || 'N/A'} (vence em ${dias} dias)`;
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
        return `<br>â€¢ ${c.numero || 'S/N'} - ${c.fornecedor || 'N/A'} (${pct}% utilizado)`;
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
        return `<br>â€¢ ${c.numero || 'S/N'} - ${c.fornecedor || 'N/A'} (${pct}% utilizado)`;
      }).join('')}`;
    div.appendChild(el);
  }
}

/***********************
 * CRUD CONTRATOS
 ***********************/
async function updateListaAnexos(contratoId) {
  const ul = document.getElementById('listaAnexosContrato');
  if (!ul) return;

  ul.innerHTML = '<li>Carregando...</li>';

  try {
    const anexos = await apiGet(`/contratos/${contratoId}/arquivos`);
    ul.innerHTML = '';

    if (!anexos.length) {
      const li = document.createElement('li');
      li.textContent = 'Nenhum anexo';
      ul.appendChild(li);
      return;
    }

    anexos.forEach(a => {
      const li = document.createElement('li');

      const link = document.createElement('a');
      link.href = `${API}${a.url}`;
      link.textContent = a.nome_arquivo || 'arquivo';
      link.target = '_blank';
      li.appendChild(link);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn ghost';
      btn.style.marginLeft = '8px';
      btn.textContent = 'Remover';
      btn.onclick = () => removeAnexo(contratoId, a.id);
      li.appendChild(btn);

      ul.appendChild(li);
    });
  } catch (err) {
    console.error('Erro ao carregar anexos:', err);
    ul.innerHTML = '<li>Erro ao carregar anexos</li>';
  }
}

async function editContrato(id) {
  const c = contratos.find(x => x.id === id);
  if (!c) return;

  editingId = id;
  const titleEl = document.getElementById('contratoModalTitle');
  if (titleEl) titleEl.textContent = 'Editar Contrato';
  updateCentroCustoOptions();
  updateContaContabilOptions();
  openModal('contratoModal');

  const get = id => document.getElementById(id);
  get('numeroContrato') && (get('numeroContrato').value = c.numero || '');
  get('fornecedor') && (get('fornecedor').value = c.fornecedor || '');
  get('centroCustoContrato') && (get('centroCustoContrato').value = c.centroCusto || '');
  get('contaContabil') && (get('contaContabil').value = c.contaContabil || '');
  get('valorTotal') && (get('valorTotal').value = Number(c.valorTotal) || 0);
  get('saldoUtilizado') && (get('saldoUtilizado').value = Number(c.saldoUtilizado) || 0);
  if (typeof formatBRInput === 'function') { get('dataInicio') && (get('dataInicio').value = c.dataInicio ? formatBRInput(c.dataInicio) : ''); get('dataVencimento') && (get('dataVencimento').value = c.dataVencimento ? formatBRInput(c.dataVencimento) : ''); } else {
    get('dataInicio') && (get('dataInicio').value = c.dataInicio?.slice(0, 10) || '');
    get('dataVencimento') && (get('dataVencimento').value = c.dataVencimento?.slice(0, 10) || '');
  }
  get('observacoes') && (get('observacoes').value = c.observacoes || '');
  get('contratoAtivo') && (get('contratoAtivo').checked = c.ativo !== false);

  await updateListaAnexos(id);
}

async function removeAnexo(contratoId, arquivoId) {
  if (!confirm('Remover este anexo?')) return;
  try {
    await apiSend(`/contratos/${contratoId}/arquivos/${arquivoId}`, 'DELETE');
    showAlert('Anexo removido!', 'success');
    await updateListaAnexos(contratoId);
  } catch (err) {
    console.error('Erro ao remover anexo:', err);
    showAlert('Erro ao remover anexo.', 'danger');
  }
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
  document.getElementById('contaModalTitle').textContent = 'Editar Conta contábil';
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
 * MOVIMENTAÃ‡Ã•ES
 ***********************/
function openMovModal(contratoId) {
  document.getElementById('movContratoId').value = contratoId;
  document.getElementById('movTipo').value = 'saida';
  document.getElementById('movValor').value = '';
  if (typeof formatBRInput === 'function') {
    document.getElementById('movData').value = formatBRInput(brNow());
    document.getElementById('movData').setAttribute('placeholder','dd/mm/aaaa');
  } else {
    document.getElementById('movData').value = formatISO(brNow()).slice(0, 10);
  }
  document.getElementById('movObs').value = '';
  
  
  const contrato = contratos.find(c => c.id === Number(contratoId));
  const infoEl = document.getElementById('movModalInfo');
  if (infoEl) {
    infoEl.textContent = contrato ? `${contrato.numero || 'S/N'} - ${contrato.fornecedor || 'N/A'}` : '';
  }
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

    movimentos
      .sort((a, b) => toBRDate(b.criadoEm || b.data) - toBRDate(a.criadoEm || a.data))
      .forEach(mov => {
        const classe = mov.tipo === 'saida' || mov.valorDelta < 0 ? 'saida' : 'entrada';
        tbody.innerHTML += `
        <tr class="${classe}">
          <td>${mov.criadoEm ? formatBR(mov.criadoEm) : 'N/A'}</td>
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
 * MANIPULADORES DE FORMULÃRIO
 ***********************/
function validateContratoForm() {
  let valid = true;
  const fields = [
    { id: 'numeroContrato', msg: 'Informe o número do contrato.' },
    { id: 'fornecedor', msg: 'Informe o fornecedor.' },
    { id: 'centroCustoContrato', msg: 'Selecione o centro de custo.' },
    { id: 'contaContabil', msg: 'Selecione a conta contábil.' },
    { id: 'valorTotal', msg: 'Informe o valor total.' },
    { id: 'dataInicio', msg: 'Informe a data de início.' },
    { id: 'dataVencimento', msg: 'Informe a data de vencimento.' }
  ];

  fields.forEach(f => {
    const el = document.getElementById(f.id);
    if (!el) return;
    const err = el.nextElementSibling;
    if (err && err.classList.contains('error')) err.textContent = '';
    el.classList.remove('invalid');

    const value = (el.value || '').trim();
    if (!value) {
      el.classList.add('invalid');
      if (err && err.classList.contains('error')) err.textContent = f.msg;
      valid = false;
    }
  });

  return valid;
}
async function handleContratoSubmit(e) {
  e.preventDefault();

  if (!validateContratoForm()) {
    showAlert('Preencha os campos obrigatórios.', 'danger');
    return;
  }

  const ativo = document.getElementById('contratoAtivo').checked;
  const data = {
    numero: document.getElementById('numeroContrato').value,
    fornecedor: document.getElementById('fornecedor').value,
    centroCusto: parseInt(document.getElementById('centroCustoContrato').value) || null,
    contaContabil: parseInt(document.getElementById('contaContabil').value) || null,
    valorTotal: parseFloat(document.getElementById('valorTotal').value) || 0,
    saldoUtilizado: parseFloat(document.getElementById('saldoUtilizado').value) || 0,
    dataInicio: (typeof parseBRToYMD==='function') ? parseBRToYMD(document.getElementById('dataInicio').value) : (document.getElementById('dataInicio').value || null),
    dataVencimento: (typeof parseBRToYMD==='function') ? parseBRToYMD(document.getElementById('dataVencimento').value) : (document.getElementById('dataVencimento').value || null),
    observacoes: document.getElementById('observacoes').value || null,
    ativo
  };

  try {
    let id;
    if (editingId) {
      await apiSend(`/contratos/${editingId}`, 'PUT', data);
      id = editingId;      
      showAlert('Contrato atualizado com sucesso!', 'success');
    } else {
      const created = await apiSend('/contratos', 'POST', data);
      id = created?.id;
      showAlert('Contrato criado com sucesso!', 'success');
    }

    const files = document.getElementById('anexosContrato').files;
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      await apiSendForm(`/contratos/${id}/anexos`, formData);
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
    console.error('Erro ao lançar Movimentação:', err);
    showAlert('Erro ao lançar Movimentação.', 'danger');
  }
}

/***********************
 * ALERTAS TEMPORÃRIOS
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
 * EXPORTAR FUNÃ‡Ã•ES GLOBAIS
 ***********************/
window.showTab = showTab;
window.openModal = openModal;
window.closeModal = closeModal;
window.editContrato = editContrato;
window.deleteContrato = deleteContrato;
window.removeAnexo = removeAnexo;
window.editCentro = editCentro;
window.deleteCentro = deleteCentro;
window.editConta = editConta;
window.deleteConta = deleteConta;
window.openMovModal = openMovModal;
window.viewAnexos = viewAnexos;

