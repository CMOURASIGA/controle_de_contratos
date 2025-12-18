"use client";
import { ItemRepresentacao } from "../items/item-represetacao";
import { useState } from "react";
import { FolderOpenIcon } from "@/components/layouts/ui/icons/folder-open";
import { ResultContainer } from "@/components/layouts/resultContainer";
import { useModal } from "@/hooks/use-modal";
import { ModalExcluirRepresentacao } from "../modais/modal-excluir";
import { ResultMetadata } from "@/components/layouts/metadata-result";
import { Representacao } from "@/types/representacao.type";

interface GradeRepresentacoesProps {
  itens: Representacao[];
  total?: number;
}

export function GradeRepresentacoes({
  itens,
  total,
}: GradeRepresentacoesProps) {
  const { openModal } = useModal();

  const [representacaoSelecionada, setRepresentacaoSelecionada] =
    useState<Representacao | null>(null);

  const excluirRepresentacaoSelecionada = (representacao: Representacao) => {
    if (representacao) {
      setRepresentacaoSelecionada(representacao);
      openModal("modal_excluir_representacao");
    }
  };

  if (!itens?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-gray-500 bg-gray-50 rounded">
        <FolderOpenIcon className="mb-4 size-12" />
        <span className="text-lg font-medium">
          Nenhuma representação encontrada. Utilize os filtros para refinar sua
          busca.
        </span>
      </div>
    );
  }

  return (
    <>
      <ResultMetadata
        resourceName="Representações"
        displayed={itens?.length || 0}
        total={total || 0}
        // isLoading={isLoading}
      />
      <ResultContainer>
        {itens.map((item: Representacao, index: number) => (
          <ItemRepresentacao
            excluirAcao={excluirRepresentacaoSelecionada}
            dados={item}
            key={index}
          />
        ))}
      </ResultContainer>
      <ModalExcluirRepresentacao
        representacao={representacaoSelecionada as Representacao}
      />
    </>
  );
}
