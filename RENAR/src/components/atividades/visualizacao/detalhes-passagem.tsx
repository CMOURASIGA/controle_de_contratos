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

export const VisualizacaoDetalhesPassagemAtividade = () => {
    const params = useParams();
    const atividadeId = params.id as string;
    const { atividadeSelected } = useConsultarAtividade(atividadeId);

    if (atividadeSelected?.statusPassagem !== 1) {
        return (
            <div className="text-gray-500 text-sm">
                Passagem não informada para esta atividade.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Passagem de Ida
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Label
                        label="Data da Passagem"
                        value={formatDate(atividadeSelected?.dataPassagemIda)}
                    />
                    <Label
                        label="Companhia"
                        value={atividadeSelected?.companhiaIda || "-"}
                    />
                    <Label
                        label="Data e Hora do Voo"
                        value={formatDateTime(atividadeSelected?.dataHoraVooIda)}
                    />
                    <Label
                        label="Trecho"
                        value={atividadeSelected?.trechoIda || "-"}
                    />
                    <Label
                        label="Número do Voo"
                        value={atividadeSelected?.numeroVooIda || "-"}
                    />
                </div>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Passagem de Volta
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Label
                        label="Data da Passagem"
                        value={formatDate(atividadeSelected?.dataPassagemVolta)}
                    />
                    <Label
                        label="Companhia"
                        value={atividadeSelected?.companhiaVolta || "-"}
                    />
                    <Label
                        label="Data e Hora do Voo"
                        value={formatDateTime(atividadeSelected?.dataHoraVooVolta)}
                    />
                    <Label
                        label="Trecho"
                        value={atividadeSelected?.trechoVolta || "-"}
                    />
                    <Label
                        label="Número do Voo"
                        value={atividadeSelected?.numeroVooVolta || "-"}
                    />
                </div>
            </div>
        </div>
    );
};

