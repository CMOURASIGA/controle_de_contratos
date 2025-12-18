"use client";

import { ButtonOutline } from "@/components/layouts/ui/buttons/button-outline/button-outline";
import { PageHeader } from "@/components/layouts/ui/page-header";
import { TabsComponent } from "@/components/layouts/ui/tabs";
import { SecaoVinculacoesOrgaos } from "@/components/orgaos/formularios/sections/secao-vinculacao-orgaos";
import VisualizarOrgao from "@/components/orgaos/visualizacao/visualizar-orgao";
import { SkeletonVisualizacaoRepresentante } from "@/components/representantes/visualizacao/SkeletonVisualizacaoRepresentante";
import { useConsultarOrgaoPorId } from "@/hooks/orgaos/use-consultar-orgao-por-id";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export default function PageVisualizarOrgao() {
  const params = useParams();
  const orgaoId = params.id as string;
  const { orgaoSelecionado } = useConsultarOrgaoPorId(orgaoId);

  const tabs = useMemo(() => {
    return [
      {
        value: "dados_gerais_orgao",
        title: "Dados Principais",
        children: orgaoSelecionado ? (
          <VisualizarOrgao orgaoSelecionado={orgaoSelecionado?.data} />
        ) : (
          <SkeletonVisualizacaoRepresentante.OutrasInformacoes />
        ),
      },
      {
        value: "vinculacoes_orgao",
        title: "Vinculações",
        children: orgaoSelecionado ? (
          <SecaoVinculacoesOrgaos
            idOrgaoeSelecionado={orgaoSelecionado?.data?.id}
          />
        ) : (
          <SkeletonVisualizacaoRepresentante.OutrasInformacoes />
        ),
      },
    ];
  }, [orgaoSelecionado]);

  return (
    <>
      <PageHeader
        title="Visualização de Órgão"
        description="Visualize as informações detalhadas do órgão."
        goBack
      >
        {orgaoSelecionado && (
          <Link
            className="hover:text-blue-800 transition-all"
            href={`/orgaos/${orgaoSelecionado?.data?.id}/editar`}
            title="Editar Órgão"
          >
            <ButtonOutline>Editar</ButtonOutline>
          </Link>
        )}
      </PageHeader>
      <div className=" mx-auto max-sm:w-screen p-6 bg-white ">
        <TabsComponent items={tabs} />
      </div>
    </>
  );
}
