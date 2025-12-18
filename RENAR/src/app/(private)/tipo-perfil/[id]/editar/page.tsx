import EditarAtuacao from "@/components/atuacoes/editar-atuacao";

const editarAtuacaoPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const idCargo = Number(id);

  return (
    <>
      <EditarAtuacao id={idCargo} />
    </>
  );
};
export default editarAtuacaoPage;
