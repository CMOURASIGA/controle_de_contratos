"use client";

import { ButtonOutline } from "@/components/layouts/ui/buttons/button-outline/button-outline";
import { PencilIcon } from "@/components/layouts/ui/icons/pincel";
import Label from "@/components/layouts/ui/label/label";
import { PageHeader } from "@/components/layouts/ui/page-header";
import { FormularioMandatosSkeleton } from "@/components/mandatos/formularios/formulario-mandatos.skeleton";
import { useConsultarTipoReuniao } from "@/hooks/dominios/use-tipo-reuniao";
import Link from "next/link";

interface VisualizarTipoReuniaoProps {
  id: string;
}

export default function VisualizarTipoReuniao({ id }: VisualizarTipoReuniaoProps) {
  const { tipoReuniaoSelected, isLoading } = useConsultarTipoReuniao(id);

  return (
    <>
      <PageHeader
        title={tipoReuniaoSelected ? `Tipo Reunião ID Nº ${tipoReuniaoSelected.id}` : "Visualizar Tipo Reunião"}
        goBack
      >
        <ButtonOutline>
          <Link href={`/tipo-reuniao/editar/${tipoReuniaoSelected?.id}`}>
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
              <Label label="Descrição:" value={tipoReuniaoSelected?.descricao} />
            </div>
          </div>
        )
      }
       
    </>
  )
}