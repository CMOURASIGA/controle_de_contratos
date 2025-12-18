"use client";

import { ButtonSave } from "@/components/layouts/ui/buttons/button-save/button-save";
import { TextAreaField } from "@/components/layouts/ui/fields/text-area-field";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import { useConsultarAreaTematica } from "@/hooks/dominios/use-area-tematica";
import { AreaTematicaPayload, atualizarAreaTematica, criarAreaTematica } from "@/services/area-tematica.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import z from "zod";

const novoTextoSchema = z
  .object({
    nome: z.string().min(1, "Informe o nome da área temática"),
    descricaoWeb: z.optional(z.string()),
  });

type NovaAreaTematicaDataForm = z.infer<typeof novoTextoSchema>;

const defaultValues: Partial<NovaAreaTematicaDataForm> = {
  nome: "",
  descricaoWeb: "",
};

interface FormularioNovaAreaTematicaProps {
  // Adicione quaisquer props necessárias aqui
  id?: string;
}  

export function FormularioAreaTematica({ id }: FormularioNovaAreaTematicaProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = Boolean(id);
  const { areaTematicaSelected } = useConsultarAreaTematica(id || "");

  const methods = useForm<NovaAreaTematicaDataForm>({
    resolver: zodResolver(novoTextoSchema),
    defaultValues,
  });
  
  const onSubmit = async (data: NovaAreaTematicaDataForm) => {
    const payload: AreaTematicaPayload = {
      nome: data.nome || "",
      descricaoWeb: data.descricaoWeb || "",
    };
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await atualizarAreaTematica(id!, payload);
        Swal.fire({
          text: "Área Temática atualizada com sucesso",
          icon: "success",
          width: 480,
          timer: 1600,
          showConfirmButton: false,
        });
      } else {
        await criarAreaTematica(payload);
        Swal.fire({
          text: "Área Temática criada com sucesso",
          icon: "success",
          width: 480,
          timer: 1600,
          showConfirmButton: false,
        });
        methods.reset(defaultValues);
      }

      queryClient.invalidateQueries({ queryKey: ["areas-tematicas"] });
      queryClient.invalidateQueries({ queryKey: ["area-tematica-id", id] });

    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : isEditMode
        ? "Não foi possível atualizar a Área Temática. Tente novamente."
        : "Não foi possível criar a Área Temática. Tente novamente.";
      Swal.fire({
        title: isEditMode
          ? "Erro ao atualizar Área Temática"
          : "Erro ao criar Área Temática",
        text: message,
        icon: "error",
        width: 520,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (areaTematicaSelected) {
      methods.reset({
        nome: areaTematicaSelected.nome,
        descricaoWeb: areaTematicaSelected.descricaoWeb,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaTematicaSelected, isEditMode]);

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="p-10 space-y-6">
            <TextField
              name="nome"
              label="Nome da área temática"
              placeholder="Informe o nome da área temática"
              required
            />

            <TextAreaField
              name="descricaoWeb"
              label="Descrição web"
              placeholder="Informe a descrição web"
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