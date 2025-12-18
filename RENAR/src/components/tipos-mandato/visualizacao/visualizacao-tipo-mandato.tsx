"use client";

import { PageHeader } from "@/components/layouts/ui/page-header";
import { ButtonOutline } from "@/components/layouts/ui/buttons/button-outline/button-outline";
import { PencilIcon } from "@/components/layouts/ui/icons/pincel";
import { useConsultarTipoMandatoPorId } from "@/hooks/tipos-mandato/use-consultar-tipo-mandato-por-id";
import PaginaCarregando from "@/components/layouts/pagina-carregando";
import Link from "next/link";
import Label from "@/components/layouts/ui/label/label";

interface VisualizacaoTipoMandatoProps {
  tipoMandatoId: string;
}

export function VisualizacaoTipoMandato({
  tipoMandatoId,
}: VisualizacaoTipoMandatoProps) {
  const { tipoMandatoSelecionado, isLoading } =
    useConsultarTipoMandatoPorId(tipoMandatoId);

  const tipo = tipoMandatoSelecionado?.data || tipoMandatoSelecionado;

  if (isLoading) {
    return <PaginaCarregando />;
  }

  return (
    <>
      <PageHeader
        title={
          tipo
            ? `Tipo de Mandato - ${tipo.descricao || ""}`
            : "Visualizar Tipo de Mandato"
        }
        description="Visualize as informações detalhadas do tipo de mandato."
        goBack
        urlBack="/tipos-mandato/busca"
      >
        <Link
          className="hover:text-blue-800 transition-all"
          href={`/tipos-mandato/${tipoMandatoId}/editar`}
          title="Editar Tipo de Mandato"
        >
          <ButtonOutline>
            <span className="flex flex-row items-center gap-2">
              <PencilIcon className="size-4" />
              Editar
            </span>
          </ButtonOutline>
        </Link>
      </PageHeader>

      <div className="mx-auto max-sm:w-screen p-6 bg-white mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
          <Label label="ID:" value={tipo?.idTipoMandato?.toString() || ""} />
          <Label label="Descrição:" value={tipo?.descricao || ""} />
          <Label
            label="Data Cadastro:"
            value={
              tipo?.dataCadastro
                ? new Date(tipo.dataCadastro).toLocaleDateString("pt-BR")
                : ""
            }
          />
          <Label
            label="Data Alteração:"
            value={
              tipo?.dataAlteracao
                ? new Date(tipo.dataAlteracao).toLocaleDateString("pt-BR")
                : ""
            }
          />
          <Label
            label="Usuário Criação:"
            value={tipo?.usuarioDeCriacao || ""}
          />
          <Label
            label="Usuário Alteração:"
            value={tipo?.usuarioDeAlteracao || ""}
          />
        </div>
      </div>
    </>
  );
}

