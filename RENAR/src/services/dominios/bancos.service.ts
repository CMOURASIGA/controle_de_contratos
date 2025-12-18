"use client";

import { httpAuthClient } from "@/services/api";

/**
 * Interface para representar um banco
 */
export interface Banco {
  id: number;
  numeroBanco: string;
  nome: string;
}

/**
 * Interface para opções do Combobox
 */
export interface OpcaoBanco {
  value: string;
  label: string;
  codigo: string;
}

/**
 * Função para buscar bancos da API
 * @returns Promise com lista de bancos
 */
export async function buscarBancos(): Promise<Banco[]> {
  try {
    const resposta = await httpAuthClient("/bancos");
    const dados = await resposta.json();
    return dados;
  } catch (erro) {
    console.error("Erro ao buscar bancos:", erro);
    throw new Error("Falha ao carregar bancos. Tente novamente.");
  }
}

/**
 * Função para buscar banco por código
 * @param codigo - Código do banco
 * @returns Promise com dados do banco
 */
export async function buscarBancoPorCodigo(
  codigo: string
): Promise<Banco | null> {
  try {
    const bancos = await buscarBancos();
    return bancos.find((banco) => banco.numeroBanco.toString() === codigo) || null;
  } catch (erro) {
    console.error("Erro ao buscar banco por código:", erro);
    return null;
  }
}
