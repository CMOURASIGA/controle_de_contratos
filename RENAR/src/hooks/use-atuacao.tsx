import {
  fetchAllAtuacoes,
  FiltrosAtuacoesProps,
} from "@/services/atuacoes.service";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useQueryString } from "./useQueryParams";
import useRoute from "./useRoute";

export default function useAtuacoes() {
  const { getAllQueryStrings } = useQueryString();
  const { nome } = getAllQueryStrings();
  const { handleItemClick } = useRoute();
  const filtros = useMemo(
    () => ({
      nome,
    }),
    [nome]
  );
  const queryKey = useMemo(() => ["busca-atuacao-filtro", filtros], [filtros]);
  const { data: atuacoes, isFetching } = useQuery({
    queryKey,
    queryFn: async () =>
      await fetchAllAtuacoes(filtros as FiltrosAtuacoesProps),
    enabled: Boolean(filtros),
  });

  const executarBusca = async (novosFiltros: FiltrosAtuacoesProps) => {
    handleItemClick(novosFiltros, "value");
  };
  const atuacoesOptions =
    atuacoes?.itens.map((atuacao) => ({
      label: atuacao.nome,
      value: atuacao.id.toString(),
    })) || [];

  return {
    filtros,
    executarBusca,
    isFetching,
    atuacoesOptions,
    total: atuacoes?.total || 0,
    atuacoes: atuacoes?.itens || [],
  };
}
