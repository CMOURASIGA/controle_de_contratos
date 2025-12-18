"use client";

import { RelatorioAtividade } from "@/components/atividades/relatorioAtividade";
import PaginaCarregando from "@/components/layouts/pagina-carregando";
import { ButtonOutline } from "@/components/layouts/ui/buttons/button-outline/button-outline";
import { ExportIcon } from "@/components/layouts/ui/icons/export";
import { FolderOpenIcon } from "@/components/layouts/ui/icons/folder-open";
import { PencilIcon } from "@/components/layouts/ui/icons/pincel";
import { PageHeader } from "@/components/layouts/ui/page-header";
import { TabsComponent } from "@/components/layouts/ui/tabs";
import { useConsultarAtividade } from "@/hooks/atividades/use-consultar-atividade";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { VisualizacaoCustosLogisticaAtividade } from "./custos-logistica";
import { VisualizacaoDadosPrincipaisAtividade } from "./dados-principais";
import { VisualizacaoDetalhesPassagemAtividade } from "./detalhes-passagem";
import { SkeletonVisualizacaoAtividade } from "./skeleton-visualizacao-atividade";

export function VisualizacaoAtividade({
  atividadeId,
}: {
  atividadeId: string;
}) {
  const { atividadeSelected, isLoading, isNotFound, error } =
    useConsultarAtividade(atividadeId);
  console.log(atividadeSelected);
  const tabs = useMemo(() => {
    return [
      {
        value: "dados_principais",
        title: "Dados Principais",
        children: isLoading ? (
          <SkeletonVisualizacaoAtividade.DadosPrincipais />
        ) : (
          <VisualizacaoDadosPrincipaisAtividade />
        ),
      },
      {
        value: "custos_logistica",
        title: "Custos e Logística",
        children: isLoading ? (
          <SkeletonVisualizacaoAtividade.CustosLogistica />
        ) : (
          <VisualizacaoCustosLogisticaAtividade />
        ),
      },
      {
        value: "detalhes_passagem",
        title: "Detalhes de Passagem",
        children: isLoading ? (
          <SkeletonVisualizacaoAtividade.DetalhesPassagem />
        ) : (
          <VisualizacaoDetalhesPassagemAtividade />
        ),
      },
    ];
  }, [isLoading]);

  if (isLoading && !atividadeSelected) {
    return <PaginaCarregando />;
  }

  if (isNotFound) {
    return (
      <>
        <PageHeader
          title="Atividade não encontrada"
          description={
            error instanceof Error
              ? error.message
              : "A atividade solicitada não foi encontrada."
          }
          goBack
          // urlBack="/atividades/buscar"
        />
        <div className="mx-auto max-sm:w-screen p-6 bg-white mb-20">
          <div className="flex flex-col items-center justify-center min-h-96 text-gray-500 bg-gray-50 rounded">
            <FolderOpenIcon className="mb-4 size-12" />
            <span className="text-lg font-medium">
              {error instanceof Error
                ? error.message
                : "A atividade solicitada não foi encontrada."}
            </span>
            <ButtonOutline>
              <Link href="/atividades/buscar">
                <span className="flex flex-row items-center gap-2 mt-2">
                  <ArrowLeftIcon className="size-4" />
                  Voltar para a listagem
                </span>
              </Link>
            </ButtonOutline>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={
          atividadeSelected
            ? atividadeSelected.descricaoAtividade ||
              `Atividade #${atividadeId}`
            : "Visualizar Atividade"
        }
        description="Visualize os detalhes da atividade."
        goBack
        // urlBack="/atividades/busca"
      >
        <ButtonOutline>
          {atividadeSelected && (
            <PDFDownloadLink
              document={<RelatorioAtividade atividade={atividadeSelected} />}
              fileName="documento.pdf"
            >
              {({ loading }) =>
                loading ? (
                  "Gerando PDF..."
                ) : (
                  <span className="flex flex-row items-center gap-2">
                    <ExportIcon />
                    Gerar Relatório
                  </span>
                )
              }
            </PDFDownloadLink>
          )}
        </ButtonOutline>

        <ButtonOutline>
          <Link href={`/atividades/editar/${atividadeId}`}>
            <span className="flex flex-row items-center gap-2">
              <PencilIcon className="size-4" />
              Editar
            </span>
          </Link>
        </ButtonOutline>
      </PageHeader>
      <div className="mx-auto max-sm:w-screen p-6 bg-white mb-20">
        <TabsComponent items={tabs} />
      </div>
    </>
  );
}
