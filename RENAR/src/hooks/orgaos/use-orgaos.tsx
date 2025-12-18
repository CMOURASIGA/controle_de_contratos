import {
  buscarOrgaoPorId,
  ExcluirOrgao,
  FiltrosOrgaosProps,
  listTodosOrgaos,
  validarExclusaoDeOrgaos,
} from "@/services/orgaos/orgaos.service";
import {
  ExclusaoOrgaoResponse,
  ValidacaoDelecaoOrgaosResponse,
} from "@/types/orgao.type";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useQueryString } from "../use-query-params";
import useRoute from "../useRoute";

export default function useOrgaos(idOrgao?: string) {
  const { getAllQueryStrings } = useQueryString();
  const { nome, situacao, tipoOrgao, entidade } = getAllQueryStrings();
  const { handleItemClick } = useRoute();

  const filtros = useMemo(
    () => ({
      nome,
      situacao,
      tipoOrgao,
      entidade,
    }),
    [nome, situacao, tipoOrgao, entidade]
  );

  const queryKey = useMemo(() => ["busca-orgaos-filtros", filtros], [filtros]);

  const {
    data: orgaos,
    isFetching,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => await listTodosOrgaos(filtros as FiltrosOrgaosProps),
    enabled: Boolean(filtros),
  });

  const executarBusca = async (novosFiltros: FiltrosOrgaosProps) => {
    handleItemClick(novosFiltros, "value");
  };

  const executarBuscaPorId = async (id: string) => {
    handleItemClick({ id }, "id");
  };

  const { data: orgao, isFetching: isFetchingOrgao } = useQuery({
    queryKey,
    queryFn: async () => await buscarOrgaoPorId(idOrgao as string),
    enabled: Boolean(filtros),
  });

  const validarExclusao = async (
    id: number
  ): Promise<ValidacaoDelecaoOrgaosResponse | null> => {
    try {
      return await validarExclusaoDeOrgaos(id);
    } catch (error) {
      console.error("Erro ao validar exclusão:", error);
      return null;
    }
  };

  const handleDeleteOrgao = async (
    id: number
  ): Promise<ExclusaoOrgaoResponse | null> => {
    try {
      const resposta = await ExcluirOrgao(String(id));
      refetch();
      return resposta;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return {
    orgaos: orgaos?.data || [],
    total: orgaos?.total || 0,
    isFetching,
    executarBusca,
    orgao,
    isFetchingOrgao,
    executarBuscaPorId,
    filtros,
    validarExclusao,
    handleDeleteOrgao,
  };
}
