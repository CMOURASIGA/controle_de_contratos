"use client";

import { ButtonSave } from "@/components/layouts/ui/buttons/button-save/button-save";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import { useConsultarPrioridadeRepresentacao } from "@/hooks/dominios/use-prioridade-representacao";
import { atualizarPrioridadeRepresentacao, criarPrioridadeRepresentacao, PrioridadeRepresentacaoPayload } from "@/services/prioridade-representacao.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import z from "zod";

const novoTextoSchema = z
  .object({
    descricao: z.string().min(1, "Informe a descrição."),
  });

type NovaPrioridadeRepresentacaoDataForm = z.infer<typeof novoTextoSchema>;

const defaultValues: Partial<NovaPrioridadeRepresentacaoDataForm> = {
  descricao: "",
};

interface FormularioNovaPrioridadeRepresentacaoProps {
  // Adicione quaisquer props necessárias aqui
  id?: string;
}  

export function FormularioPrioridadeRepresentacao({ id }: FormularioNovaPrioridadeRepresentacaoProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = Boolean(id);
  const { prioridadeSelected } = useConsultarPrioridadeRepresentacao(id || "");
  const methods = useForm<NovaPrioridadeRepresentacaoDataForm>({
    resolver: zodResolver(novoTextoSchema),
    defaultValues,
  });
  
  const onSubmit = async (data: NovaPrioridadeRepresentacaoDataForm) => {
    const prioridadePayload: PrioridadeRepresentacaoPayload = {
      descricao: data.descricao || "",
    };
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await atualizarPrioridadeRepresentacao(id!, prioridadePayload);
        Swal.fire({
          text: "Prioridade de Representação atualizado com sucesso",
          icon: "success",
          width: 480,
          timer: 1600,
          showConfirmButton: false,
        });
      } else {
        await criarPrioridadeRepresentacao(prioridadePayload);
        Swal.fire({
          text: "Prioridade de Representação criado com sucesso",
          icon: "success",
          width: 480,
          timer: 1600,
          showConfirmButton: false,
        });
        methods.reset(defaultValues);
      }

      queryClient.invalidateQueries({ queryKey: ["prioridadesRepresentacao"] });
      queryClient.invalidateQueries({ queryKey: ["prioridadeRepresentacao", id] });

    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : isEditMode
        ? "Não foi possível atualizar a Prioridade de Representação. Tente novamente."
        : "Não foi possível criar a Prioridade de Representação. Tente novamente.";
      Swal.fire({
        title: isEditMode
          ? "Erro ao atualizar Prioridade de Representação"
          : "Erro ao criar Prioridade de Representação",
        text: message,
        icon: "error",
        width: 520,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (prioridadeSelected) {
      methods.reset({
        descricao: prioridadeSelected.descricao,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prioridadeSelected, isEditMode]);
  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="p-10 space-y-6">
            <TextField
              name="descricao"
              label="Descrição"
              placeholder="Informe a descrição da prioridade de representação"
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