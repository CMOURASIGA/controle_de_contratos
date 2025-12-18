import { ResultContainer } from "@/components/layouts/resultContainer";
import { FolderOpenIcon } from "@/components/layouts/ui/icons/folder-open";
import { ResultMetadata } from "@/components/shared/metadata-result";
import { useMemo } from "react";
import { PrioridadeRepresentacao } from "@/services/prioridade-representacao.service";
import ItemPrioridadeRepresentacao from "./item-prioridade-representacao";

interface GradePrioridadeRepresentacaoProps {
  itens: PrioridadeRepresentacao[];
  total?: number;
}

export default function GradePrioridadeRepresentacao({ 
  itens, 
  total = 0 
}: GradePrioridadeRepresentacaoProps) {
  const prioridades = useMemo(() => itens ?? [], [itens]);

  if (!prioridades.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-gray-500 bg-gray-50 rounded">
        <FolderOpenIcon className="mb-4 size-12" />
        <span className="text-lg font-medium">
          Nenhuma prioridade de representação encontrada. Utilize os filtros para refinar sua busca.
        </span>
      </div>
    );
  }

  return(
    <>
      <ResultMetadata
        resourceName="Prioridades de Representação"
        displayed={prioridades.length}
        total={total}
      />

      <ResultContainer>
        {prioridades.map((prioridade) => (
          <ItemPrioridadeRepresentacao 
            key={prioridade.id} 
            dados={prioridade} 
          />
        ))}
      </ResultContainer>
    </>
  );
}
