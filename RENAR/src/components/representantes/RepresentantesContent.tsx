"use client";
import { useConsultarRepresentante } from "@/hooks/representantes/use-consultar-representante";
import { useQueryString } from "@/hooks/useQueryParams";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { PageHeader } from "../layouts/ui/page-header";
import { TabsComponent } from "../layouts/ui/tabs";
import { DadosBancariosForm } from "./forms/DadosbancariosForms";
import { DadosPessoaisForm } from "./forms/DadosPessoaisForm";
import { DadosProfissionaisForm } from "./forms/DadosProfissionais";
import { RepresentantesView } from "./pessoa/RepresentantesView";
import { MandatosEventoVisualizacao } from "./visualizacao/MandatosEventoVisualizacao";
import { OrganizacoesVisualizacao } from "./visualizacao/OrganizacoesVisualizacao";
import { RepresentanteStatusBadge } from "./visualizacao/RepresentanteStatusBadge";
import { SkeletonTabelaMandatos } from "./visualizacao/SkeletonTabelaMandatos";

export function RepresentantesContent() {
  const { getAllQueryStrings } = useQueryString();
  const { representanteId } = getAllQueryStrings();
  const pathname = usePathname();

  const { representanteSelected, isLoading } =
    useConsultarRepresentante(representanteId);
  const isEditMode = pathname?.includes("/editar");
  const isCreateMode = pathname?.includes("/novo");

  const pageTitle = isEditMode
    ? "Editar Representante"
    : isCreateMode
    ? "Cadastro de Representante"
    : "Cadastro de Representantes";

  const pageDescription = isEditMode
    ? "Edite os dados do representante cadastrado."
    : isCreateMode
    ? "Cadastre um novo representante no sistema."
    : "Gerencie, cadastre e edite os representantes utilizados.";

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
            {representanteId ? <DadosPessoaisForm /> : <RepresentantesView />}
          </>
        ),
      },
      {
        value: "2",
        title: "Dados Bancários",
        disabled: !representanteId || representanteSelected?.isNovo,
        children: (
          <>
            <h1 className="text-2xl font-bold cnc-text-brand-blue-600">
              Dados Bancários
            </h1>
            <DadosBancariosForm />
          </>
        ),
      },
      {
        value: "3",
        title: "Dados Profissionais",
        disabled: !representanteId || representanteSelected?.isNovo,
        children: (
          <>
            <h1 className="text-2xl font-bold cnc-text-brand-blue-600">
              Dados Profissionais
            </h1>
            <DadosProfissionaisForm />
          </>
        ),
      },
      {
        value: "4",
        title: "Organizações",
        disabled: true,
        children: (
          <>
            <h1 className="text-2xl font-bold cnc-text-brand-blue-600">
              Organizações
            </h1>

            <OrganizacoesVisualizacao
              representanteSelected={representanteSelected}
              isLoading={isLoading}
            />
          </>
        ),
      },
      {
        value: "5",
        title: "Mandatos/Evento",
        disabled: true,
        children: (
          <>
            <h1 className="text-2xl font-bold cnc-text-brand-blue-600">
              Mandatos/Evento
            </h1>
            {isLoading ? (
              <SkeletonTabelaMandatos />
            ) : (
              <MandatosEventoVisualizacao
                representanteSelected={representanteSelected}
                isLoading={isLoading}
              />
            )}
          </>
        ),
      },
    ];
  }, [representanteId, representanteSelected, isLoading]);

  return (
    <>
      <PageHeader title={pageTitle} description={pageDescription} goBack>
        <RepresentanteStatusBadge
          representanteId={representanteId}
          isLoading={isLoading}
          isNovo={representanteSelected?.isNovo}
        />
      </PageHeader>

      <div className="px-8 pt-10">
        <TabsComponent items={tabs} />
      </div>
    </>
  );
}
