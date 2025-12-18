"use client";
import {
  FormularioNovoCargos,
  NovoCargoFormData,
} from "@/components/cargos/formularios/formulario-novo-cargo";
import { PageHeader } from "@/components/layouts/ui/page-header";
import {
  atualizarCargos,
  fetchCargoById,
} from "@/services/dominios/cargos.service";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Swal from "sweetalert2";

export default function EditarCargo({ id }: { id: number }) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { data: cargo, refetch } = useQuery({
    queryKey: ["cargo", id],
    queryFn: async () => await fetchCargoById(id.toString()),
    enabled: id ? true : false,
  });

  async function onSubmit(dados: NovoCargoFormData) {
    setIsSubmitting(true);
    try {
      await atualizarCargos(id, dados);
      Swal.fire({
        text: "Cargo criado com sucesso",
        icon: "success",
        width: 500,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Erro ao atualizar o cargo:", error);
      const mensagem =
        error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
      Swal.fire({
        title: "Erro ao atualizar cargo",
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
  const defaultValues: Partial<NovoCargoFormData> = {
    codigo: cargo?.codigo,
    descricao: cargo?.descricao,
  };
  return (
    <>
      <PageHeader
        title="Editar Cargo"
        description="Modifique todas as informações do cargo."
        goBack
      />

      <div className="mx-auto max-sm:w-screen p-6 bg-white">
        <FormularioNovoCargos
          loading={isSubmitting}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
        />
      </div>
    </>
  );
}
