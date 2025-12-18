import { fetchAllrepresentacoes } from "@/services/representacoes.service";
import { Representacao } from "@/types/representacao.type";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface RepresentacaoOption {
    label: string;
    value: string;
}

export function useBuscarRepresentacoes(
    searchTerm: string,
    enabled = true,
    idRepresentacao?: number
) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["buscar-representacoes", searchTerm, idRepresentacao],
        queryFn: () =>
            fetchAllrepresentacoes({
                nome: searchTerm || undefined,
                idRepresentacao: idRepresentacao,
            }),
        enabled: enabled, // Sempre habilitado para carregar resultados iniciais
        staleTime: 1000 * 60 * 5, // 5 minutos
    });

    const opcoes: RepresentacaoOption[] = useMemo(() => {
        if (!data?.itens) return [];
        return data.itens.map((representacao: Representacao) => ({
            value: representacao.idRepresentacao.toString(),
            label: representacao.nome,
        }));
    }, [data]);

    return {
        opcoes,
        isLoading,
        error,
    };
}

