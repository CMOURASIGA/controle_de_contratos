import { listarTiposAtividade } from "@/services/atividades.service";
import { TipoAtividade } from "@/types/atividade.type";
import { useQuery } from "@tanstack/react-query";

export function useAtividades() {
    const {
        data,
        isLoading: loadingTiposAtividade,
        error,
    } = useQuery({
        queryKey: ["tipos-atividade"],
        queryFn: listarTiposAtividade,
    });

    const tiposAtividade = (data ?? []) as TipoAtividade[];

    const opcoesTiposAtividade =
        tiposAtividade.map((tipo) => ({
            value: tipo.id.toString(),
            label: tipo.nome ?? tipo.descricao ?? `Tipo ${tipo.id}`,
        })) ?? [];

    return {
        tiposAtividade,
        opcoesTiposAtividade,
        loadingTiposAtividade,
        errorTiposAtividade: error as Error | null,
    };
}

