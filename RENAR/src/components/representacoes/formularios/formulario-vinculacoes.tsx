import { useConsultarRepresentacao } from "@/hooks/representacoes/use-consultar-representacao";
import { formularioRepresentacaoAtualizacaoDto } from "@/hooks/representacoes/use-representacoes";
import { atualizacaoRepresentacao } from "@/services/representacoes.service";
import { useParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { SecaoVinculacoes } from "./sections/secao-vinculacao";
import { ButtonSave } from "@/components/layouts/ui/buttons/button-save/button-save";
import { useState } from "react";

export const FormularioVinculacoes = () => {
  const params = useParams();
  const representacaoId = params.id as string;
  const { representacaoSelected } = useConsultarRepresentacao(representacaoId);
  const [carregando, setCarregando] = useState<boolean>(false);

  const methods = useForm<formularioRepresentacaoAtualizacaoDto>({
    defaultValues: {},
  });

  async function onSubmit(data: formularioRepresentacaoAtualizacaoDto) {
    setCarregando(true);
    try {
      await atualizacaoRepresentacao(
        representacaoSelected?.idRepresentacao as number,
        data
      );
      Swal.fire({
        text: "Representação atualizada com sucesso",
        icon: "success",
        width: 500,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch {
      Swal.fire({
        text: "Erro na atualização da representação",
        icon: "error",
        width: 500,
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setCarregando(false);
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <SecaoVinculacoes />

        <div className="flex items-center justify-end border-t border-gray-200 pt-4 mt-4">
          <ButtonSave loading={carregando} disabled />
        </div>
      </form>
    </FormProvider>
  );
};
