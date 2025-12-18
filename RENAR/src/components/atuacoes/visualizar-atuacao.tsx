"use client";

import { ButtonOutline } from "@/components/layouts/ui/buttons/button-outline/button-outline";
import Label from "@/components/layouts/ui/label/label";
import { PageHeader } from "@/components/layouts/ui/page-header";
import { FormularioMandatosSkeleton } from "@/components/mandatos/formularios/formulario-mandatos.skeleton";
import { fetchAtuacoesById } from "@/services/atuacoes.service";
import { formatDateToDDMMYYYY } from "@/utils/generate-format-date";
import { useQuery } from "@tanstack/react-query";
import { PencilIcon } from "lucide-react";
import Link from "next/link";

export default function VisualizarAtuacao({ id }: { id: number }) {
  const {
    data: atuacao,
    isFetching: isFetching,
    isError,
  } = useQuery({
    queryKey: ["cargo", id],
    queryFn: async () => await fetchAtuacoesById(id.toString()),
    enabled: id ? true : false,
  });

  return (
    <>
      <PageHeader
        title={"Visualizar Tipo Perfil"}
        description="Visualize todas as informações operacionais dos tipos de atuação."
        goBack
      >
        <ButtonOutline>
          <Link href={`/tipo-perfil/${id}/editar`}>
            <span className="flex flex-row items-center gap-2">
              <PencilIcon className="size-4" />
              Editar
            </span>
          </Link>
        </ButtonOutline>
      </PageHeader>
      <div className="mx-auto max-sm:w-screen p-6 bg-white m-4">
        {isFetching && <FormularioMandatosSkeleton />}
        {isError && (
          <p className="text-red-500">Erro ao carregar os dados do cargo.</p>
        )}
        {!isFetching && atuacao && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            <Label label="Nome:" value={atuacao?.nome} />
            <Label label="Descrição:" value={atuacao?.descricao} />
            <Label
              label="Data Cadastro:"
              value={formatDateToDDMMYYYY(atuacao?.dataCadastro)}
            />
            <Label label="Cadastrado Por:" value={atuacao?.usuarioCadastro} />

            <Label
              label="Data Última Alteração:"
              value={formatDateToDDMMYYYY(atuacao?.dataAlteracao)}
            />
            <Label
              label="Última Alteração Por:"
              value={atuacao?.usuarioAlteracao}
            />
          </div>
        )}
      </div>
    </>
  );
}
