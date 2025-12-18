"use client";

import { FormularioNovaCategoria } from "@/components/categoria/formularios/FormularioCategoria";
import PaginaCarregando from "@/components/layouts/pagina-carregando";
import { PageHeader } from "@/components/layouts/ui/page-header";
import { useConsultarCategoria } from "@/hooks/categorias/use-busca-categoria";
import { useParams } from "next/navigation";

export default function PageEditarCategoria() {
  const params = useParams();
  const categoriaId = params.id as string;
  const { categoriaSelected, isLoading } = useConsultarCategoria(categoriaId);

  return (
    <>
      {isLoading ? (
        <PaginaCarregando />
      ) : (
        <>
          <PageHeader
            title={
              categoriaSelected
                ? `Editar Categoria - ${"ID: " + categoriaId}`
                : "Editar Categoria"
            }
            description="Edite as informações da categoria."
            goBack
          />
          <FormularioNovaCategoria idCategoria={categoriaId} />  
        </>
      )}
    </>
  );
}