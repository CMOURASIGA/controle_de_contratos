"use client";

import { useConsultarRepresentante } from "@/hooks/representantes/use-consultar-representante";
import Link from "next/link";
import { useMemo } from "react";
import { ButtonOutline } from "../layouts/ui/buttons/button-outline/button-outline";
import { PageHeader } from "../layouts/ui/page-header";
import { TabsComponent } from "../layouts/ui/tabs";
import { DadosBancariosVisualizacao } from "./visualizacao/DadosBancariosVisualizacao";
import { DadosPessoaisVisualizacao } from "./visualizacao/DadosPessoaisVisualizacao";
import { DadosProfissionaisVisualizacao } from "./visualizacao/DadosProfissionaisVisualizacao";
import { MandatosOrganizacoesVisualizacao } from "./visualizacao/MandatosOrganizacoesVisualizacao";
import { OutrasInformacoesVisualizacao } from "./visualizacao/OutrasInformacoesVisualizacao";
import { SkeletonVisualizacaoRepresentante } from "./visualizacao/SkeletonVisualizacaoRepresentante";

export function VisualizacaoRepresentante({
  representanteId,
}: {
  representanteId: string;
}) {
  const { representanteSelected, isLoading } =
    useConsultarRepresentante(representanteId);

  const tabs = useMemo(() => {
    return [
      {
        value: "1",
        title: "Dados Pessoais",
        children: (
          <>
            <h1 className="text-2xl font-bold cnc-text-brand-blue-600">
              Identificação
            </h1>
            {isLoading ? (
              <SkeletonVisualizacaoRepresentante.DadosPessoais />
            ) : (
              <DadosPessoaisVisualizacao
                representanteSelected={representanteSelected}
                isLoading={isLoading}
              />
            )}
          </>
        ),
      },
      {
        value: "2",
        title: "Dados Bancários",
        children: (
          <>
            <h1 className="text-2xl font-bold cnc-text-brand-blue-600">
              Dados Bancários
            </h1>
            {isLoading ? (
              <SkeletonVisualizacaoRepresentante.DadosBancarios />
            ) : (
              <DadosBancariosVisualizacao
                representanteSelected={representanteSelected}
                isLoading={isLoading}
              />
            )}
          </>
        ),
      },
      {
        value: "3",
        title: "Dados Profissionais",
        children: (
          <>
            <h1 className="text-2xl font-bold cnc-text-brand-blue-600">
              Dados Profissionais
            </h1>
            {isLoading ? (
              <SkeletonVisualizacaoRepresentante.DadosProfissionais />
            ) : (
              <DadosProfissionaisVisualizacao
                representanteSelected={representanteSelected}
                isLoading={isLoading}
              />
            )}
          </>
        ),
      },
      {
        value: "4",
        title: "Mandatos/Organizações",
        children: (
          <>
            <h1 className="text-2xl font-bold cnc-text-brand-blue-600">
              Mandatos/Organizações
            </h1>
            {isLoading ? (
              <SkeletonVisualizacaoRepresentante.MandatosOrganizacoes />
            ) : (
              <MandatosOrganizacoesVisualizacao
                representanteSelected={representanteSelected}
                isLoading={isLoading}
              />
            )}
          </>
        ),
      },
      {
        value: "5",
        title: "Outras Informações",
        children: (
          <>
            <h1 className="text-2xl font-bold cnc-text-brand-blue-600">
              Outras Informações
            </h1>
            {isLoading ? (
              <SkeletonVisualizacaoRepresentante.OutrasInformacoes />
            ) : (
              <OutrasInformacoesVisualizacao
                representanteSelected={representanteSelected}
                isLoading={isLoading}
              />
            )}
          </>
        ),
      },
    ];
  }, [representanteSelected, isLoading]);

  return (
    <>
      <PageHeader
        title="Visualização de Representante"
        description="Visualize as informações detalhadas do representante."
        goBack
      >
        <Link
          className="hover:text-blue-800 transition-all"
          href={`/representantes/editar?representanteId=${representanteId}`}
          title="Editar Representante"
        >
          <ButtonOutline>Editar</ButtonOutline>
        </Link>
      </PageHeader>

      <div className="px-8 py-10">
        <TabsComponent items={tabs} />
      </div>
    </>
  );
}
