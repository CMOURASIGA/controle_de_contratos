/***********************
<<<<<<< HEAD
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
=======
 * CONFIGURAÇÃO
 ***********************/
// Determine API base URL from global or build-time configuration
let API =
  (typeof window !== 'undefined' && window.API_BASE) ||
  (typeof process !== 'undefined' && process.env && process.env.API_BASE) ||
  'https://controledecontratos-production.up.railway.app';

// Estado em memÃ³ria
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
let contratos = [];
let centrosCusto = [];
let contasContabeis = [];
let editingId = null;
let chartStatus, chartEvolucao, chartFornecedores;

/***********************
<<<<<<< HEAD
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
=======
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

>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
function toBRL(n) {
  return Number(n || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

<<<<<<< HEAD
// Mascara e normalizacao para datas dd/mm/aaaa
=======
// Máscara e normalização para datas dd/mm/aaaa
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
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
<<<<<<< HEAD
 * INICIALIZACAO
=======
 * INICIALIZAÇÃO
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
 ***********************/
document.addEventListener('DOMContentLoaded', async function () {
  try {
    await initializeData();
    setupEventListeners();
    // Preenche selects do contrato quando presentes (novo/editar)
    updateCentroCustoOptions();
    updateContaContabilOptions();
<<<<<<< HEAD
    // Define valores padrao de datas respeitando UTC-3 quando presentes
=======
    // Define valores padrÃ£o de datas respeitando UTC-3 quando presentes
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
    if (typeof formatYMD === 'function') {
      const di = document.getElementById('dataInicio');
      const dv = document.getElementById('dataVencimento');
      if (di && !di.value) di.value = formatYMD(brNow());
      if (dv && !dv.value) dv.value = '';
    }
    
    // Atualiza alertas a cada 30s
    setInterval(checkAlerts, 30000);
  } catch (e) {
<<<<<<< HEAD
    console.error('Erro na inicializacao:', e);
    showAlert('Erro ao carregar dados da API. Verifique a conexao.', 'danger');
=======
    console.error('Erro na inicialização:', e);
    showAlert('Erro ao carregar dados da API. Verifique a conexão.', 'danger');
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
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

<<<<<<< HEAD
    // Evoluaao de valores pagos
    const evoCtx = document.getElementById('chartEvolucao')?.getContext('2d');
    if (evoCtx) {
      chartEvolucao.destroy();
=======
    // EvoluÃ§Ã£o de valores pagos
    const evoCtx = document.getElementById('chartEvolucao')?.getContext('2d');
    if (evoCtx) {
      chartEvolucao?.destroy();
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
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
<<<<<<< HEAD
    showAlert('Erro ao carregar metricas do dashboard.', 'danger');
=======
    showAlert('Erro ao carregar métricas do dashboard.', 'danger');
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
  }
}

function setupEventListeners() {
  // Filtros
  document.getElementById('btnAplicarFiltros')?.addEventListener('click', applyFilters);
  document.getElementById('btnLimparFiltros')?.addEventListener('click', clearFilters);
  document.getElementById('navNovoContrato')?.addEventListener('click', () => {
    window.location.href = 'novo-contrato.html';
  });

<<<<<<< HEAD
  // formularios
=======
  // formulários
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
  document.getElementById('contratoForm')?.addEventListener('submit', handleContratoSubmit);
  document.getElementById('centroForm')?.addEventListener('submit', handleCentroSubmit);
  document.getElementById('contaForm')?.addEventListener('submit', handleContaSubmit);
  document.getElementById('movForm')?.addEventListener('submit', handleMovSubmit);
  
  // Dashboard
  document.getElementById('tabDashboard')?.addEventListener('click', loadDashboard);
  
<<<<<<< HEAD
  // Validacao e pre-visualizacao de anexos
=======
  // Validação e pré-visualização de anexos
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
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
    
<<<<<<< HEAD
    // Primeiro, tenta carregar os dados basicos
    centrosCusto = await apiGet('/centros').catch(err => {
      console.error('Erro ao carregar centros:', err);
      showAlert('Nao foi possivel carregar Centros de Custo.', 'warning');
=======
    // Primeiro, tenta carregar os dados básicos
    centrosCusto = await apiGet('/centros').catch(err => {
      console.error('Erro ao carregar centros:', err);
      showAlert('Não foi possível carregar Centros de Custo.', 'warning');
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
      return [];
    });

    contasContabeis = await apiGet('/contas').catch(err => {
      console.error('Erro ao carregar contas:', err);
<<<<<<< HEAD
      showAlert('Nao foi possivel carregar Contas Contabeis.', 'warning');
=======
      showAlert('Não foi possível carregar Contas Contábeis.', 'warning');
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
      return [];
    });

    contratos = await apiGet('/contratos').catch(err => {
      console.error('Erro ao carregar contratos:', err);
<<<<<<< HEAD
      showAlert('Nao foi possivel carregar Contratos.', 'warning');
=======
      showAlert('Não foi possível carregar Contratos.', 'warning');
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
      return [];
    });

    console.log('Dados carregados:', { contratos: contratos.length, centros: centrosCusto.length, contas: contasContabeis.length });

    updateTables();
    updateStats();
    checkAlerts();

  } catch (err) {
    console.error('Falha inesperada ao inicializar dados:', err);
<<<<<<< HEAD
    showAlert('Erro ao carregar dados da API. Verifique a conexao.', 'danger');
=======
    showAlert('Erro ao carregar dados da API. Verifique a conexão.', 'danger');
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
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
<<<<<<< HEAD
  if (modalId === 'contaModal') document.getElementById('contaModalTitle').textContent = 'Nova Conta contabil';
=======
  if (modalId === 'contaModal') document.getElementById('contaModalTitle').textContent = 'Nova Conta contábil';
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
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
<<<<<<< HEAD
  select.innerHTML = '<option value="">Selecione uma conta contabil</option>';
=======
  select.innerHTML = '<option value="">Selecione uma conta contábil</option>';
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
  contasContabeis.forEach(conta => {
    const opt = document.createElement('option');
    opt.value = conta.id;
    opt.textContent = `${conta.codigo} - ${conta.descricao}`;
    select.appendChild(opt);
  });
}

/***********************
<<<<<<< HEAD
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
=======
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
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
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
<<<<<<< HEAD
    const filtered = await apiGet(path);
    const csv = buildContratosCSV(filtered || []);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
=======
    const queryString = path.includes('?') ? path.slice(path.indexOf('?')) : '';
    const url = `${API}/relatorios/contratos${queryString}`;
    
    const r = await fetch(url);
    if (!r.ok) throw new Error('Relatório indisponível.');
    
    const blob = await r.blob();
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `contratos_${formatISO(brNow()).slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
<<<<<<< HEAD
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

=======
    
    showAlert('Relatório baixado com sucesso!', 'success');
  } catch (e) {
    console.error('Erro ao gerar Relatório:', e);
    showAlert('Erro ao gerar Relatório.', 'danger');
  }
}

>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
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
<<<<<<< HEAD
        <td data-label="Numero">${contrato.numero || 'N/A'}</td>
=======
        <td data-label="Número">${contrato.numero || 'N/A'}</td>
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
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
<<<<<<< HEAD
        <td data-label="Acoes">
=======
        <td data-label="Ações">
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
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
<<<<<<< HEAD
        link.href = arq.url || '#';
=======
        link.href = `${API}${arq.url}`;
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
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
<<<<<<< HEAD
        <td data-label="Codigo">${centro.codigo || 'N/A'}</td>
        <td data-label="Nome">${centro.nome || 'N/A'}</td>
        <td data-label="Responsavel">${centro.responsavel || 'N/A'}</td>
        <td data-label="Email">${centro.email || 'N/A'}</td>
        <td data-label="Acoes">
=======
        <td data-label="Código">${centro.codigo || 'N/A'}</td>
        <td data-label="Nome">${centro.nome || 'N/A'}</td>
        <td data-label="Responsável">${centro.responsavel || 'N/A'}</td>
        <td data-label="Email">${centro.email || 'N/A'}</td>
        <td data-label="Ações">
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
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
<<<<<<< HEAD
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px; color:var(--text-secondary)">Nenhuma conta contabil encontrada</td></tr>';
=======
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px; color:var(--text-secondary)">Nenhuma conta contábil encontrada</td></tr>';
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
    return;
  }

  contasContabeis.forEach(conta => {
    tbody.innerHTML += `
      <tr>
<<<<<<< HEAD
        <td data-label="Codigo">${conta.codigo || 'N/A'}</td>
        <td data-label="Descricao">${conta.descricao || 'N/A'}</td>
        <td data-label="Tipo">${conta.tipo || 'N/A'}</td>
        <td data-label="Acoes">
=======
        <td data-label="Código">${conta.codigo || 'N/A'}</td>
        <td data-label="Descrição">${conta.descricao || 'N/A'}</td>
        <td data-label="Tipo">${conta.tipo || 'N/A'}</td>
        <td data-label="Ações">
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
          <div class="action-buttons">
            <button class="btn warn" onclick="editConta(${conta.id})">Editar</button>
            <button class="btn danger" onclick="deleteConta(${conta.id})">Excluir</button>
          </div>
        </td>
      </tr>`;
  });
}

/***********************
<<<<<<< HEAD
 * ESTATaSTICAS & ALERTAS
=======
 * ESTATÃSTICAS & ALERTAS
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
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

<<<<<<< HEAD
  // Limpa alertas existentes (mas mantem os temporarios)
=======
  // Limpa alertas existentes (mas mantém os temporários)
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
  div.querySelectorAll('.alert:not([data-temporary])').forEach(el => el.remove());

  const vencendo = contratos.filter(c => {
    if (c.ativo === false) return false;
    const dias = Math.ceil((toBRDate(c.dataVencimento) - brNow()) / (1000 * 60 * 60 * 24));
    return dias <= 30 && dias > 0;
  });

  if (vencendo.length) {
    const el = document.createElement('div');
    el.className = 'alert alert-warning';
<<<<<<< HEAD
    el.innerHTML = `<strong>?? Atencao!</strong> ${vencendo.length} contrato(s) vencendo nos proximos 30 dias:
=======
    el.innerHTML = `<strong>⚠️ Atenção!</strong> ${vencendo.length} contrato(s) vencendo nos próximos 30 dias:
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
      ${vencendo.map(c => {
        const dias = Math.ceil((toBRDate(c.dataVencimento) - brNow()) / (1000 * 60 * 60 * 24));
        return `<br>&bull; ${c.numero || 'S/N'} - ${c.fornecedor || 'N/A'} (vence em ${dias} dias)`;
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
<<<<<<< HEAD
    el.innerHTML = `<strong>?? Critico!</strong> ${estouro.length} contrato(s) com estouro de saldo:
=======
    el.innerHTML = `<strong>🚨 Crítico!</strong> ${estouro.length} contrato(s) com estouro de saldo:
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
      ${estouro.map(c => {
        const pct = ((Number(c.saldoUtilizado) / Number(c.valorTotal)) * 100).toFixed(1);
        return `<br>&bull; ${c.numero || 'S/N'} - ${c.fornecedor || 'N/A'} (${pct}% utilizado)`;
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
<<<<<<< HEAD
    el.innerHTML = `<strong>?? Saldo Baixo!</strong> ${saldoBaixo.length} contrato(s) com saldo proximo do limite:
=======
    el.innerHTML = `<strong>⚠️ Saldo Baixo!</strong> ${saldoBaixo.length} contrato(s) com saldo próximo do limite:
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
      ${saldoBaixo.map(c => {
        const pct = ((Number(c.saldoUtilizado) / Number(c.valorTotal)) * 100).toFixed(1);
        return `<br>&bull; ${c.numero || 'S/N'} - ${c.fornecedor || 'N/A'} (${pct}% utilizado)`;
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
<<<<<<< HEAD
      link.href = a.url || '#';
=======
      link.href = `${API}${a.url}`;
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
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
<<<<<<< HEAD
    get('dataInicio') && (get('dataInicio').value = c.dataInicio.slice(0, 10) || '');
    get('dataVencimento') && (get('dataVencimento').value = c.dataVencimento.slice(0, 10) || '');
=======
    get('dataInicio') && (get('dataInicio').value = c.dataInicio?.slice(0, 10) || '');
    get('dataVencimento') && (get('dataVencimento').value = c.dataVencimento?.slice(0, 10) || '');
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
  }
  get('observacoes') && (get('observacoes').value = c.observacoes || '');
  get('contratoAtivo') && (get('contratoAtivo').checked = c.ativo !== false);

  await updateListaAnexos(id);
}

async function removeAnexo(contratoId, arquivoId) {
<<<<<<< HEAD
  if (!confirm('Remover este anexo')) return;
=======
  if (!confirm('Remover este anexo?')) return;
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
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
<<<<<<< HEAD
  if (!confirm('Tem certeza que deseja excluir este contrato')) return;
=======
  if (!confirm('Tem certeza que deseja excluir este contrato?')) return;
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
  
  try {
    await apiSend(`/contratos/${id}`, 'DELETE');
    
    // Recarrega a lista com os filtros atuais
    const path = buildContratosQueryFromFilters();
    contratos = await apiGet(path);
    
    updateTables();
    updateStats();
    checkAlerts();
<<<<<<< HEAD
    showAlert('Contrato excluido com sucesso!', 'success');
=======
    showAlert('Contrato excluído com sucesso!', 'success');
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
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
<<<<<<< HEAD
    alert(`Nao e possivel excluir: usado por ${usados.length} contrato(s).`);
    return;
  }
  
  if (!confirm('Excluir centro de custo')) return;
=======
    alert(`Não é possível excluir: usado por ${usados.length} contrato(s).`);
    return;
  }
  
  if (!confirm('Excluir centro de custo?')) return;
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
  
  try {
    await apiSend(`/centros/${id}`, 'DELETE');
    centrosCusto = await apiGet('/centros');
    updateTables();
<<<<<<< HEAD
    showAlert('Centro de custo excluido!', 'success');
=======
    showAlert('Centro de custo excluído!', 'success');
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
  } catch (e) {
    console.error('Erro ao excluir centro:', e);
    showAlert('Erro ao excluir centro de custo.', 'danger');
  }
}

function editConta(id) {
  const c = contasContabeis.find(x => x.id === id);
  if (!c) return;

  editingId = id;
<<<<<<< HEAD
  document.getElementById('contaModalTitle').textContent = 'Editar Conta contabil';
=======
  document.getElementById('contaModalTitle').textContent = 'Editar Conta contábil';
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
  document.getElementById('codigoConta').value = c.codigo || '';
  document.getElementById('descricaoConta').value = c.descricao || '';
  document.getElementById('tipoConta').value = c.tipo || '';
  
  openModal('contaModal');
}

async function deleteConta(id) {
  const usados = contratos.filter(c => c.contaContabil === id);
  if (usados.length > 0) {
<<<<<<< HEAD
    alert(`Nao e possivel excluir: usada por ${usados.length} contrato(s).`);
    return;
  }
  
  if (!confirm('Excluir conta contabil')) return;
=======
    alert(`Não é possível excluir: usada por ${usados.length} contrato(s).`);
    return;
  }
  
  if (!confirm('Excluir conta contábil?')) return;
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
  
  try {
    await apiSend(`/contas/${id}`, 'DELETE');
    contasContabeis = await apiGet('/contas');
    updateTables();
<<<<<<< HEAD
    showAlert('Conta contabil excluida!', 'success');
  } catch (e) {
    console.error('Erro ao excluir conta:', e);
    showAlert('Erro ao excluir conta contabil.', 'danger');
=======
    showAlert('Conta contábil excluída!', 'success');
  } catch (e) {
    console.error('Erro ao excluir conta:', e);
    showAlert('Erro ao excluir conta contábil.', 'danger');
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
  }
}

/***********************
<<<<<<< HEAD
 * MOVIMENTAaA.ES
=======
 * MOVIMENTAÃ‡Ã•ES
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
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
<<<<<<< HEAD
  // Carrega movimentacoes existentes
=======
  // Carrega movimentações existentes
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
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
<<<<<<< HEAD
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:10px; color:var(--text-secondary)">Nenhuma movimentacao encontrada</td></tr>';
=======
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:10px; color:var(--text-secondary)">Nenhuma movimentação encontrada</td></tr>';
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
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
<<<<<<< HEAD
    console.error('Erro ao carregar movimentacoes:', e);
    const tbody = document.getElementById('tbMov');
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:10px; color:var(--danger-color)">Erro ao carregar movimentacoes</td></tr>';
=======
    console.error('Erro ao carregar movimentações:', e);
    const tbody = document.getElementById('tbMov');
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:10px; color:var(--danger-color)">Erro ao carregar movimentações</td></tr>';
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
    }
  }
}

/***********************
<<<<<<< HEAD
 * MANIPULADORES DE FORMULaRIO
=======
 * MANIPULADORES DE FORMULÃRIO
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
 ***********************/
function validateContratoForm() {
  let valid = true;
  const fields = [
<<<<<<< HEAD
    { id: 'numeroContrato', msg: 'Informe o numero do contrato.' },
    { id: 'fornecedor', msg: 'Informe o fornecedor.' },
    { id: 'centroCustoContrato', msg: 'Selecione o centro de custo.' },
    { id: 'contaContabil', msg: 'Selecione a conta contabil.' },
    { id: 'valorTotal', msg: 'Informe o valor total.' },
    { id: 'dataInicio', msg: 'Informe a data de inicio.' },
=======
    { id: 'numeroContrato', msg: 'Informe o número do contrato.' },
    { id: 'fornecedor', msg: 'Informe o fornecedor.' },
    { id: 'centroCustoContrato', msg: 'Selecione o centro de custo.' },
    { id: 'contaContabil', msg: 'Selecione a conta contábil.' },
    { id: 'valorTotal', msg: 'Informe o valor total.' },
    { id: 'dataInicio', msg: 'Informe a data de início.' },
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
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
<<<<<<< HEAD
    showAlert('Preencha os campos obrigatorios.', 'danger');
=======
    showAlert('Preencha os campos obrigatórios.', 'danger');
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
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
<<<<<<< HEAD
      showAlert('Conta contabil atualizada!', 'success');
    } else {
      await apiSend('/contas', 'POST', data);
      showAlert('Conta contabil criada!', 'success');
=======
      showAlert('Conta contábil atualizada!', 'success');
    } else {
      await apiSend('/contas', 'POST', data);
      showAlert('Conta contábil criada!', 'success');
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
    }

    contasContabeis = await apiGet('/contas');
    updateTables();
    closeModal('contaModal');
  } catch (err) {
    console.error('Erro ao salvar conta:', err);
<<<<<<< HEAD
    showAlert('Erro ao salvar conta contabil.', 'danger');
=======
    showAlert('Erro ao salvar conta contábil.', 'danger');
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
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
    
<<<<<<< HEAD
    // Recarrega as movimentacoes no modal
    await loadMovimentacoes(id);
    
    // Limpa o formulario
    document.getElementById('movValor').value = '';
    document.getElementById('movObs').value = '';
    
    showAlert('Movimentacao lancada!', 'success');
  } catch (err) {
    console.error('Erro ao lancar Movimentacao:', err);
    showAlert('Erro ao lancar Movimentacao.', 'danger');
=======
    // Recarrega as movimentações no modal
    await loadMovimentacoes(id);
    
    // Limpa o formulário
    document.getElementById('movValor').value = '';
    document.getElementById('movObs').value = '';
    
    showAlert('Movimentação lançada!', 'success');
  } catch (err) {
    console.error('Erro ao lançar Movimentação:', err);
    showAlert('Erro ao lançar Movimentação.', 'danger');
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
  }
}

/***********************
<<<<<<< HEAD
 * ALERTAS TEMPORaRIOS
=======
 * ALERTAS TEMPORÃRIOS
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
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
<<<<<<< HEAD
 * EXPORTAR FUNaA.ES GLOBAIS
=======
 * EXPORTAR FUNÃ‡Ã•ES GLOBAIS
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
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

<<<<<<< HEAD











=======
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
