import VisualizarTipoReuniao from "@/components/tipo-reuniao/visualizar/visualizar-tipo-reuniao";

const visualizarTipoReuniaoPage = async ({ 
  params }: { params: { id: string } 
}) => {
  const { id } = await params;
  return (
    <>
      <VisualizarTipoReuniao id={id} />
    </>
  )
}

export default visualizarTipoReuniaoPage;