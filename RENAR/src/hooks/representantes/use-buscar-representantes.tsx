import { buscarRepresentantes } from "@/services/representantes.service";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface RepresentanteOption {
    label: string;
    value: string;
}

export function useBuscarRepresentantes(
    searchTerm: string,
    enabled = true,
    idRepresentante?: number
) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["buscar-representantes", searchTerm, idRepresentante],
        queryFn: () =>
            buscarRepresentantes({
                nome: searchTerm || undefined,
                numeroRepresentante: idRepresentante?.toString(),
            }),
        enabled: enabled, // Sempre habilitado para carregar resultados iniciais
        staleTime: 1000 * 60 * 5, // 5 minutos
    });

    const opcoes: RepresentanteOption[] = useMemo(() => {
        if (!data?.itens) return [];
        return data.itens.map((representante) => {
            // Usar o ID numérico do representante, não o idPessoa (UUID)
            const idRepresentante = representante.id;
            return {
                value: idRepresentante.toString(),
                label: representante.nome,
            };
        });
    }, [data]);

    return {
        opcoes,
        isLoading,
        error,
    };
}

