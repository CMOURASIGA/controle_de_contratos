import { VisualizacaoRepresentante } from "@/components/representantes/VisualizacaoRepresentante";

export default async function VisualizarRepresentante({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <VisualizacaoRepresentante representanteId={id} />
    </>
  );
}
