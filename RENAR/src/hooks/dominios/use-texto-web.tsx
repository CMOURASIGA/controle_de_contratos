import { buscarTextoWebPorId } from "@/services/texto-web.service";
import { useQuery } from "@tanstack/react-query";

export function useConsultarTextoWeb(textoWebId: string) {
    const { data, isLoading, error, isError } = useQuery({
        queryKey: ["textoWeb", textoWebId],
        queryFn: async () => await buscarTextoWebPorId(textoWebId),
    });
    return { 
        textoWebSelected: data, 
        isLoading, 
        error, 
        isError, 
    };
}