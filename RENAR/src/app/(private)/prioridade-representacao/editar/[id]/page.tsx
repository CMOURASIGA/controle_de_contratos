"use client";

import PaginaCarregando from "@/components/layouts/pagina-carregando";
import { PageHeader } from "@/components/layouts/ui/page-header";
import { FormularioPrioridadeRepresentacao } from "@/components/prioridade-representacao/formularios/formulario-prioridade-representacao";
import { useConsultarPrioridadeRepresentacao } from "@/hooks/dominios/use-prioridade-representacao";
import { useParams } from "next/navigation";

export default function PageEditarTextoWeb() {
  const params = useParams();
  const id = params.id as string;
  const { prioridadeSelected, isLoading } = useConsultarPrioridadeRepresentacao(id);

  return (
    <>
      {isLoading ? (
        <PaginaCarregando />
      ) : (
        <>
          <PageHeader
            title={
              prioridadeSelected
                ? `Editar Prioridade de Representação - ${"ID: " + id }`
                : "Editar Prioridade de Representação"
            }
            description="Edite as informações da prioridade de representação."
            goBack
          />
          <FormularioPrioridadeRepresentacao id={id} />  
        </>
      )}
    </>
  );
}