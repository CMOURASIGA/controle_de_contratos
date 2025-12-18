import VisualizarCargo from "@/components/cargos/visualizar-cargo";

const visualizacaoCargoPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const idCargo = Number(id);

  return (
    <>
      <VisualizarCargo id={idCargo} />
    </>
  );
};
export default visualizacaoCargoPage;
