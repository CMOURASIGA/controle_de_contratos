"use client";

import { useQuery } from "@tanstack/react-query";
import { useLayoutEffect, useMemo, useState } from "react";

import { useQueryString } from "@/hooks/use-query-params";
import {
  FiltrosMandatosProps,
  ListaMandatosResponse,
  listarMandatos,
} from "@/services/mandatos.service";
import type { Mandato } from "@/services/representantes.service";
import { CamposBuscaMandatos } from "./busca/campos-busca";
import { CabecalhoBuscaMandatos } from "./cabecalhos/cabecalho-busca";
import { GradeMandatos } from "./grades/grade-mandatos";
import { GradeMandatosCarregando } from "./grid-mandatos-skeleton";

const CAMPOS_FILTROS: Array<keyof FiltrosMandatosProps> = [
  "idRepresentacao",
  "idPessoa",
  "idOrganizacao",
  "idTipoMandato",
  "idFuncao",
  "situacao",
  "situacaoPublicacao",
  "dataInicioDe",
  "dataInicioAte",
  "dataFimDe",
  "dataFimAte",
  "nomeIndicacao",
  "tipoLancamento",
];

export function BuscaMandatos() {
  const [filtros, setFiltros] = useState<FiltrosMandatosProps>({});
  const { updateQueryParams, getAllQueryStrings } = useQueryString();

  const enviarFiltros = (filtrosForm: Partial<FiltrosMandatosProps>) => {
    const filtrosLimpos: Partial<FiltrosMandatosProps> = {};

    if (
      filtrosForm.idRepresentacao !== undefined &&
      !Number.isNaN(filtrosForm.idRepresentacao)
    ) {
      filtrosLimpos.idRepresentacao = filtrosForm.idRepresentacao;
    }

    if (
      filtrosForm.idPessoa !== undefined &&
      !Number.isNaN(filtrosForm.idPessoa)
    ) {
      filtrosLimpos.idPessoa = filtrosForm.idPessoa;
    }

    if (
      filtrosForm.idOrganizacao !== undefined &&
      !Number.isNaN(filtrosForm.idOrganizacao)
    ) {
      filtrosLimpos.idOrganizacao = filtrosForm.idOrganizacao;
    }

    if (
      filtrosForm.idTipoMandato !== undefined &&
      !Number.isNaN(filtrosForm.idTipoMandato)
    ) {
      filtrosLimpos.idTipoMandato = filtrosForm.idTipoMandato;
    }

    if (
      filtrosForm.idFuncao !== undefined &&
      !Number.isNaN(filtrosForm.idFuncao)
    ) {
      filtrosLimpos.idFuncao = filtrosForm.idFuncao;
    }

    if (
      filtrosForm.situacao !== undefined &&
      !Number.isNaN(filtrosForm.situacao)
    ) {
      filtrosLimpos.situacao = filtrosForm.situacao;
    }

    if (
      filtrosForm.situacaoPublicacao !== undefined &&
      !Number.isNaN(filtrosForm.situacaoPublicacao)
    ) {
      filtrosLimpos.situacaoPublicacao = filtrosForm.situacaoPublicacao;
    }

    if (filtrosForm.dataInicioDe) {
      filtrosLimpos.dataInicioDe = filtrosForm.dataInicioDe;
    }

    if (filtrosForm.dataInicioAte) {
      filtrosLimpos.dataInicioAte = filtrosForm.dataInicioAte;
    }

    if (filtrosForm.dataFimDe) {
      filtrosLimpos.dataFimDe = filtrosForm.dataFimDe;
    }

    if (filtrosForm.dataFimAte) {
      filtrosLimpos.dataFimAte = filtrosForm.dataFimAte;
    }

    if (filtrosForm.nomeIndicacao?.trim()) {
      filtrosLimpos.nomeIndicacao = filtrosForm.nomeIndicacao.trim();
    }

    if (filtrosForm.tipoLancamento?.trim()) {
      filtrosLimpos.tipoLancamento = filtrosForm.tipoLancamento.trim();
    }

    const filtrosFinais =
      Object.keys(filtrosLimpos).length > 0 ? filtrosLimpos : {};

    setFiltros(filtrosFinais as FiltrosMandatosProps);

    const queryParams: Record<string, string | null> = {};

    CAMPOS_FILTROS.forEach((campo) => {
      const valor = filtrosLimpos[campo];
      if (valor === undefined || valor === null || valor === "") {
        queryParams[campo] = null;
        return;
      }

      if (typeof valor === "number") {
        queryParams[campo] = valor.toString();
        return;
      }

      queryParams[campo] = valor;
    });

    updateQueryParams(queryParams);
  };

  const { data, isFetching, refetch } = useQuery<ListaMandatosResponse>({
    queryKey: ["mandatos", filtros],
    queryFn: async () =>
      await listarMandatos((filtros || {}) as FiltrosMandatosProps),
  });

  useLayoutEffect(() => {
    const queriesParams = getAllQueryStrings();
    if (queriesParams && Object.keys(queriesParams).length > 0) {
      const filtrosConvertidos: FiltrosMandatosProps = {};

      if (queriesParams.idRepresentacao) {
        const valor = Number(queriesParams.idRepresentacao);
        if (!Number.isNaN(valor)) {
          filtrosConvertidos.idRepresentacao = valor;
        }
      }

      if (queriesParams.idPessoa) {
        const valor = Number(queriesParams.idPessoa);
        if (!Number.isNaN(valor)) {
          filtrosConvertidos.idPessoa = valor;
        }
      }

      if (queriesParams.idOrganizacao) {
        const valor = Number(queriesParams.idOrganizacao);
        if (!Number.isNaN(valor)) {
          filtrosConvertidos.idOrganizacao = valor;
        }
      }

      if (queriesParams.idTipoMandato) {
        const valor = Number(queriesParams.idTipoMandato);
        if (!Number.isNaN(valor)) {
          filtrosConvertidos.idTipoMandato = valor;
        }
      }

      if (queriesParams.idFuncao) {
        const valor = Number(queriesParams.idFuncao);
        if (!Number.isNaN(valor)) {
          filtrosConvertidos.idFuncao = valor;
        }
      }

      if (queriesParams.situacao) {
        const valor = Number(queriesParams.situacao);
        if (!Number.isNaN(valor)) {
          filtrosConvertidos.situacao = valor;
        }
      }

      if (queriesParams.situacaoPublicacao) {
        const valor = Number(queriesParams.situacaoPublicacao);
        if (!Number.isNaN(valor)) {
          filtrosConvertidos.situacaoPublicacao = valor;
        }
      }

      if (queriesParams.dataInicioDe) {
        filtrosConvertidos.dataInicioDe = queriesParams.dataInicioDe;
      }

      if (queriesParams.dataInicioAte) {
        filtrosConvertidos.dataInicioAte = queriesParams.dataInicioAte;
      }

      if (queriesParams.dataFimDe) {
        filtrosConvertidos.dataFimDe = queriesParams.dataFimDe;
      }

      if (queriesParams.dataFimAte) {
        filtrosConvertidos.dataFimAte = queriesParams.dataFimAte;
      }

      if (queriesParams.nomeIndicacao) {
        filtrosConvertidos.nomeIndicacao = queriesParams.nomeIndicacao;
      }

      if (queriesParams.tipoLancamento) {
        filtrosConvertidos.tipoLancamento = queriesParams.tipoLancamento;
      }

      setFiltros(filtrosConvertidos);
    }
  }, []);

  const itens = useMemo(() => (data?.itens as Mandato[]) ?? [], [data?.itens]);

  return (
    <>
      <CabecalhoBuscaMandatos />
      <CamposBuscaMandatos
        filtros={filtros}
        enviarFiltros={enviarFiltros}
        loading={isFetching}
      />
      <section className="px-6">
        {isFetching ? (
          <GradeMandatosCarregando />
        ) : (
          <GradeMandatos
            itens={itens}
            total={data?.total ?? 0}
            refetch={refetch}
          />
        )}
      </section>
    </>
  );
}
