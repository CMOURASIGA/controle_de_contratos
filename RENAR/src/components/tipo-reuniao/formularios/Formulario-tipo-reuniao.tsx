"use client";

import { ButtonSave } from "@/components/layouts/ui/buttons/button-save/button-save";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import { useConsultarTipoReuniao } from "@/hooks/dominios/use-tipo-reuniao";
import { atualizarTipoReuniao, criarTipoReuniao, TipoReuniaoPayload } from "@/services/tipo-reuniao.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import z from "zod";

const novoTextoSchema = z
  .object({
    descricao: z.string().min(1, "Informe a descrição do do tipo de reunião"),
  });

type NovoTipoReuniaoDataForm = z.infer<typeof novoTextoSchema>;

const defaultValues: Partial<NovoTipoReuniaoDataForm> = {
  descricao: "",
};

interface FormularioNovoTipoReuniaoProps {
  // Adicione quaisquer props necessárias aqui
  id?: string;
}  

export function FormularioNovoTipoReuniao({ id }: FormularioNovoTipoReuniaoProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = Boolean(id);
  const { tipoReuniaoSelected } = useConsultarTipoReuniao(id || "");
  const methods = useForm<NovoTipoReuniaoDataForm>({
    resolver: zodResolver(novoTextoSchema),
    defaultValues,
  });
  
  const onSubmit = async (data: NovoTipoReuniaoDataForm) => {
    const tipoReuniaoPayload: TipoReuniaoPayload = {
      descricao: data.descricao || "",
    };
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await atualizarTipoReuniao(id!, tipoReuniaoPayload);
        Swal.fire({
          text: "Tipo de Reunião atualizado com sucesso",
          icon: "success",
          width: 480,
          timer: 1600,
          showConfirmButton: false,
        });
      } else {
        await criarTipoReuniao(tipoReuniaoPayload);
        Swal.fire({
          text: "Tipo de Reunião criado com sucesso",
          icon: "success",
          width: 480,
          timer: 1600,
          showConfirmButton: false,
        });
        methods.reset(defaultValues);
      }

      queryClient.invalidateQueries({ queryKey: ["tipo-reuniao"] });
      queryClient.invalidateQueries({ queryKey: ["tipo-reuniao-id", id] });

    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : isEditMode
        ? "Não foi possível atualizar o Tipo de Reunião. Tente novamente."
        : "Não foi possível criar o Tipo de Reunião. Tente novamente.";
      Swal.fire({
        title: isEditMode
          ? "Erro ao atualizar Tipo de Reunião"
          : "Erro ao criar Tipo de Reunião",
        text: message,
        icon: "error",
        width: 520,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (tipoReuniaoSelected && isEditMode) {
      methods.reset({
        descricao: tipoReuniaoSelected.descricao,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoReuniaoSelected, isEditMode]);

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="p-10 space-y-6">
            <TextField
              name="descricao"
              label="Descrição do Tipo de Reunião"
              placeholder="Informe a descrição do tipo de reunião"
            />

            <div className="flex items-center justify-end border-t border-gray-200 pt-4">
            <ButtonSave 
              loading={isSubmitting}
              type="submit" 
            />
          </div>
          </div>
        </form>
      </FormProvider>
    </>
  )
}