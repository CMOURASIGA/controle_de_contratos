"use client";

import { BuscaContainer } from "@/components/layouts/busca-container";
import { ButtonSearch } from "@/components/layouts/ui/buttons/button-search/button-search";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import { ExportIcon } from "@/components/layouts/ui/icons/export";
import { FiltrosPrioridadeRepresentacaoProps } from "@/types/prioridade-representacap";
import { Button } from "@cnc-ti/layout-basic";
import { useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface CamposBuscaPrioridadeProps {
  filtros?: FiltrosPrioridadeRepresentacaoProps;
  enviarFiltros: (filtros: Partial<FiltrosPrioridadeRepresentacaoProps>) => void;
  loading: boolean;
  handleExportar: () => void;
}

type FormFiltrosPrioridade = {
  descricao?: string;
};

export function CamposBuscaPrioridade({ 
  filtros, 
  enviarFiltros, 
  handleExportar,
  loading }: CamposBuscaPrioridadeProps) {
  const isUpdatingFromWatch = useRef(false);

  const methods = useForm<FormFiltrosPrioridade>({
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

  const onSubmit = (formData: FormFiltrosPrioridade) => {
    const filtrosPreparados: Partial<FiltrosPrioridadeRepresentacaoProps> = {};

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
              aria-label="Filtros de busca de prioridade de representação"
            >
              <div className="grid grid-cols-2 xl:grid-cols-2 gap-4 w-full items-end">
                 <TextField
                    name="descricao"
                    label="Descrição"
                    placeholder="Descrição da prioridade"
                  />
                 
                 <div className="actions flex items-end justify-end gap-2 align-content-center">
                <div>
                  <ButtonSearch
                    loading={loading}
                    aria-label="Buscar prioridades de representação"
                  />
                </div>
                <div>
                  <Button onClick={handleExportar} className="button h-10 gap-2 text-xs font-medium">
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