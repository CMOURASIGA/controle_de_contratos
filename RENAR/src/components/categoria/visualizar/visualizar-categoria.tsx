"use client";

import { ButtonOutline } from "@/components/layouts/ui/buttons/button-outline/button-outline";
import { PencilIcon } from "@/components/layouts/ui/icons/pincel";
import Label from "@/components/layouts/ui/label/label";
import { PageHeader } from "@/components/layouts/ui/page-header";
import { FormularioMandatosSkeleton } from "@/components/mandatos/formularios/formulario-mandatos.skeleton";
import { useConsultarCategoria } from "@/hooks/categorias/use-busca-categoria";
import Link from "next/link";

interface VisualizarCategoriaProps {
  id: string;
}

export default function VisualizarCategoria({ id }: VisualizarCategoriaProps) {
  const { categoriaSelected, isLoading } = useConsultarCategoria(id);

  return (
    <>
      <PageHeader
        title={categoriaSelected ? `Categoria ID Nº ${categoriaSelected.idCategoria}` : "Visualizar Categoria"}
        goBack
      >
        <ButtonOutline>
          <Link href={`/categorias/editar/${categoriaSelected?.idCategoria}`}>
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
              <Label label="Título:" value={categoriaSelected?.nomeCategoria} />
            </div>
          </div>
        )
      }
       
    </>
  )
}