import { useConsultarRepresentacao } from "@/hooks/representacoes/use-consultar-representacao";
import {
  CusteioRepresentacao,
  CreateCusteioRepresentacaoDto,
  UpdateCusteioRepresentacaoDto,
} from "@/types/representacao.type";
import {
  criarCusteioRepresentacao,
  atualizarCusteioRepresentacao,
  deletarCusteioRepresentacao,
  buscarTiposCusteio,
  buscarFontesCusteio,
} from "@/services/representacoes.service";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { ButtonSave } from "@/components/layouts/ui/buttons/button-save/button-save";
import { SecaoCusteio } from "./sections/secao-custeio";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schemaCusteio = z.object({
  idTipoCusteio: z.string().min(1, "Tipo de custeio é obrigatório"),
  idFonteCusteio: z.string().min(1, "Fonte de custeio é obrigatória"),
  dataCriacao: z.string().optional(),
});

type FormCusteio = z.infer<typeof schemaCusteio>;

export const FormularioCusteio = () => {
  const params = useParams();
  const representacaoId = params.id as string;
  const { representacaoSelected } = useConsultarRepresentacao(representacaoId);
  const queryClient = useQueryClient();
  const [carregando, setCarregando] = useState(false);

  // Buscar tipos e fontes de custeio
  const { data: tiposCusteio, isLoading: isLoadingTipos } = useQuery({
    queryKey: ["tipos-custeio"],
    queryFn: buscarTiposCusteio,
  });

  const { data: fontesCusteio, isLoading: isLoadingFontes } = useQuery({
    queryKey: ["fontes-custeio"],
    queryFn: buscarFontesCusteio,
  });

  // Preparar opções para os selects
  const opcoesTiposCusteio =
    tiposCusteio?.map((tipo) => ({
      value: tipo.idTipoCusteio.toString(),
      label: tipo.descricaoTipoCusteio,
    })) || [];

  const opcoesFontesCusteio =
    fontesCusteio?.map((fonte) => ({
      value: fonte.idFonteCusteio.toString(),
      label: fonte.descricaoChave || fonte.codigoChave,
    })) || [];

  // Obter o custeio existente (se houver apenas 1)
  const custeioExistente: CusteioRepresentacao | undefined =
    representacaoSelected?.custeioRepresentacao &&
      representacaoSelected.custeioRepresentacao.length > 0
      ? representacaoSelected.custeioRepresentacao[0]
      : undefined;

  const methods = useForm<FormCusteio>({
    resolver: zodResolver(schemaCusteio),
    defaultValues: {
      idTipoCusteio: "",
      idFonteCusteio: "",
      dataCriacao: "",
    },
  });

  // Carregar dados do custeio existente no formulário
  useEffect(() => {
    if (custeioExistente) {
      methods.reset({
        idTipoCusteio: custeioExistente.idTipoCusteio.toString(),
        idFonteCusteio: custeioExistente.idFonteCusteio.toString(),
        dataCriacao: custeioExistente.dataCriacao
          ? new Date(custeioExistente.dataCriacao).toISOString().split("T")[0]
          : "",
      });
    } else {
      methods.reset({
        idTipoCusteio: "",
        idFonteCusteio: "",
        dataCriacao: "",
      });
    }
  }, [custeioExistente, methods]);

  const criarMutation = useMutation({
    mutationFn: (data: CreateCusteioRepresentacaoDto) =>
      criarCusteioRepresentacao(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["representacao", representacaoId],
      });
      Swal.fire({
        text: "Custeio criado com sucesso",
        icon: "success",
        width: 500,
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: (error: Error) => {
      Swal.fire({
        text: error.message || "Erro ao criar custeio",
        icon: "error",
        width: 500,
        showConfirmButton: false,
        timer: 2000,
      });
    },
  });

  const atualizarMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateCusteioRepresentacaoDto;
    }) => atualizarCusteioRepresentacao(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["representacao", representacaoId],
      });
      Swal.fire({
        text: "Custeio atualizado com sucesso",
        icon: "success",
        width: 500,
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: (error: Error) => {
      Swal.fire({
        text: error.message || "Erro ao atualizar custeio",
        icon: "error",
        width: 500,
        showConfirmButton: false,
        timer: 2000,
      });
    },
  });

  const deletarMutation = useMutation({
    mutationFn: (id: number) => deletarCusteioRepresentacao(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["representacao", representacaoId],
      });
      methods.reset({
        idTipoCusteio: "",
        idFonteCusteio: "",
        dataCriacao: "",
      });
      Swal.fire({
        text: "Custeio deletado com sucesso",
        icon: "success",
        width: 500,
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: (error: Error) => {
      Swal.fire({
        text: error.message || "Erro ao deletar custeio",
        icon: "error",
        width: 500,
        showConfirmButton: false,
        timer: 2000,
      });
    },
  });

  const onSubmit = (data: FormCusteio) => {
    if (!representacaoSelected?.idRepresentacao) {
      Swal.fire({
        text: "Representação não encontrada",
        icon: "error",
        width: 500,
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    setCarregando(true);

    const payload = {
      idRepresentacao: representacaoSelected.idRepresentacao,
      idTipoCusteio: Number(data.idTipoCusteio),
      idFonteCusteio: Number(data.idFonteCusteio),
      ...(data.dataCriacao && { dataCriacao: data.dataCriacao }),
    };

    if (custeioExistente) {
      atualizarMutation.mutate(
        {
          id: custeioExistente.idCusteioRepresentacao,
          data: payload,
        },
        {
          onSettled: () => {
            setCarregando(false);
          },
        }
      );
    } else {
      criarMutation.mutate(payload, {
        onSettled: () => {
          setCarregando(false);
        },
      });
    }
  };

  const isLoading =
    criarMutation.isPending ||
    atualizarMutation.isPending ||
    deletarMutation.isPending ||
    isLoadingTipos ||
    isLoadingFontes ||
    carregando;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold cnc-text-brand-blue-600 my-4">
          Custeio de Representação
        </h1>

      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <SecaoCusteio
            opcoesTiposCusteio={opcoesTiposCusteio}
            opcoesFontesCusteio={opcoesFontesCusteio}
            isLoading={isLoadingTipos || isLoadingFontes}
          />

          <div className="flex items-center justify-end border-t border-gray-200 pt-4 mt-4">
            <ButtonSave
              type="submit"
              loading={isLoading}
              disabled={isLoading}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
