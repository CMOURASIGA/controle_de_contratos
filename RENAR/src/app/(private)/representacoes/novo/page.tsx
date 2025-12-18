//client component
"use client";

import { PageHeader } from "@/components/layouts/ui/page-header";
import { TabsComponent } from "@/components/layouts/ui/tabs";

import { FormularioDadosPrincipaisCriacao } from "@/components/representacoes/formularios/formulario-dados-principais-criacao";
import React, { useMemo } from "react";

const CadastroRepresentacao: React.FC = () => {
  const tabs = useMemo(() => {
    return [
      {
        value: "dados_principais",
        title: "Dados Principais",
        children: <FormularioDadosPrincipaisCriacao />,
      },
      {
        value: "informacoes",
        title: "Informações",
        disabled: true,
        children: <></>,
      },
      {
        value: "representantes",
        title: "Representantes",
        disabled: true,
        children: <></>,
      },

      {
        value: "custeio_representacao",
        title: "Custeio Representação",
        disabled: true,
        children: <></>,
      },
      {
        value: "",
        title: "Custeio Representação",
        disabled: true,
        children: <></>,
      },
    ];
  }, []);

  return (
    <>
      <PageHeader
        title="Cadastro Representação"
        description="Página de criar de representações"
        goBack
      />

      <div className=" mx-auto max-sm:w-screen p-6 bg-white ">
        <TabsComponent items={tabs} />
      </div>
    </>
  );
};

export default CadastroRepresentacao;
