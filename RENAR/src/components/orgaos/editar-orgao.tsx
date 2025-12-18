"use client";

import { useQueryString } from "@/hooks/useQueryParams";
import { useMemo } from "react";
import { FormularioEdicaoOrgao } from "./formularios/forumulario-edicao-orgao";
import { useConsultarOrgaoPorId } from "@/hooks/orgaos/use-consultar-orgao-por-id";
import { TabsComponent } from "../layouts/ui/tabs";
import { PageHeader } from "../layouts/ui/page-header";
import { SkeletonVisualizacaoRepresentante } from "../representantes/visualizacao/SkeletonVisualizacaoRepresentante";


export function EditarOrgao() {
  const { getAllQueryStrings } = useQueryString();
  const { orgaoId } = getAllQueryStrings();
  const { orgaoSelecionado } = useConsultarOrgaoPorId(orgaoId);

  const tabs = useMemo(() => {
    return [
      {
        value: "dados_principais",
        title: "Dados Principais",
        label: (
          <>
            <div className="flex flex-row text-xs">Dados Principais</div>
          </>
        ),
        children: <FormularioEdicaoOrgao />,
      },
      {
        value: "dados_principais",
        title: "Dados Principais",
        label: (
          <>
            <div className="flex flex-row text-xs">Vinculações</div>
          </>
        ),
        children: <> </>,
        disabled: true,
      },
    ];
  }, []);

  return (
    <div>
      <PageHeader
        title={
          orgaoSelecionado
            ? orgaoSelecionado?.data?.nome
            : "Editar Órgão"
        }
        goBack
      />
      { orgaoSelecionado ? (
        <div className=" mx-auto max-sm:w-screen p-6 bg-white ">
          <TabsComponent items={tabs} />
        </div>
      ) : (
        <div className=" mx-auto max-sm:w-screen p-6 bg-white ">
          <SkeletonVisualizacaoRepresentante.OutrasInformacoes />
        </div>
      )}
    </div>
  );
}