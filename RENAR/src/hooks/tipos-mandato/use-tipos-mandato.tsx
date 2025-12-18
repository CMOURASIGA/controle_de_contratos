import {
  listarTiposMandato,
  buscarTipoMandatoPorId,
} from "@/services/tipos-mandato.service";
import {
  TipoMandatoResponse,
  FiltrosTiposMandatoProps,
} from "@/types/tipo-mandato.type";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useQueryString } from "../use-query-params";
import useRoute from "../useRoute";

export default function useTiposMandato(idTipoMandato?: string) {
  const { getAllQueryStrings } = useQueryString();
  const { descricao, dataCadastro, dataAlteracao, modificadoPor } = getAllQueryStrings();
  const { handleItemClick } = useRoute();

  const filtros = useMemo(
    () => ({
      descricao,
      dataCadastro,
      dataAlteracao,
      modificadoPor,
    }),
    [descricao, dataCadastro, dataAlteracao, modificadoPor]
  );

  const queryKey = useMemo(
    () => ["busca-tipos-mandato-filtros", filtros],
    [filtros]
  );

  const {
    data: tiposMandato,
    isFetching,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () =>
      await listarTiposMandato(filtros as FiltrosTiposMandatoProps),
    enabled: true,
  });

  const executarBusca = async (novosFiltros: FiltrosTiposMandatoProps) => {
    handleItemClick(novosFiltros, "value");
  };

  const executarBuscaPorId = async (id: string) => {
    handleItemClick({ id }, "id");
  };

  const { data: tipoMandato, isFetching: isFetchingTipo } = useQuery({
    queryKey: ["tipo-mandato", idTipoMandato],
    queryFn: async () => await buscarTipoMandatoPorId(idTipoMandato as string),
    enabled: Boolean(idTipoMandato),
  });

  // Garantir que sempre retornamos um array
  const tiposArray: TipoMandatoResponse[] = Array.isArray(tiposMandato)
    ? tiposMandato
    : tiposMandato?.itens || [];

  const totalCount: number = Array.isArray(tiposMandato)
    ? tiposMandato.length
    : tiposMandato?.total || 0;

  return {
    tiposMandato: tiposArray,
    total: totalCount,
    isFetching,
    executarBusca,
    tipoMandato,
    isFetchingTipo,
    executarBuscaPorId,
    filtros,
    refetch,
  };
}

