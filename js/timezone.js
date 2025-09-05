const BR_TZ = 'America/Sao_Paulo';

/**
 * Retorna a data e hora atuais no fuso-horário de São Paulo.
 */
function brNow() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: BR_TZ }));
}

/**
 * Converte uma data para o fuso-horário de São Paulo.
 * @param {string|number|Date} date
 */
function toBRDate(date) {
  if (!date) return null;
  return new Date(new Date(date).toLocaleString('en-US', { timeZone: BR_TZ }));
}

/**
 * Formata uma data no padrão pt-BR respeitando o fuso de São Paulo.
 * @param {string|number|Date} date
 */
function formatBR(date) {
  return new Intl.DateTimeFormat('pt-BR', { timeZone: BR_TZ }).format(toBRDate(date));
}

/**
 * Retorna a representação ISO da data no fuso de São Paulo.
 * @param {string|number|Date} date
 */
function formatISO(date) {
  return toBRDate(date).toISOString();
}

/**
 * Retorna string YYYY-MM-DD da data no fuso de São Paulo.
 * @param {string|number|Date} date
 */
function formatYMD(date) {
  const d = toBRDate(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// expõe funções no escopo global
window.brNow = brNow;
window.toBRDate = toBRDate;
window.formatBR = formatBR;
window.formatISO = formatISO;
window.formatYMD = formatYMD;
