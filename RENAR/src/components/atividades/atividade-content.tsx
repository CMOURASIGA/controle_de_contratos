"use client";

import { FormularioNovaAtividade } from "@/components/atividades";
import { PageHeader } from "@/components/layouts/ui/page-header";
import { TabsComponent } from "@/components/layouts/ui/tabs";
import { useMemo } from "react";

export function NovaAtividadeContent() {
  const tabs = useMemo(
    () => [
      {
        value: "dados_principais",
        title: "Dados principais",
        children: <FormularioNovaAtividade />,
      },
      {
        value: "prestacao_contas",
        title: "Prestação de Contas",
        children: <></>,
        disabled: true,
      },
    ],
    []
  );

  return (
    <>
      <PageHeader
        title="Cadastro de Atividade"
        description="Registre todas as informações operacionais da atividade."
        goBack
      />
      <div className="mx-auto max-sm:w-screen p-6 bg-white">
        <TabsComponent items={tabs} />
      </div>
    </>
  );
}
