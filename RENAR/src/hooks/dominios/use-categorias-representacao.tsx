"use client";

import { fetchAllCategoriasRepresentacao } from "@/services/dominios/categorias-representacao.service";
import { useQuery } from "@tanstack/react-query";

export interface OpcaoCategoriaRepresentacao {
  value: string;
  label: string;
}

export function useCaregoriasRepresentacao() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["categorias-representacao"],
    queryFn: fetchAllCategoriasRepresentacao,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const opcoesCategoriasRepresentacao: OpcaoCategoriaRepresentacao[] =
    data?.map((categoriaRepresentacao) => ({
      value: categoriaRepresentacao.id.toString(),
      label: categoriaRepresentacao.nome,
    })) || [];

  return {
    opcoesCategoriasRepresentacao,
    isLoading,
    erro: error as Error | null,
  };
}
