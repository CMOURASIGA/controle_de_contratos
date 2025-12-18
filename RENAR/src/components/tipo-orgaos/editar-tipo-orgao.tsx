"use client";
import { PageHeader } from "@/components/layouts/ui/page-header";
import {
  atualizarTipoOrgaos,
  fetchTipoOrgaosById,
} from "@/services/orgaos/tipo-orgaos.service";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Swal from "sweetalert2";
import {
  FormularioNovoTipoOrgao,
  NovoTipoOrgaoFormData,
} from "./formularios/formulario-novo-tipo-orgao";

export default function EditarTipoOrgao({ id }: { id: number }) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { data: tipoOrgao, refetch } = useQuery({
    queryKey: ["tipo-orgao-id", id],
    queryFn: async () => await fetchTipoOrgaosById(id.toString()),
    enabled: id ? true : false,
  });

  async function onSubmit(dados: NovoTipoOrgaoFormData) {
    setIsSubmitting(true);
    try {
      await atualizarTipoOrgaos(id, dados);
      Swal.fire({
        text: "Tipo órgão criado com sucesso",
        icon: "success",
        width: 500,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Erro ao atualizar o tipo de órgão:", error);
      const mensagem =
        error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
      Swal.fire({
        title: "Erro ao atualizar tipo de órgão",
        text: mensagem,
        icon: "error",
        width: 500,
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      setIsSubmitting(false);
      refetch();
    }
  }
  const defaultValues: Partial<NovoTipoOrgaoFormData> = {
    nome: tipoOrgao?.nome,
  };
  return (
    <>
      <PageHeader
        title="Editar Cargo"
        description="Modifique todas as informações do cargo."
        goBack
      />

      <div className="mx-auto max-sm:w-screen p-6 bg-white">
        <FormularioNovoTipoOrgao
          loading={isSubmitting}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
        />
      </div>
    </>
  );
}
