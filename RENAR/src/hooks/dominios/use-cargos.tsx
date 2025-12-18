import {
  fetchAllCargos,
  FiltrosCargosProps,
} from "@/services/dominios/cargos.service";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useQueryString } from "../useQueryParams";
import useRoute from "../useRoute";

export default function useCargos() {
  const { getAllQueryStrings } = useQueryString();
  const { codigo, descricao } = getAllQueryStrings();
  const { handleItemClick } = useRoute();
  const filtros = useMemo(
    () => ({
      codigo,
      descricao,
    }),
    [codigo, descricao]
  );
  const queryKey = useMemo(() => ["busca-cargos-filtros", filtros], [filtros]);
  const { data: cargos, isFetching: isFetchingCargos } = useQuery({
    queryKey,
    queryFn: async () => await fetchAllCargos(filtros as FiltrosCargosProps),
    enabled: Boolean(filtros),
  });

  const executarBusca = async (novosFiltros: FiltrosCargosProps) => {
    handleItemClick(novosFiltros, "value");
  };
  return {
    filtros,
    executarBusca,
    isFetchingCargos,
    total: cargos?.total || 0,
    cargos: cargos?.itens || [],
  };
}
