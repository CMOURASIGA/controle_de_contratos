//client component
"use client";

import { PageHeader } from "@/components/layouts/ui/page-header";
import { TabsComponent } from "@/components/layouts/ui/tabs";

import { FormularioDadosPrincipaisEdicao } from "@/components/representacoes/formularios/formulario-dados-principais-edicao";
import React, { useMemo } from "react";

import PaginaCarregando from "@/components/layouts/pagina-carregando";
import { ButtonDelete } from "@/components/layouts/ui/buttons/button-delete/button-delete";
import { FormularioCusteio } from "@/components/representacoes/formularios/formulario-custeio";
import { FormularioInformacoes } from "@/components/representacoes/formularios/formulario-informacoes";
import { FormularioRepresentantes } from "@/components/representacoes/formularios/formulario-representantes";
import { FormularioVinculacoes } from "@/components/representacoes/formularios/formulario-vinculacoes";
import { ModalExcluirRepresentacao } from "@/components/representacoes/modais/modal-excluir";
import { useConsultarRepresentacao } from "@/hooks/representacoes/use-consultar-representacao";
import { useModal } from "@/hooks/use-modal";
import { Representacao } from "@/types/representacao.type";
import { useParams } from "next/navigation";

const EdicaoRepresentacao: React.FC = () => {
  const params = useParams();
  const representacaoId = params.id as string;
  const { representacaoSelected, isLoading } =
    useConsultarRepresentacao(representacaoId);
  const { openModal } = useModal();

  const tabs = useMemo(() => {
    return [
      {
        value: "dados_principais",
        title: "Dados Principais",
        children: <FormularioDadosPrincipaisEdicao />,
      },
      {
        value: "informacoes",
        title: "Informações Adicionais",
        children: <FormularioInformacoes />,
      },
      {
        value: "representantes",
        title: "Representantes",
        children: <FormularioRepresentantes />,
      },
      {
        value: "custeio_representacao",
        title: "Custeio Representação",
        children: <FormularioCusteio />,
      },
      {
        value: "vinculacoes",
        title: "Vinculações",
        children: <FormularioVinculacoes />,
      },
    ];
  }, []);

  return (
    <>
      {isLoading ? (
        <PaginaCarregando />
      ) : (
        <>
          <PageHeader
            title={
              representacaoSelected
                ? representacaoSelected.nome
                : "Editar Representação"
            }
            goBack
            urlBack="/representacoes/busca"
          >
            <ButtonDelete
              onClick={() => openModal("modal_excluir_representacao")}
            />
          </PageHeader>
          <div className=" mx-auto max-sm:w-screen p-6 bg-white mb-20">
            <TabsComponent items={tabs} />
          </div>
          {representacaoSelected && (
            <ModalExcluirRepresentacao
              redirect
              representacao={representacaoSelected as Representacao}
            />
          )}
        </>
      )}
    </>
  );
};

export default EdicaoRepresentacao;
