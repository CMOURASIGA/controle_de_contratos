"use client";

import Table, { ColumnTableProps } from "@/components/layouts/ui/table/table";
import { useConsultarMandatosRepresentante } from "@/hooks/representantes/use-consultar-mandatos-representante";
import type { Mandato } from "@/services/representantes.service";
import type { DadosRepresentanteCompletos } from "@/types/representante-visualizacao";
import { useMemo } from "react";
import { SkeletonTabelaMandatos } from "./SkeletonTabelaMandatos";

interface MandatosEventoVisualizacaoProps {
  representanteSelected: DadosRepresentanteCompletos | null | undefined;
  isLoading: boolean;
}

export function MandatosEventoVisualizacao({
  representanteSelected,
  isLoading,
}: MandatosEventoVisualizacaoProps) {
  const { mandatos, isLoading: isLoadingMandatos } =
    useConsultarMandatosRepresentante(representanteSelected?.id);

  const formatarData = (data?: Date | string) => {
    if (!data) return "-";
    const dataObj = typeof data === "string" ? new Date(data) : data;
    return dataObj.toLocaleDateString("pt-BR");
  };

  const dadosMandatos = useMemo(() => {
    if (!mandatos) return [];

    return mandatos.map((mandato: Mandato) => {
      const representacaoEvento =
        mandato.representacao?.nome ??
        mandato.representacao?.sigla ??
        "Sem informação";

      const tipoMandatoDescricao = mandato.tipoMandato?.nome ?? "";
      const funcaoDescricao = mandato.funcao?.nome ?? "";
      const prazoMandato =
        mandato.prazoMandato && mandato.unidadePrazoMandato
          ? `${mandato.prazoMandato} ${mandato.unidadePrazoMandato}`
          : "-";

      const statusMandato =
        mandato.situacao === -1
          ? "A vencer"
          : mandato.situacao === 0
          ? "Vencido"
          : "Sem informação";

      return {
        id: mandato.id,
        representacaoEvento,
        status: statusMandato,
        tipo: mandato.tipoLancamento === "M" ? "Mandato" : "Evento",
        tipoMandato: tipoMandatoDescricao,
        funcao: funcaoDescricao,
        prazo: prazoMandato,
        dataInicio: formatarData(mandato.dataInicioMandato),
        dataFim: formatarData(mandato.dataFimMandato),
      };
    });
  }, [mandatos]);

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
    </div>
  );
}
