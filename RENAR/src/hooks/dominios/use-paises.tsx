"use client";

import {
  buscarPaises,
  type OpcaoPais,
  type Pais,
} from "@/services/dominios/paises.service";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook para gerenciar dados de países
 * @returns Objeto com dados dos países, opções formatadas e estados de carregamento
 */
export function usePaises() {
  const {
    data: paises = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["paises"],
    queryFn: buscarPaises,
  });

  const opcoesPaises: OpcaoPais[] | [] = paises.map((pais: Pais) => ({
    value: String(pais.id),
    label: pais.nome,
    id: pais.id,
    codigo: pais.sigla,
  }));

  return {
    paises,
    opcoesPaises,
    estaCarregando: isLoading,
    erro: error,
    recarregar: refetch,
  };
}
