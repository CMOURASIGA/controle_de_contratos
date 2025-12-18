"use client";

import VisualizarCategoria from "@/components/categoria/visualizar/visualizar-categoria";

const visualizarCategoriaPage = async ({ 
  params }: { params: { id: string } 
}) => {
  const { id } = await params;
  return (
    <>
      <VisualizarCategoria id={id} />
    </>
  )
}

export default visualizarCategoriaPage;