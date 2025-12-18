
"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Combobox,
} from "@cnc-ti/layout-basic";
import { ChevronDown } from "lucide-react";

import { BuscaContainer } from "@/components/layouts/busca-container";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import { SelectFieldRepresentacao } from "@/components/shared/select-field-representacao";
import { ButtonSearch } from "@/components/layouts/ui/buttons/button-search/button-search";
import { DateField } from "@/components/layouts/ui/fields/date-field/date-field";
import { FiltrosMandatosProps } from "@/services/mandatos.service";

interface CamposBuscaMandatosProps {
  filtros?: FiltrosMandatosProps;
  enviarFiltros: (filtros: Partial<FiltrosMandatosProps>) => void;
  loading: boolean;
}

type FormFiltrosMandatos = {
  idRepresentacao?: string;
  situacao?: string;
  dataInicio?: string;
  dataFim?: string;
  nomeIndicacao?: string;
  tipoLancamento?: string;
};

const opcoesSituacao = [
  { label: "Todas", value: "" },
  { label: "A vencer", value: "-1" },
  { label: "Vencido", value: "0" },
];

const opcoesTipoLancamento = [
  { label: "Todos", value: "" },
  { label: "Mandato (M)", value: "M" },
  { label: "Evento (E)", value: "E" },
];

export function CamposBuscaMandatos({
  filtros,
  enviarFiltros,
  loading,
}: CamposBuscaMandatosProps) {
  const [mostrarAvancados, setMostrarAvancados] = useState(false);
  const isUpdatingFromWatch = useRef(false);

  const methods = useForm<FormFiltrosMandatos>({
    defaultValues: {
      idRepresentacao: filtros?.idRepresentacao
        ? String(filtros.idRepresentacao)
        : "",
      situacao:
        filtros?.situacao !== undefined ? String(filtros.situacao) : "",
      dataInicio: filtros?.dataInicioDe ?? "",
      dataFim: filtros?.dataFimAte ?? "",
      nomeIndicacao: filtros?.nomeIndicacao ?? "",
      tipoLancamento: filtros?.tipoLancamento ?? "",
    },
  });

  useEffect(() => {
    if (!isUpdatingFromWatch.current) {
      methods.reset({
        idRepresentacao: filtros?.idRepresentacao
          ? String(filtros.idRepresentacao)
          : "",
        situacao:
          filtros?.situacao !== undefined ? String(filtros.situacao) : "",
        dataInicio: filtros?.dataInicioDe ?? "",
        dataFim: filtros?.dataFimAte ?? "",
        nomeIndicacao: filtros?.nomeIndicacao ?? "",
        tipoLancamento: filtros?.tipoLancamento ?? "",
      });
    }
    isUpdatingFromWatch.current = false;
  }, [filtros, methods]);

  const onSubmit = (formData: FormFiltrosMandatos) => {
    const filtrosPreparados: Partial<FiltrosMandatosProps> = {};

    if (formData.idRepresentacao) {
      const valor = Number(formData.idRepresentacao);
      if (!Number.isNaN(valor)) {
        filtrosPreparados.idRepresentacao = valor;
      }
    }

    // if (formData.idPessoa) {
    //   const valor = Number(formData.idPessoa);
    //   if (!Number.isNaN(valor)) {
    //     filtrosPreparados.idPessoa = valor;
    //   }
    // }

    if (formData.situacao) {
      const valor = Number(formData.situacao);
      if (!Number.isNaN(valor)) {
        filtrosPreparados.situacao = valor;
      }
    }

    if (formData.dataInicio) {
      filtrosPreparados.dataInicioDe = formData.dataInicio;
    }

    if (formData.dataFim) {
      filtrosPreparados.dataFimAte = formData.dataFim;
    }

    if (formData.nomeIndicacao?.trim()) {
      filtrosPreparados.nomeIndicacao = formData.nomeIndicacao.trim();
    }

    if (formData.tipoLancamento) {
      filtrosPreparados.tipoLancamento = formData.tipoLancamento;
    }

    enviarFiltros(filtrosPreparados);
  };

  return (
    <BuscaContainer>
      <div className="flex justify-content-between">
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="w-full"
            aria-label="Filtros de busca de mandatos"
          >
            <Collapsible
              open={mostrarAvancados}
              onOpenChange={setMostrarAvancados}
              className="flex flex-col gap-4 w-full"
            >
              <div className="grid grid-cols-1 xl:grid-cols-[repeat(5,minmax(0,1fr))] gap-4 w-full items-end">
                <SelectFieldRepresentacao
                  name="idRepresentacao"
                  label="Representação"
                  placeholder="Buscar representação"
                  value={filtros?.idRepresentacao}
                />

                <TextField
                  name="nomeIndicacao"
                  label="Nome da indicação"
                  placeholder="Nome da indicação"
                  maxLength={60}
                />

                <Controller
                  name="tipoLancamento"
                  render={({ field }) => (
                    <div>
                      <label className="text-sm block mb-1 font-medium text-gray-600">
                        Tipo
                      </label>
                      <Combobox
                        placeholder="Selecione um tipo"
                        options={opcoesTipoLancamento}
                        command={{
                          placeholder: "Pesquisar tipo",
                          emptyMessage: "Nenhum tipo encontrado",
                        }}
                        value={field.value || ""}
                        onChange={(value) =>
                          field.onChange(value ? value : "")
                        }
                      />
                    </div>
                  )}
                />

                <Controller
                  name="situacao"
                  render={({ field }) => (
                    <div>
                      <label className="text-sm block mb-1 font-medium text-gray-600">
                        Situação
                      </label>
                      <Combobox
                        placeholder="Selecione uma opção"
                        options={opcoesSituacao}
                        command={{
                          placeholder: "Pesquisar situação",
                          emptyMessage: "Nenhuma situação encontrada",
                        }}
                        value={field.value || ""}
                        onChange={(value) =>
                          field.onChange(value ? value : "")
                        }
                      />
                    </div>
                  )}
                />

                <div className="flex items-end justify-end gap-2">
                  <CollapsibleTrigger asChild>
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label={
                        mostrarAvancados
                          ? "Ocultar filtros avançados"
                          : "Mostrar filtros avançados"
                      }
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${mostrarAvancados ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                  </CollapsibleTrigger>
                  <ButtonSearch
                    loading={loading}
                    aria-label="Buscar mandatos"
                    className="h-10"
                  />
                </div>
              </div>

              <CollapsibleContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full border-t pt-4">
                  <DateField name="dataInicio" label="Data início" />
                  <DateField name="dataFim" label="Data fim" />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </form>
        </FormProvider>
      </div>
    </BuscaContainer>
  );
}

