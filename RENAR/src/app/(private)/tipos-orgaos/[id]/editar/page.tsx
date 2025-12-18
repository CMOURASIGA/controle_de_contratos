import EditarTipoOrgao from "@/components/tipo-orgaos/editar-tipo-orgao";

const editarTipoOrgaoPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const idTipoOrgao = Number(id);

  return (
    <>
      <EditarTipoOrgao id={idTipoOrgao} />
    </>
  );
};
export default editarTipoOrgaoPage;
