"use client";

import { BuscaContainer } from "@/components/layouts/busca-container";
import { ButtonSearch } from "@/components/layouts/ui/buttons/button-search/button-search";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import { ExportIcon } from "@/components/layouts/ui/icons/export";
import { FiltrosTipoReuniaoProps } from "@/types/tipo-reuniao";
import { Button } from "@cnc-ti/layout-basic";
import { useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface CamposBuscaTipoReuniaoProps {
  filtros?: FiltrosTipoReuniaoProps;
  enviarFiltros: (filtros: Partial<FiltrosTipoReuniaoProps>) => void;
  loading: boolean;
  exportarRelatorio?: () => void;
}

type FormFiltrosTipoReuniao = {
  descricao?: string;
};

export function CamposBuscaTipoReuniao({ 
  filtros, 
  enviarFiltros,
  exportarRelatorio, 
  loading }: CamposBuscaTipoReuniaoProps) {
  const isUpdatingFromWatch = useRef(false);

  const methods = useForm<FormFiltrosTipoReuniao>({
    defaultValues: {
      descricao: filtros?.descricao ?? "",
    },
  });

  useEffect(() => {
     if (!isUpdatingFromWatch.current) {
      methods.reset({
        descricao: filtros?.descricao ?? "",
      });
    }
    isUpdatingFromWatch.current = false;
  }, [filtros, methods]);

  const onSubmit = (formData: FormFiltrosTipoReuniao) => {
    const filtrosPreparados: Partial<FiltrosTipoReuniaoProps> = {};

    if (formData.descricao?.trim()) {
      filtrosPreparados.descricao = formData.descricao.trim();
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
              aria-label="Filtros de busca de Tipos de Reunião"
            >
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 w-full">
                  <TextField
                    name="descricao"
                    label="Descrição"
                    placeholder="Descrição do tipo de reunião"
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