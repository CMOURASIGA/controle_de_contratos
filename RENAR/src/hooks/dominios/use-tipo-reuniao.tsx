import { buscarTipoReuniaoPorId } from "@/services/tipo-reuniao.service";
import { useQuery } from "@tanstack/react-query";

export function useConsultarTipoReuniao(tipoReuniaoId: string) {
    const { data, isLoading, error, isError } = useQuery({
        queryKey: ["tipo-reuniao-id", tipoReuniaoId],
        queryFn: async () => await buscarTipoReuniaoPorId(tipoReuniaoId),
    });
    return { 
        tipoReuniaoSelected: data, 
        isLoading, 
        error, 
        isError, 
    };
}