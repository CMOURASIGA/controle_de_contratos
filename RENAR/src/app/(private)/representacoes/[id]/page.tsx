//client component
"use client";

import React, { useMemo } from "react";

import PaginaCarregando from "@/components/layouts/pagina-carregando";
import { ButtonDelete } from "@/components/layouts/ui/buttons/button-delete/button-delete";
import { ButtonOutline } from "@/components/layouts/ui/buttons/button-outline/button-outline";
import { PencilIcon } from "@/components/layouts/ui/icons/pincel";
import { PageHeader } from "@/components/layouts/ui/page-header";
import { TabsComponent } from "@/components/layouts/ui/tabs";
import { ModalExcluirRepresentacao } from "@/components/representacoes/modais/modal-excluir";
import { VisualizacaoCusteioRepresentacaoTab } from "@/components/representacoes/visualizacao/custeio-representacao";
import { VisualizacaoDadosPrincipaisRepresentacoesTab } from "@/components/representacoes/visualizacao/dados-principais";
import { VisualizacaoInformacoesAdicionaisRepresentacoesTab } from "@/components/representacoes/visualizacao/informacoes-adicionais";
import { VisualizacaoRepresentantesRepresentacoesTab } from "@/components/representacoes/visualizacao/representantes";
import { VisualizacaoVinculacoesTab } from "@/components/representacoes/visualizacao/vinculacoes";
import { useConsultarRepresentacao } from "@/hooks/representacoes/use-consultar-representacao";
import { useModal } from "@/hooks/use-modal";
import { Representacao } from "@/types/representacao.type";
import Link from "next/link";
import { useParams } from "next/navigation";

const PaginaDetalhesRepresentacao: React.FC = () => {
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
        children: <VisualizacaoDadosPrincipaisRepresentacoesTab />,
      },
      {
        value: "informacoes",
        title: "Informações",
        children: <VisualizacaoInformacoesAdicionaisRepresentacoesTab />,
      },
      {
        value: "representantes",
        title: "Representantes",
        children: <VisualizacaoRepresentantesRepresentacoesTab />,
      },
      {
        value: "custeio_representacao",
        title: "Custeio Representação",
        children: <VisualizacaoCusteioRepresentacaoTab />,
      },
      {
        value: "vinculacoes",
        title: "Vinculações",
        children: <VisualizacaoVinculacoesTab />,
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
                : "Visualizar Representação"
            }
            goBack
          >
            <ButtonDelete
              onClick={() => openModal("modal_excluir_representacao")}
            />
            <ButtonOutline>
              <Link href={`/representacoes/editar/${representacaoId}`}>
                <span className="flex flex-row items-center gap-2">
                  <PencilIcon className="size-4" />
                  Editar
                </span>
              </Link>
            </ButtonOutline>
          </PageHeader>
          <div className=" mx-auto max-sm:w-screen p-6 bg-white ">
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

export default PaginaDetalhesRepresentacao;
