import { VisualizacaoTipoMandato } from "@/components/tipos-mandato/visualizacao/visualizacao-tipo-mandato";

export default async function VisualizarTipoMandato({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <VisualizacaoTipoMandato tipoMandatoId={id} />
    </>
  );
}

