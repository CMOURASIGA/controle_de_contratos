"use client";

import { ButtonOutline } from "@/components/layouts/ui/buttons/button-outline/button-outline";
import { PencilIcon } from "@/components/layouts/ui/icons/pincel";
import Label from "@/components/layouts/ui/label/label";
import { PageHeader } from "@/components/layouts/ui/page-header";
import { FormularioMandatosSkeleton } from "@/components/mandatos/formularios/formulario-mandatos.skeleton";
import { useConsultarFuncao } from "@/hooks/funcoes/use-funcao";
import Link from "next/link";

interface VisualizarFuncaoProps {
  id: string;
}

export default function VisualizarFuncao({ id }: VisualizarFuncaoProps) {
  const { funcaoSelected, isLoading } = useConsultarFuncao(id);

  return (
    <>
      <PageHeader
        title={funcaoSelected ? `Função ID Nº ${funcaoSelected.id}` : "Visualizar Função"}
        goBack
      >
        <ButtonOutline>
          <Link href={`/funcoes/editar/${funcaoSelected?.id}`}>
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
              <Label label="nome:" value={funcaoSelected?.nomeFuncao} />
              <Label label="Função Pai:" value={funcaoSelected?.nomePai || ""} />
            </div>
          </div>
        )
      }
       
    </>
  )
}