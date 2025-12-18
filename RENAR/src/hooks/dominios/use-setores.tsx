"use client";

import { fetchAllSetores } from "@/services/dominios/setores.service";
import { useQuery } from "@tanstack/react-query";

export interface OpcaoSetores {
  value: string;
  label: string;
}

export function useSetores() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["setores"],
    queryFn: fetchAllSetores,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const opcoesSetores: OpcaoSetores[] =
    data?.map((setor) => ({
      value: setor.sigla,
      label: setor.sigla,
    })) || [];

  return {
    setores: data || [],
    opcoesSetores,
    isLoading,
    erro: error as Error | null,
  };
}
