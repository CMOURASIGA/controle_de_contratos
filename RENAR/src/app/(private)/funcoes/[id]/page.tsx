import VisualizarFuncao from "@/components/funcoes/visualizar/visualizar-funcao";

const visualizarFuncoesPage = async ({ 
  params }: { params: { id: string } 
}) => {
  const { id } = await params;
  return (
    <>
      <VisualizarFuncao id={id} />
    </>
  )
}

export default visualizarFuncoesPage;