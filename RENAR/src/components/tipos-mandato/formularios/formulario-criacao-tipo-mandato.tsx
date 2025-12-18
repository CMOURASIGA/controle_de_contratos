import { TipoMandatoFormData, CreateTipoMandatoDto } from "@/types/tipo-mandato.type";
import { FormProvider, useForm } from "react-hook-form";
import { criarTipoMandato } from "@/services/tipos-mandato.service";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import { ButtonSave } from "@/components/layouts/ui/buttons/button-save/button-save";

export default function FormularioCriacaoTipoMandato() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const methods = useForm<TipoMandatoFormData>({
    defaultValues: {
      descricao: "",
    },
  });

  const onSubmit = async (data: TipoMandatoFormData) => {
    setIsSubmitting(true);
    try {
      const payload: CreateTipoMandatoDto = {
        descricao: data.descricao,
      };
      await criarTipoMandato(payload);

      Swal.fire({
        text: "Tipo de mandato criado com sucesso",
        icon: "success",
        width: 500,
        showConfirmButton: false,
        timer: 1500,
      });
      queryClient.invalidateQueries({ queryKey: ["tipos-mandato"] });
      router.push("/tipos-mandato/busca");
    } catch (error) {
      console.error("Erro ao criar tipo de mandato:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Erro ao criar tipo de mandato";
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
  );
}

