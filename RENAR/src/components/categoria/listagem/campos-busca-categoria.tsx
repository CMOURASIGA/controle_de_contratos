"use client";

import { BuscaContainer } from "@/components/layouts/busca-container";
import { ButtonSearch } from "@/components/layouts/ui/buttons/button-search/button-search";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import { ExportIcon } from "@/components/layouts/ui/icons/export";
import { FiltrosCategoriaProps } from "@/types/categoria.type";
import { Button } from "@cnc-ti/layout-basic";
import { useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface CamposBuscaCategoriaProps {
  filtros?: FiltrosCategoriaProps;
  enviarFiltros: (filtros: Partial<FiltrosCategoriaProps>) => void;
  loading: boolean;
  handleExport?: () => void;
}

type FormFiltrosCategoria = {
  nomeCategoria?: string;
};

export function CamposBuscaCategoria({ 
  filtros, 
  enviarFiltros, 
  handleExport,
  loading }: CamposBuscaCategoriaProps) {
  const isUpdatingFromWatch = useRef(false);

  const methods = useForm<FormFiltrosCategoria>({
    defaultValues: {
      nomeCategoria: filtros?.nomeCategoria ?? "",
    },
  });

  useEffect(() => {
     if (!isUpdatingFromWatch.current) {
      methods.reset({
        nomeCategoria: filtros?.nomeCategoria ?? "",
      });
    }
    isUpdatingFromWatch.current = false;
  }, [filtros, methods]);

  const onSubmit = (formData: FormFiltrosCategoria) => {
    const filtrosPreparados: Partial<FiltrosCategoriaProps> = {};

    if (formData.nomeCategoria?.trim()) {
      filtrosPreparados.nomeCategoria = formData.nomeCategoria.trim();
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
              aria-label="Filtros de busca de Categorias"
            >
              <div className="grid grid-cols-2 xl:grid-cols-2 gap-4 w-full items-end">
                <TextField
                  name="nomeCategoria"
                  label="Nome da categoria"
                  placeholder="Nome da categoria"
                />

                <div className="actions flex items-end justify-end gap-2 align-content-center">
                  <div>
                    <ButtonSearch
                      loading={loading}
                      aria-label="Buscar Categorias"
                    />
                  </div>
                  <div>
                    <Button onClick={handleExport} className="button h-10 gap-2 text-xs font-medium">
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