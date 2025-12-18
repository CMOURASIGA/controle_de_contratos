import { useQueryString } from "@/hooks/useQueryParams";
import {
  buscarRepresentantes,
  excluirRepresentante,
  ExcluirRepresentanteResponse,
  validarExclusaoRepresentante,
  ValidarExclusaoResponse,
} from "@/services/representantes.service";
import { FormBuscaRepresentantes } from "@/types/representante";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import useRoute from "../useRoute";

export function useRepresentantes() {
  const { getAllQueryStrings } = useQueryString();
  const { numeroRepresentante, nome, profissao, categoria, ativo } =
    getAllQueryStrings();
  const { handleItemClick } = useRoute();

  const filtros = useMemo(
    () => ({
      numeroRepresentante,
      nome,
      profissao,
      categoria,
      ativo: ativo === "true" ? true : ativo === "false" ? false : undefined,
    }),
    [numeroRepresentante, nome, profissao, categoria, ativo]
  );

  const queryKey = useMemo(() => ["busca-representantes", filtros], [filtros]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => await buscarRepresentantes(filtros),
  });

  const executarBusca = async (novosFiltros: FormBuscaRepresentantes) => {
    handleItemClick(novosFiltros, "value");
  };

  const handleDeleteRepresentante = async (
    id: number
  ): Promise<ExcluirRepresentanteResponse | null> => {
    try {
      const resposta = await excluirRepresentante(id);
      await refetch();

      return resposta;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const validarExclusao = async (
    id: number
  ): Promise<ValidarExclusaoResponse | null> => {
    try {
      return await validarExclusaoRepresentante(id);
    } catch (error) {
      console.error("Erro ao validar exclusão:", error);
      return null;
    }
  };

  const opcoesRepresentante =
    (data &&
      data?.itens?.map((representante) => {
        const idPessoa =
          (representante as { idPessoa?: string })?.idPessoa ??
          representante.id;

        return {
          value: idPessoa.toString(),
          label: representante.nome,
        };
      })) ||
    [];

  return {
    representantes: data?.itens || [],
    opcoesRepresentante,
    isLoading,
    totalResultados: data?.total ?? 0,
    erro: error as Error | null,
    buscarRepresentantes: executarBusca,
    excluirRepresentante: handleDeleteRepresentante,
    validarExclusao,
  };
}
