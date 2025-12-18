import { buscarTodasFuncoes, Funcao } from "@/services/funcoes.service";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface FuncoesOption {
    label: string;
    value: string;
}

export function useSelectFuncoes(
    searchTerm: string,
    enabled = true,
    id?: number
) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["funcoes-select", searchTerm, id],
        queryFn: () =>
            buscarTodasFuncoes({
                nomeFuncao: searchTerm || undefined,
                id: id !== undefined ? String(id) : undefined,
            }),
        enabled: enabled, 
        staleTime: 1000 * 60 * 5,
    });

    const opcoes: FuncoesOption[] = useMemo(() => {
        if (!data?.itens) return [];
        return data.itens.map((funcao: Funcao) => ({
            value: String(funcao.id),
            label: funcao.nomeFuncao,
        }));
    }, [data]);

    return {
        opcoes,
        isLoading,
        error,
    };
}

