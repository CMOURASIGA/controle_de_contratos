"use client";

import { ButtonSave } from "@/components/layouts/ui/buttons/button-save/button-save";
import { TextAreaField } from "@/components/layouts/ui/fields/text-area-field";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import { useConsultarTextoWeb } from "@/hooks/dominios/use-texto-web";
import { atualizarTextoWeb, criarTextoWeb, TextoWebPayload } from "@/services/texto-web.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import z from "zod";

const novoTextoSchema = z
  .object({
    resumoTexto: z.string().min(1, "Informe o resumo do texto"),
    descricaoTexto: z.optional(z.string()),
    tituloTexto: z.optional(z.string()),
  });

type NovoTextoWebDataForm = z.infer<typeof novoTextoSchema>;

const defaultValues: Partial<NovoTextoWebDataForm> = {
  resumoTexto: "",
  descricaoTexto: "",
  tituloTexto: "",
};

interface FormularioNovoTextoWebProps {
  // Adicione quaisquer props necessárias aqui
  idTextoWeb?: string;
}  

export function FormularioNovoTextoWeb({ idTextoWeb }: FormularioNovoTextoWebProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = Boolean(idTextoWeb);
  const { textoWebSelected } = useConsultarTextoWeb(idTextoWeb || "");

  const methods = useForm<NovoTextoWebDataForm>({
    resolver: zodResolver(novoTextoSchema),
    defaultValues,
  });
  
  const onSubmit = async (data: NovoTextoWebDataForm) => {
    const textoPayload: TextoWebPayload = {
      tituloTexto: data.tituloTexto || "",
      resumoTexto: data.resumoTexto,
      descricaoTexto: data.descricaoTexto || "",
    };
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await atualizarTextoWeb(idTextoWeb!, textoPayload);
        Swal.fire({
          text: "Texto Web atualizado com sucesso",
          icon: "success",
          width: 480,
          timer: 1600,
          showConfirmButton: false,
        });
      } else {
        await criarTextoWeb(textoPayload);
        Swal.fire({
          text: "Texto Web criado com sucesso",
          icon: "success",
          width: 480,
          timer: 1600,
          showConfirmButton: false,
        });
        methods.reset(defaultValues);
      }

      queryClient.invalidateQueries({ queryKey: ["textoWeb"] });
      queryClient.invalidateQueries({ queryKey: ["textoWeb", idTextoWeb] });

    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : isEditMode
        ? "Não foi possível atualizar o Texto Web. Tente novamente."
        : "Não foi possível criar o Texto Web. Tente novamente.";
      Swal.fire({
        title: isEditMode
          ? "Erro ao atualizar Texto Web"
          : "Erro ao criar Texto Web",
        text: message,
        icon: "error",
        width: 520,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (textoWebSelected) {
      methods.reset({
        tituloTexto: textoWebSelected.tituloTexto,
        resumoTexto: textoWebSelected.resumoTexto,
        descricaoTexto: textoWebSelected.descricaoTexto,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textoWebSelected, isEditMode]);

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="p-10 space-y-6">
            <TextField
              name="tituloTexto"
              label="Título do Texto"
              placeholder="Informe o título do texto"
            />
            <TextField
              name="resumoTexto"
              label="Resumo do Texto"
              placeholder="Informe o resumo do texto"
              required
            />
            <TextAreaField
              name="descricaoTexto"
              label="Descrição do Texto"
              placeholder="Informe a descrição do texto"
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