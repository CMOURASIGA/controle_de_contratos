"use client";
import { ResultMetadata } from "@/components/layouts/metadata-result";
import { ResultContainer } from "@/components/layouts/resultContainer";
import { Cargo } from "@/types/cargo.type";
import { ItemCargo } from "./item-cargos";

interface ResultCargosProps {
  itens: Cargo[] | never;
  total?: number;
  isLoading: boolean;
}

export function ResultCargos({ itens, total, isLoading }: ResultCargosProps) {
  return (
    <>
      <ResultMetadata
        resourceName="Cargos"
        displayed={itens?.length || 0}
        total={total || 0}
        isLoading={isLoading}
      />
      <ResultContainer>
        {itens &&
          itens.map((item: Cargo, index: number) => (
            <ItemCargo dados={item} key={index} />
          ))}
      </ResultContainer>
    </>
  );
}
