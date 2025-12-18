"use client";
import {
  FormularioNovoAtuacao,
  NovoAtuacaoFormData,
} from "@/components/atuacoes/formularios/formularios-novo-atuacao";
import { PageHeader } from "@/components/layouts/ui/page-header";
import { createAtuacoes } from "@/services/atuacoes.service";
import { useState } from "react";
import Swal from "sweetalert2";

export default function NovoTipoPerfil() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  async function onSubmit(dados: NovoAtuacaoFormData) {
    setIsSubmitting(true);
    try {
      await createAtuacoes(dados);
      Swal.fire({
        text: "Tipo Perfil criado com sucesso",
        icon: "success",
        width: 500,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Erro ao criar tipo perfil:", error);
      const mensagem =
        error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
      Swal.fire({
        title: "Erro ao criar tipo perfil",
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
        title="Cadastro de Tipo Perfil"
        description="Registre todas as informações operacionais do tipo perfil."
        goBack
      />

      <div className="mx-auto max-sm:w-screen p-6 bg-white">
        <FormularioNovoAtuacao loading={isSubmitting} onSubmit={onSubmit} />
      </div>
    </>
  );
}
