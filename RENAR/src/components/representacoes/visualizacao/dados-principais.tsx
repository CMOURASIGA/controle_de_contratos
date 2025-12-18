import Label from "@/components/layouts/ui/label/label";
import { useConsultarRepresentacao } from "@/hooks/representacoes/use-consultar-representacao";
import { useParams } from "next/navigation";
import {
  getAreaTematica,
  getGrauPrioridadeRepresentacao,
  getSituacaoRepresentacao,
  getTipoRepresentacao,
} from "../representacoes.utils";

export const VisualizacaoDadosPrincipaisRepresentacoesTab = () => {
  const params = useParams();
  const representacaoId = params.id as string;
  const { representacaoSelected } = useConsultarRepresentacao(representacaoId);

  const areaTematica = getAreaTematica(
    Number(representacaoSelected?.idCategoria)
  );

  // Converter statusSituacao para número para usar com getSituacaoRepresentacao
  const situacaoMap: Record<string, string> = {
    "ATIVO": "-1",
    "INATIVO": "0",
    "AGUARDANDO": "1",
    "DECLINADO": "2",
  };
  const situacaoNumero = situacaoMap[representacaoSelected?.statusSituacao || ""] || "-1";
  const situacao = getSituacaoRepresentacao(Number(situacaoNumero));

  const tipo = getTipoRepresentacao(
    Number(representacaoSelected?.tipoDados)
  );

  const prioridade = getGrauPrioridadeRepresentacao(
    representacaoSelected?.grauPrioridade ? Number(representacaoSelected.grauPrioridade) : 0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Label label="Nome" value={representacaoSelected?.nome} />
      <Label
        label="Número"
        value={String(representacaoSelected?.idRepresentacao)}
      />
      <Label label="Sigla" value={representacaoSelected?.sigla} />
      <Label label="Área temática" value={areaTematica?.label} />
      <Label label="Situação" value={situacao?.label} />
      <Label label="Tipo" value={tipo?.label} />
      <Label label="Prioridade" value={prioridade?.label} />
    </div>
  );
};
