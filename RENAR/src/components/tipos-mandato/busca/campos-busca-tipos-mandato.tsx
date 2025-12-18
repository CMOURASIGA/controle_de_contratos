import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import { ExportIcon } from "@/components/layouts/ui/icons/export";
import SearchIcon from "@/components/layouts/ui/icons/search";
import { FiltrosTiposMandatoProps } from "@/types/tipo-mandato.type";
import { Button } from "@cnc-ti/layout-basic";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface CamposBuscaTiposMandatoProps {
  filtros?: FiltrosTiposMandatoProps;
  enviarFiltros: (filtros: FiltrosTiposMandatoProps) => void;
  loading: boolean;
  handleExport?: () => void;
}

export default function CamposBuscaTiposMandato({
  filtros,
  enviarFiltros,
  handleExport,
  loading,
}: CamposBuscaTiposMandatoProps) {
  const methods = useForm<FiltrosTiposMandatoProps>({});

  useEffect(() => {
    methods.reset({
      descricao: filtros?.descricao ?? "",
      dataCadastro: filtros?.dataCadastro ?? "",
      dataAlteracao: filtros?.dataAlteracao ?? "",
    });
  }, [filtros, methods]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(enviarFiltros)}
      >
        <div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 w-full items-end">
            <div className="col-span-1 md:col-span-3">
              <label className="text-sm block mb-1 font-medium text-gray-600 w-full">
                Descrição
              </label>
              <div className="flex-1">
                <TextField
                  className="h-10"
                  name="descricao"
                  placeholder="Descrição do tipo de mandato"
                />
              </div>
            </div>

            <div className="col-span-1 md:col-span-3">
              <label className="text-sm block mb-1 font-medium text-gray-600 w-full">
                Data Cadastro
              </label>
              <div className="flex-1">
                <TextField
                  className="h-10"
                  name="dataCadastro"
                  type="date"
                  placeholder="Data de cadastro"
                />
              </div>
            </div>

            <div className="col-span-4 md:col-span-3">
              <label className="text-sm block mb-1 font-medium text-gray-600 w-full">
                Data Alteração
              </label>
              <div className="flex-1">
                <TextField
                  className="h-10"
                  name="dataAlteracao"
                  type="date"
                  placeholder="Data de alteração"
                />
              </div>
            </div>

            <div className="col-span-1 md:col-span-3 flex items-end justify-end">
              <div>
                <Button isLoading={loading} className="button h-10 gap-2 w-full md:w-auto text-xs font-medium">
                  <SearchIcon />
                  Pesquisar
                </Button>
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
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

