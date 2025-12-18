"use client";

import { FiltrosTextoWebProps } from "@/types/texto-web";
import { useLayoutEffect, useMemo, useState } from "react";
import { useQueryString } from "@/hooks/use-query-params";
import { useQuery } from "@tanstack/react-query";
import { buscarTodosTextoWeb, exportarTextosWeb, TextoWeb } from "@/services/texto-web.service";
import { Button, PageHeader, PageHeaderTitle, PageHeaderTitleContent } from "@cnc-ti/layout-basic";
import { ButtonBack } from "@/components/layouts/ui/buttons/button-back/button-back";
import Link from "next/link";
import { CamposBuscaTextoWeb } from "./campos-busca-texto-web";
import { GradeMandatosCarregando } from "@/components/mandatos/grid-mandatos-skeleton";
import GradeTextoWeb from "./grade-texto-web";
import Swal from "sweetalert2";

const CAMPOS_FILTROS: Array<keyof FiltrosTextoWebProps> = [
  "tituloTexto",
  "resumoTexto",
  "descricaoTexto",
];

export default function ListagemTextoWeb() {
  const [filtros, setFiltros] = useState<FiltrosTextoWebProps>({});
  const { updateQueryParams, getAllQueryStrings } = useQueryString();

  const enviarFiltros = (filtrosForm: Partial<FiltrosTextoWebProps>) => {
    const filtrosLimpos: Partial<FiltrosTextoWebProps> = {};

    if (filtrosForm.tituloTexto?.trim()) {
      filtrosLimpos.tituloTexto = filtrosForm.tituloTexto.trim();
    }

    if (filtrosForm.resumoTexto?.trim()) {
      filtrosLimpos.resumoTexto = filtrosForm.resumoTexto.trim();
    }

    if (filtrosForm.descricaoTexto?.trim()) {
      filtrosLimpos.descricaoTexto = filtrosForm.descricaoTexto.trim();
    }

    const filtrosFinais =
      Object.keys(filtrosLimpos).length > 0 ? filtrosLimpos : {};

    setFiltros(filtrosFinais as FiltrosTextoWebProps);

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
    queryKey: ["textoWeb", filtros],
    queryFn: async () => await buscarTodosTextoWeb(filtros),
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
      const blob = await exportarTextosWeb(filtros);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `textos-web-${new Date().toISOString().split("T")[0]}.xlsx`;
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
      const filtrosConvertidos: FiltrosTextoWebProps = {};


      if (queriesParams.tituloTexto) {
        filtrosConvertidos.tituloTexto = queriesParams.tituloTexto;
      }

      if (queriesParams.resumoTexto) {
        filtrosConvertidos.resumoTexto = queriesParams.resumoTexto;
      }

      if (queriesParams.descricaoTexto) {
        filtrosConvertidos.descricaoTexto = queriesParams.descricaoTexto;
      }
      setFiltros(filtrosConvertidos);
    }
  }, []);

  const itens = useMemo(() => (data?.itens as TextoWeb[]) ?? [], [data?.itens]);

  return (
    <>
      <PageHeader className="flex flex-col gap-y-6 lg:flex-row items-center">
        <PageHeaderTitleContent className="flex flex-col lg:flex-row gap-6 items-center">
          <ButtonBack />
          <div className="flex flex-col lg:flex-row w-full items-center gap-4 lg:gap-6 text-center lg:text-start">
            <PageHeaderTitle
              title="Buscar Textos Web"
              description="Página de busca de textos web"
            />
          </div>
        </PageHeaderTitleContent>
        <div>
          <div className="flex gap-2">
            <Button variant="create" className="font-semibold">
              <Link href="/texto-web/novo">Novo Texto Web</Link>
            </Button>
          </div>
        </div>
      </PageHeader>
      <CamposBuscaTextoWeb
        filtros={filtros}
        enviarFiltros={enviarFiltros}
        loading={isFetching}
        exportarRelatorio={handleExport}
      />

      <section className="px-6">
        {isFetching ? (
          <GradeMandatosCarregando />
        ) : (
          <GradeTextoWeb
            itens={itens}
            total={data?.total ?? 0}
          />
        )}
      </section>

    </>
  )
}