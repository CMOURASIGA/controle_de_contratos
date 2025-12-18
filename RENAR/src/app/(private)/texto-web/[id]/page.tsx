"use client";

import VisualizarTextoWeb from "@/components/textoWeb/visualizar/visualizar-texto-web";

const visualizarTextoWebPage = async ({ 
  params }: { params: { id: string } 
}) => {
  const { id } = await params;
  return (
    <>
      <VisualizarTextoWeb id={id} />
    </>
  )
}

export default visualizarTextoWebPage;