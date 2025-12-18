"use client";

import { ButtonOutline } from "@/components/layouts/ui/buttons/button-outline/button-outline";
import { PencilIcon } from "@/components/layouts/ui/icons/pincel";
import Label from "@/components/layouts/ui/label/label";
import { PageHeader } from "@/components/layouts/ui/page-header";
import { FormularioMandatosSkeleton } from "@/components/mandatos/formularios/formulario-mandatos.skeleton";
import { useConsultarAreaTematica } from "@/hooks/dominios/use-area-tematica";
import Link from "next/link";

interface VisualizarAreaTematicaProps {
  id: string;
}

export default function VisualizarAreaTematica({ id }: VisualizarAreaTematicaProps) {
  const { areaTematicaSelected, isLoading } = useConsultarAreaTematica(id);

  return (
    <>
      <PageHeader
        title={areaTematicaSelected 
          ? `Área Temática ID Nº ${areaTematicaSelected.idCategoriaRepresentacao}` 
          : "Visualizar Área Temática"}
        goBack
      >
        <ButtonOutline>
          <Link href={`/area-tematica/editar/${areaTematicaSelected?.idCategoriaRepresentacao}`}>
            <span className="flex flex-row items-center gap-2">
              <PencilIcon className="size-4" />
              Editar
            </span>
          </Link>
        </ButtonOutline>
      </PageHeader>
      {
        isLoading ? (
          <FormularioMandatosSkeleton />
        ) : (
          <div className="mx-auto max-sm:w-screen p-6 bg-white m-4">
            <div className="grid grid-cols-1 gap-8 mt-4">
              <Label label="Nome:" value={areaTematicaSelected?.nome} />
              <Label label="Descrição Web:" value={areaTematicaSelected?.descricaoWeb} />
            </div>
          </div>
        )
      }
       
    </>
  )
}