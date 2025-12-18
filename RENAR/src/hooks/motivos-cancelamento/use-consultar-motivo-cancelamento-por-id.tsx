import { buscarMotivoCancelamentoPorId } from "@/services/motivos-cancelamento.service";
import { useQuery } from "@tanstack/react-query";

export function useConsultarMotivoCancelamentoPorId(motivoId: string) {
  const { data: motivoSelecionado, isLoading } = useQuery({
    queryKey: ["motivo-cancelamento", motivoId],
    queryFn: async () => await buscarMotivoCancelamentoPorId(motivoId),
    enabled: !!motivoId,
  });
  return { motivoSelecionado, isLoading };
}

