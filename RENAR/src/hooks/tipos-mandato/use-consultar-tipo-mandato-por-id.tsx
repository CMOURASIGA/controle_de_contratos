import { buscarTipoMandatoPorId } from "@/services/tipos-mandato.service";
import { useQuery } from "@tanstack/react-query";

export function useConsultarTipoMandatoPorId(tipoMandatoId: string) {
  const { data: tipoMandatoSelecionado, isLoading } = useQuery({
    queryKey: ["tipo-mandato", tipoMandatoId],
    queryFn: async () => await buscarTipoMandatoPorId(tipoMandatoId),
    enabled: !!tipoMandatoId,
  });
  return { tipoMandatoSelecionado, isLoading };
}

