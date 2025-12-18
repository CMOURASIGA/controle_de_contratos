import {
  listarMotivosCancelamento,
  buscarMotivoCancelamentoPorId,
} from "@/services/motivos-cancelamento.service";
import {
  MotivoCancelamentoResponse,
  FiltrosMotivosCancelamentoProps,
} from "@/types/motivo-cancelamento.type";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useQueryString } from "../use-query-params";
import useRoute from "../useRoute";

export default function useMotivosCancelamento(idMotivo?: string) {
  const { getAllQueryStrings } = useQueryString();
  const { nome } = getAllQueryStrings();
  const { handleItemClick } = useRoute();

  const filtros = useMemo(
    () => ({
      nome,
    }),
    [nome]
  );

  const queryKey = useMemo(
    () => ["busca-motivos-cancelamento-filtros", filtros],
    [filtros]
  );

  const {
    data: motivosCancelamento,
    isFetching,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () =>
      await listarMotivosCancelamento(filtros as FiltrosMotivosCancelamentoProps),
    enabled: true,
  });

  const executarBusca = async (novosFiltros: FiltrosMotivosCancelamentoProps) => {
    handleItemClick(novosFiltros, "value");
  };

  const executarBuscaPorId = async (id: string) => {
    handleItemClick({ id }, "id");
  };

  const { data: motivoCancelamento, isFetching: isFetchingMotivo } = useQuery({
    queryKey: ["motivo-cancelamento", idMotivo],
    queryFn: async () => await buscarMotivoCancelamentoPorId(idMotivo as string),
    enabled: Boolean(idMotivo),
  });

  // Garantir que sempre retornamos um array
  const motivosArray: MotivoCancelamentoResponse[] = Array.isArray(motivosCancelamento)
    ? motivosCancelamento
    : motivosCancelamento?.itens || [];

  const totalCount: number = Array.isArray(motivosCancelamento)
    ? motivosCancelamento.length
    : motivosCancelamento?.total || 0;

  return {
    motivosCancelamento: motivosArray,
    total: totalCount,
    isFetching,
    executarBusca,
    motivoCancelamento,
    isFetchingMotivo,
    executarBuscaPorId,
    filtros,
    refetch,
  };
}

