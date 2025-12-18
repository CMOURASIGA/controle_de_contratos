import { buscarPrestacaoContasPorId } from "@/services/atividades.service";
import { useQuery } from "@tanstack/react-query";

export function useConsultarPrestacaoContas(atividadeId: number) {
  const { data: prestacaoContas, isLoading } = useQuery({
    queryKey: ["atividade", atividadeId],
    queryFn: async () => await buscarPrestacaoContasPorId(atividadeId),
    enabled: !!atividadeId,
  });

  return { prestacaoContasSelected: prestacaoContas, isLoading };
}
