"use client";

import PaginaCarregando from "@/components/layouts/pagina-carregando";
import { PageHeader } from "@/components/layouts/ui/page-header";
import { FormularioNovoTextoWeb } from "@/components/textoWeb/formularios/FormularioTextoWeb";
import { useConsultarTextoWeb } from "@/hooks/dominios/use-texto-web";
import { useParams } from "next/navigation";

export default function PageEditarTextoWeb() {
  const params = useParams();
  const textoWebId = params.id as string;
  const { textoWebSelected, isLoading } = useConsultarTextoWeb(textoWebId);

  return (
    <>
      {isLoading ? (
        <PaginaCarregando />
      ) : (
        <>
          <PageHeader
            title={
              textoWebSelected
                ? `Editar Texto Web - ${
                    textoWebSelected.resumoTexto || "ID: " + textoWebId
                  }`
                : "Editar Texto Web"
            }
            description="Edite as informações do texto web."
            goBack
          />
          <FormularioNovoTextoWeb idTextoWeb={textoWebId} />  
        </>
      )}
    </>
  );
}