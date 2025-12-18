/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Cria uma função de debounce que atrasa a execução da função fornecida até que um período de inatividade
 * (especificado pelo delay) ocorra. Isso é útil para evitar chamadas excessivas, como em eventos de digitação.
 *
 * @param {number} delay - O tempo de espera em milissegundos antes de executar a função.
 * @returns {(func: (...args: any) => void) => (...args: any) => void} Uma função que recebe uma outra função e retorna sua versão debounced.
 */
export function useDebounce(delay: string | number | undefined) {
  /**
   * Retorna uma versão debounced da função fornecida, que só será executada após o período de inatividade.
   *
   * @param {(...args) => void} func - A função que deverá ser executada após o delay.
   * @returns {(...args) => void} A função debounced.
   */
  function debounce(func: (...args: any) => void) {
    let timer: string | number | NodeJS.Timeout | undefined;
    return (...args: any) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, Number(delay));
    };
  }

  return debounce;
}
