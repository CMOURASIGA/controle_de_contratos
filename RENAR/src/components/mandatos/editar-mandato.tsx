"use client";

import { useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layouts/ui/page-header";
import {
  DadosMandatosForm,
  DadosMandatosPayload,
  FormularioMandatos,
} from "@/components/mandatos/formularios/formulario-mandatos";
import { FormularioMandatosSkeleton } from "@/components/mandatos/formularios/formulario-mandatos.skeleton";
import {
  atualizarMandato,
  obterMandatoPorId,
} from "@/services/mandatos.service";
import Swal from "sweetalert2";

interface EditarMandatoProps {
  id: number;
}

const formatarDataParaInput = (data?: Date | string | null) => {
  if (!data) {
    return "";
  }

  const dataObj = data instanceof Date ? data : new Date(data);
  if (Number.isNaN(dataObj.getTime())) {
    return "";
  }

  const ano = dataObj.getFullYear();
  const mes = `${dataObj.getMonth() + 1}`.padStart(2, "0");
  const dia = `${dataObj.getDate()}`.padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
};

export function EditarMandato({ id }: EditarMandatoProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["mandato", id],
    queryFn: async () => await obterMandatoPorId(id),
    enabled: !!id,
  });

  const valoresIniciais = useMemo<Partial<DadosMandatosForm>>(() => {
    if (!data) {
      return {};
    }

    const dataInicioMandato =
      (data as { dataInicioMandato?: Date | string })?.dataInicioMandato ??
      (data as { dataInicio?: Date | string })?.dataInicio;
    const dataFimMandato =
      (data as { dataFimMandato?: Date | string })?.dataFimMandato ??
      (data as { dataFim?: Date | string })?.dataFim;

    const idTipoMandato =
      (data as { idTipoMandato?: number | string })?.idTipoMandato ??
      (data as { tipoMandato?: { id?: number | string } })?.tipoMandato?.id;

    const idFuncao =
      (data as { idFuncao?: number | string })?.idFuncao ??
      (data as { funcao?: { id?: number | string } })?.funcao?.id;

    const idPessoa =
      (data as { idPessoa?: number | string })?.idPessoa ??
      (data as { idRepresentante?: number | string })?.idRepresentante ??
      (data as { representante?: { idPessoa?: number | string } })?.representante
        ?.idPessoa;

    const observacaoMandato =
      (data as { observacaoMandato?: string })?.observacaoMandato ??
      (data as { observacao?: string })?.observacao ??
      "";

    return {
      idRepresentacao: data.idRepresentacao
        ? String(data.idRepresentacao)
        : undefined,
      idPessoa: idPessoa ? String(idPessoa) : undefined,
      idOrganizacao: data.idOrganizacao
        ? String(data.idOrganizacao)
        : undefined,
      dataInicio: formatarDataParaInput(dataInicioMandato ?? null),
      dataFim: formatarDataParaInput(dataFimMandato ?? null),
      idTipoMandato: idTipoMandato ? String(idTipoMandato) : undefined,
      nomeIndicacao: data.nomeIndicacao ?? "",
      dataIndicacao: formatarDataParaInput(data.dataIndicacao ?? null),
      idFuncao: idFuncao ? String(idFuncao) : undefined,
      observacaoMandato,
    };
  }, [data]);

  const handleSubmit = async (formData: DadosMandatosPayload) => {
    setIsSaving(true);
    try {
      await atualizarMandato(id, formData);
      Swal.fire({
        text: "Mandato atualizado com sucesso",
        icon: "success",
        width: 500,
        showConfirmButton: false,
        timer: 1500,
      });
      router.refresh();
    } catch (error) {
      console.error("Erro ao atualizar mandato:", error);
      const mensagem =
        error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
      Swal.fire({
        title: "Erro ao atualizar mandato",
        text: mensagem,
        icon: "error",
        width: 500,
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title={data ? `Editar Mandato Nº ${data.id}` : "Editar Mandato"}
        goBack
      />

      <div className="mx-auto max-sm:w-screen p-6 bg-white">
        {isLoading ? (
          <FormularioMandatosSkeleton />
        ) : isError || !data ? (
          <p className="text-sm text-red-600">
            Não foi possível carregar os dados do mandato selecionado.
          </p>
        ) : (
          <FormularioMandatos
            defaultValues={valoresIniciais}
            onSubmit={handleSubmit}
            loading={isSaving}
          />
        )}
      </div>
    </>
  );
}

