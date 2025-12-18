"use client";

import { PageHeader } from "@/components/layouts/ui/page-header";
import { TabsComponent } from "@/components/layouts/ui/tabs";
import FormularioCriacaoOrgao from "@/components/orgaos/formularios/formulario-criacao-orgao";
import { useMemo } from "react";

export default function NovoOrgao() {
  const tabs = useMemo(() => {
    return [
      {
        value: "dados_principais",
        title: "Dados Principais",
        children: <FormularioCriacaoOrgao />,
      },
      {
        value: "vinculacoes",
        title: "Vinculações",
        disabled: true,
        children: <></>,
      },
    ];
  }, []);

  return (
    <>
      <PageHeader title="Cadastro de Órgão" goBack />

      <div className=" mx-auto max-sm:w-screen p-6 bg-white ">
        <TabsComponent items={tabs} />
        {/* <FormularioCriacaoOrgao /> */}
      </div>
    </>
  );
}
