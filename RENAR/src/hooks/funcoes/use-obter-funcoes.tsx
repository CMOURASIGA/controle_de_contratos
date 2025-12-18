import { buscarTodasFuncoes, Funcao } from "@/services/funcoes.service";
import { useQuery } from "@tanstack/react-query";

export default function useObterFuncoes() {
    // Lógica para obter funções
    const { data: funcoes, isLoading: isLoadingFuncoes } = useQuery({
        queryKey: ["funcao-all"],
        queryFn: async () => await buscarTodasFuncoes(),
    });

    const opcoesFuncao =
        (funcoes &&
          funcoes?.itens.map((funcao: Funcao) => ({
            value: funcao.id.toString(),
            label: funcao.nomeFuncao,
          }))) ||
        [];

    return { funcoes, opcoesFuncao, isLoadingFuncoes };
}