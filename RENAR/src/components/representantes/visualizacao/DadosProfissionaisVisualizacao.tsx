"use client";

import Label from "@/components/layouts/ui/label/label";
import Table, { ColumnTableProps } from "@/components/layouts/ui/table/table";
import type { DadosRepresentanteCompletos } from "@/types/representante-visualizacao";
import { useMemo } from "react";

/**
 * Interface para atuações profissionais
 */
interface AtuacaoProfissional {
  atuacao: string;
  descricao: string;
  [key: string]: string | number | React.ReactNode;
}

interface DadosProfissionaisVisualizacaoProps {
  representanteSelected: DadosRepresentanteCompletos | null | undefined;
  isLoading: boolean;
}

export function DadosProfissionaisVisualizacao({
  representanteSelected,
  isLoading,
}: DadosProfissionaisVisualizacaoProps) {
  //const { opcoesProfissoes } = useProfissoes();

  // Configuração das colunas da tabela de atuações
  const colunasAtuacoes: ColumnTableProps[] = useMemo(
    () => [
      {
        key: "atuacao",
        title: "Atuações",
        width: "40%",
      },
      {
        key: "descricao",
        title: "Descrição",
        width: "60%",
      },
    ],
    []
  );

  if (isLoading) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Carregando dados profissionais...</p>
      </div>
    );
  }

  if (!representanteSelected) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-600">
          Informações profissionais não disponíveis no momento.
        </p>
      </div>
    );
  }

  // Buscar nome da profissão baseado no ID
  const nomeProfissao =
    representanteSelected.profissao?.descricaoProfissao || "Profissão não identificada";

  return (
    <div className="mt-6 space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label label="Profissão" value={nomeProfissao} />
        </div>

        <div className="space-y-2">
          <Label
            label="Mini Currículo"
            value={
              <div className="p-3 bg-gray-50 rounded-md border min-h-[100px]">
                {/* Aqui seria exibido o mini currículo quando disponível na API */}
                <p className="text-gray-600 italic">
                  {representanteSelected.miniCurriculo ||
                    "Mini currículo não disponível no momento."}
                </p>
              </div>
            }
          />
        </div>
      </div>

      {/* Seção de Atuações Profissionais */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Atuações Profissionais
        </h3>

        {representanteSelected?.atuacoes?.length > 0 ? (
          <Table
            data={representanteSelected.atuacoes}
            columns={colunasAtuacoes}
            aria-label="Tabela de atuações profissionais"
          />
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600 italic">
              Nenhuma atuação profissional cadastrada no momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
