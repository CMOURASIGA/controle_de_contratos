"use client";

import { FormularioFuncao } from "@/components/funcoes/formularios/formulario-funcao";
import PaginaCarregando from "@/components/layouts/pagina-carregando";
import { PageHeader } from "@/components/layouts/ui/page-header";
import { useConsultarFuncao } from "@/hooks/funcoes/use-funcao";
import { useParams } from "next/navigation";

export default function PageEditarFuncoesPage() {
  const params = useParams();
  const funcaoId = params.id as string;
  const { funcaoSelected, isLoading } = useConsultarFuncao(funcaoId);

  return (
    <>
      {isLoading ? (
        <PaginaCarregando />
      ) : (
        <>
          <PageHeader
            title={
              funcaoSelected
                ? `Editar Função - ${"ID: " + funcaoId}`
                : "Editar Função"
            }
            description="Edite as informações da função."
            goBack
          />
          <FormularioFuncao idFuncao={funcaoId} />  
        </>
      )}
    </>
  );
}