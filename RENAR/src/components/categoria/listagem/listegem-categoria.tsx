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
import { FiltrosCategoriaProps } from "@/types/categoria.type";
import { buscarTodasCategorias, Categoria, exportarCategorias } from "@/services/categorias.service";
import { CamposBuscaCategoria } from "./campos-busca-categoria";
import GradeCategoria from "./grade-categoria";

const CAMPOS_FILTROS: Array<keyof FiltrosCategoriaProps> = [
  "nomeCategoria",
];

export default function ListagemCategoria() {
  const [filtros, setFiltros] = useState<FiltrosCategoriaProps>({});
  const { updateQueryParams, getAllQueryStrings } = useQueryString();

  const enviarFiltros = (filtrosForm: Partial<FiltrosCategoriaProps>) => {
    const filtrosLimpos: Partial<FiltrosCategoriaProps> = {};
    if (filtrosForm.nomeCategoria?.trim()) {
      filtrosLimpos.nomeCategoria = filtrosForm.nomeCategoria.trim();
    }

    const filtrosFinais =
      Object.keys(filtrosLimpos).length > 0 ? filtrosLimpos : {};

    setFiltros(filtrosFinais as FiltrosCategoriaProps);

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
    queryKey: ["all-categoria", filtros],
    queryFn: async () => await buscarTodasCategorias(filtros),
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
      const blob = await exportarCategorias(filtros);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `categorias-${new Date().toISOString().split("T")[0]}.xlsx`;
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
      const filtrosConvertidos: FiltrosCategoriaProps = {};


      if (queriesParams.nomeCategoria) {
        filtrosConvertidos.nomeCategoria = queriesParams.nomeCategoria;
      }

      setFiltros(filtrosConvertidos);
    }
  }, []);

  const itens = useMemo(() => (data?.itens as Categoria[]) ?? [], [data?.itens]);
  return (
    <>
      <PageHeader className="flex flex-col gap-y-6 lg:flex-row items-center">
        <PageHeaderTitleContent className="flex flex-col lg:flex-row gap-6 items-center">
          <ButtonBack />
          <div className="flex flex-col lg:flex-row w-full items-center gap-4 lg:gap-6 text-center lg:text-start">
            <PageHeaderTitle
              title="Buscar Categorias"
              description="Página de busca de categorias"
            />
          </div>
        </PageHeaderTitleContent>
        <div>
          <div className="flex gap-2">
            {/* {data && data?.total > 0 && (
              <ButtonExport onClick={handleExport} />
            )} */}
            <Button variant="create" className="font-semibold">
              <Link href="/categorias/novo">Nova Categoria</Link>
            </Button>
          </div>
        </div>
      </PageHeader>
      <CamposBuscaCategoria
        filtros={filtros}
        enviarFiltros={enviarFiltros}
        loading={isFetching}
        handleExport={handleExport}
      />

      <section className="px-6">
        {isFetching ? (
          <GradeMandatosCarregando />
        ) : (
          <GradeCategoria
            itens={itens}
            total={data?.total ?? 0}
          />
        )}
      </section>

    </>
  )
}