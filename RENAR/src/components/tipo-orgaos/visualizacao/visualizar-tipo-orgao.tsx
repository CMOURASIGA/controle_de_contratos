"use client";

import { ButtonOutline } from "@/components/layouts/ui/buttons/button-outline/button-outline";
import Label from "@/components/layouts/ui/label/label";
import { PageHeader } from "@/components/layouts/ui/page-header";
import { FormularioMandatosSkeleton } from "@/components/mandatos/formularios/formulario-mandatos.skeleton";
import { fetchTipoOrgaosById } from "@/services/orgaos/tipo-orgaos.service";
import { formatDateToDDMMYYYY } from "@/utils/generate-format-date";
import { useQuery } from "@tanstack/react-query";
import { PencilIcon } from "lucide-react";
import Link from "next/link";

export default function VisualizarTipoOrgao({ id }: { id: number }) {
  const {
    data: tiposOrgaos,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["tipo-orgao-id", id],
    queryFn: async () => await fetchTipoOrgaosById(id.toString()),
    enabled: id ? true : false,
  });

  return (
    <>
      <PageHeader
        title={"Visualizar Tipo Órgão"}
        description="Visualize todas as informações operacionais do tipo de órgão."
        goBack
      >
        <ButtonOutline>
          <Link href={`/tipos-orgaos/${id}/editar`}>
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
        {!isFetching && tiposOrgaos && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            <Label label="Código:" value={id.toString()} />
            <Label label="Nome:" value={tiposOrgaos?.nome} />
            <Label
              label="Data Cadastro:"
              value={formatDateToDDMMYYYY(tiposOrgaos?.dataCadastro)}
            />
            <Label
              label="Cadastrado Por:"
              value={tiposOrgaos?.usuarioCadastro}
            />

            <Label
              label="Data Última Alteração:"
              value={formatDateToDDMMYYYY(tiposOrgaos?.dataAlteracao)}
            />
            <Label
              label="Última Alteração Por:"
              value={tiposOrgaos?.usuarioAlteracao}
            />
          </div>
        )}
      </div>
    </>
  );
}
