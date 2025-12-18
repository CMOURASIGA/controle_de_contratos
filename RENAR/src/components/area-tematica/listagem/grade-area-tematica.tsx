import { ResultContainer } from "@/components/layouts/resultContainer";
import { FolderOpenIcon } from "@/components/layouts/ui/icons/folder-open";
import { ResultMetadata } from "@/components/shared/metadata-result";
import { useMemo } from "react";
import { AreaTematica } from "@/services/area-tematica.service";
import ItemAreaTematica from "./item-area-tematica";

interface GradeAreaTematicaProps {
  itens: AreaTematica[];
  total?: number;
}

export default function GradeAreaTematica({ 
  itens, 
  total = 0 
}: GradeAreaTematicaProps) {
  const areasTematicas = useMemo(() => itens ?? [], [itens]);

  if (!areasTematicas.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-gray-500 bg-gray-50 rounded">
        <FolderOpenIcon className="mb-4 size-12" />
        <span className="text-lg font-medium">
          Nenhuma área temática encontrada. Utilize os filtros para refinar sua busca.
        </span>
      </div>
    );
  }

  return(
    <>
      <ResultMetadata
        resourceName="Textos Web"
        displayed={areasTematicas.length}
        total={total}
      />

      <ResultContainer>
        {areasTematicas.map((areaTematica) => (
          <ItemAreaTematica 
            key={areaTematica.idCategoriaRepresentacao} 
            dados={areaTematica} 
          />
        ))}
      </ResultContainer>
    </>
  );
}
