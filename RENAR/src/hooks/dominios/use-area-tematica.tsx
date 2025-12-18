import { buscarAreaTematicaPorId } from "@/services/area-tematica.service";
import { useQuery } from "@tanstack/react-query";

export function useConsultarAreaTematica(id: string) {
    const { data, isLoading, error, isError } = useQuery({
        queryKey: ["area-tematica-id", id],
        queryFn: async () => await buscarAreaTematicaPorId(id),
    });
    return { 
        areaTematicaSelected: data, 
        isLoading, 
        error, 
        isError, 
    };
}