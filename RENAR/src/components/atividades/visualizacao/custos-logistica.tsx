"use client";

import Label from "@/components/layouts/ui/label/label";
import { useConsultarAtividade } from "@/hooks/atividades/use-consultar-atividade";
import { useParams } from "next/navigation";
import { formatDateToDDMMYYYY } from "@/utils/generate-format-date";

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

const getStatusLabel = (status: number | undefined): string => {
    return status === 1 ? "Sim" : "Não";
};

export const VisualizacaoCustosLogisticaAtividade = () => {
    const params = useParams();
    const atividadeId = params.id as string;
    const { atividadeSelected } = useConsultarAtividade(atividadeId);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Label
                    label="Hospedagem"
                    value={getStatusLabel(atividadeSelected?.statusHospedagem)}
                />
                <Label
                    label="Diária"
                    value={getStatusLabel(atividadeSelected?.statusDiaria)}
                />
                <Label
                    label="Passagem"
                    value={getStatusLabel(atividadeSelected?.statusPassagem)}
                />
            </div>

            {atividadeSelected?.statusHospedagem === 1 && atividadeSelected?.observacaoHospedagem && (
                <div className="mt-6">
                    <Label
                        label="Observações de Hospedagem"
                        value={atividadeSelected.observacaoHospedagem}
                    />
                </div>
            )}

            {atividadeSelected?.statusDiaria === 1 && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {atividadeSelected?.quantidadeDiaria !== undefined && (
                        <Label
                            label="Quantidade de Diárias"
                            value={atividadeSelected.quantidadeDiaria.toString()}
                        />
                    )}
                    {atividadeSelected?.observacaodiaria && (
                        <Label
                            label="Observações sobre Diárias"
                            value={atividadeSelected.observacaodiaria}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

