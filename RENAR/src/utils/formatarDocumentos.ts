/**
 * Utilitários para formatação de documentos (CPF e RG)
 * Aplica formatação apenas se o documento tiver a quantidade correta de caracteres
 */

/**
 * Formatar CPF no padrão XXX.XXX.XXX-XX
 * @param cpf - CPF sem formatação
 * @returns CPF formatado ou o valor original se não tiver 11 dígitos
 */
export function formatarCpf(cpf: string | null | undefined): string {
  if (!cpf) return "Não informado";
  
  // Remove todos os caracteres não numéricos
  const apenasNumeros = cpf.replace(/\D/g, "");
  
  // Verifica se tem exatamente 11 dígitos
  if (apenasNumeros.length !== 11) {
    return cpf; // Retorna sem formatação se não tiver 11 dígitos
  }
  
  // Aplica a formatação XXX.XXX.XXX-XX
  return apenasNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

/**
 * Formatar RG no padrão XX.XXX.XXX-X
 * @param rg - RG sem formatação
 * @returns RG formatado ou o valor original se não tiver 9 dígitos
 */
export function formatarRg(rg: string | null | undefined): string {
  if (!rg) return "Não informado";
  
  // Remove todos os caracteres não numéricos e não alfabéticos (para o dígito verificador)
  const apenasCaracteresValidos = rg.replace(/[^0-9A-Za-z]/g, "");
  
  // Verifica se tem exatamente 9 caracteres (8 números + 1 dígito verificador)
  if (apenasCaracteresValidos.length !== 9) {
    return rg; // Retorna sem formatação se não tiver 9 caracteres
  }
  
  // Aplica a formatação XX.XXX.XXX-X
  return apenasCaracteresValidos.replace(/(\d{2})(\d{3})(\d{3})(\w{1})/, "$1.$2.$3-$4");
}

/**
 * Validar se CPF tem formato válido (11 dígitos numéricos)
 * @param cpf - CPF para validar
 * @returns true se o CPF tem 11 dígitos numéricos
 */
export function ehCpfValido(cpf: string | null | undefined): boolean {
  if (!cpf) return false;
  const apenasNumeros = cpf.replace(/\D/g, "");
  return apenasNumeros.length === 11;
}

/**
 * Validar se RG tem formato válido (9 caracteres)
 * @param rg - RG para validar
 * @returns true se o RG tem 9 caracteres válidos
 */
export function ehRgValido(rg: string | null | undefined): boolean {
  if (!rg) return false;
  const apenasCaracteresValidos = rg.replace(/[^0-9A-Za-z]/g, "");
  return apenasCaracteresValidos.length === 9;
}