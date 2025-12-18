"use client";
import { ResultMetadata } from "@/components/layouts/metadata-result";
import { ResultContainer } from "@/components/layouts/resultContainer";
import { Atuacao } from "@/services/atuacoes.service";
import { ItemAtuacao } from "./item-atuacao";

interface ResultCargosProps {
  itens: Atuacao[] | never;
  total?: number;
  isLoading: boolean;
}

export function ResultAtuacoes({ itens, total, isLoading }: ResultCargosProps) {
  return (
    <>
      <ResultMetadata
        resourceName="Tipo Perfil"
        displayed={itens?.length || 0}
        total={total || 0}
        isLoading={isLoading}
      />
      <ResultContainer>
        {itens &&
          itens.map((item: Atuacao, index: number) => (
            <ItemAtuacao dados={item} key={index} />
          ))}
      </ResultContainer>
    </>
  );
}
