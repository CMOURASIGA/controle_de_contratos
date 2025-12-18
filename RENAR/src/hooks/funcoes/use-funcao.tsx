import { buscarFuncaoPorId } from "@/services/funcoes.service";
import { useQuery } from "@tanstack/react-query";

export function useConsultarFuncao(funcaoId: string) {
    const { data, isLoading, error, isError } = useQuery({
        queryKey: ["funcao-id", funcaoId],
        queryFn: async () => await buscarFuncaoPorId(funcaoId),
    });
    return { 
        funcaoSelected: data, 
        isLoading, 
        error, 
        isError, 
    };
}