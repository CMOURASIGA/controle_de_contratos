"use client";

import { BuscaContainer } from "@/components/layouts/busca-container";
import { ButtonSearch } from "@/components/layouts/ui/buttons/button-search/button-search";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import { ExportIcon } from "@/components/layouts/ui/icons/export";
import { FiltrosAreaTematicaProps } from "@/types/area-tematica";
import { Button } from "@cnc-ti/layout-basic";
import { useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface CamposBuscaAreaTematicaProps {
  filtros?: FiltrosAreaTematicaProps;
  enviarFiltros: (filtros: Partial<FiltrosAreaTematicaProps>) => void;
  loading: boolean;
  exportarRelatorio?: () => void;
}

type FormFiltrosAreaTematica = {
  nome?: string;
  descricaoWeb?: string;
};

export function CamposBuscaAreaTematica({ 
    filtros, 
    enviarFiltros, 
    loading,
    exportarRelatorio,
  }: CamposBuscaAreaTematicaProps) {
  const isUpdatingFromWatch = useRef(false);

  const methods = useForm<FormFiltrosAreaTematica>({
    defaultValues: {
      nome: filtros?.nome ?? "",
      descricaoWeb: filtros?.descricaoWeb ?? "",
    },
  });

  useEffect(() => {
     if (!isUpdatingFromWatch.current) {
      methods.reset({
        nome: filtros?.nome ?? "",
        descricaoWeb: filtros?.descricaoWeb ?? "",
      });
    }
    isUpdatingFromWatch.current = false;
  }, [filtros, methods]);

  const onSubmit = (formData: FormFiltrosAreaTematica) => {
    const filtrosPreparados: Partial<FiltrosAreaTematicaProps> = {};

    if (formData.nome?.trim()) {
      filtrosPreparados.nome = formData.nome.trim();
    }

    if (formData.descricaoWeb?.trim()) {
      filtrosPreparados.descricaoWeb = formData.descricaoWeb.trim();
    }
    enviarFiltros(filtrosPreparados);
  };

  return (
    <>
      <BuscaContainer>
        <div className="flex justify-content-between">
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="w-full"
              aria-label="Filtros de busca de Áreas Temáticas"
            >
              <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 w-full">
                <TextField
                  name="nome"
                  label="Nome da Área Temática"
                  placeholder="Nome da Área Temática"
                />
                <TextField
                  name="descricaoWeb"
                  label="Descrição Web"
                  placeholder="Descrição Web"
                />
             
                <div className="actions flex items-end justify-end gap-2 align-content-center">
                   <div>
                    <ButtonSearch
                      loading={loading}
                      aria-label="Buscar Áreas Temáticas"
                    />
                  </div>
                  <div>
                    <Button onClick={exportarRelatorio} className="button h-10 gap-2 text-xs font-medium">
                      <ExportIcon />
                      Baixar Relatório
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </BuscaContainer>
    </>
  );
}