<<<<<<< HEAD
﻿const BR_TZ = 'America/Sao_Paulo';

/**
 * Retorna a data e hora atuais no fuso-horario de Sao Paulo.
=======
const BR_TZ = 'America/Sao_Paulo';

/**
 * Retorna a data e hora atuais no fuso-horário de São Paulo.
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
 */
function brNow() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: BR_TZ }));
}

/**
<<<<<<< HEAD
 * Converte uma data para o fuso-horario de Sao Paulo.
=======
 * Converte uma data para o fuso-horário de São Paulo.
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
 * @param {string|number|Date} date
 */
function toBRDate(date) {
  if (!date) return null;
  return new Date(new Date(date).toLocaleString('en-US', { timeZone: BR_TZ }));
}

/**
<<<<<<< HEAD
 * Formata uma data no padrao pt-BR respeitando o fuso de Sao Paulo.
=======
 * Formata uma data no padrão pt-BR respeitando o fuso de São Paulo.
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
 * @param {string|number|Date} date
 */
function formatBR(date) {
  return new Intl.DateTimeFormat('pt-BR', { timeZone: BR_TZ }).format(toBRDate(date));
}

/**
<<<<<<< HEAD
 * Retorna a representaaao ISO da data no fuso de Sao Paulo.
=======
 * Retorna a representação ISO da data no fuso de São Paulo.
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
 * @param {string|number|Date} date
 */
function formatISO(date) {
  return toBRDate(date).toISOString();
}

/**
<<<<<<< HEAD
 * Retorna string YYYY-MM-DD da data no fuso de Sao Paulo.
=======
 * Retorna string YYYY-MM-DD da data no fuso de São Paulo.
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
 * @param {string|number|Date} date
 */
function formatYMD(date) {
  const d = toBRDate(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
<<<<<<< HEAD
 * Retorna string dd/mm/aaaa no fuso de Sao Paulo.
=======
 * Retorna string dd/mm/aaaa no fuso de São Paulo.
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
 */
function formatBRInput(date) {
  const d = toBRDate(date);
  const day = String(d.getDate()).padStart(2, '0');
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const y = d.getFullYear();
  return `${day}/${m}/${y}`;
}

/**
 * Converte dd/mm/aaaa para YYYY-MM-DD.
 */
function parseBRToYMD(str) {
  if (!str) return null;
  const m = String(str).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
<<<<<<< HEAD
  if (!m) return str || null; // ja pode estar em ISO (YYYY-MM-DD)
=======
  if (!m) return str || null; // já pode estar em ISO (YYYY-MM-DD)
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
  const [_, dd, mm, yyyy] = m;
  return `${yyyy}-${mm}-${dd}`;
}

<<<<<<< HEAD
// expae funaaes no escopo global
=======
// expõe funções no escopo global
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
window.brNow = brNow;
window.toBRDate = toBRDate;
window.formatBR = formatBR;
window.formatISO = formatISO;
window.formatYMD = formatYMD;
window.formatBRInput = formatBRInput;
window.parseBRToYMD = parseBRToYMD;
<<<<<<< HEAD




=======
>>>>>>> 8804e5c05fa9bffc8526991029854834c655de51
