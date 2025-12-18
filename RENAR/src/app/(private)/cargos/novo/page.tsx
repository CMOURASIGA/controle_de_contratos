"use client";
import {
  FormularioNovoCargos,
  NovoCargoFormData,
} from "@/components/cargos/formularios/formulario-novo-cargo";
import { PageHeader } from "@/components/layouts/ui/page-header";
import { createCargos } from "@/services/dominios/cargos.service";
import { useState } from "react";
import Swal from "sweetalert2";

export default function NovoCargoPage() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  async function onSubmit(dados: NovoCargoFormData) {
    setIsSubmitting(true);
    try {
      await createCargos(dados);
      Swal.fire({
        text: "Cargo criado com sucesso",
        icon: "success",
        width: 500,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Erro ao criar o cargo:", error);
      const mensagem =
        error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
      Swal.fire({
        title: "Erro ao criar cargo",
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
        title="Cadastro de Cargos"
        description="Registre todas as informações operacionais do carg."
        goBack
      />

      <div className="mx-auto max-sm:w-screen p-6 bg-white">
        <FormularioNovoCargos loading={isSubmitting} onSubmit={onSubmit} />
      </div>
    </>
  );
}
