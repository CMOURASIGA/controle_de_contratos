import { useConsultarTipoMandatoPorId } from "@/hooks/tipos-mandato/use-consultar-tipo-mandato-por-id";
import { queryClient } from "@/providers/react-query";
import { atualizarTipoMandato } from "@/services/tipos-mandato.service";
import { UpdateTipoMandatoDto } from "@/types/tipo-mandato.type";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import { ButtonSave } from "@/components/layouts/ui/buttons/button-save/button-save";

interface FormData {
  descricao: string;
}

export const FormularioEdicaoTipoMandato = () => {
  const params = useParams();
  const router = useRouter();
  const tipoMandatoId = params.id as string;
  const { tipoMandatoSelecionado, isLoading } =
    useConsultarTipoMandatoPorId(tipoMandatoId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<FormData>({
    defaultValues: {
      descricao: "",
    },
  });

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    try {
      const payload: UpdateTipoMandatoDto = {
        descricao: data.descricao,
      };
      await atualizarTipoMandato(tipoMandatoId, payload);

      Swal.fire({
        text: "Tipo de mandato atualizado com sucesso",
        icon: "success",
        width: 500,
        showConfirmButton: false,
        timer: 1500,
      });
      queryClient.invalidateQueries({ queryKey: ["tipos-mandato"] });
      router.push("/tipos-mandato/busca");
    } catch (error) {
      console.error("Erro ao atualizar tipo de mandato:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Erro ao atualizar tipo de mandato";
      Swal.fire({
        text: errorMessage,
        icon: "error",
        width: 500,
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (tipoMandatoSelecionado) {
      const tipo = tipoMandatoSelecionado?.data || tipoMandatoSelecionado;
      if (tipo) {
        methods.reset({
          descricao: tipo.descricao || "",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoMandatoSelecionado]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          aria-describedby="drawer-subgroup-desc"
        >
          <div className="flex flex-col gap-4">
            <TextField
              name="descricao"
              label="Descrição"
              placeholder="Digite a descrição do tipo de mandato"
              required
              maxLength={60}
            />
          </div>

          <div className="flex items-center justify-end border-t border-gray-200 pt-4 mt-4">
            <ButtonSave
              loading={isSubmitting}
              type="submit"
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

