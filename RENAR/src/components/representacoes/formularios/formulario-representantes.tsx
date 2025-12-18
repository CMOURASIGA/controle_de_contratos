import { formularioRepresentacaoAtualizacaoDto } from "@/hooks/representacoes/use-representacoes";
import { FormProvider, useForm } from "react-hook-form";
import { SecaoRepresentantes } from "./sections/secao-representates";
import { ButtonSave } from "@/components/layouts/ui/buttons/button-save/button-save";
import { useState } from "react";

export const FormularioRepresentantes = () => {
  const [carregando, setCarregando] = useState<boolean>(false);

  const methods = useForm<formularioRepresentacaoAtualizacaoDto>({
    defaultValues: {},
  });

  async function onSubmit(data: formularioRepresentacaoAtualizacaoDto) {
    setCarregando(true);
    console.log("data", data);
    setCarregando(false);
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <SecaoRepresentantes formMetodos={methods} />

        <div className="flex items-center justify-end border-t border-gray-200 pt-4 mt-4">
          <ButtonSave loading={carregando} />
        </div>
      </form>
    </FormProvider>
  );
};
