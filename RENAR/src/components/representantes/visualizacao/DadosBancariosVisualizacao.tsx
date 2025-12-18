"use client";

import Label from "@/components/layouts/ui/label/label";
import { useBancos } from "@/hooks/dominios/use-bancos";
import type { DadosRepresentanteCompletos } from "@/types/representante-visualizacao";

interface DadosBancariosVisualizacaoProps {
  representanteSelected: DadosRepresentanteCompletos | null | undefined;
  isLoading: boolean;
}

const tipoConta = {
  P: "Poupança",
  C: "Corrente",
  S: "Salário",
  D: "Depósito",
};

export function DadosBancariosVisualizacao({
  representanteSelected,
  isLoading,
}: DadosBancariosVisualizacaoProps) {
  const { opcoesBancos } = useBancos();
  if (isLoading) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Carregando dados bancários...</p>
      </div>
    );
  }

  if (!representanteSelected) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-600">
          Dados bancários não disponíveis no momento.
        </p>
      </div>
    );
  }

  const tipoContaLabel = representanteSelected.tipoConta
    ? tipoConta[representanteSelected.tipoConta as keyof typeof tipoConta]
    : "Dados bancários não disponíveis";

  const bancoLabel =
    opcoesBancos.find(
      (b) => b.value === representanteSelected?.numeroBanco?.trimEnd()
    )?.label || "Dados bancários não disponíveis";

  const agenciaLabel = !!representanteSelected?.numeroAgencia?.trim()
    ? representanteSelected.numeroAgencia
    : "Dados bancários não disponíveis";

  return (
    <div className="mt-6 space-y-6">
      {/* Dados Bancários */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Label label="Banco" value={bancoLabel} />

        <Label
          label="Número da Conta"
          value={
            representanteSelected.numeroContaCorrente ||
            "Dados bancários não disponíveis"
          }
        />

        <Label label="Agência" value={agenciaLabel} />

        <Label label="Tipo de Conta" value={tipoContaLabel} />
      </div>
    </div>
  );
}
