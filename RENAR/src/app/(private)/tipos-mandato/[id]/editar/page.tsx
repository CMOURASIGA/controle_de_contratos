"use client";

import { FormularioEdicaoTipoMandato } from "@/components/tipos-mandato/formularios/formulario-edicao-tipo-mandato";
import PaginaCarregando from "@/components/layouts/pagina-carregando";
import { PageHeader } from "@/components/layouts/ui/page-header";
import { useConsultarTipoMandatoPorId } from "@/hooks/tipos-mandato/use-consultar-tipo-mandato-por-id";
import { useParams } from "next/navigation";

export default function EditarTipoMandato() {
  const params = useParams();
  const tipoMandatoId = params.id as string;
  const { tipoMandatoSelecionado, isLoading } =
    useConsultarTipoMandatoPorId(tipoMandatoId);

  return (
    <>
      {isLoading ? (
        <PaginaCarregando />
      ) : (
        <>
          <PageHeader
            title={
              tipoMandatoSelecionado
                ? `Editar Tipo - ${
                    tipoMandatoSelecionado?.data?.descricao || tipoMandatoSelecionado?.descricao || ""
                  }`
                : "Editar Tipo de Mandato"
            }
            description="Edite as informações do tipo de mandato."
            goBack
            urlBack="/tipos-mandato/busca"
          />
          <div className="mx-auto max-sm:w-screen p-6 bg-white mb-20">
            <FormularioEdicaoTipoMandato />
          </div>
        </>
      )}
    </>
  );
}

