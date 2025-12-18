"use client";

import type { Representante } from "@/types";

interface ListaResultadosRepresentantesProps {
  representantes: Representante[];
  total: number;
  isLoading: boolean;
  excluirRepresentante: (id: number) => Promise<ExcluirRepresentanteResponse | null>;
  validarExclusao: (id: number) => Promise<ValidarExclusaoResponse | null>;
}

import { ResultMetadata } from "@/components/shared/metadata-result";

import { GridRepresentantesSkeleton } from "./grid-representantes-skeleton";
import { ResultContainer } from "../resultContainer";
import { CardRepresentante } from "./cards/card-representante";
import { FolderOpenIcon } from "../ui/icons/folder-open";
import { ExcluirRepresentanteResponse, ValidarExclusaoResponse } from "@/services/representantes.service";

export function ListaResultadosRepresentantes({
  representantes,
  total,
  isLoading,
  excluirRepresentante,
  validarExclusao,
}: ListaResultadosRepresentantesProps) {
  return (
    <div className="px-6">
      <ResultMetadata
        resourceName="Representantes"
        displayed={representantes?.length}
        total={total}
        isLoading={isLoading}
      />
      <div className="mt-4 mb-8">
        {isLoading ? (
          <GridRepresentantesSkeleton />
        ) : (
          <ResultContainer>
            {representantes.map((representante) => (
              <CardRepresentante
                key={representante.id}
                data={representante}
                onDelete={(id) => {
                  return excluirRepresentante(id);
                }}
                onValidarExclusao={(id) => {
                  return validarExclusao(id);
                }}
              />
            ))}
          </ResultContainer>
        )}
        {representantes.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center min-h-96 text-gray-500 bg-gray-50 rounded">
            <FolderOpenIcon className="mb-4 size-12" />
            <span className="text-lg font-medium">
              Nenhum representante encontrado. Utilize os filtros para refinar sua busca.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
