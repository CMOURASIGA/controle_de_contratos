"use client";

import {
  buscarUfs,
  type FiltroUf,
  type Uf,
} from "@/services/dominios/ufs.service";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook para gerenciar dados de UFs
 * @param filtro - Filtros opcionais para a busca
 * @returns Objeto com dados das UFs, opções formatadas e estados de carregamento
 */
export function useUfs(filtro?: FiltroUf) {
  const {
    data: ufs,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["ufs", filtro],
    queryFn: () => buscarUfs(filtro),
  });

  /**
   * Formata as UFs para uso em componentes de seleção
   */
  const opcoesUfs =
    ufs?.map((uf: Uf) => ({
      value: uf.id,
      label: `${uf.nome} (${uf.sigla})`,
      id: uf.id,
      sigla: uf.sigla,
    })) || [];

  // Mantém compatibilidade com a versão anterior
  const ufsOptions =
    ufs?.map((uf: Uf) => ({
      label: uf.sigla,
      value: String(uf.id),
    })) || [];

  return {
    /** Lista completa de UFs */
    ufs,
    /** Opções formatadas para componentes de seleção (nova versão) */
    opcoesUfs,
    /** Opções formatadas para componentes de seleção (compatibilidade) */
    ufsOptions,
    /** Indica se os dados estão sendo carregados */
    estaCarregando: isLoading,
    /** Erro ocorrido durante o carregamento */
    erro: error,
    /** Função para recarregar os dados */
    recarregar: refetch,
  };
}
