"use client";

import Table, { ColumnTableProps } from "@/components/layouts/ui/table/table";
import type { DadosRepresentanteCompletos } from "@/types/representante-visualizacao";
import { useMemo } from "react";

import { useConsultarOrganizacoesRepresentante } from "@/hooks/representantes/use-consultar-organizacoes-representante";
import { SkeletonTabelaOrganizacoes } from "./SkeletonTabelaMandatos";

interface MandatosOrganizacoesVisualizacaoProps {
  representanteSelected: DadosRepresentanteCompletos | null | undefined;
  isLoading?: boolean;
}

export function OrganizacoesVisualizacao({
  representanteSelected,
  isLoading = false,
}: MandatosOrganizacoesVisualizacaoProps) {
  const { organizacoes, isLoading: isLoadingOrganizacoes } =
    useConsultarOrganizacoesRepresentante(representanteSelected?.id);

  const dadosOrganizacoes = useMemo(() => {
    if (!organizacoes) return [];

    return organizacoes.map((organizacao) => ({
      ...organizacao,
      numeroTelefone: organizacao.numeroTelefone
        ? organizacao.numeroTelefone
        : "Não informado",
      enderecoHome: organizacao.enderecoHome
        ? organizacao.enderecoHome
        : "Não informado",
    }));
  }, [organizacoes]);

  const colunasOrganizacoes: ColumnTableProps[] = useMemo(
    () => [
      {
        title: "Identificação SLC",
        key: "id",
        width: "15%",
      },
      {
        title: "Cargo",
        key: "descricaoCargo",
        width: "20%",
      },
      {
        title: "Organização",
        key: "nomeOrganizacao",
        width: "25%",
      },
      {
        title: "Telefone",
        key: "numeroTelefone",
        width: "15%",
      },
      {
        title: "E-mail",
        key: "email",
        width: "15%",
      },
      {
        title: "Site",
        key: "enderecoHome",
        width: "10%",
      },
    ],
    []
  );

  if (isLoading) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-600">
          Carregando informações de mandatos e organizações...
        </p>
      </div>
    );
  }

  if (!representanteSelected) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-600">
          Informações de mandatos e organizações não disponíveis no momento.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-8">
      {/* Seção de Organizações */}
      <div className="space-y-4">
        {isLoadingOrganizacoes ? (
          <SkeletonTabelaOrganizacoes />
        ) : (
          <Table
            data={dadosOrganizacoes}
            columns={colunasOrganizacoes}
            aria-label="Tabela de organizações"
          />
        )}
      </div>
    </div>
  );
}
