"use client";

import EditarCargo from "@/components/cargos/editar-cargo";

const editarCargoPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const idCargo = Number(id);

  return (
    <>
      <EditarCargo id={idCargo} />
    </>
  );
};
export default editarCargoPage;
