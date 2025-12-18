import { ButtonSave } from "@/components/layouts/ui/buttons/button-save/button-save";
import {
  dadosPrincipaisRepresentacaoDto,
  schemaFormularioDadosPrincipaisRepresentacao,
  useRepresentacoes,
} from "@/hooks/representacoes/use-representacoes";
import { criacaoRepresentacao } from "@/services/representacoes.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { SecaoDadosCadastrais } from "./sections/secao-dados-cadastrais";
import { SecaoDadosRepresentacao } from "./sections/secao-dados-representacao";

export const FormularioDadosPrincipaisCriacao = () => {
  const { tradutorDadosCadastro } = useRepresentacoes();
  const router = useRouter();

  const [carregando, setCarregando] = useState<boolean>(false);

  const methods = useForm<dadosPrincipaisRepresentacaoDto>({
    defaultValues: {
      representacaoNome: "",
      vinculado: "",
      entidade: "1995",
      grauPrioridade: "",
      numero: "",
      tipoDados: "",
      situacao: "",
      areaTematica: "",
    },
    resolver: zodResolver(schemaFormularioDadosPrincipaisRepresentacao),
  });
  const hasErrors = Object.keys(methods.formState.errors).length > 0;

  async function onSubmit(data: dadosPrincipaisRepresentacaoDto) {
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

    const payload = tradutorDadosCadastro(data);
    setCarregando(true);
    try {
      const novaRepresentacao = await criacaoRepresentacao(payload);

      Swal.fire({
        text: "Representação criada com sucesso",
        icon: "success",
        width: 500,
        showConfirmButton: false,
        timer: 1500,
      });
      router.push(
        `/representacoes/editar/${novaRepresentacao?.idRepresentacao}`
      );
      methods.reset();
    } catch (error) {
      const erro = error as { message: string };

      let mensagemFormatada;
      if (erro.message.includes("Já existe uma representação")) {
        methods.setError("numero", {
          type: "manual",
          message: "Já existe uma representação cadastrada com esse ID.",
        });
        mensagemFormatada = erro?.message.split(":")[1]?.split("(")[0].trim();
      }

      Swal.fire({
        text:
          mensagemFormatada || erro.message || "Erro ao criar representação",
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
        <SecaoDadosCadastrais />
        <hr className=" border-t border-gray-200" />
        <SecaoDadosRepresentacao method={methods} />

        <div className="flex items-center justify-end border-t border-gray-200 pt-4 mt-4">
          <ButtonSave type="submit" loading={carregando} disabled={hasErrors} />
        </div>
      </form>
    </FormProvider>
  );
};
