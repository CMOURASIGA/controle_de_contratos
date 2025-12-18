import { useQuery } from "@tanstack/react-query";
import { buscarMandatosPorRepresentanteId } from "@/services/representantes.service";

export function useConsultarMandatosRepresentante(representanteId?: number) {
  const { data: mandatos, isLoading } = useQuery({
    queryKey: ["mandatos", representanteId],
    queryFn: async () => await buscarMandatosPorRepresentanteId(representanteId!),
    enabled: !!representanteId,
  });

  return { mandatos, isLoading };
}