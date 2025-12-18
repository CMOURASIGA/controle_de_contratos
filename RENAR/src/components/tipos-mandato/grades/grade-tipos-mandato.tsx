"use client";
import { useDrawer } from "@/hooks/use-drawer";
import { ResultContainer } from "@/components/layouts/resultContainer";
import { ResultMetadata } from "@/components/layouts/metadata-result";
import { TipoMandatoResponse } from "@/types/tipo-mandato.type";
import { ItemTipoMandato } from "../items/item-tipo-mandato";

interface GradeTiposMandatoProps {
  itens: TipoMandatoResponse[] | undefined;
  total?: number;
  isLoading: boolean;
}

export function GradeTiposMandato({
  itens,
  total,
  isLoading,
}: GradeTiposMandatoProps) {
  const { openDrawer } = useDrawer();

  const lidarTipoSelecionado = (_tipo: TipoMandatoResponse) => {
    openDrawer("detalhes_tipo_mandato");
  };

  const editarTipoSelecionado = (_tipo: TipoMandatoResponse) => {
    // Função mantida para compatibilidade com a interface
  };

  return (
    <>
      <ResultMetadata
        resourceName="Tipos de Mandato"
        displayed={itens?.length || 0}
        total={total || 0}
        isLoading={isLoading}
      />
      <ResultContainer>
        {itens &&
          itens.map((item: TipoMandatoResponse, index: number) => (
            <ItemTipoMandato
              visualizarAcao={lidarTipoSelecionado}
              editarAcao={editarTipoSelecionado}
              dados={item}
              key={index}
            />
          ))}
      </ResultContainer>
    </>
  );
}

