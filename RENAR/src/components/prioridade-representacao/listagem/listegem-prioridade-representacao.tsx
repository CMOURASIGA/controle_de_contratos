"use client";

import { useLayoutEffect, useMemo, useState } from "react";
import { useQueryString } from "@/hooks/use-query-params";
import { useQuery } from "@tanstack/react-query";
import { Button, PageHeader, PageHeaderTitle, PageHeaderTitleContent } from "@cnc-ti/layout-basic";
import { ButtonBack } from "@/components/layouts/ui/buttons/button-back/button-back";
import Link from "next/link";
import { GradeMandatosCarregando } from "@/components/mandatos/grid-mandatos-skeleton";
import Swal from "sweetalert2";
import { FiltrosPrioridadeRepresentacaoProps } from "@/types/prioridade-representacap";
import { buscarTodasPrioridadesRepresentacao, exportarPrioridadesRepresentacao, PrioridadeRepresentacao } from "@/services/prioridade-representacao.service";
import { CamposBuscaPrioridade } from "./campos-busca-prioridade-representacao";
import GradePrioridadeRepresentacao from "./grade-prioridade-representacao";

const CAMPOS_FILTROS: Array<keyof FiltrosPrioridadeRepresentacaoProps> = [
  "descricao",
];

export default function ListagemPrioridadeRepresentacao() {
  const [filtros, setFiltros] = useState<FiltrosPrioridadeRepresentacaoProps>({});
  const { updateQueryParams, getAllQueryStrings } = useQueryString();

  const enviarFiltros = (filtrosForm: Partial<FiltrosPrioridadeRepresentacaoProps>) => {
    const filtrosLimpos: Partial<FiltrosPrioridadeRepresentacaoProps> = {};

    if (filtrosForm.descricao?.trim()) {
      filtrosLimpos.descricao = filtrosForm.descricao.trim();
    }

    const filtrosFinais =
      Object.keys(filtrosLimpos).length > 0 ? filtrosLimpos : {};

    setFiltros(filtrosFinais as FiltrosPrioridadeRepresentacaoProps);
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
    queryKey: ["prioridadesRepresentacao", filtros],
    queryFn: async () => await buscarTodasPrioridadesRepresentacao(filtros),
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
      const blob = await exportarPrioridadesRepresentacao(filtros);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `prioridades-representacao-${new Date().toISOString().split("T")[0]}.xlsx`;
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
      const filtrosConvertidos: FiltrosPrioridadeRepresentacaoProps = {};


      if (queriesParams.descricao) {
        filtrosConvertidos.descricao = queriesParams.descricao;
      }
      setFiltros(filtrosConvertidos);
    }
  }, []);

  const itens = useMemo(() => (data?.itens as PrioridadeRepresentacao[]) ?? [], [data?.itens]);

  return (
    <>
      <PageHeader className="flex flex-col gap-y-6 lg:flex-row items-center">
        <PageHeaderTitleContent className="flex flex-col lg:flex-row gap-6 items-center">
          <ButtonBack />
          <div className="flex flex-col lg:flex-row w-full items-center gap-4 lg:gap-6 text-center lg:text-start">
            <PageHeaderTitle
              title="Buscar Prioridades de Representação"
              description="Página de busca de prioridades de representação cadastradas no sistema."
            />
          </div>
        </PageHeaderTitleContent>
        <div>
          <div className="flex gap-2">
            {/* {data && data?.total > 0 && (
              <ButtonExport onClick={handleExport} />
            )} */}
            <Button variant="create" className="font-semibold">
              <Link href="/prioridade-representacao/novo">Nova Prioridade de Representação</Link>
            </Button>
          </div>
        </div>
      </PageHeader>
      <CamposBuscaPrioridade
        filtros={filtros}
        enviarFiltros={enviarFiltros}
        loading={isFetching}
        handleExportar={handleExport}
      />

      <section className="px-6">
        {isFetching ? (
          <GradeMandatosCarregando />
        ) : (
          <GradePrioridadeRepresentacao
            itens={itens}
            total={data?.total ?? 0}
          />
        )}
      </section>

    </>
  )
}