"use client";

import { BuscaContainer } from "@/components/layouts/busca-container";
import { ButtonSearch } from "@/components/layouts/ui/buttons/button-search/button-search";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import { ExportIcon } from "@/components/layouts/ui/icons/export";
import { SelectFieldFuncoes } from "@/components/shared/select-field-funcoes";
import { FiltrosFuncoesProps } from "@/types/funcoes.type";
import { Button } from "@cnc-ti/layout-basic";
import { useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface CamposBuscaFuncoesProps {
  filtros?: FiltrosFuncoesProps;
  enviarFiltros: (filtros: Partial<FiltrosFuncoesProps>) => void;
  loading: boolean;
  handleExport: () => void;
}

type FormFiltrosFuncoes = {
  nomeFuncao?: string;
  idHierarquia?: string;
};

export function CamposBuscaFuncoes({ 
  filtros, 
  enviarFiltros, 
  handleExport,
  loading }: CamposBuscaFuncoesProps) {
  const isUpdatingFromWatch = useRef(false);

  const methods = useForm<FormFiltrosFuncoes>({
    defaultValues: {
      nomeFuncao: filtros?.nomeFuncao ?? "",
      idHierarquia: filtros?.idHierarquia ?? "",
    },
  });

  useEffect(() => {
     if (!isUpdatingFromWatch.current) {
      methods.reset({
        nomeFuncao: filtros?.nomeFuncao ?? "",
        idHierarquia: filtros?.idHierarquia ?? "",
      });
    }
    isUpdatingFromWatch.current = false;
  }, [filtros, methods]);

  const onSubmit = (formData: FormFiltrosFuncoes) => {
    const filtrosPreparados: Partial<FiltrosFuncoesProps> = {};

    if (formData.nomeFuncao?.trim()) {
      filtrosPreparados.nomeFuncao = formData.nomeFuncao.trim();
    }

    if (formData.idHierarquia?.trim()) {
      filtrosPreparados.idHierarquia = formData.idHierarquia.trim();
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
              <div className="grid grid-cols-1 xl:grid-cols-[repeat(5,minmax(0,1fr))] gap-4 w-full items-end">
                <SelectFieldFuncoes
                  name="idHierarquia"
                  label="Hierarquia"
                  placeholder="Buscar por função pai"
                  value={filtros?.idHierarquia ?? "0"}
                />
                 <TextField
                    name="nomeFuncao"
                    label="Nome da Função"
                    placeholder="Nome da Função"
                  />
              </div>
              <div className="actions flex items-end justify-end gap-2 align-content-center">
                <div>
                  <ButtonSearch
                    loading={loading}
                    aria-label="Buscar representantes"
                  />
                </div>
                <div>
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