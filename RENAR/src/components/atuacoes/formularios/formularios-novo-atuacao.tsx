import { ButtonSave } from "@/components/layouts/ui/buttons/button-save/button-save";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";

export const novoAtuacaoSchema = z.object({
  nome: z.string("Insira o nome").min(1, "Deve conter mais de 3 caracteres"),
  descricao: z
    .string("Insira uma descrição")
    .min(3, "Deve conter mais de 3 caracteres")
    .optional(),
});
export type NovoAtuacaoFormData = z.infer<typeof novoAtuacaoSchema>;

interface FormularioNovoAtuacaoProps {
  defaultValues?: Partial<NovoAtuacaoFormData>;
  onSubmit?: (dados: NovoAtuacaoFormData) => Promise<void> | void;
  loading?: boolean;
}

export function FormularioNovoAtuacao({
  defaultValues,
  onSubmit,
  loading,
}: FormularioNovoAtuacaoProps) {
  const methods = useForm<NovoAtuacaoFormData>({
    resolver: zodResolver(novoAtuacaoSchema),
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-1 ml-1">
          <TextField
            id="field-descricao"
            name="nome"
            label="Nome"
            placeholder="Informe o Nome"
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
