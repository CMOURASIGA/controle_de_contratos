import { httpAuthClient } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export interface PronomesTratamento {
  id: number;
  sigla: string;
  descricao: string;
}

/**
 * Interface para opções do Combobox
 */
export interface OpcaoPronomes {
  value: string;
  label: string;
}

async function BuscarPronomes(): Promise<PronomesTratamento[]> {
  try {
    const resposta = await httpAuthClient("/dominios/pronomes-tratamento");
    const dados = await resposta.json();
    return dados;
  } catch (erro) {
    console.error("Erro ao buscar os pronomes:", erro);
    throw new Error("Falha ao carregar os pronomes. Tente novamente.");
  }
}

export function usePronomeTratamento() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["pronomes-tratamento"],
    queryFn: BuscarPronomes,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });

  // Transforma os pronomes em opções para Combobox
  const opcoesPronomes: OpcaoPronomes[] =
    data?.map((pronome) => ({
      value: pronome.id.toString(),
      label: pronome.sigla,
    })) || [];

  return {
    categorias: data || [],
    opcoesPronomes,
    isLoading,
    erro: error as Error | null,
  };
}
