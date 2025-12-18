import VisualizarPrioridadeRepresentacao from "@/components/prioridade-representacao/visualizar/visualizar-prioridade-representacao";

const visualizarPrioridadeRepresentacaoPage = async ({ 
  params }: { params: { id: string } 
}) => {
  const { id } = await params;
  return (
    <>
      <VisualizarPrioridadeRepresentacao id={id} />
    </>
  )
}

export default visualizarPrioridadeRepresentacaoPage;