import { buscarAtividadePorId } from "@/services/atividades.service";
import { useQuery } from "@tanstack/react-query";

export function useConsultarAtividade(atividadeId: string) {
    const { data: atividade, isLoading, error, isError } = useQuery({
        queryKey: ["atividade", atividadeId],
        queryFn: async () => await buscarAtividadePorId(atividadeId),
        enabled: !!atividadeId,
        retry: false,
        retryOnMount: false,
        refetchOnWindowFocus: false,
    });

    return {
        atividadeSelected: atividade,
        isLoading,
        error,
        isError,
        isNotFound: isError && error instanceof Error && error.message.includes("não encontrada")
    };
}

