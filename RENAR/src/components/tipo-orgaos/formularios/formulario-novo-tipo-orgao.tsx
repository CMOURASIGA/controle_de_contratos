"use client";
import { ButtonSave } from "@/components/layouts/ui/buttons/button-save/button-save";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";

export const novoTipoOrgaoSchema = z.object({
  nome: z
    .string("Insira uma descrição")
    .min(3, "Deve conter mais de 3 caracteres"),
});
export type NovoTipoOrgaoFormData = z.infer<typeof novoTipoOrgaoSchema>;

interface FormularioNovoTipoOrgaoProps {
  defaultValues?: Partial<NovoTipoOrgaoFormData>;
  onSubmit?: (dados: NovoTipoOrgaoFormData) => Promise<void> | void;
  loading?: boolean;
}

export function FormularioNovoTipoOrgao({
  defaultValues,
  onSubmit,
  loading,
}: FormularioNovoTipoOrgaoProps) {
  const methods = useForm<NovoTipoOrgaoFormData>({
    resolver: zodResolver(novoTipoOrgaoSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    methods.reset(defaultValues);
  }, [defaultValues]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={onSubmit && methods.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mr-1 ml-1">
          <TextField
            id="field-nome"
            name="nome"
            label="Nome"
            placeholder="Informe o nome do tipo de órgão"
            required
          />
        </div>

        <div className="flex items-center justify-end border-t border-gray-200 pt-4">
          <ButtonSave loading={loading} type="submit" />
        </div>
      </form>
    </FormProvider>
  );
}
