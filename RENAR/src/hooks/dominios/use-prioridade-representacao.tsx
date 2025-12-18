import { buscarPrioridadeRepresentacaoPorId } from "@/services/prioridade-representacao.service";
import { useQuery } from "@tanstack/react-query";

export function useConsultarPrioridadeRepresentacao(id: string) {
    const { data, isLoading, error, isError } = useQuery({
        queryKey: ["prioridadeRepresentacao", id],
        queryFn: async () => await buscarPrioridadeRepresentacaoPorId(id),
    });
    return { 
        prioridadeSelected: data, 
        isLoading, 
        error, 
        isError, 
    };
}