"use client";

import { ButtonOutline } from "@/components/layouts/ui/buttons/button-outline/button-outline";
import Label from "@/components/layouts/ui/label/label";
import { PageHeader } from "@/components/layouts/ui/page-header";
import { FormularioMandatosSkeleton } from "@/components/mandatos/formularios/formulario-mandatos.skeleton";
import { fetchCargoById } from "@/services/dominios/cargos.service";
import { formatDateToDDMMYYYY } from "@/utils/generate-format-date";
import { useQuery } from "@tanstack/react-query";
import { PencilIcon } from "lucide-react";
import Link from "next/link";

export default function VisualizarCargo({ id }: { id: number }) {
  const {
    data: cargo,
    isFetching: isFetchingCargo,
    isError,
  } = useQuery({
    queryKey: ["cargo", id],
    queryFn: async () => await fetchCargoById(id.toString()),
    enabled: id ? true : false,
  });

  return (
    <>
      <PageHeader
        title={"Visualizar Cargo"}
        description="Visualize todas as informações operacionais do cargo."
        goBack
      >
        <ButtonOutline>
          <Link href={`/cargos/${id}/editar`}>
            <span className="flex flex-row items-center gap-2">
              <PencilIcon className="size-4" />
              Editar
            </span>
          </Link>
        </ButtonOutline>
      </PageHeader>
      <div className="mx-auto max-sm:w-screen p-6 bg-white m-4">
        {isFetchingCargo && <FormularioMandatosSkeleton />}
        {isError && (
          <p className="text-red-500">Erro ao carregar os dados do cargo.</p>
        )}
        {!isFetchingCargo && cargo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            <Label label="Código:" value={id.toString()} />
            <Label label="Descrição:" value={cargo?.descricao} />
            <Label
              label="Data Cadastro:"
              value={formatDateToDDMMYYYY(cargo?.dataCadastro)}
            />
            <Label label="Cadastrado Por:" value={cargo?.usuarioCadastro} />

            <Label
              label="Data Última Alteração:"
              value={formatDateToDDMMYYYY(cargo?.dataAlteracao)}
            />
            <Label
              label="Última Alteração Por:"
              value={cargo?.usuarioAlteracao}
            />
          </div>
        )}
      </div>
    </>
  );
}
