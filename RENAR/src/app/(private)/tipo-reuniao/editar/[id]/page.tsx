"use client";

import PaginaCarregando from "@/components/layouts/pagina-carregando";
import { PageHeader } from "@/components/layouts/ui/page-header";
import { FormularioNovoTipoReuniao } from "@/components/tipo-reuniao/formularios/Formulario-tipo-reuniao";
import { useConsultarTipoReuniao } from "@/hooks/dominios/use-tipo-reuniao";
import { useParams } from "next/navigation";

export default function PageEditarTipoReuniao() {
  const params = useParams();
  const tipoReuniaoId = params.id as string;
  const { tipoReuniaoSelected, isLoading } = useConsultarTipoReuniao(tipoReuniaoId);

  return (
    <>
      {isLoading ? (
        <PaginaCarregando />
      ) : (
        <>
          <PageHeader
            title={
              tipoReuniaoSelected
                ? `Editar Tipo Reunião - ${
                    tipoReuniaoSelected.descricao || "ID: " + tipoReuniaoId
                  }`
                : "Editar Tipo Reunião"
            }
            description="Edite as informações do tipo de reunião."
            goBack
          />
          <FormularioNovoTipoReuniao id={tipoReuniaoId} />  
        </>
      )}
    </>
  );
}