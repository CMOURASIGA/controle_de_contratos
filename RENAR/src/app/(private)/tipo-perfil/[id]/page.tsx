import VisualizarAtuacao from "@/components/atuacoes/visualizar-atuacao";

const visualizacaoTipoPerfilPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const idCargo = Number(id);

  return (
    <>
      <VisualizarAtuacao id={idCargo} />
    </>
  );
};
export default visualizacaoTipoPerfilPage;
