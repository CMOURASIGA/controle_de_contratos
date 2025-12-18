"use client";
import { useDrawer } from "@/hooks/use-drawer";
import { ResultContainer } from "@/components/layouts/resultContainer";
import { ResultMetadata } from "@/components/layouts/metadata-result";
import { MotivoCancelamentoResponse } from "@/types/motivo-cancelamento.type";
import { ItemMotivoCancelamento } from "../items/item-motivo-cancelamento";

interface GradeMotivosCancelamentoProps {
  itens: MotivoCancelamentoResponse[] | undefined;
  total?: number;
  isLoading: boolean;
}

export function GradeMotivosCancelamento({
  itens,
  total,
  isLoading,
}: GradeMotivosCancelamentoProps) {
  const { openDrawer } = useDrawer();

  const lidarMotivoSelecionado = (_motivo: MotivoCancelamentoResponse) => {
    openDrawer("detalhes_motivo_cancelamento");
  };

  const editarMotivoSelecionado = (_motivo: MotivoCancelamentoResponse) => {
    // Função mantida para compatibilidade com a interface
  };

  return (
    <>
      <ResultMetadata
        resourceName="Motivos de Cancelamento"
        displayed={itens?.length || 0}
        total={total || 0}
        isLoading={isLoading}
      />
      <ResultContainer>
        {itens &&
          itens.map((item: MotivoCancelamentoResponse, index: number) => (
            <ItemMotivoCancelamento
              visualizarAcao={lidarMotivoSelecionado}
              editarAcao={editarMotivoSelecionado}
              dados={item}
              key={index}
            />
          ))}
      </ResultContainer>
    </>
  );
}

