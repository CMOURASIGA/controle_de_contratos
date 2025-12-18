import VisualizarAreaTematica from "@/components/area-tematica/visualizar/visualizar-area-tematica";
  
const visualizarAreaTematicaPage = async ({ 
  params }: { params: { id: string } 
}) => {
  const { id } = await params;
  return (
    <>
      <VisualizarAreaTematica id={id} />
    </>
  )
}

export default visualizarAreaTematicaPage;