"use client";

import { useQueryString } from "@/hooks/use-query-params";
import { Atividade, FiltrosAtividadesProps, ListaAtividadesResponse } from "@/types/atividade.type";
import { useQuery } from "@tanstack/react-query";
import { useLayoutEffect, useMemo, useState } from "react";
import CabecalhoBuscaAtividades from "./cabecalho-busca-atividades";
import { GradeMandatosCarregando } from "@/components/mandatos/grid-mandatos-skeleton";
import { listarAtividades } from "@/services/atividades.service";
import { GradeAtividade } from "../grade/grade-atividades";
import CamposBuscaAtividades from "./campos-busca-atividade";

const CAMPOS_FILTROS: Array<keyof FiltrosAtividadesProps> = [
  "idRepresentante",
  "idRepresentacao",
  "idTipoAtividade",
  "statusAtividade",
  "descricaoAtividade",
  "dataInicioAtividade",
  "dataFimAtividade",
];

const BuscaAtividades = () => {
  const [filtros, setFiltros] = useState<FiltrosAtividadesProps>({});
  const { updateQueryParams, getAllQueryStrings } = useQueryString();

  const enviarFiltros = (filtrosForm: Partial<FiltrosAtividadesProps>) => {
    const filtrosLimpos: Partial<FiltrosAtividadesProps> = {};

    if (
      filtrosForm.idRepresentacao !== undefined &&
      !Number.isNaN(filtrosForm.idRepresentacao)
    ) {
      filtrosLimpos.idRepresentacao = filtrosForm.idRepresentacao;
    }

    if (
      filtrosForm.idRepresentante !== undefined &&
      !Number.isNaN(filtrosForm.idRepresentante)
    ) {
      filtrosLimpos.idRepresentante = filtrosForm.idRepresentante;
    }

    if (
      filtrosForm.idRepresentante !== undefined &&
      !Number.isNaN(filtrosForm.idRepresentante)
    ) {
      filtrosLimpos.idRepresentante = filtrosForm.idRepresentante;
    }

    if (
      filtrosForm.idTipoAtividade !== undefined &&
      !Number.isNaN(filtrosForm.idTipoAtividade)
    ) {
      filtrosLimpos.idTipoAtividade = filtrosForm.idTipoAtividade;
    }

    if (
      filtrosForm.statusAtividade !== undefined &&
      !Number.isNaN(filtrosForm.statusAtividade)
    ) {
      filtrosLimpos.statusAtividade = filtrosForm.statusAtividade;
    }

    if (
      filtrosForm.descricaoAtividade !== undefined &&
      filtrosForm.descricaoAtividade.trim() !== ""
    ) {
      filtrosLimpos.descricaoAtividade = filtrosForm.descricaoAtividade;
    }

    if (
      filtrosForm.dataInicioAtividade !== undefined
    ) {
      filtrosLimpos.dataInicioAtividade = filtrosForm.dataInicioAtividade;
    }

    if (filtrosForm.dataFimAtividade !== undefined
    ) {
      filtrosLimpos.dataFimAtividade = filtrosForm.dataFimAtividade;
    }

    const filtrosFinais =
      Object.keys(filtrosLimpos).length > 0 ? filtrosLimpos : {};

    setFiltros(filtrosFinais as FiltrosAtividadesProps);

    const queryParams: Record<string, string | null> = {};

    CAMPOS_FILTROS.forEach((campo) => {
      const valor = filtrosLimpos[campo];
      if (valor === undefined || valor === null || valor === "") {
        queryParams[campo] = null;
        return;
      }

      if (valor instanceof Date) {
        queryParams[campo] = valor.toISOString();
        return;
      }
      queryParams[campo] = typeof valor === "number" ? valor.toString() : valor;
    });

    updateQueryParams(queryParams);
  };

  const { data, isFetching, refetch } = useQuery<ListaAtividadesResponse>({
    queryKey: ["atividades", filtros],
    queryFn: async () =>
      await listarAtividades((filtros || {}) as FiltrosAtividadesProps),
  });

  useLayoutEffect(() => {
    const queriesParams = getAllQueryStrings();
    if (queriesParams && Object.keys(queriesParams).length > 0) {
      const filtrosConvertidos: FiltrosAtividadesProps = {};

      if (queriesParams.idRepresentacao) {
        const valor = queriesParams.idRepresentacao;
        if (valor.trim() !== "") {
          const numero = Number(valor);
          if (!Number.isNaN(numero)) {
            filtrosConvertidos.idRepresentacao = numero;
          }
        }
      }

      if (queriesParams.idRepresentante) {
        const valor = queriesParams.idRepresentante;
        if (valor.trim() !== "") {
          const numero = Number(valor);
          if (!Number.isNaN(numero)) {
            filtrosConvertidos.idRepresentante = numero;
          }
        }
      }

      if (queriesParams.idTipoAtividade) {
        const valor = queriesParams.idTipoAtividade;
        if (valor.trim() !== "") {
          const numero = Number(valor);
          if (!Number.isNaN(numero)) {
            filtrosConvertidos.idTipoAtividade = numero;
          }
        }
      }

      if (queriesParams.statusAtividade) {
        const valor = queriesParams.statusAtividade;
        if (valor.trim() !== "") {
          const numero = Number(valor);
          if (!Number.isNaN(numero)) {
            filtrosConvertidos.statusAtividade = numero;
          }
        }
      }

      if (queriesParams.descricaoAtividade) {
        const valor = queriesParams.descricaoAtividade;
        if (valor.trim() !== "") {
          filtrosConvertidos.descricaoAtividade = valor;
        }
      }

      if (queriesParams.dataInicioAtividade) {
        filtrosConvertidos.dataInicioAtividade = queriesParams.dataInicioAtividade;
      }

      if (queriesParams.dataFimAtividade) {
        filtrosConvertidos.dataFimAtividade = queriesParams.dataFimAtividade;
      }


      setFiltros(filtrosConvertidos);
    }
  }, []);

  const itens = useMemo(() => (data?.itens as Atividade[]) ?? [], [data?.itens]);

  return (
    <>
      <CabecalhoBuscaAtividades />
      <CamposBuscaAtividades
        filtros={filtros}
        enviarFiltros={enviarFiltros}
        loading={isFetching}
      />
      <section className="px-6">
        {isFetching ? (
          <GradeMandatosCarregando />
        ) : (
          <GradeAtividade
            itens={itens}
            total={data?.total ?? 0}
          />
        )}
      </section>
    </>
  );
}

export default BuscaAtividades;