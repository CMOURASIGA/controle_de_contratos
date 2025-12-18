import { useConsultarMotivoCancelamentoPorId } from "@/hooks/motivos-cancelamento/use-consultar-motivo-cancelamento-por-id";
import { queryClient } from "@/providers/react-query";
import { atualizarMotivoCancelamento } from "@/services/motivos-cancelamento.service";
import { UpdateMotivoCancelamentoDto } from "@/types/motivo-cancelamento.type";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import { SelectField } from "@/components/layouts/ui/fields/select-field/select-field";
import { ButtonSave } from "@/components/layouts/ui/buttons/button-save/button-save";

const opcoesStatus = [
  { label: "Ativo", value: "1" },
  { label: "Inativo", value: "0" },
];

interface FormData {
  descricao: string;
  status: string;
}

export const FormularioEdicaoMotivoCancelamento = () => {
  const params = useParams();
  const router = useRouter();
  const motivoId = params.id as string;
  const { motivoSelecionado, isLoading } =
    useConsultarMotivoCancelamentoPorId(motivoId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<FormData>({
    defaultValues: {
      descricao: "",
      status: "1",
    },
  });

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    try {
      const payload: UpdateMotivoCancelamentoDto = {
        descricao: data.descricao,
        status: Number(data.status),
      };
      await atualizarMotivoCancelamento(motivoId, payload);

      Swal.fire({
        text: "Motivo de cancelamento atualizado com sucesso",
        icon: "success",
        width: 500,
        showConfirmButton: false,
        timer: 1500,
      });
      queryClient.invalidateQueries({ queryKey: ["motivos-cancelamento"] });
      router.push("/motivos-cancelamento/busca");
    } catch (error) {
      console.error("Erro ao atualizar motivo de cancelamento:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Erro ao atualizar motivo de cancelamento";
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
    if (motivoSelecionado) {
      const motivo = motivoSelecionado?.data || motivoSelecionado;
      if (motivo) {
        methods.reset({
          descricao: motivo.descricao || "",
          status: motivo.status !== undefined && motivo.status !== null ? String(motivo.status) : "1",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motivoSelecionado]);

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
              placeholder="Digite a descrição do motivo de cancelamento"
              required
              maxLength={100}
            />
            <SelectField
              name="status"
              label="Status"
              options={opcoesStatus}
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

