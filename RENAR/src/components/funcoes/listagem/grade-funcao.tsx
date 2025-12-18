import { ResultContainer } from "@/components/layouts/resultContainer";
import { FolderOpenIcon } from "@/components/layouts/ui/icons/folder-open";
import { ResultMetadata } from "@/components/shared/metadata-result";
import { useMemo } from "react";
import { Funcao } from "@/services/funcoes.service";
import ItemFuncao from "./item-funcao";

interface GradeFuncaoProps {
  itens: Funcao[];
  total?: number;
}

export default function GradeFuncao({ 
  itens, 
  total = 0 
}: GradeFuncaoProps) {
  const funcoes = useMemo(() => itens ?? [], [itens]);
  if (!funcoes.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-gray-500 bg-gray-50 rounded">
        <FolderOpenIcon className="mb-4 size-12" />
        <span className="text-lg font-medium">
          Nenhuma função encontrada. Utilize os filtros para refinar sua busca.
        </span>
      </div>
    );
  }

  return(
    <>
      <ResultMetadata
        resourceName="Funções"
        displayed={funcoes.length}
        total={total}
      />

      <ResultContainer>
        {funcoes.map((funcao) => (
          <ItemFuncao 
            key={funcao.id} 
            dados={funcao} 
          />
        ))}
      </ResultContainer>
    </>
  );
}
