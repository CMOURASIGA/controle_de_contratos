import { buscarRepresentantePorId } from "@/services/representantes.service";
import { useQuery } from "@tanstack/react-query";

export function useConsultarRepresentante(representanteId?: string) {
  const { data: representante, isLoading } = useQuery({
    queryKey: ["representante", representanteId],
    queryFn: async () => await buscarRepresentantePorId(representanteId!),
    enabled: !!representanteId,
  });

  return { representanteSelected: representante, isLoading };
}
