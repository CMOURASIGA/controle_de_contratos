import { MotivoCancelamentoFormData, CreateMotivoCancelamentoDto } from "@/types/motivo-cancelamento.type";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { criarMotivoCancelamento } from "@/services/motivos-cancelamento.service";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import { SelectField } from "@/components/layouts/ui/fields/select-field/select-field";
import { ButtonSave } from "@/components/layouts/ui/buttons/button-save/button-save";

const opcoesStatus = [
  { label: "Ativo", value: "1" },
  { label: "Inativo", value: "0" },
];

export default function FormularioCriacaoMotivoCancelamento() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const methods = useForm<MotivoCancelamentoFormData>({
    defaultValues: {
      descricao: "",
      status: 1,
    },
  });

  const onSubmit = async (data: MotivoCancelamentoFormData) => {
    setIsSubmitting(true);
    try {
      const payload: CreateMotivoCancelamentoDto = {
        descricao: data.descricao,
        status: data.status,
      };
      const response = await criarMotivoCancelamento(payload);
      if (response) {
        Swal.fire({
          text: "Motivo de cancelamento criado com sucesso",
          icon: "success",
          width: 500,
          showConfirmButton: false,
          timer: 1500,
        });
        queryClient.invalidateQueries({ queryKey: ["motivos-cancelamento"] });
        router.push("/motivos-cancelamento/busca");
      }
    } catch (error) {
      console.error("Erro ao criar motivo de cancelamento:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Erro ao criar motivo de cancelamento";
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
  };

  return (
    <div>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
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
            <div>
              <label className="text-sm block mb-1 font-medium text-gray-600">
                Status <span className="text-red-500">*</span>
              </label>
              <Controller
                name="status"
                control={methods.control}
                rules={{ required: "Status é obrigatório" }}
                render={({ field }) => (
                  <SelectField
                    name="status"
                    options={opcoesStatus}
                    value={String(field.value)}
                    onChange={(e) => {
                      field.onChange(Number(e.target.value));
                    }}
                    required
                  />
                )}
              />
            </div>
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
}

