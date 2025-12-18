"use client";

import { useMemo } from "react";

import { ResultMetadata } from "@/components/layouts/metadata-result";
import { ResultContainer } from "@/components/layouts/resultContainer";
import { FolderOpenIcon } from "@/components/layouts/ui/icons/folder-open";
import type { Mandato } from "@/services/representantes.service";
import { ItemMandato } from "../items/item-mandato";

interface GradeMandatosProps {
  itens: Mandato[];
  total?: number;
  refetch: () => void;
}

export function GradeMandatos({
  itens,
  total = 0,
  refetch,
}: GradeMandatosProps) {
  const mandatos = useMemo(() => itens ?? [], [itens]);

  if (!mandatos.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-gray-500 bg-gray-50 rounded">
        <FolderOpenIcon className="mb-4 size-12" />
        <span className="text-lg font-medium">
          Nenhum mandato encontrado. Utilize os filtros para refinar sua busca.
        </span>
      </div>
    );
  }
  return (
    <>
      <ResultMetadata
        resourceName="Mandatos"
        displayed={mandatos.length}
        total={total}
      />
      <ResultContainer>
        {mandatos.map((mandato) => (
          <ItemMandato key={mandato.id} dados={mandato} refetch={refetch} />
        ))}
      </ResultContainer>
    </>
  );
}
