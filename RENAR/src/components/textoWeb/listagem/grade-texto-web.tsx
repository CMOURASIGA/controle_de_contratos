import { ResultContainer } from "@/components/layouts/resultContainer";
import { FolderOpenIcon } from "@/components/layouts/ui/icons/folder-open";
import { ResultMetadata } from "@/components/shared/metadata-result";
import { TextoWeb } from "@/services/texto-web.service";
import { useMemo } from "react";
import ItemTextoWeb from "./item-texto-web";

interface GradeTextoWebProps {
  itens: TextoWeb[];
  total?: number;
}

export default function GradeTextoWeb({ 
  itens, 
  total = 0 
}: GradeTextoWebProps) {
  const textosWeb = useMemo(() => itens ?? [], [itens]);

  if (!textosWeb.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-gray-500 bg-gray-50 rounded">
        <FolderOpenIcon className="mb-4 size-12" />
        <span className="text-lg font-medium">
          Nenhum texto web encontrado. Utilize os filtros para refinar sua busca.
        </span>
      </div>
    );
  }

  return(
    <>
      <ResultMetadata
        resourceName="Textos Web"
        displayed={textosWeb.length}
        total={total}
      />

      <ResultContainer>
        {textosWeb.map((textoWeb) => (
          <ItemTextoWeb 
            key={textoWeb.id} 
            dados={textoWeb} 
          />
        ))}
      </ResultContainer>
    </>
  );
}
