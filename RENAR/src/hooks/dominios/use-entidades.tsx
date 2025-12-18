import { httpAuthClient } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export interface Entidade {
  id: number;
  nome: string;
  sigla: string;
}

/**
 * Interface para opções do Combobox
 */
export interface OpcaoEntidades {
  value: string;
  label: string;
}

async function BuscarEntidades(): Promise<Entidade[]> {
  try {
    const resposta = await httpAuthClient("/dominios/entidades");
    const dados = await resposta.json();
    return dados;
  } catch (erro) {
    console.error("Erro ao buscar entidades:", erro);
    throw new Error("Falha ao carregar entidades. Tente novamente.");
  }
}

export function useEntidades() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["entidades"],
    queryFn: BuscarEntidades,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });

  // Transforma as entidades em opções para Combobox
  const opcoesEntidades: OpcaoEntidades[] =
    (data &&
      data?.map((entidade) => ({
        value: entidade.id.toString(),
        label: entidade.sigla,
      }))) ||
    [];

  return {
    categorias: data || [],
    opcoesEntidades,
    isLoading,
    erro: error as Error | null,
  };
}
