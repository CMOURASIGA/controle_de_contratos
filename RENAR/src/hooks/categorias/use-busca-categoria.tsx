import { buscarCategoriaPorId } from "@/services/categorias.service";
import { useQuery } from "@tanstack/react-query";

export function useConsultarCategoria(idCategoria: string) {
    const { data, isLoading, error, isError } = useQuery({
        queryKey: ["busca-categoria", idCategoria],
        queryFn: async () => await buscarCategoriaPorId(idCategoria),
    });
    return { 
        categoriaSelected: data, 
        isLoading, 
        error, 
        isError, 
    };
}