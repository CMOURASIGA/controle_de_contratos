import { ButtonSave } from "@/components/layouts/ui/buttons/button-save/button-save";
import { SelectField } from "@/components/layouts/ui/fields/select-field/select-field";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import { useBancos } from "@/hooks/dominios/use-bancos";
import { useQueryString } from "@/hooks/useQueryParams";
import { queryClient } from "@/infra/tanStack/ReactQueryWrapper";
import { atualizarDadosBancariosRepresentante } from "@/services/representantes.service";
import { Representante } from "@/types/representante.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";

const dadosBancariosSchema = z.object({
  banco: z.string().min(1, "Banco é obrigatório"),
  conta: z.string().min(4, "Conta deve ter no mínimo 4 dígitos"),
  agencia: z.string().min(3, "Agência deve ter no mínimo 3 dígitos"),
  tipo: z.string(),
});

type Dadosbancarios = z.infer<typeof dadosBancariosSchema>;
export function DadosBancariosForm() {
  const { opcoesBancos } = useBancos();
  const [isLoading, setIsloading] = useState<boolean>(false);

  const { getAllQueryStrings } = useQueryString();
  const { representanteId } = getAllQueryStrings();
  const representante: Representante | undefined = queryClient.getQueryData([
    "representante",
    representanteId,
  ]);

  const methods = useForm<Dadosbancarios>({
    resolver: zodResolver(dadosBancariosSchema),
  });

  useEffect(() => {
    if (!representante?.isNovo) {
      methods.setValue("banco", representante?.numeroBanco?.trimEnd() || "");
      methods.setValue(
        "agencia",
        representante?.numeroAgencia?.trimEnd() || ""
      );
      methods.setValue(
        "conta",
        representante?.numeroContaCorrente?.trimEnd() || ""
      );
      methods.setValue("tipo", representante?.tipoConta || "");
    }
  }, [representante, methods]);

  async function onSubmit(data: Dadosbancarios) {
    setIsloading(true);
    atualizarDadosBancariosRepresentante(representanteId, data)
      .then(() => {
        Swal.fire({
          text: "Representante criado com sucesso",
          icon: "success",
          width: 500,
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch(() => {
        Swal.fire({
          text: "Erro ao criar representante",
          icon: "error",
          width: 500,
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .finally(() => setIsloading(false));
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        aria-describedby="dados-bancarios-form"
      >
        <SelectField
          options={opcoesBancos}
          label="Banco*"
          name="banco"
          placeholder="Banco"
          id="field-banco"
          required
        />
        <div className="grid grid-cols-3 gap-4 my-4 pb-4">
          <TextField
            label="Conta*"
            name="conta"
            placeholder="Conta"
            id="field-conta"
            required
          />

          <TextField
            label="Agência*"
            name="agencia"
            placeholder="Agência"
            id="field-agencia"
            required
          />
          <SelectField
            options={[
              { value: "C", label: "Conta Corrente" },
              { value: "P", label: "Conta Poupança" },
            ]}
            name="tipo"
            label="Tipo de Conta"
            placeholder="tipo de conta"
          />
        </div>
        <div className="flex items-center justify-end border-t border-gray-200 pt-4 mt-4">
          <ButtonSave loading={isLoading} />
        </div>
      </form>
    </FormProvider>
  );
}
