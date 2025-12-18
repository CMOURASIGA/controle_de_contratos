"use client";

import { ButtonOutline } from "@/components/layouts/ui/buttons/button-outline/button-outline";
import { PencilIcon } from "@/components/layouts/ui/icons/pincel";
import Label from "@/components/layouts/ui/label/label";
import { PageHeader } from "@/components/layouts/ui/page-header";
import { FormularioMandatosSkeleton } from "@/components/mandatos/formularios/formulario-mandatos.skeleton";
import { useConsultarPrioridadeRepresentacao } from "@/hooks/dominios/use-prioridade-representacao";
import Link from "next/link";

interface VisualizarPrioridadeRepresentacaoProps {
  id: string;
}

export default function VisualizarPrioridadeRepresentacao({ id }: VisualizarPrioridadeRepresentacaoProps) {
  const { prioridadeSelected, isLoading } = useConsultarPrioridadeRepresentacao(id);

  return (
    <>
      <PageHeader
        title={prioridadeSelected ? `Prioridade de Representação ID Nº ${prioridadeSelected.id}` : "Visualizar Prioridade de Representação"}
        goBack
      >
        <ButtonOutline>
          <Link href={`/prioridade-representacao/editar/${prioridadeSelected?.id}`}>
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
              <Label label="Descrição:" value={prioridadeSelected?.descricao} />
            </div>
          </div>
        )
      }
       
    </>
  )
}