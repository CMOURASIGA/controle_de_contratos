import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import SearchIcon from "@/components/layouts/ui/icons/search";
import { FiltrosOrgaosProps } from "@/services/orgaos/orgaos.service";
import { Button, Combobox } from "@cnc-ti/layout-basic";
import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

interface CamposBuscaOrgaosProps {
  filtros?: FiltrosOrgaosProps;
  enviarFiltros: (filtros: FiltrosOrgaosProps) => void;
  loading: boolean;
}

export default function CamposBuscaOrgaos({
  filtros,
  enviarFiltros,
  loading,
}: CamposBuscaOrgaosProps) {
  const methods = useForm<FiltrosOrgaosProps>({});

  useEffect(() => {
    methods.reset({
      nome: filtros?.nome ?? "",
      situacao: filtros?.situacao ?? "",
      tipoOrgao: filtros?.tipoOrgao ?? "",
      entidade: filtros?.entidade ?? "",
    });
  }, [filtros]);

  const opcoesSituacao = [
    {
      label: "Todos",
      value: "",
    },
    {
      label: "Inativo",
      value: "0",
    },
    {
      label: "Ativo",
      value: "1",
    },
    {
      label: "Aguardando Definição",
      value: "2",
    },
    {
      label: "Declinada",
      value: "3",
    },
  ];

  const opcoesTipodeOrgao = [
    {
      label: "Todos",
      value: "",
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

  const entidades = [
    { label: "Todas", value: "" },
    { label: "CNC", value: "1" },
    { label: "SENAC", value: "2" },
    { label: "SESC", value: "3" },
  ];

  return (
    <>
      {/* <BuscaContainer>
        <div className="flex justify-content-between "> */}
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(enviarFiltros)}
          // className="flex w-full lg:flex-row flex-col gap-2 md:items-end"
          // className="w-full"
        >
          {/* <div className="flex flex-col items-start w-full"> */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
              {/* <div> */}
              <div>
                <label className="text-sm block mb-1 font-medium text-gray-600 w-full">
                  Nome do Órgão
                </label>
                <div className="flex-1">
                  <TextField className="h-10" name="nome" placeholder="Nome do Órgão" />
                </div>
              </div>

              <Controller
                name="entidade"
                control={methods.control}
                render={({ field }) => {
                  return (
                    <div className="flex-1">
                      <label
                        htmlFor=""
                        className="text-sm block mb-1 font-medium text-gray-600"
                      >
                        Entidade
                      </label>
                      <Combobox
                        options={entidades}
                        placeholder="Selecione uma opção"
                        command={{
                          placeholder: "Pesquisar por entidade",
                          emptyMessage: "Nenhuma entidade encontrada",
                        }}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </div>
                  );
                }}
              />
              <Controller
                name="situacao"
                control={methods.control}
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
                        options={opcoesSituacao}
                        placeholder="Selecione uma opção"
                        command={{
                          placeholder: "Pesquisar por situação",
                          emptyMessage: "Nenhuma situação encontrada",
                        }}
                        value={field.value}
                        onChange={field.onChange}
                      />
                      {/* <SelectComponent
                            options={opcoesSituacao}
                            placeholder="Selecione uma opção"
                            value={field.value}
                            onChange={field.onChange}
                          /> */}
                    </div>
                  );
                }}
              />

              <Controller
                name="tipoOrgao"
                control={methods.control}
                render={({ field }) => {
                  return (
                    <div className="flex-1">
                      <label
                        htmlFor=""
                        className="text-sm block mb-1 font-medium text-gray-600"
                      >
                        Tipo
                      </label>
                      <Combobox
                        options={opcoesTipodeOrgao}
                        placeholder="Selecione um tipo"
                        command={{
                          placeholder: "Pesquisar por tipo",
                          emptyMessage: "Nenhum tipo encontrado",
                        }}
                        value={field.value}
                        onChange={field.onChange}
                      />

                      {/* <SelectComponent
                            options={opcoesTipodeOrgao}
                            placeholder="Selecione uma opção"
                            value={field.value}
                            onChange={field.onChange}
                          /> */}
                    </div>
                  );
                }}
              />

              <div className="actions flex items-end justify-end gap-2 align-content-center">
                <div>
                  <Button isLoading={loading} className="button h-10 gap-2">
                    <SearchIcon />
                    Pesquisar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>

      {/* </div>
      </BuscaContainer> */}
    </>
  );
}
