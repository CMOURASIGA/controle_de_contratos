import { ResultContainer } from "@/components/layouts/resultContainer";
import { FolderOpenIcon } from "@/components/layouts/ui/icons/folder-open";
import { ResultMetadata } from "@/components/shared/metadata-result";
import { useMemo } from "react";
import { Categoria } from "@/services/categorias.service";
import ItemCategoria from "./item-categoria";

interface GradeCategoriaProps {
  itens: Categoria[];
  total?: number;
}

export default function GradeCategoria({ 
  itens, 
  total = 0 
}: GradeCategoriaProps) {
  const categorias = useMemo(() => itens ?? [], [itens]);
  if (!categorias.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-gray-500 bg-gray-50 rounded">
        <FolderOpenIcon className="mb-4 size-12" />
        <span className="text-lg font-medium">
          Nenhuma categoria encontrada. Utilize os filtros para refinar sua busca.
        </span>
      </div>
    );
  }
  
  return(
    <>
      <ResultMetadata
        resourceName="Categorias"
        displayed={categorias.length}
        total={total}
      />

      <ResultContainer>
        {categorias.map((categoria) => (
          <ItemCategoria 
            key={categoria.idCategoria} 
            dados={categoria} 
          />
        ))}
      </ResultContainer>
    </>
  );
}
