import { buscarRepresentacaoPorId } from "@/services/representacoes.service";
import { useQuery } from "@tanstack/react-query";

export function useConsultarRepresentacao(
  representacaoId: string,
  incluirVinculo: boolean = true
) {
  const { data: representacao, isLoading } = useQuery({
    queryKey: ["representacao", representacaoId],
    queryFn: async () =>
      await buscarRepresentacaoPorId(representacaoId, incluirVinculo),
    enabled: !!representacaoId,
  });

  return { representacaoSelected: representacao, isLoading };
}
