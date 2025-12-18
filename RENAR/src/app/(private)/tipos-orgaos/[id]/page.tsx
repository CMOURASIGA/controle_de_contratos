import VisualizarTipoOrgao from "@/components/tipo-orgaos/visualizacao/visualizar-tipo-orgao";

const visualizacaoTipoOrgaoPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const idTipoOrgao = Number(id);

  return (
    <>
      <VisualizarTipoOrgao id={idTipoOrgao} />
    </>
  );
};
export default visualizacaoTipoOrgaoPage;
