"use client";

import { useLayoutEffect, useMemo, useState } from "react";
import { useQueryString } from "@/hooks/use-query-params";
import { useQuery } from "@tanstack/react-query";
import { Button, PageHeader, PageHeaderTitle, PageHeaderTitleContent } from "@cnc-ti/layout-basic";
import { ButtonBack } from "@/components/layouts/ui/buttons/button-back/button-back";
import Link from "next/link";
import { GradeMandatosCarregando } from "@/components/mandatos/grid-mandatos-skeleton";
import Swal from "sweetalert2";
import { FiltrosTipoReuniaoProps } from "@/types/tipo-reuniao";
import { buscarTodosTipoReuniao, exportarTipoReuniao, TipoReuniao } from "@/services/tipo-reuniao.service";
import GradeTipoReuniao from "./grade-tipo-reuniao";
import { CamposBuscaTipoReuniao } from "./campos-busca-tipo-reuniao";

const CAMPOS_FILTROS: Array<keyof FiltrosTipoReuniaoProps> = [
  "descricao",
];

export default function ListagemTipoReuniao() {
  const [filtros, setFiltros] = useState<FiltrosTipoReuniaoProps>({});
  const { updateQueryParams, getAllQueryStrings } = useQueryString();

  const enviarFiltros = (filtrosForm: Partial<FiltrosTipoReuniaoProps>) => {
    const filtrosLimpos: Partial<FiltrosTipoReuniaoProps> = {};

    if (filtrosForm.descricao?.trim()) {
      filtrosLimpos.descricao = filtrosForm.descricao.trim();
    }

    const filtrosFinais =
      Object.keys(filtrosLimpos).length > 0 ? filtrosLimpos : {};

    setFiltros(filtrosFinais as FiltrosTipoReuniaoProps);

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
    queryKey: ["tipo-reuniao-filtro", filtros],
    queryFn: async () => await buscarTodosTipoReuniao(filtros),
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
      const blob = await exportarTipoReuniao(filtros);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `tipo-reuniao-${new Date().toISOString().split("T")[0]}.xlsx`;
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
      const filtrosConvertidos: FiltrosTipoReuniaoProps = {};
      if (queriesParams.descricao) {
        filtrosConvertidos.descricao = queriesParams.descricao;
      }

      setFiltros(filtrosConvertidos);
    }
  }, []);

  const itens = useMemo(() => (data?.itens as TipoReuniao[]) ?? [], [data?.itens]);

  return (
    <>
      <PageHeader className="flex flex-col gap-y-6 lg:flex-row items-center">
        <PageHeaderTitleContent className="flex flex-col lg:flex-row gap-6 items-center">
          <ButtonBack />
          <div className="flex flex-col lg:flex-row w-full items-center gap-4 lg:gap-6 text-center lg:text-start">
            <PageHeaderTitle
              title="Buscar Tipos de Reunião"
              description="Página de busca de tipos de reunião"
            />
          </div>
        </PageHeaderTitleContent>
        <div>
          <div className="flex gap-2">
            <Button variant="create" className="font-semibold">
              <Link href="/tipo-reuniao/novo">Novo Tipo de Reunião</Link>
            </Button>
          </div>
        </div>
      </PageHeader>
      <CamposBuscaTipoReuniao
        filtros={filtros}
        enviarFiltros={enviarFiltros}
        loading={isFetching}
        exportarRelatorio={handleExport}
      />

      <section className="px-6">
        {isFetching ? (
          <GradeMandatosCarregando />
        ) : (
          <GradeTipoReuniao
            itens={itens}
            total={data?.total ?? 0}
          />
        )}
      </section>

    </>
  )
}