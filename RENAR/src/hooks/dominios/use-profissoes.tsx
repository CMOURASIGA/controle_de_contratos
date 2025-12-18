"use client";

import { fetchAllProfissoes } from "@/services/dominios/profissoes.service";
import { useQuery } from "@tanstack/react-query";

export interface OpcaoProfissao {
  value: string;
  label: string;
}

export function useProfissoes() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["profissoes"],
    queryFn: fetchAllProfissoes,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const opcoesProfissoes: OpcaoProfissao[] =
    data?.map((profissao) => ({
      value: profissao.id.toString(),
      label: profissao.nome,
    })) || [];

  return {
    profissoes: data || [],
    opcoesProfissoes,
    isLoading,
    erro: error as Error | null,
  };
}
