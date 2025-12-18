"use client";

import { PageHeader } from "@/components/layouts/ui/page-header";
import {
  atualizarAtuacoes,
  fetchAtuacoesById,
} from "@/services/atuacoes.service";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Swal from "sweetalert2";
import {
  FormularioNovoAtuacao,
  NovoAtuacaoFormData,
} from "./formularios/formularios-novo-atuacao";

export default function EditarAtuacao({ id }: { id: number }) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { data: atuacao, refetch } = useQuery({
    queryKey: ["atuacao-by-id", id],
    queryFn: async () => await fetchAtuacoesById(id.toString()),
    enabled: id ? true : false,
  });

  async function onSubmit(dados: NovoAtuacaoFormData) {
    setIsSubmitting(true);
    try {
      await atualizarAtuacoes(id, dados);
      Swal.fire({
        text: "Tipo perfil atualizado com sucesso",
        icon: "success",
        width: 500,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Erro ao atualizar o tipo perfil:", error);
      const mensagem =
        error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
      Swal.fire({
        title: "Erro ao atualizar tipo perfil",
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
  const defaultValues: Partial<NovoAtuacaoFormData> = {
    nome: atuacao?.nome,
    descricao: atuacao?.descricao,
  };
  return (
    <>
      <PageHeader
        title="Editar Tipo Perfil"
        description="Modifique todas as informações do tipo perfil."
        goBack
      />

      <div className="mx-auto max-sm:w-screen p-6 bg-white">
        <FormularioNovoAtuacao
          loading={isSubmitting}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
        />
      </div>
    </>
  );
}
