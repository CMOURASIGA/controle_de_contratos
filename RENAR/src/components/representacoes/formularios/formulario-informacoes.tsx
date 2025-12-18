import {
  formularioRepresentacaoAtualizacaoDto,
  useRepresentacoes,
} from "@/hooks/representacoes/use-representacoes";
import { FormProvider, useForm } from "react-hook-form";
import { SecaoInformacoes } from "./sections/secao-informacoes";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useConsultarRepresentacao } from "@/hooks/representacoes/use-consultar-representacao";
import Swal from "sweetalert2";
import { atualizacaoRepresentacao } from "@/services/representacoes.service";
import { ButtonSave } from "@/components/layouts/ui/buttons/button-save/button-save";

export const FormularioInformacoes = () => {
  const { tradutorInformacoesAtualizacao } = useRepresentacoes();
  const params = useParams();
  const representacaoId = params.id as string;
  const { representacaoSelected } = useConsultarRepresentacao(representacaoId);
  const [carregando, setCarregando] = useState<boolean>(false);

  const methods = useForm<formularioRepresentacaoAtualizacaoDto>({
    defaultValues: {},
  });

  async function onSubmit(data: formularioRepresentacaoAtualizacaoDto) {
    const payload = tradutorInformacoesAtualizacao(data);
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

  useEffect(() => {
    if (representacaoSelected) {
      methods.reset({
        competencia: representacaoSelected?.competencia ?? "",
        competenciaWeb: !!representacaoSelected?.staCmptnc,
        perfil: representacaoSelected?.perfil ?? "",
        publicarWeb: representacaoSelected?.perfilWeb ? Boolean(representacaoSelected.perfilWeb) : false,
        siteComposicao: representacaoSelected?.enderecoHomepageComposicao ?? "",
        siteLegislacao: representacaoSelected?.enderecoHomepageLegislacao ?? "",
        perfilRepresentacao: representacaoSelected?.perfilRepresentacao ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [representacaoSelected]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <SecaoInformacoes />

        <div className="flex items-center justify-end border-t border-gray-200 pt-4 mt-4">
          <ButtonSave loading={carregando} />
        </div>
      </form>
    </FormProvider>
  );
};
