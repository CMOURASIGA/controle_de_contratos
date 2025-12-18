"use client";

import { useLayoutEffect, useMemo, useState } from "react";
import { useQueryString } from "@/hooks/use-query-params";
import { useQuery } from "@tanstack/react-query";
import { Button, PageHeader, PageHeaderTitle, PageHeaderTitleContent } from "@cnc-ti/layout-basic";
import { ButtonBack } from "@/components/layouts/ui/buttons/button-back/button-back";
import Link from "next/link";
import { GradeMandatosCarregando } from "@/components/mandatos/grid-mandatos-skeleton";
import { ButtonExport } from "@/components/layouts/ui/buttons/button-export/button-export";
import Swal from "sweetalert2";
import GradeAreaTematica from "./grade-area-tematica";
import { FiltrosAreaTematicaProps } from "@/types/area-tematica";
import { AreaTematica, buscarTodasAreasTematicas, exportarAreasTematicas } from "@/services/area-tematica.service";
import { CamposBuscaAreaTematica } from "./campos-busca-area-tematica";

const CAMPOS_FILTROS: Array<keyof FiltrosAreaTematicaProps> = [
  "nome",
  "descricaoWeb",
];

export default function ListagemAreaTematica() {
  const [filtros, setFiltros] = useState<FiltrosAreaTematicaProps>({});
  const { updateQueryParams, getAllQueryStrings } = useQueryString();

  const enviarFiltros = (filtrosForm: Partial<FiltrosAreaTematicaProps>) => {
    const filtrosLimpos: Partial<FiltrosAreaTematicaProps> = {};

    if (filtrosForm.nome?.trim()) {
      filtrosLimpos.nome = filtrosForm.nome.trim();
    }

    if (filtrosForm.descricaoWeb?.trim()) {
      filtrosLimpos.descricaoWeb = filtrosForm.descricaoWeb.trim();
    }

    const filtrosFinais =
      Object.keys(filtrosLimpos).length > 0 ? filtrosLimpos : {};

    setFiltros(filtrosFinais as FiltrosAreaTematicaProps);

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
    queryKey: ["areas-tematicas", filtros],
    queryFn: async () => await buscarTodasAreasTematicas(filtros),
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
      const blob = await exportarAreasTematicas(filtros);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `areas-tematicas-${new Date().toISOString().split("T")[0]}.xlsx`;
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
      const filtrosConvertidos: FiltrosAreaTematicaProps = {};
      
      if (queriesParams.nome) {
        filtrosConvertidos.nome = queriesParams.nome;
      }

      if (queriesParams.descricaoWeb) {
        filtrosConvertidos.descricaoWeb = queriesParams.descricaoWeb;
      }
      setFiltros(filtrosConvertidos);
    }
  }, []);

  const itens = useMemo(() => (data?.itens as AreaTematica[]) ?? [], [data?.itens]);
  return (
    <>
      <PageHeader className="flex flex-col gap-y-6 lg:flex-row items-center">
        <PageHeaderTitleContent className="flex flex-col lg:flex-row gap-6 items-center">
          <ButtonBack />
          <div className="flex flex-col lg:flex-row w-full items-center gap-4 lg:gap-6 text-center lg:text-start">
            <PageHeaderTitle
              title="Buscar Áreas Temáticas"
              description="Página de busca de áreas temáticas"
            />
          </div>
        </PageHeaderTitleContent>
        <div>
          <div className="flex gap-2">
            {/* {data && data?.total > 0 && (
              <ButtonExport onClick={handleExport} />
            )} */}
            <Button variant="create" className="font-semibold">
              <Link href="/area-tematica/novo">Nova Área Temática</Link>
            </Button>
          </div>
        </div>
      </PageHeader>
      <CamposBuscaAreaTematica
        filtros={filtros}
        enviarFiltros={enviarFiltros}
        loading={isFetching}
        exportarRelatorio={handleExport}
      />

      <section className="px-6">
        {isFetching ? (
          <GradeMandatosCarregando />
        ) : (
          <GradeAreaTematica
            itens={itens}
            total={data?.total ?? 0}
          />
        )}
      </section>

    </>
  )
}