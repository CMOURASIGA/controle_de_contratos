"use client";

import { FormularioEdicaoMotivoCancelamento } from "@/components/motivos-cancelamento/formularios/formulario-edicao-motivo-cancelamento";
import PaginaCarregando from "@/components/layouts/pagina-carregando";
import { PageHeader } from "@/components/layouts/ui/page-header";
import { useConsultarMotivoCancelamentoPorId } from "@/hooks/motivos-cancelamento/use-consultar-motivo-cancelamento-por-id";
import { useParams } from "next/navigation";

export default function EditarMotivoCancelamento() {
  const params = useParams();
  const motivoId = params.id as string;
  const { motivoSelecionado, isLoading } =
    useConsultarMotivoCancelamentoPorId(motivoId);

  return (
    <>
      {isLoading ? (
        <PaginaCarregando />
      ) : (
        <>
          <PageHeader
            title={
              motivoSelecionado
                ? `Editar Motivo - ${
                    motivoSelecionado?.data?.descricao || motivoSelecionado?.descricao || ""
                  }`
                : "Editar Motivo de Cancelamento"
            }
            description="Edite as informações do motivo de cancelamento."
            goBack
            urlBack="/motivos-cancelamento/busca"
          />
          <div className="mx-auto max-sm:w-screen p-6 bg-white mb-20">
            <FormularioEdicaoMotivoCancelamento />
          </div>
        </>
      )}
    </>
  );
}

