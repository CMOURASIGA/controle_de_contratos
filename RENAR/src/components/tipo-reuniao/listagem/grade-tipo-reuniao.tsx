import { ResultContainer } from "@/components/layouts/resultContainer";
import { FolderOpenIcon } from "@/components/layouts/ui/icons/folder-open";
import { ResultMetadata } from "@/components/shared/metadata-result";
import { useMemo } from "react";
import { TipoReuniao } from "@/services/tipo-reuniao.service";
import ItemTipoReuniao from "./item-tipo-reuniao";

interface GradeTipoReuniaoProps {
  itens: TipoReuniao[];
  total?: number;
}

export default function GradeTipoReuniao({ 
  itens, 
  total = 0 
}: GradeTipoReuniaoProps) {
  const tiposReuniao = useMemo(() => itens ?? [], [itens]);

  if (!tiposReuniao.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-gray-500 bg-gray-50 rounded">
        <FolderOpenIcon className="mb-4 size-12" />
        <span className="text-lg font-medium">
          Nenhum tipo de reunião encontrado. Utilize os filtros para refinar sua busca.
        </span>
      </div>
    );
  }

  return(
    <>
      <ResultMetadata
        resourceName="Tipos de Reunião"
        displayed={tiposReuniao.length}
        total={total}
      />

      <ResultContainer>
        {tiposReuniao.map((tipoReuniao) => (
          <ItemTipoReuniao 
            key={tipoReuniao.id} 
            dados={tipoReuniao} 
          />
        ))}
      </ResultContainer>
    </>
  );
}
