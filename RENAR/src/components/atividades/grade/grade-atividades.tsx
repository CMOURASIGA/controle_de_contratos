"use client";

import { Atividade } from "@/types/atividade.type";
import { ResultMetadata } from "@/components/layouts/metadata-result";
import { useMemo, useState } from "react";
import { FolderOpenIcon } from "@/components/layouts/ui/icons/folder-open";
import { ResultContainer } from "@/components/layouts/resultContainer";
import ItemAtividade from "./item-atividade";
import { useModal } from "@/hooks/use-modal";
import { ModalExcluirAtividade } from "../modais/modal-excluir-atividade";

interface GradeAtividadesProps {
  itens: Atividade[];
  total?: number;
}

export function GradeAtividade ({
  itens,
  total = 0,
}: GradeAtividadesProps) {
  const { openModal } = useModal();
  
  const [atividadeSelecionada, setAtividadeSelecionada] =
    useState<Atividade | null>(null);

  const excluirAtividadeSelecionada = (atividade: Atividade) => {
    if (atividade) {
      setAtividadeSelecionada(atividade);
      openModal("modal_excluir_atividade");
    }
  };

  const atividades = useMemo(() => itens ?? [], [itens]);
  
  if (!atividades.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-gray-500 bg-gray-50 rounded">
        <FolderOpenIcon className="mb-4 size-12" />
        <span className="text-lg font-medium">
          Nenhum atividade encontrada. Utilize os filtros para refinar sua busca.
        </span>
      </div>
    );
  }
  return (
    <>
      <ResultMetadata
        resourceName="Atividades"
        displayed={atividades.length}
        total={total}
      />
      <ResultContainer>
        {atividades.map((atividade) => (
          <ItemAtividade 
            key={atividade.id} 
            dados={atividade} 
            excluir={excluirAtividadeSelecionada}
          />
        ))}
      </ResultContainer>
      {
        atividadeSelecionada && 
          <ModalExcluirAtividade atividade={atividadeSelecionada} redirect={true} />
      }
        
    </>
  );
}