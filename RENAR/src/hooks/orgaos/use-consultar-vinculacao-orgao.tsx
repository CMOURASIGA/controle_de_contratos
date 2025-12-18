import { buscaVinculacaoOrgaos } from "@/services/orgaos/orgaos.service";
import { useQuery } from "@tanstack/react-query";

export function useConsultarVinculacaoOrgao(idOrgao: string) {
  const { data: vinculacaoOrgao, isFetching: isFetchingVinculacaoOrgao } =
    useQuery({
      queryKey: ["vinculacao-orgao", idOrgao],
      queryFn: async () => await buscaVinculacaoOrgaos(idOrgao as string),
      enabled: Boolean(idOrgao),
    });

  return { vinculacaoOrgao, isFetchingVinculacaoOrgao };
}
