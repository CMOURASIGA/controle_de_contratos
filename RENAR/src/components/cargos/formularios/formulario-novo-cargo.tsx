"use client";
import { ButtonSave } from "@/components/layouts/ui/buttons/button-save/button-save";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";

export const novoCargoSchema = z.object({
  codigo: z.string().min(1, "Informe um código"),
  descricao: z
    .string("Insira uma descrição")
    .min(3, "Deve conter mais de 3 caracteres"),
});
export type NovoCargoFormData = z.infer<typeof novoCargoSchema>;

interface FormularioNovoCargosProps {
  defaultValues?: Partial<NovoCargoFormData>;
  onSubmit?: (dados: NovoCargoFormData) => Promise<void> | void;
  loading?: boolean;
}

export function FormularioNovoCargos({
  defaultValues,
  onSubmit,
  loading,
}: FormularioNovoCargosProps) {
  const methods = useForm<NovoCargoFormData>({
    resolver: zodResolver(novoCargoSchema),
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
            id="field-codigo"
            name="codigo"
            label="Código"
            placeholder="Informe o código"
            type="number"
            disabled={defaultValues?.codigo ? true : false}
            required
          />
          <TextField
            id="field-descricao"
            name="descricao"
            label="Descrição"
            placeholder="Informe a descricao"
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
