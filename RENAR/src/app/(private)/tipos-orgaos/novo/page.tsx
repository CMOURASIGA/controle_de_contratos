"use client";
import { PageHeader } from "@/components/layouts/ui/page-header";
import {
  FormularioNovoTipoOrgao,
  NovoTipoOrgaoFormData,
} from "@/components/tipo-orgaos/formularios/formulario-novo-tipo-orgao";
import { createTipoOrgaos } from "@/services/orgaos/tipo-orgaos.service";
import { useState } from "react";
import Swal from "sweetalert2";

export default function NovoTipoOrgaoPage() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  async function onSubmit(dados: NovoTipoOrgaoFormData) {
    setIsSubmitting(true);
    try {
      await createTipoOrgaos(dados);
      Swal.fire({
        text: "Tipo órgão criado com sucesso",
        icon: "success",
        width: 500,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Erro ao criar o tipo de órgão:", error);
      const mensagem =
        error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
      Swal.fire({
        title: "Erro ao criar tipo de órgão",
        text: mensagem,
        icon: "error",
        width: 500,
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <>
      <PageHeader
        title="Cadastro de Tipos de Órgãos"
        description="Registre todas as informações operacionais do tipo de órgão."
        goBack
      />

      <div className="mx-auto max-sm:w-screen p-6 bg-white">
        <FormularioNovoTipoOrgao loading={isSubmitting} onSubmit={onSubmit} />
      </div>
    </>
  );
}
