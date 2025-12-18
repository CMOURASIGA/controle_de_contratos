import { useQuery } from "@tanstack/react-query";
import { buscarOrganizacoesPorRepresentanteId } from "@/services/representantes.service";

/**
 * Hook personalizado para consultar organizações de um representante
 * @param representanteId - ID do representante para buscar as organizações
 * @returns Objeto contendo organizações e estado de carregamento
 */
export function useConsultarOrganizacoesRepresentante(representanteId?: number) {
  const { data: organizacoes, isLoading } = useQuery({
    queryKey: ["organizacoes", representanteId],
    queryFn: async () => await buscarOrganizacoesPorRepresentanteId(representanteId!),
    enabled: !!representanteId,
  });

  return { organizacoes, isLoading };
}