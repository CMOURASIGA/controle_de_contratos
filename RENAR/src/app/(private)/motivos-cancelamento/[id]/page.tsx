import VisualizarMotivoCancelamento from "@/components/motivos-cancelamento/visualizar/visualizar-motivo-cancelamento";

export const metadata = {
  title: "Motivo Cancelamento | RENAR",
};

const VisualizarMotivoCancelamentoPage = async ({ 
  params }: { params: { id: string } 
}) => {
  const { id } = await params;

  return <>
    <VisualizarMotivoCancelamento id={id} />
  </>
}

export default VisualizarMotivoCancelamentoPage;