import { useConsultarRepresentacao } from "@/hooks/representacoes/use-consultar-representacao";
import {
  atualizacaoDadosPrincipaisRepresentacaoDto,
  schemaFormularioDadosPrincipaisRepresentacaoAtualizacao,
  useRepresentacoes,
} from "@/hooks/representacoes/use-representacoes";
import { atualizacaoRepresentacao } from "@/services/representacoes.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { opcoesEntidades } from "./sections/secao-dados-cadastrais";
import { SecaoDadosRepresentacao } from "./sections/secao-dados-representacao";
import { ButtonSave } from "@/components/layouts/ui/buttons/button-save/button-save";

export const FormularioDadosPrincipaisEdicao = () => {
  const params = useParams();
  const representacaoId = params.id as string;
  const { representacaoSelected } = useConsultarRepresentacao(representacaoId);
  const { tradutorDadosPrincipaisAtualizacao } = useRepresentacoes();

  const [carregando, setCarregando] = useState<boolean>(false);

  const methods = useForm<atualizacaoDadosPrincipaisRepresentacaoDto>({
    defaultValues: {
      tipoDados: "1",
    },
    resolver: zodResolver(
      schemaFormularioDadosPrincipaisRepresentacaoAtualizacao
    ),
  });

  async function onSubmit(data: atualizacaoDadosPrincipaisRepresentacaoDto) {
    console.log("data", data);
    if (Object.keys(methods.formState.errors).length > 0) {
      Swal.fire({
        text: "Por favor, corrija os erros no formulário antes de salvar",
        icon: "error",
        width: 500,
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    const payload = tradutorDadosPrincipaisAtualizacao(data);
    setCarregando(true);

    try {
      await atualizacaoRepresentacao(
        representacaoSelected?.idRepresentacao as number,
        payload
      );

      Swal.fire({
        text: "Representação atualizada com sucesso",
        icon: "success",
        width: 500,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        text: `Erro na atualização da representação: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        icon: "error",
        width: 500,
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    if (representacaoSelected) {
      // Converter statusSituacao para valores antigos do formulário
      const situacaoMap: Record<string, string> = {
        "ATIVO": "-1",
        "INATIVO": "0",
        "AGUARDANDO": "1",
        "DECLINADO": "2",
      };

      let vinculadoValue = "";

      // Verificar idRepresentacaoPai primeiro (pode ser número ou null)
      if (representacaoSelected?.idRepresentacaoPai !== null && representacaoSelected?.idRepresentacaoPai !== undefined) {
        vinculadoValue = `${representacaoSelected.idRepresentacaoPai}_REPRESENTACAO`;
      }
      // Se não tiver idRepresentacaoPai, verificar idOrgaoPai
      else if (representacaoSelected?.idOrgaoPai !== null && representacaoSelected?.idOrgaoPai !== undefined) {
        vinculadoValue = `${representacaoSelected.idOrgaoPai}_ORGAO`;
      }

      const formData = {
        numero: String(representacaoSelected?.idRepresentacao),
        representacaoNome: representacaoSelected?.nome || "",
        sigla: representacaoSelected?.sigla || "",
        areaTematica: String(representacaoSelected?.idCategoria) || "",
        situacao: situacaoMap[representacaoSelected?.statusSituacao || ""] || "",
        grauPrioridade: representacaoSelected?.grauPrioridade || "",
        vinculado: vinculadoValue,
        tipoDados: representacaoSelected?.tipoDados ? String(representacaoSelected.tipoDados) : "",
        idRepresentacaoPai: representacaoSelected?.idRepresentacaoPai !== null && representacaoSelected?.idRepresentacaoPai !== undefined
          ? String(representacaoSelected.idRepresentacaoPai)
          : undefined,
        idOrgaoPai: representacaoSelected?.idOrgaoPai !== null && representacaoSelected?.idOrgaoPai !== undefined
          ? String(representacaoSelected.idOrgaoPai)
          : undefined,
      } as atualizacaoDadosPrincipaisRepresentacaoDto;

      methods.reset(formData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [representacaoSelected]);

  const entidade = opcoesEntidades?.find(
    (row) => Number(row.value) === representacaoSelected?.organizacao?.idNumeroOrganizacao
  );

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <>
          <h1 className="text-2xl font-bold cnc-text-brand-blue-600 my-4">
            Dados Cadastrais
          </h1>
          <div className="w-full">
            <label>Entidade:</label>
            <h2 className="text-lg font-medium">{entidade?.label}</h2>
          </div>
        </>
        <hr className=" border-t border-gray-200" />
        <SecaoDadosRepresentacao method={methods} />
        <div className="flex items-center justify-end border-t border-gray-200 pt-4 mt-4">
          <ButtonSave type="submit" loading={carregando} />
        </div>
      </form>
    </FormProvider>
  );
};
