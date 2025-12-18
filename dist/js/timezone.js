const BR_TZ = 'America/Sao_Paulo';

function brNow() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: BR_TZ }));
}

function toBRDate(date) {
  if (!date) return null;
  return new Date(new Date(date).toLocaleString('en-US', { timeZone: BR_TZ }));
}

function formatBR(date) {
  const parsed = toBRDate(date);
  if (!parsed) return '';
  return new Intl.DateTimeFormat('pt-BR', { timeZone: BR_TZ }).format(parsed);
}

function formatISO(date) {
  const parsed = toBRDate(date);
  if (!parsed) return '';
  return parsed.toISOString();
}

function formatYMD(date) {
  const parsed = toBRDate(date);
  if (!parsed) return '';
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatBRInput(date) {
  const parsed = toBRDate(date);
  if (!parsed) return '';
  const day = String(parsed.getDate()).padStart(2, '0');
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const year = parsed.getFullYear();
  return `${day}/${month}/${year}`;
}

function parseBRToYMD(str) {
  if (!str) return null;
  const match = String(str).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return str || null;
  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

window.brNow = brNow;
window.toBRDate = toBRDate;
window.formatBR = formatBR;
window.formatISO = formatISO;
window.formatYMD = formatYMD;
window.formatBRInput = formatBRInput;
window.parseBRToYMD = parseBRToYMD;
