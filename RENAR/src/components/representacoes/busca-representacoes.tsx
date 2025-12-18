"use client";

import {
  FiltrosRepresentacoesProps,
  listTodasRepesentacoes,
} from "@/services/representacoes.service";
import { useQuery } from "@tanstack/react-query";
import { CamposBuscaRepresentacoes } from "./busca/campos-busca";
import { CabecalhoBusca } from "./cabecalhos/cabecalho-busca";
import { GradeRepresentacoes } from "./grades/grade-representacoes";

import { useQueryString } from "@/hooks/use-query-params";
import { Representacao } from "@/types/representacao.type";
import { useLayoutEffect, useState } from "react";
import { GradeRepresetacaoCarregando } from "./grid-representacoes-skeleton";

export function BuscaRepresentacoes() {
  const [filtros, setFiltros] = useState<FiltrosRepresentacoesProps>({});
  const { updateQueryParams, getAllQueryStrings } = useQueryString();

  const enviarFiltros = (filtrosForm: Partial<FiltrosRepresentacoesProps>) => {
    // Limpar valores "Todos" (vazios ou "0") antes de passar para o estado
    const filtrosLimpos: Partial<FiltrosRepresentacoesProps> = {
      ...filtrosForm,
    };

    if (!filtrosLimpos.situacao) {
      delete filtrosLimpos.situacao;
    }
    if (filtrosLimpos.tipo === undefined) {
      delete filtrosLimpos.tipo;
    } else if (filtrosLimpos.tipo === (0 as 0 | 1 | 2 | 3)) {
      delete filtrosLimpos.tipo;
    }
    if (
      filtrosLimpos.idCategoria === undefined ||
      filtrosLimpos.idCategoria === null
    ) {
      delete filtrosLimpos.idCategoria;
    }
    if (filtrosLimpos.nome === "" || !filtrosLimpos.nome) {
      delete filtrosLimpos.nome;
    }
    if (
      filtrosLimpos.idNumeroOrganizacao === undefined ||
      filtrosLimpos.idNumeroOrganizacao === null
    ) {
      delete filtrosLimpos.idNumeroOrganizacao;
    }

    // Se todos os filtros foram limpos, usar objeto vazio para executar consulta padrão
    const filtrosFinais =
      Object.keys(filtrosLimpos).length > 0 ? filtrosLimpos : {};
    setFiltros(filtrosFinais as FiltrosRepresentacoesProps);

    // Obter parâmetros atuais da URL para detectar campos que precisam ser removidos
    const queryParamsAtuais = getAllQueryStrings();

    // Converter filtros para formato de query string (todos os valores devem ser string | null)
    // Sempre incluir todos os campos possíveis (do formulário e da URL atual) para garantir remoção quando deselecionados
    const queryParams: Record<string, string | null> = {};

    // Lista de todos os campos possíveis
    const camposPossiveis = [
      "idRepresentacao",
      "idNumeroOrganizacao",
      "situacao",
      "tipo",
      "idCategoria",
      "nome",
    ];

    // Processar cada campo: se existe no formulário ou na URL atual, deve ser processado
    camposPossiveis.forEach((campo) => {
      const existeNoFormulario = campo in filtrosForm;
      const existeNaUrl = campo in queryParamsAtuais;

      // Processar apenas se existe no formulário ou na URL (para remover se foi deselecionado)
      if (existeNoFormulario || existeNaUrl) {
        if (campo === "idRepresentacao") {
          queryParams.idRepresentacao =
            filtrosLimpos.idRepresentacao !== undefined
              ? filtrosLimpos.idRepresentacao.toString()
              : null;
        } else if (campo === "idNumeroOrganizacao") {
          queryParams.idNumeroOrganizacao =
            filtrosLimpos.idNumeroOrganizacao !== undefined
              ? filtrosLimpos.idNumeroOrganizacao.toString()
              : null;
        } else if (campo === "situacao") {
          queryParams.situacao = filtrosLimpos.situacao || null;
        } else if (campo === "tipo") {
          queryParams.tipo =
            filtrosLimpos.tipo !== undefined
              ? filtrosLimpos.tipo.toString()
              : null;
        } else if (campo === "idCategoria") {
          queryParams.idCategoria =
            filtrosLimpos.idCategoria !== undefined &&
            filtrosLimpos.idCategoria !== null
              ? filtrosLimpos.idCategoria.toString()
              : null;
        } else if (campo === "nome") {
          queryParams.nome =
            filtrosLimpos.nome && filtrosLimpos.nome !== ""
              ? filtrosLimpos.nome
              : null;
        }
      }
    });

    updateQueryParams(queryParams);
  };

  const { data: representacoes, isFetching } = useQuery({
    queryKey: ["representacoes", filtros],
    queryFn: async () =>
      await listTodasRepesentacoes(
        (filtros || {}) as FiltrosRepresentacoesProps
      ),
    enabled: true, // Sempre habilitado para permitir consulta padrão quando não há filtros
  });

  useLayoutEffect(() => {
    const queriesParams = getAllQueryStrings();
    if (queriesParams && Object.keys(queriesParams).length > 0) {
      const filtrosConvertidos: FiltrosRepresentacoesProps = {};

      if (queriesParams.idRepresentacao) {
        filtrosConvertidos.idRepresentacao = Number(
          queriesParams.idRepresentacao
        );
      }
      if (queriesParams.idNumeroOrganizacao) {
        filtrosConvertidos.idNumeroOrganizacao = Number(
          queriesParams.idNumeroOrganizacao
        );
      }
      if (queriesParams.situacao) {
        filtrosConvertidos.situacao = queriesParams.situacao as
          | "ATIVO"
          | "INATIVO"
          | "AGUARDANDO"
          | "DECLINADO";
      }
      if (queriesParams.tipo && queriesParams.tipo !== "0") {
        filtrosConvertidos.tipo = Number(queriesParams.tipo) as 0 | 1 | 2 | 3;
      }
      if (queriesParams.idCategoria) {
        filtrosConvertidos.idCategoria = Number(queriesParams.idCategoria);
      }
      if (queriesParams.nome) {
        filtrosConvertidos.nome = queriesParams.nome;
      }

      setFiltros(filtrosConvertidos);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <CabecalhoBusca />
      <CamposBuscaRepresentacoes
        enviarFiltros={enviarFiltros}
        loading={isFetching}
      />
      <section className="px-6">
        {isFetching ? (
          <GradeRepresetacaoCarregando />
        ) : (
          <GradeRepresentacoes
            itens={representacoes?.itens as Representacao[]}
            total={representacoes?.total as number}
          />
        )}
      </section>
    </>
  );
}
