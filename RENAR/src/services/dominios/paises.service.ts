import { httpAuthClient } from "../api";

/**
 * Interface que representa um país
 */
export interface Pais {
  /** Identificador único do país */
  id: number;
  /** Nome completo do país */
  nome: string;
  /** Sigla do país */
  sigla: string;
}

/**
 * Interface para opções de seleção de país
 */
export interface OpcaoPais {
  /** Valor da opção (ID do país) */
  value: string;
  /** Texto exibido na opção */
  label: string;
  /** ID do país */
  id: number;
  /** Código/sigla do país */
  codigo: string;
}

/**
 * Busca todos os países disponíveis
 * @returns Promise com array de países
 */
export async function buscarPaises(): Promise<Pais[]> {
  try {
    const response = await httpAuthClient("/paises");
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar países:", error);
    throw new Error("Falha ao carregar lista de países");
  }
}

/**
 * Busca um país específico pelo ID
 * @param id - ID do país
 * @returns Promise com o país encontrado ou undefined
 */
export async function buscarPaisPorId(id: number): Promise<Pais | undefined> {
  try {
    const paises = await buscarPaises();
    return paises.find((pais) => pais.id === id);
  } catch (error) {
    console.error("Erro ao buscar país por ID:", error);
    throw new Error("Falha ao buscar país");
  }
}
