"use client";

import { ButtonOutline } from "@/components/layouts/ui/buttons/button-outline/button-outline";
import { PencilIcon } from "@/components/layouts/ui/icons/pincel";
import Label from "@/components/layouts/ui/label/label";
import { PageHeader } from "@/components/layouts/ui/page-header";
import { FormularioMandatosSkeleton } from "@/components/mandatos/formularios/formulario-mandatos.skeleton";
import { useConsultarTextoWeb } from "@/hooks/dominios/use-texto-web";
import Link from "next/link";

interface VisualizarTextoWebProps {
  id: string;
}

export default function VisualizarTextoWeb({ id }: VisualizarTextoWebProps) {

  const { textoWebSelected, isLoading } = useConsultarTextoWeb(id);

  return (
    <>
      <PageHeader
        title={textoWebSelected ? `Texto ID Nº ${textoWebSelected.id}` : "Visualizar Texto Web"}
        goBack
      >
        <ButtonOutline>
          <Link href={`/texto-web/editar/${textoWebSelected?.id}`}>
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
              <Label label="Título:" value={textoWebSelected?.tituloTexto} />
              <Label label="Resumo:" value={textoWebSelected?.resumoTexto} />
              <Label label="Descrição:" value={textoWebSelected?.descricaoTexto} />
            </div>
          </div>
        )
      }
       
    </>
  )
}