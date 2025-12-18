"use client";

import { useCategorias } from "@/hooks/dominios/use-categorias";
import { useProfissoes } from "@/hooks/dominios/use-profissoes";
import { useQueryString } from "@/hooks/useQueryParams";
import { FormBuscaRepresentantes } from "@/types/representante";
import { Combobox } from "@cnc-ti/layout-basic";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { ButtonSearch } from "../ui/buttons/button-search/button-search";
import { TextField } from "../ui/fields/text-field/text-field";

interface BarraBuscaRepresentantesProps {
  onSubmit: (dados: FormBuscaRepresentantes) => void;
}

export function BarraBuscaRepresentantes({
  onSubmit,
}: BarraBuscaRepresentantesProps) {
  // Hooks para buscar dados da API
  const { opcoesCategorias, isLoading: carregandoCategorias } = useCategorias();
  const { opcoesProfissoes, isLoading: carregandoProfissoes } = useProfissoes();

  const { getAllQueryStrings } = useQueryString();
  const queryParams = getAllQueryStrings();
  const defaultValues = {
    numeroRepresentante: queryParams.numeroRepresentante || "",
    nome: queryParams.nome || "",
    profissao: queryParams.profissao || "",
    categoria: queryParams.categoria || "",
    status: queryParams.status || "",
  };

  const methods = useForm<FormBuscaRepresentantes>({
    defaultValues: defaultValues,
  });

  function handleSubmit(data: FormBuscaRepresentantes) {
    onSubmit(data);
  }

  // Adiciona opção "Todas" no início das categorias
  const opcoesCategoriasComTodas = [
    { value: "", label: "Todas" },
    ...opcoesCategorias,
  ];

  // Adiciona opção "Todas" no início das profissões
  const opcoesProfissoesComTodas = [
    { value: "", label: "Todas" },
    ...opcoesProfissoes,
  ];

  // Opções de status
  const opcoesStatus = [
    { value: "", label: "Todos" },
    { value: "true", label: "Ativo" },
    { value: "false", label: "Inativo" },
  ];

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleSubmit)}
        className="flex lg:flex-row flex-col gap-4 lg:gap-8 md:items-end"
        role="search"
        aria-label="Buscar representantes"
      >
        <div className="flex-1">
          <TextField
            name="numeroRepresentante"
            label="Número do Representante"
            placeholder="Digite o número do representante"
            aria-label="Buscar por número do representante"
            id="field-numero-representante"
            className="h-10"
          />
        </div>

        <div className="flex-1">
          <TextField
            name="nome"
            label="Nome"
            placeholder="Digite o nome do representante"
            aria-label="Buscar por nome do representante"
            id="field-nome-representante"
            className="h-10"
          />
        </div>

        <Controller
          name="profissao"
          control={methods.control}
          render={({ field }) => (
            <div className="flex-1">
              <label className="text-sm block mb-1 font-medium text-gray-600">
                Profissão
              </label>
              <Combobox
                placeholder={
                  carregandoProfissoes ? "Carregando..." : "Selecione uma opção"
                }
                options={opcoesProfissoesComTodas}
                command={{
                  placeholder: "Pesquisar por profissão",
                  emptyMessage: carregandoProfissoes
                    ? "Carregando profissões..."
                    : "Nenhuma profissão encontrada",
                }}
                value={field.value}
                onChange={field.onChange}
              />
            </div>
          )}
        />

        <Controller
          name="categoria"
          control={methods.control}
          render={({ field }) => (
            <div className="flex-1">
              <label className="text-sm block mb-1 font-medium text-gray-600">
                Categoria
              </label>
              <Combobox
                placeholder="Selecione uma opção"
                options={opcoesCategoriasComTodas}
                command={{
                  placeholder: "Pesquisar por categoria",
                  emptyMessage: carregandoCategorias
                    ? "Carregando categorias..."
                    : "Nenhuma categoria encontrada",
                }}
                value={field.value}
                onChange={field.onChange}
              />
            </div>
          )}
        />

        <Controller
          name="ativo"
          control={methods.control}
          render={({ field }) => (
            <div className="flex-1">
              <label className="text-sm block mb-1 font-medium text-gray-600">
                Situação
              </label>
              <Combobox
                placeholder="Selecione uma opção"
                options={opcoesStatus}
                command={{
                  placeholder: "Pesquisar por situação",
                  emptyMessage: "Nenhum status encontrado",
                }}
                value={field.value}
                onChange={field.onChange}
              />
            </div>
          )}
        />

        <ButtonSearch aria-label="Buscar representantes" />
      </form>
    </FormProvider>
  );
}
