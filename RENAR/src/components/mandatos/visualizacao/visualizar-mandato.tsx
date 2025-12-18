"use client";

import { ButtonOutline } from "@/components/layouts/ui/buttons/button-outline/button-outline";
import { PencilIcon } from "@/components/layouts/ui/icons/pincel";
import Label from "@/components/layouts/ui/label/label";
import { PageHeader } from "@/components/layouts/ui/page-header";
import { obterMandatoPorId } from "@/services/mandatos.service";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FormularioMandatosSkeleton } from "../formularios/formulario-mandatos.skeleton";

interface IVisualizarMandato {
  id: number;
}

export function VisualizarMandato({ id }: IVisualizarMandato) {

  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["mandato", id],
    queryFn: async () => await obterMandatoPorId(id),
    enabled: !!id,
  });

  return (
  <> 
    <PageHeader
      title={data ? `Mandato Nº ${data.id}` : "Visualizar Mandato"}
      goBack
    >
      <ButtonOutline>
        <Link href={`/mandatos/${data?.id}/editar`}>
          <span className="flex flex-row items-center gap-2">
            <PencilIcon className="size-4" />
            Editar
          </span>
        </Link>
      </ButtonOutline>
    </PageHeader>
    {
      isLoading ? (
        <FormularioMandatosSkeleton />
      ) : (
        <div className="mx-auto max-sm:w-screen p-6 bg-white m-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            <Label label="Representação:" value={data?.representacao.nome} />
            <Label label="Representante:" value={data?.representante?.PessoaCNC?.nome} />
            <Label label="Organização:" value={data?.organizacao?.siglaOrganizacao} />
            <Label label="Data Início:" value={data?.dataInicio ? new Date(data.dataInicio).toLocaleDateString() : ''} />
            <Label label="Data Fim:" value={data?.dataFim ? new Date(data.dataFim).toLocaleDateString() : ''} />
            <Label label="Tipo Mandato:" value={data?.tipoMandato?.descricao} />
            <Label label="Nome Indicação:" value={data?.nomeIndicacao} />
            <Label label="Data Indicação:" value={data?.dataIndicacao ? new Date(data.dataIndicacao).toLocaleDateString() : ''} />
            <Label label="Tipo Função:" value={data?.funcao?.nomeFuncao} />
            <Label label="Observação:" value={data?.observacao} />
          </div>
        </div>
      )
    }

  </>
  );
}

export default VisualizarMandato;