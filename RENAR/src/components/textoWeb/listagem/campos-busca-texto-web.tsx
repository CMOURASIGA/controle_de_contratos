"use client";

import { BuscaContainer } from "@/components/layouts/busca-container";
import { ButtonSearch } from "@/components/layouts/ui/buttons/button-search/button-search";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import { ExportIcon } from "@/components/layouts/ui/icons/export";
import { FiltrosTextoWebProps } from "@/types/texto-web";
import { Button } from "@cnc-ti/layout-basic";
import { useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface CamposBuscaTextoWebProps {
  filtros?: FiltrosTextoWebProps;
  enviarFiltros: (filtros: Partial<FiltrosTextoWebProps>) => void;
  loading: boolean;
  exportarRelatorio?: () => void;
}

type FormFiltrosTextoWeb = {
  tituloTexto?: string;
  resumoTexto?: string;
};

export function CamposBuscaTextoWeb({ 
  filtros, 
  enviarFiltros,
  exportarRelatorio, 
  loading }: CamposBuscaTextoWebProps) {
  const isUpdatingFromWatch = useRef(false);

  const methods = useForm<FormFiltrosTextoWeb>({
    defaultValues: {
      tituloTexto: filtros?.tituloTexto ?? "",
      resumoTexto: filtros?.resumoTexto ?? "",
    },
  });

  useEffect(() => {
     if (!isUpdatingFromWatch.current) {
      methods.reset({
        tituloTexto: filtros?.tituloTexto ?? "",
        resumoTexto: filtros?.resumoTexto ?? "",
      });
    }
    isUpdatingFromWatch.current = false;
  }, [filtros, methods]);

  const onSubmit = (formData: FormFiltrosTextoWeb) => {
    const filtrosPreparados: Partial<FiltrosTextoWebProps> = {};

    if (formData.tituloTexto?.trim()) {
      filtrosPreparados.tituloTexto = formData.tituloTexto.trim();
    }

    if (formData.resumoTexto?.trim()) {
      filtrosPreparados.resumoTexto = formData.resumoTexto.trim();
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
              aria-label="Filtros de busca de Textos Web"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 w-full">
                  <TextField
                    name="tituloTexto"
                    label="Título do texto"
                    placeholder="Título do texto"
                  />
                  <TextField
                    name="resumoTexto"
                    label="Resumo do texto"
                    placeholder="Resumo do texto"
                  />
                <div className="actions flex items-end justify-end gap-2 align-content-center">
                  <div>
                    <ButtonSearch
                      loading={loading}
                      aria-label="Buscar representantes"
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