/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Controller, FormProvider, useForm } from "react-hook-form";
import { Combobox } from "@cnc-ti/layout-basic";
import { FiltrosRepresentacoesProps } from "@/services/representacoes.service";
import { useEffect } from "react";
import { useQueryString } from "@/hooks/use-query-params";
import { BuscaContainer } from "@/components/layouts/busca-container";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import { ButtonSearch } from "@/components/layouts/ui/buttons/button-search/button-search";
import { useCaregoriasRepresentacao } from "@/hooks/dominios/use-categorias-representacao";

interface CamposBuscaRepresentacoesProps {
  filtros?: any;
  enviarFiltros: (filtros: FiltrosRepresentacoesProps) => void;
  loading: boolean;
}

export function CamposBuscaRepresentacoes({
  filtros,
  enviarFiltros,
  loading,
}: CamposBuscaRepresentacoesProps) {
  const { getAllQueryStrings } = useQueryString();
  const { opcoesCategoriasRepresentacao } = useCaregoriasRepresentacao();
  const methods = useForm<FiltrosRepresentacoesProps>({
    defaultValues: filtros,
  });

  useEffect(() => {
    const { nome, idCategoria, tipo, situacao, idNumeroOrganizacao } =
      getAllQueryStrings();

    if (nome || idCategoria || tipo || situacao || idNumeroOrganizacao) {
      methods.reset({
        nome: nome,
        idCategoria: idCategoria ? Number(idCategoria) : undefined,
        tipo: tipo ? (Number(tipo) as 0 | 1 | 2 | 3) : undefined,
        situacao: situacao as
          | "ATIVO"
          | "INATIVO"
          | "AGUARDANDO"
          | "DECLINADO"
          | undefined,
        idNumeroOrganizacao: idNumeroOrganizacao
          ? Number(idNumeroOrganizacao)
          : undefined,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const opcoesSituacao = [
    {
      label: "Todos",
      value: "",
    },
    {
      label: "Ativo",
      value: "ATIVO",
    },
    {
      label: "Inativo",
      value: "INATIVO",
    },
    {
      label: "Aguardando",
      value: "AGUARDANDO",
    },
    {
      label: "Declinado",
      value: "DECLINADO",
    },
  ];

  const opcoesEntidades = [
    {
      label: "CNC",
      value: "1995",
    },
    {
      label: "SENAC",
      value: "4544",
    },
    {
      label: "SESC",
      value: "4836",
    },
  ];

  const opcoesTipo = [
    {
      label: "Todos",
      value: "0",
    },
    {
      label: "Órgão Público",
      value: "1",
    },
    {
      label: "Órgão Internacional",
      value: "2",
    },
    {
      label: "Órgão Privado",
      value: "3",
    },
  ];

  const opcoesCategoria = [
    {
      label: "Todos",
      value: "",
    },
    ...opcoesCategoriasRepresentacao.map((cat) => ({
      label: cat.label,
      value: cat.value,
    })),
  ];

  return (
    <BuscaContainer>
      <div className="flex justify-content-between ">
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(enviarFiltros)}
            className="w-full"
          >
            <div className="flex flex-col items-start w-full">
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full">
                <div>
                  <label className="text-sm block mb-1 font-medium text-gray-600 w-full">
                    Representação
                  </label>
                  <TextField
                    className="h-10"
                    name="nome"
                    placeholder="Nome da representação"
                  />
                </div>
                <Controller
                  name="idNumeroOrganizacao"
                  render={({ field }) => {
                    return (
                      <div>
                        <label
                          htmlFor=""
                          className="text-sm block mb-1 font-medium text-gray-600"
                        >
                          Entidade
                        </label>

                        <Combobox
                          placeholder="Selecione uma entidade"
                          options={opcoesEntidades}
                          command={{
                            placeholder: "Pesquisar por entidade",
                            emptyMessage: "Nenhuma entidade foi encontrada",
                          }}
                          value={
                            field.value !== undefined ? String(field.value) : ""
                          }
                          onChange={(value) =>
                            field.onChange(value ? Number(value) : undefined)
                          }
                        />
                      </div>
                    );
                  }}
                />
                <Controller
                  name="situacao"
                  render={({ field }) => {
                    return (
                      <div className="flex-1">
                        <label
                          htmlFor=""
                          className="text-sm block mb-1 font-medium text-gray-600"
                        >
                          Situação
                        </label>

                        <Combobox
                          placeholder="Selecione uma opção"
                          options={opcoesSituacao}
                          command={{
                            placeholder: "Pesquisar por uma situação",
                            emptyMessage: "Nenhuma situação foi encontrada",
                          }}
                          value={field.value || ""}
                          onChange={(value) =>
                            field.onChange(
                              value && value !== "" ? value : undefined
                            )
                          }
                        />
                      </div>
                    );
                  }}
                />
                <Controller
                  name="tipo"
                  render={({ field }) => {
                    return (
                      <div>
                        <label
                          htmlFor=""
                          className="text-sm block mb-1 font-medium text-gray-600"
                        >
                          Tipo
                        </label>

                        <Combobox
                          placeholder="Selecione uma opção"
                          options={opcoesTipo}
                          command={{
                            placeholder: "Pesquisar por um tipo",
                            emptyMessage: "Nenhuma tipo foi encontrado",
                          }}
                          value={
                            field.value !== undefined ? String(field.value) : ""
                          }
                          onChange={(value) =>
                            field.onChange(
                              value && value !== "0"
                                ? (Number(value) as 0 | 1 | 2 | 3)
                                : undefined
                            )
                          }
                        />
                      </div>
                    );
                  }}
                />
                <Controller
                  name="idCategoria"
                  render={({ field }) => {
                    return (
                      <div>
                        <label
                          htmlFor=""
                          className="text-sm block mb-1 font-medium text-gray-600"
                        >
                          Área temática
                        </label>

                        <Combobox
                          placeholder="Selecione uma opção"
                          options={opcoesCategoria}
                          command={{
                            placeholder: "Pesquisar por uma área temática",
                            emptyMessage: "Nenhuma categoria foi encontrada",
                          }}
                          value={
                            field.value !== undefined ? String(field.value) : ""
                          }
                          onChange={(value) =>
                            field.onChange(
                              value && value !== "" ? Number(value) : undefined
                            )
                          }
                        />
                      </div>
                    );
                  }}
                />

                <div className="actions flex items-end justify-end gap-2 align-content-center">
                  <div>
                    <ButtonSearch
                      loading={loading}
                      aria-label="Buscar representantes"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </BuscaContainer>
  );
}
