"use client";

import { FormularioAreaTematica } from "@/components/area-tematica/formularios/FormularioAreaTematica";
import PaginaCarregando from "@/components/layouts/pagina-carregando";
import { PageHeader } from "@/components/layouts/ui/page-header";
import { useConsultarAreaTematica } from "@/hooks/dominios/use-area-tematica";
import { useParams } from "next/navigation";

export default function PageEditarAreaTematica() {
  const params = useParams();
  const areaTematicaId = params.id as string;
  const { areaTematicaSelected, isLoading } = useConsultarAreaTematica(areaTematicaId);

  return (
    <>
      {isLoading ? (
        <PaginaCarregando />
      ) : (
        <>
          <PageHeader
            title={
              areaTematicaSelected
                ? `Editar Área Temática - ${
                    areaTematicaSelected.nome || "ID: " + areaTematicaId
                  }`
                : "Editar Área Temática"
            }
            description="Edite as informações da área temática."
            goBack
          />
          <FormularioAreaTematica id={areaTematicaId} />  
        </>
      )}
    </>
  );
}