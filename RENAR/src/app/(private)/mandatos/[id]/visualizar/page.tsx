"use client";

import VisualizarMandato from "@/components/mandatos/visualizacao/visualizar-mandato";

const visualizacaoDeMandatoPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const idMandatoNumber = Number(id);
  
  return (
    <>
      <VisualizarMandato id={idMandatoNumber} />
    </>
  );
}

export default visualizacaoDeMandatoPage;