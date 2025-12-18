/***********************
 * CONFIGURACAO / STORAGE LOCAL
 ***********************/
let API = 'local-storage';

const LOCAL_DB_KEY = 'cnc_local_db_v1';
const LOCAL_DB_SNAPSHOT = {
  centros: [
    { id: 1, codigo: 'ADM', nome: 'Administrativo', responsavel: 'Ana Lima', email: 'ana@empresa.com' },
    { id: 2, codigo: 'TI', nome: 'Tecnologia', responsavel: 'Carlos Souza', email: 'carlos@empresa.com' }
  ],
  contas: [
    { id: 1, codigo: '6.1.01', descricao: 'Servicos de terceiros', tipo: 'Despesa' },
    { id: 2, codigo: '6.2.13', descricao: 'Softwares e licencas', tipo: 'Investimento' }
  ],
  contratos: [
    {
      id: 1,
      numero: 'CT-1001',
      fornecedor: 'Alfa Telecom',
      centroCusto: 1,
      contaContabil: 1,
      valorTotal: 120000,
      saldoUtilizado: 30000,
      dataInicio: '2025-01-01',
      dataVencimento: '2025-12-31',
      observacoes: 'Contrato demonstrativo salvo em localStorage. Os dados sao locais para cada navegador.',
      ativo: true,
      movimentos: [
        { id: 1, contrato_id: 1, tipo: 'PAGAMENTO', observacao: 'Parcela Janeiro', valorDelta: 15000, criadoEm: '2025-01-10T12:00:00Z' },
        { id: 2, contrato_id: 1, tipo: 'PAGAMENTO', observacao: 'Parcela Fevereiro', valorDelta: 15000, criadoEm: '2025-02-10T12:00:00Z' }
      ],
      anexos: []
    }
  ],
  seq: { centros: 3, contas: 3, contratos: 2, movimentos: 3, anexos: 1 }
};

let localDB = loadLocalDB();

// Estado em memoria
let contratos = [];
let centrosCusto = [];
let contasContabeis = [];
let centrosCustoAll = [];
let contasContabeisAll = [];
let editingId = null;
let chartStatus, chartEvolucao, chartFornecedores;

window.setEditingId = function (id) {
  editingId = id == null ? null : Number(id);
};
window.getEditingId = function () {
  return editingId;
};

/***********************
 * UTIL - STORAGE LOCAL
 ***********************/
function loadLocalDB() {
  if (typeof localStorage === 'undefined') {
    return JSON.parse(JSON.stringify(LOCAL_DB_SNAPSHOT));
  }
  try {
    const raw = localStorage.getItem(LOCAL_DB_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(LOCAL_DB_SNAPSHOT));
      return JSON.parse(JSON.stringify(LOCAL_DB_SNAPSHOT));
    }
    const parsed = JSON.parse(raw);
    if (!parsed.seq) parsed.seq = { centros: 1, contas: 1, contratos: 1, movimentos: 1, anexos: 1 };
    return parsed;
  } catch (err) {
    console.warn('Falha ao ler localStorage, recriando base local:', err);
    return JSON.parse(JSON.stringify(LOCAL_DB_SNAPSHOT));
  }
}

function persistLocalDB() {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(localDB));
  } catch (err) {
    console.warn('Nao foi possivel salvar no localStorage:', err);
  }
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function nextId(key) {
  if (!localDB.seq) localDB.seq = {};
  const current = Number(localDB.seq[key] || 1);
  localDB.seq[key] = current + 1;
  return current;
}

function parseRequest(path) {
  const url = new URL(path, 'https://local.api');
  return {
    segments: url.pathname.split('/').filter(Boolean),
    search: url.searchParams
  };
}

function computeContractStatus(contrato) {
  if (contrato.ativo === false) return 'INATIVO';
  if (!contrato.dataVencimento) return 'ATIVO';
  const hoje = new Date();
  const fim = new Date(contrato.dataVencimento);
  if (fim < hoje) return 'VENCIDO';
  const diff = (fim - hoje) / (1000 * 60 * 60 * 24);
  if (diff <= 30) return 'VENCE_EM_30_DIAS';
  return 'ATIVO';
}

function serializeContrato(contrato) {
  return {
    id: contrato.id,
    numero: contrato.numero,
    fornecedor: contrato.fornecedor,
    centroCusto: contrato.centroCusto,
    contaContabil: contrato.contaContabil,
    valorTotal: contrato.valorTotal,
    saldoUtilizado: contrato.saldoUtilizado,
    dataInicio: contrato.dataInicio,
    dataVencimento: contrato.dataVencimento,
    observacoes: contrato.observacoes,
    ativo: contrato.ativo !== false,
    status: computeContractStatus(contrato)
  };
}

function filterContratos(search) {
  const entries = localDB.contratos.slice().sort((a, b) => b.id - a.id);
  return entries
    .filter(c => {
      const status = computeContractStatus(c);
      const ativoParam = search.get('ativo');
      if (ativoParam !== null) {
        const bool = ativoParam === 'true';
        if ((c.ativo !== false) !== bool) return false;
      }
      const statusParam = search.get('status');
      if (statusParam && status !== statusParam) return false;
      const centroParam = search.get('centro');
      if (centroParam && Number(c.centroCusto) !== Number(centroParam)) return false;
      const contaParam = search.get('conta');
      if (contaParam && Number(c.contaContabil) !== Number(contaParam)) return false;
      const fornecedor = search.get('fornecedor');
      if (fornecedor && !(c.fornecedor || '').toLowerCase().includes(fornecedor.toLowerCase())) return false;
      const q = search.get('q');
      if (q) {
        const haystack = [c.numero || '', c.observacoes || '', c.fornecedor || ''].join(' ').toLowerCase();
        if (!haystack.includes(q.toLowerCase())) return false;
      }
      const vencimentoDe = search.get('vencimentoDe');
      if (vencimentoDe && c.dataVencimento && new Date(c.dataVencimento) < new Date(vencimentoDe)) return false;
      const vencimentoAte = search.get('vencimentoAte');
      if (vencimentoAte && c.dataVencimento && new Date(c.dataVencimento) > new Date(vencimentoAte)) return false;
      return true;
    })
    .map(serializeContrato);
}

function buildDashboardMetrics() {
  const statusContratos = {};
  localDB.contratos.forEach(c => {
    const st = computeContractStatus(c);
    statusContratos[st] = (statusContratos[st] || 0) + 1;
  });

  const evolucao = {};
  localDB.contratos.forEach(c => {
    (c.movimentos || []).forEach(m => {
      if (m.tipo !== 'PAGAMENTO') return;
      const mes = (m.criadoEm || '').slice(0, 7) || new Date().toISOString().slice(0, 7);
      evolucao[mes] = (evolucao[mes] || 0) + Number(m.valorDelta || 0);
    });
  });

  const topFornecedores = {};
  localDB.contratos.forEach(c => {
    const nome = c.fornecedor || 'Fornecedor';
    topFornecedores[nome] = (topFornecedores[nome] || 0) + Number(c.valorTotal || 0);
  });

  return {
    statusContratos,
    evolucaoPagamentos: Object.keys(evolucao)
      .sort()
      .map(mes => ({ mes, valor: Number(evolucao[mes] || 0) })),
    topFornecedores: Object.entries(topFornecedores).map(([fornecedor, total]) => ({ fornecedor, total: Number(total || 0) }))
  };
}

function getContratoById(id) {
  const contrato = localDB.contratos.find(c => c.id === id);
  if (!contrato) throw new Error('Contrato nao encontrado');
  return contrato;
}

async function dispatchLocal(method, path, payload = {}) {
  const { segments, search } = parseRequest(path);
  method = String(method || 'GET').toUpperCase();

  const normalizeContratoPayload = body => ({
    numero: body.numero || '',
    fornecedor: body.fornecedor || '',
    centroCusto: body.centroCusto || null,
    contaContabil: body.contaContabil || null,
    valorTotal: Number(body.valorTotal || 0),
    saldoUtilizado: Number(body.saldoUtilizado || 0),
    dataInicio: body.dataInicio || null,
    dataVencimento: body.dataVencimento || null,
    observacoes: body.observacoes || null,
    ativo: body.ativo !== false
  });

  const sortClone = arr => clone(arr.slice().sort((a, b) => b.id - a.id));

  switch (method) {
    case 'GET': {
      if (segments[0] === 'dashboard' && segments[1] === 'metrics') {
        return buildDashboardMetrics();
      }
      if (segments[0] === 'centros') {
        return sortClone(localDB.centros);
      }
      if (segments[0] === 'contas') {
        return sortClone(localDB.contas);
      }
      if (segments[0] === 'contratos') {
        if (segments.length === 1) return filterContratos(search);
        const contratoId = Number(segments[1]);
        if (segments.length === 2) return clone(serializeContrato(getContratoById(contratoId)));
        if (segments[2] === 'arquivos') {
          const contrato = getContratoById(contratoId);
          return clone((contrato.anexos || []).map(a => ({
            id: a.id,
            contrato_id: contratoId,
            nome_arquivo: a.nome_arquivo || a.nome || 'arquivo',
            url: a.url || a.dataUrl,
            criado_em: a.criado_em || a.criadoEm
          })));
        }
        if (segments[2] === 'movimentos') {
          const contrato = getContratoById(contratoId);
          return clone((contrato.movimentos || []).slice().sort((a, b) => b.id - a.id));
        }
      }
      throw new Error(`GET ${path} nao suportado no modo local.`);
    }
    case 'POST': {
      if (segments[0] === 'centros') {
        const item = { id: nextId('centros'), ...payload };
        localDB.centros.push(item);
        persistLocalDB();
        return clone(item);
      }
      if (segments[0] === 'contas') {
        const conta = { id: nextId('contas'), ...payload };
        localDB.contas.push(conta);
        persistLocalDB();
        return clone(conta);
      }
      if (segments[0] === 'contratos' && segments.length === 1) {
        const contrato = {
          id: nextId('contratos'),
          ...normalizeContratoPayload(payload),
          movimentos: [],
          anexos: [],
          criadoEm: new Date().toISOString()
        };
        localDB.contratos.push(contrato);
        persistLocalDB();
        return { id: contrato.id };
      }
      if (segments[0] === 'contratos' && segments[2] === 'movimentos') {
        const contrato = getContratoById(Number(segments[1]));
        const movimento = {
          id: nextId('movimentos'),
          contrato_id: contrato.id,
          tipo: payload.tipo || 'AJUSTE',
          observacao: payload.observacao || null,
          valorDelta: Number(payload.valorDelta || 0),
          criadoEm: new Date().toISOString()
        };
        contrato.movimentos = contrato.movimentos || [];
        contrato.movimentos.unshift(movimento);
        if (movimento.valorDelta) {
          contrato.saldoUtilizado = Number(contrato.saldoUtilizado || 0) + movimento.valorDelta;
        }
        persistLocalDB();
        return { ok: true, id: movimento.id };
      }
      break;
    }
    case 'PUT': {
      if (segments[0] === 'centros') {
        const id = Number(segments[1]);
        const idx = localDB.centros.findIndex(c => c.id === id);
        if (idx >= 0) {
          localDB.centros[idx] = { ...localDB.centros[idx], ...payload };
          persistLocalDB();
          return clone(localDB.centros[idx]);
        }
        throw new Error('Centro nao encontrado');
      }
      if (segments[0] === 'contas') {
        const id = Number(segments[1]);
        const idx = localDB.contas.findIndex(c => c.id === id);
        if (idx >= 0) {
          localDB.contas[idx] = { ...localDB.contas[idx], ...payload };
          persistLocalDB();
          return clone(localDB.contas[idx]);
        }
        throw new Error('Conta nao encontrada');
      }
      if (segments[0] === 'contratos' && segments.length === 2) {
        const contrato = getContratoById(Number(segments[1]));
        Object.assign(contrato, normalizeContratoPayload(payload));
        persistLocalDB();
        return clone(serializeContrato(contrato));
      }
      break;
    }
    case 'DELETE': {
      if (segments[0] === 'centros') {
        const id = Number(segments[1]);
        localDB.centros = localDB.centros.filter(c => c.id !== id);
        localDB.contratos.forEach(c => {
          if (c.centroCusto === id) c.centroCusto = null;
        });
        persistLocalDB();
        return { ok: true };
      }
      if (segments[0] === 'contas') {
        const id = Number(segments[1]);
        localDB.contas = localDB.contas.filter(c => c.id !== id);
        localDB.contratos.forEach(c => {
          if (c.contaContabil === id) c.contaContabil = null;
        });
        persistLocalDB();
        return { ok: true };
      }
      if (segments[0] === 'contratos' && segments.length === 2) {
        const id = Number(segments[1]);
        localDB.contratos = localDB.contratos.filter(c => c.id !== id);
        persistLocalDB();
        return { ok: true };
      }
      if (segments[0] === 'contratos' && segments[2] === 'arquivos') {
        const contrato = getContratoById(Number(segments[1]));
        const arquivoId = Number(segments[3]);
        contrato.anexos = (contrato.anexos || []).filter(a => a.id !== arquivoId);
        persistLocalDB();
        return { ok: true };
      }
      break;
    }
    case 'UPLOAD': {
      if (segments[0] === 'contratos' && segments[2] === 'anexos') {
        const contrato = getContratoById(Number(segments[1]));
        contrato.anexos = contrato.anexos || [];
        (payload.files || []).forEach(file => {
          if (!file || !file.dataUrl) return;
          contrato.anexos.unshift({
            id: nextId('anexos'),
            contrato_id: contrato.id,
            nome_arquivo: file.name || 'arquivo',
            mime: file.type || 'application/octet-stream',
            url: file.dataUrl,
            criado_em: new Date().toISOString()
          });
        });
        persistLocalDB();
        return { ok: true };
      }
      break;
    }
    default:
      throw new Error(`Metodo ${method} nao suportado`);
  }

  throw new Error(`${method} ${path} nao suportado no modo local.`);
}

async function apiGet(path) {
  return dispatchLocal('GET', path);
}

async function apiSend(path, method, body) {
  return dispatchLocal(method, path, body || {});
}

async function apiSendForm(path, formData) {
  const files = [];
  if (formData && typeof formData.forEach === 'function') {
    const promises = [];
    formData.forEach(value => {
      if (typeof File !== 'undefined' && value instanceof File) {
        promises.push(new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({
            name: value.name,
            type: value.type || 'application/octet-stream',
            size: value.size || 0,
            dataUrl: reader.result
          });
          reader.onerror = reject;
          reader.readAsDataURL(value);
        }));
      }
    });
    const uploads = await Promise.all(promises);
    return dispatchLocal('UPLOAD', path, { files: uploads });
  }
  return dispatchLocal('UPLOAD', path, { files: [] });
}

/***********************
 * UTIL
 **************************************/
function toBRL(n) {
  return Number(n || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

// Mascara e normalizacao para datas dd/mm/aaaa
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
 * INICIALIZACAO
 ***********************/
document.addEventListener('DOMContentLoaded', async function () {
  try {
    window.__CNC_INIT = window.__CNC_INIT || initializeData();
    await window.__CNC_INIT;
    setupEventListeners();
    // Preenche selects do contrato quando presentes (novo/editar)
    updateCentroCustoOptions();
    updateContaContabilOptions();
    // Define valores padrao de datas respeitando UTC-3 quando presentes
    if (typeof formatYMD === 'function') {
      const di = document.getElementById('dataInicio');
      const dv = document.getElementById('dataVencimento');
      if (di && !di.value) di.value = formatYMD(brNow());
      if (dv && !dv.value) dv.value = '';
    }
    
    // Atualiza alertas a cada 30s
    setInterval(checkAlerts, 30000);
  } catch (e) {
    console.error('Erro na inicializacao:', e);
    showAlert('Erro ao carregar dados da API. Verifique a conexao.', 'danger');
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

    // Evoluaao de valores pagos
    const evoCtx = document.getElementById('chartEvolucao')?.getContext('2d');
    if (evoCtx) {
      chartEvolucao.destroy();
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
    showAlert('Erro ao carregar metricas do dashboard.', 'danger');
  }
}

function setupEventListeners() {
  // Filtros
  document.getElementById('btnAplicarFiltros')?.addEventListener('click', applyFilters);
  document.getElementById('btnLimparFiltros')?.addEventListener('click', clearFilters);
  document.getElementById('btnBaixar')?.addEventListener('click', baixarRelatorio);
  document.getElementById('btnBaixarTop')?.addEventListener('click', baixarRelatorio);
  document.getElementById('navNovoContrato')?.addEventListener('click', () => {
    window.location.href = 'novo-contrato.html';
  });

  document.getElementById('btnBuscarCentros')?.addEventListener('click', applyCentrosFilters);
  document.getElementById('btnLimparCentros')?.addEventListener('click', clearCentrosFilters);
  document.getElementById('btnBuscarContas')?.addEventListener('click', applyContasFilters);
  document.getElementById('btnLimparContas')?.addEventListener('click', clearContasFilters);

  // formularios
  document.getElementById('contratoForm')?.addEventListener('submit', handleContratoSubmit);
  document.getElementById('centroForm')?.addEventListener('submit', handleCentroSubmit);
  document.getElementById('contaForm')?.addEventListener('submit', handleContaSubmit);
  document.getElementById('movForm')?.addEventListener('submit', handleMovSubmit);
  
  // Dashboard
  document.getElementById('tabDashboard')?.addEventListener('click', loadDashboard);
  
  // Validacao e pre-visualizacao de anexos
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

  // Auto-abrir modais via query string (para atalhos estilo "Criar ...")
  try {
    const params = new URLSearchParams(window.location.search);
    const novo = params.get('novo');
    if (novo === 'centro') openModal('centroModal');
    if (novo === 'conta') openModal('contaModal');
  } catch (e) {
    // ignore
  }
}

async function initializeData() {
  try {
    console.log('Inicializando dados...');
    
    // Primeiro, tenta carregar os dados basicos
    centrosCusto = await apiGet('/centros').catch(err => {
      console.error('Erro ao carregar centros:', err);
      showAlert('Nao foi possivel carregar Centros de Custo.', 'warning');
      return [];
    });

    contasContabeis = await apiGet('/contas').catch(err => {
      console.error('Erro ao carregar contas:', err);
      showAlert('Nao foi possivel carregar Contas Contabeis.', 'warning');
      return [];
    });

    contratos = await apiGet('/contratos').catch(err => {
      console.error('Erro ao carregar contratos:', err);
      showAlert('Nao foi possivel carregar Contratos.', 'warning');
      return [];
    });

    console.log('Dados carregados:', { contratos: contratos.length, centros: centrosCusto.length, contas: contasContabeis.length });

    centrosCustoAll = clone(centrosCusto || []);
    contasContabeisAll = clone(contasContabeis || []);

    updateTables();
    updateStats();
    checkAlerts();

  } catch (err) {
    console.error('Falha inesperada ao inicializar dados:', err);
    showAlert('Erro ao carregar dados da API. Verifique a conexao.', 'danger');
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
  if (modalId === 'contaModal') document.getElementById('contaModalTitle').textContent = 'Nova Conta contabil';
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
  select.innerHTML = '<option value="">Selecione uma conta contabil</option>';
  contasContabeis.forEach(conta => {
    const opt = document.createElement('option');
    opt.value = conta.id;
    opt.textContent = `${conta.codigo} - ${conta.descricao}`;
    select.appendChild(opt);
  });
}

/***********************
 * FILTROS + RELATA"RIO
 ***********************/
function buildContratosQueryFromFilters() {
  const params = new URLSearchParams();
  const fornecedor = document.getElementById('filtroFornecedor')?.value.trim() || '';
  const numero = document.getElementById('filtroNumero')?.value.trim() || '';
  const status = document.getElementById('filtroStatus')?.value || '';
  let vencimentoDe = document.getElementById('filtroVencimentoDe')?.value || '';
  let vencimentoAte = document.getElementById('filtroVencimentoAte')?.value || '';
  // Converte dd/mm/aaaa -> YYYY-MM-DD se necessario
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
    const fornecedor = document.getElementById('filtroFornecedor');
    const numero = document.getElementById('filtroNumero');
    const status = document.getElementById('filtroStatus');
    const vencimentoDe = document.getElementById('filtroVencimentoDe');
    const vencimentoAte = document.getElementById('filtroVencimentoAte');

    if (fornecedor) fornecedor.value = '';
    if (numero) numero.value = '';
    if (status) status.value = '';
    if (vencimentoDe) vencimentoDe.value = '';
    if (vencimentoAte) vencimentoAte.value = '';
    
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

/***********************
 * FILTROS - CENTROS
 ***********************/
function applyCentrosFilters() {
  const codigo = (document.getElementById('filtroCentroCodigo')?.value || '').trim().toLowerCase();
  const nome = (document.getElementById('filtroCentroNome')?.value || '').trim().toLowerCase();
  const responsavel = (document.getElementById('filtroCentroResponsavel')?.value || '').trim().toLowerCase();

  const base = Array.isArray(centrosCustoAll) && centrosCustoAll.length ? centrosCustoAll : centrosCusto;
  centrosCusto = (base || []).filter(c => {
    const cCodigo = String(c.codigo || '').toLowerCase();
    const cNome = String(c.nome || '').toLowerCase();
    const cResp = String(c.responsavel || '').toLowerCase();
    return (!codigo || cCodigo.includes(codigo)) && (!nome || cNome.includes(nome)) && (!responsavel || cResp.includes(responsavel));
  });

  updateCentrosTable();
}

function clearCentrosFilters() {
  const codigo = document.getElementById('filtroCentroCodigo');
  const nome = document.getElementById('filtroCentroNome');
  const responsavel = document.getElementById('filtroCentroResponsavel');
  if (codigo) codigo.value = '';
  if (nome) nome.value = '';
  if (responsavel) responsavel.value = '';

  centrosCusto = clone(centrosCustoAll || []);
  updateCentrosTable();
}

/***********************
 * FILTROS - CONTAS
 ***********************/
function applyContasFilters() {
  const codigo = (document.getElementById('filtroContaCodigo')?.value || '').trim().toLowerCase();
  const descricao = (document.getElementById('filtroContaDescricao')?.value || '').trim().toLowerCase();
  const tipo = (document.getElementById('filtroContaTipo')?.value || '').trim().toLowerCase();

  const base = Array.isArray(contasContabeisAll) && contasContabeisAll.length ? contasContabeisAll : contasContabeis;
  contasContabeis = (base || []).filter(c => {
    const cCodigo = String(c.codigo || '').toLowerCase();
    const cDesc = String(c.descricao || '').toLowerCase();
    const cTipo = String(c.tipo || '').toLowerCase();
    return (!codigo || cCodigo.includes(codigo)) && (!descricao || cDesc.includes(descricao)) && (!tipo || cTipo === tipo);
  });

  updateContasTable();
}

function clearContasFilters() {
  const codigo = document.getElementById('filtroContaCodigo');
  const descricao = document.getElementById('filtroContaDescricao');
  const tipo = document.getElementById('filtroContaTipo');
  if (codigo) codigo.value = '';
  if (descricao) descricao.value = '';
  if (tipo) tipo.value = '';

  contasContabeis = clone(contasContabeisAll || []);
  updateContasTable();
}

async function baixarRelatorio() {
  try {
    const path = buildContratosQueryFromFilters();
    const filtered = await apiGet(path);
    const csv = buildContratosCSV(filtered || []);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `contratos_${formatISO(brNow()).slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    showAlert('Relatorio baixado com sucesso!', 'success');
  } catch (e) {
    console.error('Erro ao gerar Relatorio:', e);
    showAlert('Erro ao gerar Relatorio.', 'danger');
  }
}

function buildContratosCSV(data) {
  const head = ['id','numero','fornecedor','valor_total','saldo_utilizado','data_inicio','data_fim','ativo'];
  const rows = (data || []).map(c => [
    c.id,
    c.numero ?? '',
    c.fornecedor ?? '',
    String(c.valorTotal ?? '').replace('.', ','),
    String(c.saldoUtilizado ?? '').replace('.', ','),
    c.dataInicio ?? '',
    c.dataVencimento ?? '',
    c.ativo !== false ? 'SIM' : 'NAO'
  ]);
  return [head.join(';'), ...rows.map(r => r.join(';'))].join('\n');
}

/***********************
 * UX - METADADOS / EMPTY STATE
 ***********************/
function setListViewState(opts) {
  const countEl = opts.countId ? document.getElementById(opts.countId) : null;
  const emptyEl = opts.emptyId ? document.getElementById(opts.emptyId) : null;
  const tableWrap = opts.tableWrapId ? document.getElementById(opts.tableWrapId) : null;
  const cardsWrap = opts.cardsWrapId ? document.getElementById(opts.cardsWrapId) : null;

  if (countEl) countEl.textContent = String(opts.count || 0);
  if (emptyEl) emptyEl.style.display = opts.count === 0 ? 'flex' : 'none';
  if (tableWrap) tableWrap.style.display = opts.count === 0 ? 'none' : 'block';
  if (cardsWrap) cardsWrap.style.display = opts.count === 0 ? 'none' : 'block';
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
  const cardsContainer = document.getElementById('contratosCards');
  const tbody = document.querySelector('#contratosTable tbody');
  if (!cardsContainer && !tbody) return;
  if (tbody) tbody.innerHTML = '';
  if (cardsContainer) cardsContainer.innerHTML = '';

  setListViewState({
    countId: 'contratosCount',
    emptyId: 'contratosEmpty',
    tableWrapId: 'contratosTableWrap',
    cardsWrapId: 'contratosCardsWrap',
    count: contratos.length
  });

  if (contratos.length === 0) {
    return;
  }

  if (cardsContainer) {
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

      const fornecedor = contrato.fornecedor || 'N/A';
      const numero = contrato.numero || 'S/N';
      const vencimento = contrato.dataVencimento ? formatBR(contrato.dataVencimento) : 'N/A';
      const valorTotal = `R$ ${toBRL(contrato.valorTotal)}`;
      const saldoUtilizado = `R$ ${toBRL(contrato.saldoUtilizado)}`;
      const centroNome = centro ? centro.nome : 'N/A';

      const card = document.createElement('div');
      card.className = 'result-card';
      card.innerHTML = `
        <div class="result-card__content">
          <div class="result-card__header">
            <span class="result-card__meta">Nº ${numero}</span>
            <span class="badge ${statusClass}">${statusText}</span>
          </div>
          <div class="result-card__title">${fornecedor}</div>
          <div class="result-card__details">
            <div class="kv">
              <div class="kv__label">Centro de custo</div>
              <div class="kv__value">${centroNome}</div>
            </div>
            <div class="kv">
              <div class="kv__label">Valor total</div>
              <div class="kv__value">${valorTotal}</div>
            </div>
            <div class="kv">
              <div class="kv__label">Saldo utilizado</div>
              <div class="kv__value">
                ${saldoUtilizado}
                <div class="progress-bar">
                  <div class="progress-fill" style="width:${Math.min(pct, 100)}%; background:${pct > 90 ? 'var(--danger-color)' : 'var(--accent-color)'}"></div>
                </div>
                <small>${isFinite(pct) ? pct.toFixed(1) : '0.0'}% utilizado</small>
              </div>
            </div>
            <div class="kv">
              <div class="kv__label">Vencimento</div>
              <div class="kv__value">${vencimento}</div>
            </div>
          </div>
        </div>
        <div class="result-card__actions" role="group" aria-label="Acoes">
          <button class="card-action" type="button" title="Visualizar" aria-label="Visualizar" onclick="goContratoView(${contrato.id})">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
          <button class="card-action" type="button" title="Editar" aria-label="Editar" onclick="goContratoEdit(${contrato.id})">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="card-action danger" type="button" title="Excluir" aria-label="Excluir" onclick="deleteContrato(${contrato.id})">
            <i class="fa-regular fa-trash-can"></i>
          </button>
          <button class="card-action success" type="button" title="Movimentar" aria-label="Movimentar" onclick="openMovModal(${contrato.id})">
            <i class="fa-solid fa-right-left"></i>
          </button>
        </div>
      `;
      cardsContainer.appendChild(card);
    });
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
        <td data-label="Numero">${contrato.numero || 'N/A'}</td>
        <td data-label="Fornecedor">${contrato.fornecedor || 'N/A'}</td>
        <td data-label="Centro de Custo">${centro ? centro.nome : 'N/A'}</td>
        <td data-label="Valor Total">R$ ${toBRL(contrato.valorTotal)}</td>
        <td data-label="Saldo Utilizado">
          <div>R$ ${toBRL(contrato.saldoUtilizado)}</div>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${Math.min(pct, 100)}%; background:${pct > 90 ? 'var(--danger-color)' : 'var(--accent-color)'}"></div>
          </div>
          <small>${isFinite(pct) ? pct.toFixed(1) : '0.0'}% utilizado</small>
        </td>
        <td data-label="Vencimento">${contrato.dataVencimento ? formatBR(contrato.dataVencimento) : 'N/A'}</td>
        <td data-label="Status"><span class="badge ${statusClass}">${statusText}</span></td>
        <td data-label="Acoes">
          <div class="action-buttons">
            <button class="icon-action-btn primary" type="button" title="Visualizar" aria-label="Visualizar" onclick="goContratoView(${contrato.id})">
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
            <button class="icon-action-btn primary" type="button" title="Editar" aria-label="Editar" onclick="goContratoEdit(${contrato.id})">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="icon-action-btn danger" type="button" title="Excluir" aria-label="Excluir" onclick="deleteContrato(${contrato.id})">
              <i class="fa-regular fa-trash-can"></i>
            </button>
            <button class="icon-action-btn success" type="button" title="Movimentar" aria-label="Movimentar" onclick="openMovModal(${contrato.id})">
              <i class="fa-solid fa-right-left"></i>
            </button>
          </div>
        </td>
      </tr>`;
  });
}

function goContratoEdit(id) {
  if (!id && id !== 0) return;
  const q = `id=${encodeURIComponent(id)}&from=contratos`;
  window.location.href = `novo-contrato.html?${q}`;
}

function goContratoView(id) {
  if (!id && id !== 0) return;
  const q = `id=${encodeURIComponent(id)}&readonly=1&from=contratos`;
  window.location.href = `novo-contrato.html?${q}`;
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
        link.href = arq.url || '#';
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
  const cardsContainer = document.getElementById('centrosCards');
  const tbody = document.querySelector('#centrosTable tbody');
  if (!cardsContainer && !tbody) return;
  if (tbody) tbody.innerHTML = '';
  if (cardsContainer) cardsContainer.innerHTML = '';

  setListViewState({
    countId: 'centrosCount',
    emptyId: 'centrosEmpty',
    tableWrapId: 'centrosTableWrap',
    cardsWrapId: 'centrosCardsWrap',
    count: centrosCusto.length
  });

  if (centrosCusto.length === 0) {
    return;
  }

  if (cardsContainer) {
    centrosCusto.forEach(centro => {
      const card = document.createElement('div');
      card.className = 'result-card';
      card.innerHTML = `
        <div class="result-card__content">
          <div class="result-card__header">
            <span class="result-card__meta">${centro.codigo || 'S/N'}</span>
            <span class="badge badge-success">Ativo</span>
          </div>
          <div class="result-card__title">${centro.nome || 'N/A'}</div>
          <div class="result-card__details">
            <div class="kv">
              <div class="kv__label">Responsavel</div>
              <div class="kv__value">${centro.responsavel || 'N/A'}</div>
            </div>
            <div class="kv">
              <div class="kv__label">Email</div>
              <div class="kv__value">${centro.email || 'N/A'}</div>
            </div>
          </div>
        </div>
        <div class="result-card__actions" role="group" aria-label="Acoes">
          <button class="card-action" type="button" title="Editar" aria-label="Editar" onclick="editCentro(${centro.id})">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="card-action danger" type="button" title="Excluir" aria-label="Excluir" onclick="deleteCentro(${centro.id})">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      `;
      cardsContainer.appendChild(card);
    });
    return;
  }

  centrosCusto.forEach(centro => {
    tbody.innerHTML += `
      <tr>
        <td data-label="Codigo">${centro.codigo || 'N/A'}</td>
        <td data-label="Nome">${centro.nome || 'N/A'}</td>
        <td data-label="Responsavel">${centro.responsavel || 'N/A'}</td>
        <td data-label="Email">${centro.email || 'N/A'}</td>
        <td data-label="Acoes">
          <div class="action-buttons">
            <button class="btn warn" onclick="editCentro(${centro.id})">Editar</button>
            <button class="btn danger" onclick="deleteCentro(${centro.id})">Excluir</button>
          </div>
        </td>
      </tr>`;
  });
}

function updateContasTable() {
  const cardsContainer = document.getElementById('contasCards');
  const tbody = document.querySelector('#contasTable tbody');
  if (!cardsContainer && !tbody) return;
  if (tbody) tbody.innerHTML = '';
  if (cardsContainer) cardsContainer.innerHTML = '';

  setListViewState({
    countId: 'contasCount',
    emptyId: 'contasEmpty',
    tableWrapId: 'contasTableWrap',
    cardsWrapId: 'contasCardsWrap',
    count: contasContabeis.length
  });

  if (contasContabeis.length === 0) {
    return;
  }

  if (cardsContainer) {
    contasContabeis.forEach(conta => {
      const card = document.createElement('div');
      card.className = 'result-card';
      card.innerHTML = `
        <div class="result-card__content">
          <div class="result-card__header">
            <span class="result-card__meta">${conta.codigo || 'S/N'}</span>
            <span class="badge badge-success">${conta.tipo || 'N/A'}</span>
          </div>
          <div class="result-card__title">${conta.descricao || 'N/A'}</div>
        </div>
        <div class="result-card__actions" role="group" aria-label="Acoes">
          <button class="card-action" type="button" title="Editar" aria-label="Editar" onclick="editConta(${conta.id})">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="card-action danger" type="button" title="Excluir" aria-label="Excluir" onclick="deleteConta(${conta.id})">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      `;
      cardsContainer.appendChild(card);
    });
    return;
  }

  contasContabeis.forEach(conta => {
    tbody.innerHTML += `
      <tr>
        <td data-label="Codigo">${conta.codigo || 'N/A'}</td>
        <td data-label="Descricao">${conta.descricao || 'N/A'}</td>
        <td data-label="Tipo">${conta.tipo || 'N/A'}</td>
        <td data-label="Acoes">
          <div class="action-buttons">
            <button class="btn warn" onclick="editConta(${conta.id})">Editar</button>
            <button class="btn danger" onclick="deleteConta(${conta.id})">Excluir</button>
          </div>
        </td>
      </tr>`;
  });
}

/***********************
 * ESTATaSTICAS & ALERTAS
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
  const homeTotal = document.getElementById('homeTotalContratos');
  const homeAtivos = document.getElementById('homeContratosAtivos');
  const homeInativos = document.getElementById('homeContratosInativos');
  const homeVencendo = document.getElementById('homeContratosVencendo');

  if (!elTotal && !elAtivos && !elVencendo && !elEstouro && !homeTotal && !homeAtivos && !homeInativos && !homeVencendo) return;

  const totalContratos = contratos.length;
  const contratosAtivos = contratos.filter(c => c.ativo !== false && toBRDate(c.dataVencimento) > brNow()).length;
  const contratosInativos = contratos.filter(c => c.ativo === false).length;
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

  if (homeTotal) homeTotal.textContent = totalContratos;
  if (homeAtivos) homeAtivos.textContent = contratosAtivos;
  if (homeInativos) homeInativos.textContent = contratosInativos;
  if (homeVencendo) homeVencendo.textContent = contratosVencendo;
}

function checkAlerts() {
  // Alertas visuais (banners) desativados.
  // Os indicadores de "ativos / inativos / a vencer" sao exibidos na Home.
  return;
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
      link.href = a.url || '#';
      link.textContent = a.nome_arquivo || 'arquivo';
      link.target = '_blank';
      li.appendChild(link);

      const readonly = Boolean(window.contratoReadonly);
      if (!readonly) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn ghost';
        btn.style.marginLeft = '8px';
        btn.textContent = 'Remover';
        btn.onclick = () => removeAnexo(contratoId, a.id);
        li.appendChild(btn);
      }

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
    get('dataInicio') && (get('dataInicio').value = c.dataInicio.slice(0, 10) || '');
    get('dataVencimento') && (get('dataVencimento').value = c.dataVencimento.slice(0, 10) || '');
  }
  get('observacoes') && (get('observacoes').value = c.observacoes || '');
  get('contratoAtivo') && (get('contratoAtivo').checked = c.ativo !== false);

  await updateListaAnexos(id);
}

async function removeAnexo(contratoId, arquivoId) {
  if (!confirm('Remover este anexo')) return;
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
  if (!confirm('Tem certeza que deseja excluir este contrato')) return;
  
  try {
    await apiSend(`/contratos/${id}`, 'DELETE');
    
    // Recarrega a lista com os filtros atuais
    const path = buildContratosQueryFromFilters();
    contratos = await apiGet(path);
    
    updateTables();
    updateStats();
    checkAlerts();
    showAlert('Contrato excluido com sucesso!', 'success');
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
    alert(`Nao e possivel excluir: usado por ${usados.length} contrato(s).`);
    return;
  }
  
  if (!confirm('Excluir centro de custo')) return;
  
  try {
    await apiSend(`/centros/${id}`, 'DELETE');
    centrosCusto = await apiGet('/centros');
    updateTables();
    showAlert('Centro de custo excluido!', 'success');
  } catch (e) {
    console.error('Erro ao excluir centro:', e);
    showAlert('Erro ao excluir centro de custo.', 'danger');
  }
}

function editConta(id) {
  const c = contasContabeis.find(x => x.id === id);
  if (!c) return;

  editingId = id;
  document.getElementById('contaModalTitle').textContent = 'Editar Conta contabil';
  document.getElementById('codigoConta').value = c.codigo || '';
  document.getElementById('descricaoConta').value = c.descricao || '';
  document.getElementById('tipoConta').value = c.tipo || '';
  
  openModal('contaModal');
}

async function deleteConta(id) {
  const usados = contratos.filter(c => c.contaContabil === id);
  if (usados.length > 0) {
    alert(`Nao e possivel excluir: usada por ${usados.length} contrato(s).`);
    return;
  }
  
  if (!confirm('Excluir conta contabil')) return;
  
  try {
    await apiSend(`/contas/${id}`, 'DELETE');
    contasContabeis = await apiGet('/contas');
    updateTables();
    showAlert('Conta contabil excluida!', 'success');
  } catch (e) {
    console.error('Erro ao excluir conta:', e);
    showAlert('Erro ao excluir conta contabil.', 'danger');
  }
}

/***********************
 * MOVIMENTAaA.ES
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
  // Carrega movimentacoes existentes
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
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:10px; color:var(--text-secondary)">Nenhuma movimentacao encontrada</td></tr>';
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
    console.error('Erro ao carregar movimentacoes:', e);
    const tbody = document.getElementById('tbMov');
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:10px; color:var(--danger-color)">Erro ao carregar movimentacoes</td></tr>';
    }
  }
}

/***********************
 * MANIPULADORES DE FORMULaRIO
 ***********************/
function validateContratoForm() {
  let valid = true;
  const fields = [
    { id: 'numeroContrato', msg: 'Informe o numero do contrato.' },
    { id: 'fornecedor', msg: 'Informe o fornecedor.' },
    { id: 'centroCustoContrato', msg: 'Selecione o centro de custo.' },
    { id: 'contaContabil', msg: 'Selecione a conta contabil.' },
    { id: 'valorTotal', msg: 'Informe o valor total.' },
    { id: 'dataInicio', msg: 'Informe a data de inicio.' },
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
    showAlert('Preencha os campos obrigatorios.', 'danger');
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
    editingId = null;

    const modal = document.getElementById('centroModal');
    if (modal) {
      closeModal('centroModal');
    } else {
      window.location.href = 'centros.html';
    }
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
      showAlert('Conta contabil atualizada!', 'success');
    } else {
      await apiSend('/contas', 'POST', data);
      showAlert('Conta contabil criada!', 'success');
    }

    contasContabeis = await apiGet('/contas');
    updateTables();
    editingId = null;

    const modal = document.getElementById('contaModal');
    if (modal) {
      closeModal('contaModal');
    } else {
      window.location.href = 'contas.html';
    }
  } catch (err) {
    console.error('Erro ao salvar conta:', err);
    showAlert('Erro ao salvar conta contabil.', 'danger');
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
    
    // Recarrega as movimentacoes no modal
    await loadMovimentacoes(id);
    
    // Limpa o formulario
    document.getElementById('movValor').value = '';
    document.getElementById('movObs').value = '';
    
    showAlert('Movimentacao lancada!', 'success');
  } catch (err) {
    console.error('Erro ao lancar Movimentacao:', err);
    showAlert('Erro ao lancar Movimentacao.', 'danger');
  }
}

/***********************
 * ALERTAS TEMPORaRIOS
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
 * EXPORTAR FUNaA.ES GLOBAIS
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














