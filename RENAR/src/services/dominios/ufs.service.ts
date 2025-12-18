import { httpAuthClient } from "../api";

export interface Cidade {
  id: number;

  nome: string;
}

export interface Uf {
  id: number;
  nome: string;
  sigla: string;
  cidades?: Cidade[];
}

export interface OpcaoUf {
  value: number;
  label: string;
  id: number;
  sigla: string;
}

export interface FiltroUf {
  id?: number;
  nome?: string;
  sigla?: string;
}

/**
 * Busca todas as UFs disponíveis
 * @param filtro - Filtros opcionais para a busca
 * @returns Promise com array de UFs
 */
export async function buscarUfs(filtro?: FiltroUf): Promise<Uf[]> {
  try {
    const params = new URLSearchParams();
    if (filtro?.id) params.append("id", filtro.id.toString());
    if (filtro?.nome) params.append("nome", filtro.nome);
    if (filtro?.sigla) params.append("sigla", filtro.sigla);

    const url = `/ufs${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await httpAuthClient(url);

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar UFs:", error);
    throw new Error("Falha ao carregar lista de UFs");
  }
}

/**
 * Busca uma UF específica pelo ID
 * @param id - ID da UF
 * @returns Promise com a UF encontrada ou undefined
 */
export async function buscarUfPorId(id: number): Promise<Uf | undefined> {
  try {
    const ufs = await buscarUfs({ id });
    return ufs.find((uf) => uf.id === id);
  } catch (error) {
    console.error("Erro ao buscar UF por ID:", error);
    throw new Error("Falha ao buscar UF");
  }
}

/**
 * Busca uma UF específica pela sigla
 * @param sigla - Sigla da UF
 * @returns Promise com a UF encontrada ou undefined
 */
export async function buscarUfPorSigla(sigla: string): Promise<Uf | undefined> {
  try {
    const ufs = await buscarUfs({ sigla });
    return ufs.find((uf) => uf.sigla === sigla);
  } catch (error) {
    console.error("Erro ao buscar UF por sigla:", error);
    throw new Error("Falha ao buscar UF");
  }
}
