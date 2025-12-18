import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import { ExportIcon } from "@/components/layouts/ui/icons/export";
import SearchIcon from "@/components/layouts/ui/icons/search";
import { FiltrosMotivosCancelamentoProps } from "@/types/motivo-cancelamento.type";
import { Button } from "@cnc-ti/layout-basic";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface CamposBuscaMotivosCancelamentoProps {
  filtros?: FiltrosMotivosCancelamentoProps;
  enviarFiltros: (filtros: FiltrosMotivosCancelamentoProps) => void;
  loading: boolean;
  exportarRelatorio?: () => void;
}

export default function CamposBuscaMotivosCancelamento({
  filtros,
  enviarFiltros,
  exportarRelatorio,
  loading,
}: CamposBuscaMotivosCancelamentoProps) {
  const methods = useForm<FiltrosMotivosCancelamentoProps>({});

  useEffect(() => {
    methods.reset({
      nome: filtros?.nome ?? "",
    });
  }, [filtros, methods]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(enviarFiltros)}
      >
        <div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 w-full">
            <div className="col-span-1 md:col-span-10">
              <label className="text-sm block mb-1 font-medium text-gray-600 w-full">
                Nome
              </label>
              <div className="flex-1">
                <TextField
                  className="h-10"
                  name="nome"
                  placeholder="Nome do motivo"
                />
              </div>
            </div>

            
          </div>
          <div className="actions flex items-end justify-end gap-2 align-content-center pt-8">
            <div>
              <Button isLoading={loading} className="button h-10 gap-2 w-full md:w-auto">
                <SearchIcon />
                Pesquisar
              </Button>

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
  );
}

