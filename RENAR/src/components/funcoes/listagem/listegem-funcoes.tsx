"use client";

import { useLayoutEffect, useMemo, useState } from "react";
import { useQueryString } from "@/hooks/use-query-params";
import { useQuery } from "@tanstack/react-query";
import { Button, PageHeader, PageHeaderTitle, PageHeaderTitleContent } from "@cnc-ti/layout-basic";
import { ButtonBack } from "@/components/layouts/ui/buttons/button-back/button-back";
import Link from "next/link";
import { GradeMandatosCarregando } from "@/components/mandatos/grid-mandatos-skeleton";
import Swal from "sweetalert2";
import { FiltrosFuncoesProps } from "@/types/funcoes.type";
import { buscarTodasFuncoes, exportarFuncoes, Funcao } from "@/services/funcoes.service";
import { CamposBuscaFuncoes } from "./campos-busca-funcoes";
import GradeFuncao from "./grade-funcao";

const CAMPOS_FILTROS: Array<keyof FiltrosFuncoesProps> = [
  "nomeFuncao",
  "idHierarquia",
];

export default function ListagemFuncoes() {
  const [filtros, setFiltros] = useState<FiltrosFuncoesProps>({});
  const { updateQueryParams, getAllQueryStrings } = useQueryString();

  const enviarFiltros = (filtrosForm: Partial<FiltrosFuncoesProps>) => {
    const filtrosLimpos: Partial<FiltrosFuncoesProps> = {};
    if (filtrosForm.nomeFuncao?.trim()) {
      filtrosLimpos.nomeFuncao = filtrosForm.nomeFuncao.trim();
    }

    if (filtrosForm.idHierarquia?.trim()) {
      filtrosLimpos.idHierarquia = filtrosForm.idHierarquia.trim();
    }

    const filtrosFinais =
      Object.keys(filtrosLimpos).length > 0 ? filtrosLimpos : {};

    setFiltros(filtrosFinais as FiltrosFuncoesProps);
    const queryParams: Record<string, string | null> = {};

    CAMPOS_FILTROS.forEach((campo) => {
      const valor = filtrosLimpos[campo];
      if (valor === undefined || valor === null || valor === "") {
        queryParams[campo] = null;
        return;
      }

      queryParams[campo] = valor;
    });

    updateQueryParams(queryParams);
  };
  
  const { data, isFetching } = useQuery({
    queryKey: ["funcoes-all", filtros],
    queryFn: async () => await buscarTodasFuncoes(filtros),
  });

  const handleExport = async () => {
    if (!data || data.total === 0) {
      Swal.fire({
        text: "Não há dados para exportar",
        icon: "warning",
        width: 500,
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    try {
      const blob = await exportarFuncoes(filtros);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `funcoes-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(link);
      await link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Erro ao exportar:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Erro ao exportar relatório.";
      Swal.fire({
        text: errorMessage,
        icon: "error",
        width: 500,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  useLayoutEffect(() => {
    const queriesParams = getAllQueryStrings();
    if (queriesParams && Object.keys(queriesParams).length > 0) {
      const filtrosConvertidos: FiltrosFuncoesProps = {};


      if (queriesParams.nomeFuncao) {
        filtrosConvertidos.nomeFuncao = queriesParams.nomeFuncao;
      }

      if (queriesParams.idHierarquia) {
        filtrosConvertidos.idHierarquia = queriesParams.idHierarquia;
      }
      setFiltros(filtrosConvertidos);
    }
  }, []);

  const itens = useMemo(() => (data?.itens as Funcao[]) ?? [], [data?.itens]);
  return (
    <>
      <PageHeader className="flex flex-col gap-y-6 lg:flex-row items-center">
        <PageHeaderTitleContent className="flex flex-col lg:flex-row gap-6 items-center">
          <ButtonBack />
          <div className="flex flex-col lg:flex-row w-full items-center gap-4 lg:gap-6 text-center lg:text-start">
            <PageHeaderTitle
              title="Buscar Funções"
              description="Página de busca de funções"
            />
          </div>
        </PageHeaderTitleContent>
        <div>
          <div className="flex gap-2">
            {/* {data && data?.total > 0 && (
              <ButtonExport onClick={handleExport} />
            )} */}
            <Button variant="create" className="font-semibold">
              <Link href="/funcoes/novo">Nova Função</Link>
            </Button>
          </div>
        </div>
      </PageHeader>
      <CamposBuscaFuncoes
        filtros={filtros}
        enviarFiltros={enviarFiltros}
        loading={isFetching}
        handleExport={handleExport}
      />

      <section className="px-6">
        {isFetching ? (
          <GradeMandatosCarregando />
        ) : (
          <GradeFuncao
            itens={itens}
            total={data?.total ?? 0}
          />
        )}
      </section>

    </>
  )
}