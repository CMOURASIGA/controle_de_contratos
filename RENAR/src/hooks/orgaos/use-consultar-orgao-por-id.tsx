import { buscarOrgaoPorId } from "@/services/orgaos/orgaos.service";
import { useQuery } from "@tanstack/react-query";

export function useConsultarOrgaoPorId(orgaoId: string) {
  const { data: orgao, isLoading } = useQuery({
    queryKey: ["orgao", orgaoId],
    queryFn: async () => await buscarOrgaoPorId(orgaoId),
    enabled: !!orgaoId,
  });
  return { orgaoSelecionado: orgao, isLoading };
}
