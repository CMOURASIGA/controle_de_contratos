"use client";
import { ResultMetadata } from "@/components/layouts/metadata-result";
import { ResultContainer } from "@/components/layouts/resultContainer";
import { TipoOrgaos } from "@/services/orgaos/tipo-orgaos.service";
import { ItemTipoOrgao } from "./item-tipo-orgaos";

interface ResultTipoOrgaosProps {
  itens: TipoOrgaos[] | never;
  total?: number;
  isLoading: boolean;
}

export function ResultTipoOrgao({
  itens,
  total,
  isLoading,
}: ResultTipoOrgaosProps) {
  return (
    <>
      <ResultMetadata
        resourceName="Tipo de Órgãos"
        displayed={itens?.length || 0}
        total={total || 0}
        isLoading={isLoading}
      />
      <ResultContainer>
        {itens &&
          itens.map((item: TipoOrgaos, index: number) => (
            <ItemTipoOrgao dados={item} key={index} />
          ))}
      </ResultContainer>
    </>
  );
}
