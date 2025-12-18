import { VisualizacaoAtividade } from "@/components/atividades/visualizacao/visualizacao-atividade";

interface VisualizarAtividadePageProps {
  params: Promise<{ id: string }>;
}

export default async function VisualizarAtividadePage({
  params,
}: VisualizarAtividadePageProps) {
  const { id } = await params;

  return <VisualizacaoAtividade atividadeId={id} />;
}
