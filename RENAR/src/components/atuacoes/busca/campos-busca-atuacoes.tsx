import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import { ExportIcon } from "@/components/layouts/ui/icons/export";
import SearchIcon from "@/components/layouts/ui/icons/search";
import { FiltrosAtuacoesProps } from "@/services/atuacoes.service";
import { Button } from "@cnc-ti/layout-basic";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface CamposBuscaAtuacaoProps {
  filtros?: FiltrosAtuacoesProps;
  enviarFiltros: (filtros: FiltrosAtuacoesProps) => void;
  loading: boolean;
  onExport?: () => void;
}

export default function CamposBuscaAtuacao({
  filtros,
  enviarFiltros,
  loading,
  onExport,
}: CamposBuscaAtuacaoProps) {
  const methods = useForm<FiltrosAtuacoesProps>({});

  useEffect(() => {
    methods.reset({
      nome: filtros?.nome ?? "",
      descricao: filtros?.descricao ?? "",
    });
  }, [filtros]);

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(enviarFiltros)}>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 w-full">
              <TextField
                className="h-10"
                name="nome"
                placeholder="Nome"
                label="Nome"
              />
              <TextField
                className="h-10"
                name="descricao"
                placeholder="Descrição"
                label="Descrição"
              />

              <div className="actions flex items-end justify-end gap-2 align-content-center">
                <div>
                  <Button isLoading={loading} className="button h-10 gap-2 text-xs font-medium">
                    <SearchIcon />
                    Pesquisar
                  </Button>
                </div>
                <div>
                  <Button onClick={onExport} className="button h-10 gap-2 text-xs font-medium">
                    <ExportIcon />
                    Baixar Relatório
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
