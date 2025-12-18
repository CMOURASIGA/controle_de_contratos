"use client";

import { ButtonSaveAndLoading } from "@/components/layouts/ui/buttons/button-save-loading/button-save";
import { SelectField } from "@/components/layouts/ui/fields/select-field/select-field";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import { useConsultarFuncao } from "@/hooks/funcoes/use-funcao";
import useObterFuncoes from "@/hooks/funcoes/use-obter-funcoes";
import { atualizarFuncao, criarFuncao, FuncaoPayload } from "@/services/funcoes.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import z from "zod";

const novaFuncaoSchema = z
  .object({
    nomeFuncao: z.string().min(1, "Informe o nome da função"),
    idHierarquia: z.optional(z.string()),
  });

type NovaFuncaoDataForm = z.infer<typeof novaFuncaoSchema>;

const defaultValues: Partial<NovaFuncaoDataForm> = {
  nomeFuncao: "",
  idHierarquia: "",
};

interface FormularioFuncaoProps {
  idFuncao?: string;
}  

export function FormularioFuncao({ idFuncao }: FormularioFuncaoProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = Boolean(idFuncao);
  const { funcaoSelected } = useConsultarFuncao(idFuncao || "");
  const { opcoesFuncao, isLoadingFuncoes } = useObterFuncoes();
  const methods = useForm<NovaFuncaoDataForm>({
    resolver: zodResolver(novaFuncaoSchema),
    defaultValues,
  });
  
  const onSubmit = async (data: NovaFuncaoDataForm) => {
    const funcaoPayload: FuncaoPayload = {
      nomeFuncao: data.nomeFuncao || "",
      idHierarquia: data.idHierarquia || undefined,
    };
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await atualizarFuncao(idFuncao!, funcaoPayload);
        Swal.fire({
          text: "Função atualizada com sucesso",
          icon: "success",
          width: 480,
          timer: 1600,
          showConfirmButton: false,
        });
      } else {
        await criarFuncao(funcaoPayload);
        Swal.fire({
          text: "Função criada com sucesso",
          icon: "success",
          width: 480,
          timer: 1600,
          showConfirmButton: false,
        });
        methods.reset(defaultValues);
      }

      queryClient.invalidateQueries({ queryKey: ["funcao-all"] });
      queryClient.invalidateQueries({ queryKey: ["funcao-id", idFuncao] });

    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : isEditMode
        ? "Não foi possível atualizar a função. Tente novamente."
        : "Não foi possível criar a função. Tente novamente.";
      Swal.fire({
        title: isEditMode
          ? "Erro ao atualizar função"
          : "Erro ao criar função",
        text: message,
        icon: "error",
        width: 520,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (funcaoSelected) {
      methods.reset({
        nomeFuncao: funcaoSelected.nomeFuncao,
        idHierarquia: funcaoSelected.idHierarquia,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [funcaoSelected, isEditMode]);

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="p-10 space-y-6">
            <TextField
              name="nomeFuncao"
              label="Nome da Função"
              placeholder="Informe o nome da função"
              required
            />
            <SelectField
              options={opcoesFuncao || []}
              name="idHierarquia"
              label="Função Pai"
              placeholder="Função Pai"
              id="field-hierarquia"
              disabled={isLoadingFuncoes}
            />

            <div className="flex items-center justify-end border-t border-gray-200 pt-4">
            <ButtonSaveAndLoading 
              saving={isSubmitting}
              loading={isLoadingFuncoes}
              type="submit" 
            />
          </div>
          </div>
        </form>
      </FormProvider>
    </>
  )
}