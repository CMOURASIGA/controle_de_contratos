"use client";

import Table, { ColumnTableProps } from "@/components/layouts/ui/table/table";
import { useConsultarMandatosRepresentante } from "@/hooks/representantes/use-consultar-mandatos-representante";
import type { Mandato } from "@/services/representantes.service";
import type { DadosRepresentanteCompletos } from "@/types/representante-visualizacao";
import { useMemo } from "react";

import { useConsultarOrganizacoesRepresentante } from "@/hooks/representantes/use-consultar-organizacoes-representante";
import {
  SkeletonTabelaMandatos,
  SkeletonTabelaOrganizacoes,
} from "./SkeletonTabelaMandatos";

interface MandatosOrganizacoesVisualizacaoProps {
  representanteSelected: DadosRepresentanteCompletos | null | undefined;
  isLoading: boolean;
}

export function MandatosOrganizacoesVisualizacao({
  representanteSelected,
  isLoading,
}: MandatosOrganizacoesVisualizacaoProps) {
  const { mandatos, isLoading: isLoadingMandatos } =
    useConsultarMandatosRepresentante(representanteSelected?.id);

  const { organizacoes, isLoading: isLoadingOrganizacoes } =
    useConsultarOrganizacoesRepresentante(representanteSelected?.id);

  const formatarData = (data?: Date | string) => {
    if (!data) return "-";
    const dataObj = typeof data === "string" ? new Date(data) : data;
    return dataObj.toLocaleDateString("pt-BR");
  };

  const dadosMandatos = useMemo(() => {
    if (!mandatos) return [];

    return mandatos.map((mandato: Mandato) => ({
      id: mandato.id,
      representacaoEvento: mandato.representacao.nome ?? "Sem informação",
      status:
        mandato.situacao === -1
          ? "A vencer"
          : mandato.situacao === 0
          ? "Vencido"
          : "Sem informação",
      tipo: mandato.tipoLancamento === "M" ? "Mandato" : "Evento",
      tipoMandato: mandato.tipoMandato.nome ?? "",
      funcao: mandato?.funcao?.nome ?? "",
      prazo: `${mandato.prazoMandato} ${mandato.unidadePrazoMandato}`,
      dataInicio: formatarData(mandato.dataInicioMandato),
      dataFim: formatarData(mandato.dataFimMandato),
    }));
  }, [mandatos]);

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

  const colunasMandatos: ColumnTableProps[] = useMemo(
    () => [
      {
        key: "representacaoEvento",
        title: "Representação / Evento",
        width: "35%",
      },
      {
        key: "tipo",
        title: "Tipo Mandato / Evento",
        width: "15%",
      },
      {
        key: "status",
        title: "Status",
        width: "15%",
      },
      {
        key: "tipoMandato",
        title: "Tipo Mandato",
        width: "15%",
      },
      {
        key: "funcao",
        title: "Função",
        width: "15%",
      },
      {
        key: "prazo",
        title: "Prazo (dias/anos)",
        width: "15%",
      },
      {
        key: "dataInicio",
        title: "Data Início",
        width: "15%",
      },
      {
        key: "dataFim",
        title: "Data Fim",
        width: "15%",
      },
    ],
    []
  );

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
      {/* Seção de Mandatos */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Mandatos</h3>
        {isLoadingMandatos ? (
          <SkeletonTabelaMandatos />
        ) : (
          <Table
            data={dadosMandatos}
            columns={colunasMandatos}
            aria-label="Tabela de mandatos e eventos"
          />
        )}
      </div>

      {/* Seção de Organizações */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Organizações</h3>
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
