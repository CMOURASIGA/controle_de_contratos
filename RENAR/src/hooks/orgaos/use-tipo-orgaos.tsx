import {
  fetchAllTipoOrgaos,
  FiltrosTipoOrgaosProps,
} from "@/services/orgaos/tipo-orgaos.service";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useQueryString } from "../useQueryParams";
import useRoute from "../useRoute";

export default function useTipoOrgao() {
  const { getAllQueryStrings } = useQueryString();
  const { nome } = getAllQueryStrings();
  const { handleItemClick } = useRoute();
  const filtros = useMemo(
    () => ({
      nome,
    }),
    [nome]
  );
  const queryKey = useMemo(() => ["busca-tipo-orgao", filtros], [filtros]);
  const { data: tipoOrgaos, isFetching: isFetchingTipoOrgaos } = useQuery({
    queryKey,
    queryFn: async () =>
      await fetchAllTipoOrgaos(filtros as FiltrosTipoOrgaosProps),
    enabled: Boolean(filtros),
  });

  const executarBusca = async (novosFiltros: FiltrosTipoOrgaosProps) => {
    handleItemClick(novosFiltros, "value");
  };
  return {
    filtros,
    executarBusca,
    isFetchingTipoOrgaos,
    total: tipoOrgaos?.total || 0,
    tipoOrgaos: tipoOrgaos?.itens || [],
  };
}
