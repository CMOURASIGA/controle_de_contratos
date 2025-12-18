"use client";

import { FormularioNovaAtividade } from "@/components/atividades/formularios/formulario-nova-atividade";
import { FormularioPrestacaoContas } from "@/components/atividades/formularios/formulario-prestacao-conta";
import PaginaCarregando from "@/components/layouts/pagina-carregando";
import { PageHeader } from "@/components/layouts/ui/page-header";
import { TabsComponent } from "@/components/layouts/ui/tabs";
import { useConsultarAtividade } from "@/hooks/atividades/use-consultar-atividade";
import { useParams } from "next/navigation";
import { useMemo } from "react";

const EdicaoAtividade: React.FC = () => {
  const params = useParams();
  const atividadeId = params.id as string;
  const { atividadeSelected, isLoading } = useConsultarAtividade(atividadeId);

  const tabs = useMemo(
    () => [
      {
        value: "dados_principais",
        title: "Dados principais",
        children: <FormularioNovaAtividade atividadeId={atividadeId} />,
      },
      {
        value: "prestacao_contas",
        title: "Prestação de Contas",
        children: <FormularioPrestacaoContas id={+atividadeId} />,
        disabled: false,
      },
    ],
    [atividadeId]
  );

  return (
    <>
      {isLoading ? (
        <PaginaCarregando />
      ) : (
        <>
          <PageHeader
            title={
              atividadeSelected
                ? `Editar Atividade - ${
                    atividadeSelected.descricaoAtividade || "ID: " + atividadeId
                  }`
                : "Editar Atividade"
            }
            description="Edite as informações da atividade."
            goBack
            urlBack="/atividades/buscar"
          />
          <div className="mx-auto max-sm:w-screen p-6 bg-white mb-20">
            <TabsComponent items={tabs} />
          </div>
        </>
      )}
    </>
  );
};

export default EdicaoAtividade;
