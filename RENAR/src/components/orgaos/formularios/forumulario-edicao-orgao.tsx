import { useConsultarOrgaoPorId } from "@/hooks/orgaos/use-consultar-orgao-por-id";
import { queryClient } from "@/providers/react-query";
import { AtualizarOrgao } from "@/services/orgaos/orgaos.service";
import { OrgaoFormData } from "@/types/orgao.type";
import { Button } from "@cnc-ti/layout-basic";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { SecaoDadosCadastraisOrgaos } from "./sections/secao-dados-cadastrais-orgaos";
import { SecaoDadosOrgao } from "./sections/secao-dados-orgao";

const tipoOrgaoOptions = [
  { nome: "Público", value: "1" },
  { nome: "Internacional", value: "2" },
  { nome: "Privado", value: "3" },
];

const situacaoOptions = [
  { nome: "Ativo", value: "1" },
  { nome: "Inativo", value: "0" },
  { nome: "Aguardando Definição", value: "2" },
  { nome: "Declinada", value: "3" },
];

export const FormularioEdicaoOrgao = () => {
  const params = useParams();
  const orgaoId = params.id as string;
  const { orgaoSelecionado } = useConsultarOrgaoPorId(orgaoId);

  const methods = useForm<OrgaoFormData>();

  async function onSubmit(data: OrgaoFormData) {
    try {
      AtualizarOrgao(orgaoId, data);

      Swal.fire({
        text: "Órgão atualizado com sucesso",
        icon: "success",
        width: 500,
        showConfirmButton: false,
        timer: 1500,
      });
      queryClient.invalidateQueries({ queryKey: ["orgaos"] });
    } catch (error) {
      console.error("Erro ao atualizar órgão:", error);
      Swal.fire({
        text: "Erro ao atualizar órgão",
        icon: "error",
        width: 500,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
  useEffect(() => {
    console.log("Órgão selecionado:", orgaoSelecionado);
    if (orgaoSelecionado?.data) {
      const indiceTipoOrgao =
        tipoOrgaoOptions.find(
          (option) => option.value == orgaoSelecionado?.data.tipoOrgaoId
        )?.value || "0";
      const indiceSituacao =
        situacaoOptions.find((option) =>
          option.value.includes(orgaoSelecionado?.data.situacao)
        )?.value || "0";

      methods.reset({
        entidade: String(orgaoSelecionado?.data.entidadeId) || "",
        orgaoNome: orgaoSelecionado?.data.nome || "",
        numero: String(orgaoSelecionado?.data.id) || "",
        sigla: orgaoSelecionado?.data.sigla || "",
        vinculado: String(orgaoSelecionado?.data.idOrgaoPai) || "",
        tipo: String(indiceTipoOrgao) || "0",
        situacao: String(indiceSituacao) || "0",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgaoSelecionado]);

  return (
    <div>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          aria-describedby="drawer-subgroup-desc"
        >
          <SecaoDadosCadastraisOrgaos />
          <hr className=" border-t border-gray-200" />
          <SecaoDadosOrgao />

          <div className="flex items-center justify-end border-t border-gray-200 pt-4 mt-4">
            <Button type="submit">Salvar alterações</Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
