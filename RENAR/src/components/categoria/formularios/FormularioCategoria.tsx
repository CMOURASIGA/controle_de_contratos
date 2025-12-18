"use client";

import { ButtonSave } from "@/components/layouts/ui/buttons/button-save/button-save";
import { TextAreaField } from "@/components/layouts/ui/fields/text-area-field";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import { useConsultarCategoria } from "@/hooks/categorias/use-busca-categoria";
import { atualizarCategoria, CategoriaPayload, criarCategoria } from "@/services/categorias.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import z from "zod";

const novoTextoSchema = z
  .object({
    nomeCategoria: z.string().min(1, "Informe o nome da categoria"),
  });

type NovaCategoriaDataForm = z.infer<typeof novoTextoSchema>;

const defaultValues: Partial<NovaCategoriaDataForm> = {
  nomeCategoria: "",
};

interface FormularioCategoriaProps {
  idCategoria?: string;
}  

export function FormularioNovaCategoria({ idCategoria }: FormularioCategoriaProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = Boolean(idCategoria);
  const { categoriaSelected } = useConsultarCategoria(idCategoria || "");
  const methods = useForm<NovaCategoriaDataForm>({
    resolver: zodResolver(novoTextoSchema),
    defaultValues,
  });
  
  const onSubmit = async (data: NovaCategoriaDataForm) => {
    const categoriaPayload: CategoriaPayload = {
      nomeCategoria: data.nomeCategoria || "",
    };
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await atualizarCategoria(idCategoria!, categoriaPayload);
        Swal.fire({
          text: "Categoria atualizada com sucesso",
          icon: "success",
          width: 480,
          timer: 1600,
          showConfirmButton: false,
        });
      } else {
        await criarCategoria(categoriaPayload);
        Swal.fire({
          text: "Categoria criada com sucesso",
          icon: "success",
          width: 480,
          timer: 1600,
          showConfirmButton: false,
        });
        methods.reset(defaultValues);
      }

      queryClient.invalidateQueries({ queryKey: ["all-categoria"] });
      queryClient.invalidateQueries({ queryKey: ["busca-categoria", idCategoria] });

    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : isEditMode
        ? "Não foi possível atualizar a categoria. Tente novamente."
        : "Não foi possível criar a categoria. Tente novamente.";
      Swal.fire({
        title: isEditMode
          ? "Erro ao atualizar Categoria"
          : "Erro ao criar Categoria",
        text: message,
        icon: "error",
        width: 520,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (categoriaSelected) {
      methods.reset({
        nomeCategoria: categoriaSelected.nomeCategoria,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriaSelected, isEditMode]);
  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="p-10 space-y-6">

            <TextField
              name="nomeCategoria"
              label="Nome da Categoria"
              placeholder="Informe o nome da categoria"
              required
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