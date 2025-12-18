"use client";

import Label from "@/components/layouts/ui/label/label";
import { useConsultarAtividade } from "@/hooks/atividades/use-consultar-atividade";
import { formatDateToDDMMYYYY } from "@/utils/generate-format-date";
import { useParams } from "next/navigation";

const formatDateTime = (dateString?: string) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch {
    return dateString;
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  try {
    return formatDateToDDMMYYYY(dateString);
  } catch {
    return dateString;
  }
};

export const VisualizacaoDadosPrincipaisAtividade = () => {
  const params = useParams();
  const atividadeId = params.id as string;
  const { atividadeSelected } = useConsultarAtividade(atividadeId);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Label
          label="Representação"
          value={atividadeSelected?.Representacao?.nome || "-"}
        />
        <Label
          label="Representante"
          value={atividadeSelected?.Representante?.nome || "-"}
        />
        <Label
          label="Tipo de Atividade"
          value={atividadeSelected?.TipoAtividade?.descricao || "-"}
        />
        <Label
          label="Endereço do Evento"
          value={atividadeSelected?.enderecoEvento || "-"}
        />
        <Label
          label="Data e Hora de Início"
          value={formatDateTime(atividadeSelected?.dataInicioAtividade)}
        />
        <Label
          label="Data e Hora de Término"
          value={formatDateTime(atividadeSelected?.dataFimAtividade)}
        />
      </div>

      <div className="mt-6">
        <Label
          label="Descrição da Atividade"
          value={atividadeSelected?.descricaoAtividade || "-"}
        />
      </div>

      {atividadeSelected?.descricaoPauta && (
        <div className="mt-6">
          <Label
            label="Descrição da Pauta"
            value={atividadeSelected.descricaoPauta}
          />
        </div>
      )}
    </div>
  );
};
