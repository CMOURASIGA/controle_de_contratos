"use client";

import { useQuery } from "@tanstack/react-query";
import { httpAuthClient } from "@/services/api";

/**
 * Interface para representar uma categoria
 */
export interface Categoria {
  id: number;
  nome: string;
  dataCriacao: Date;
  dataAlteracao: Date;
}

/**
 * Interface para opções do Combobox
 */
export interface OpcaoCategoria {
  value: string;
  label: string;
}

/**
 * Função para buscar categorias da API
 * @returns Promise com lista de categorias
 */
async function buscarCategorias(): Promise<Categoria[]> {
  try {
    const resposta = await httpAuthClient('/dominios/categorias');
    const dados = await resposta.json();
    return dados;
  } catch (erro) {
    console.error('Erro ao buscar categorias:', erro);
    throw new Error('Falha ao carregar categorias. Tente novamente.');
  }
}

/**
 * Hook para buscar e gerenciar categorias
 * @returns Dados e funções para categorias
 */
export function useCategorias() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["categorias"],
    queryFn: buscarCategorias,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });

  // Transforma as categorias em opções para Combobox
  const opcoesCategorias: OpcaoCategoria[] = data?.map((categoria) => ({
    value: categoria.id.toString(),
    label: categoria.nome,
  })) || [];

  return {
    categorias: data || [],
    opcoesCategorias,
    isLoading,
    erro: error as Error | null,
  };
}