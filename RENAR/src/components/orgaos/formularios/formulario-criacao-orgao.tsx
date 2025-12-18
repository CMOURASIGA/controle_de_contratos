import { NovoOrgao } from "@/services/orgaos/orgaos.service";
import { OrgaoFormData } from "@/types/orgao.type";
import { Button } from "@cnc-ti/layout-basic";
import { useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { SecaoDadosCadastraisOrgaos } from "./sections/secao-dados-cadastrais-orgaos";
import { SecaoDadosOrgao } from "./sections/secao-dados-orgao";

export default function FormularioCriacaoOrgao() {
  const queryClient = useQueryClient();
  const methods = useForm<OrgaoFormData>();

  const onSubmit = async (data: OrgaoFormData) => {
    try {
      const response = await NovoOrgao(data);
      if (response) {
        console.log("Órgão criado com sucesso:", response);
        Swal.fire({
          text: "Órgão criado com sucesso",
          icon: "success",
          width: 500,
          showConfirmButton: false,
          timer: 1500,
        });
        queryClient.invalidateQueries({ queryKey: ["orgaos"] });
        methods.reset();
      }
    } catch (error) {
      console.error("Erro ao criar órgão:", error);
      Swal.fire({
        text: "Erro ao criar órgão",
        icon: "error",
        width: 500,
        showConfirmButton: false,
        timer: 1500,
      });
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
          <SecaoDadosCadastraisOrgaos />
          <hr className=" border-t border-gray-200" />
          <SecaoDadosOrgao />

          <div className="flex items-center justify-end border-t border-gray-200 pt-4 mt-4">
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
