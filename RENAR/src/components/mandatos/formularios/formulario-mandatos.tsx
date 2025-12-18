import { useEffect, useState } from "react";

import { ButtonSave } from "@/components/layouts/ui/buttons/button-save/button-save";
import { DateField } from "@/components/layouts/ui/fields/date-field/date-field";
import { SelectField } from "@/components/layouts/ui/fields/select-field/select-field";
import { TextAreaField } from "@/components/layouts/ui/fields/text-area-field";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import { useEntidades } from "@/hooks/dominios/use-entidades";
import useMandatos from "@/hooks/mandatos/use-mandatos";
import { useRepresentacoes } from "@/hooks/representacoes/use-representacoes";
import { useRepresentantes } from "@/hooks/representantes/use-representantes";
import { criarMandato } from "@/services/mandatos.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";

const dadosMandatosSchema = z.object({
  idRepresentacao: z.string("Campo obrigatório"),
  idPessoa: z.string("Campo obrigatório"),
  idOrganizacao: z.string("Campo obrigatório"),
  dataInicio: z.string("Campo obrigatório"),
  dataFim: z.string("Campo obrigatório"),
  idTipoMandato: z.string("Campo obrigatório"),
  nomeIndicacao: z.string("Campo obrigatório"),
  dataIndicacao: z.string("Campo obrigatório"),
  idFuncao: z.string("Campo obrigatório"),
  observacaoMandato: z.string("Campo obrigatório").optional(),
});

export type DadosMandatosForm = z.infer<typeof dadosMandatosSchema>;

export type DadosMandatosPayload = {
  idRepresentacao: number;
  idPessoa: number;
  idOrganizacao: number;
  dataInicio: string;
  dataFim: string;
  idTipoMandato: number;
  nomeIndicacao: string;
  dataIndicacao: string;
  idFuncao: number;
  observacaoMandato?: string;
};

interface FormularioMandatosProps {
  defaultValues?: Partial<DadosMandatosForm>;
  onSubmit?: (dados: DadosMandatosPayload) => Promise<void> | void;
  loading?: boolean;
}

type CamposNumericos =
  | "idRepresentacao"
  | "idPessoa"
  | "idOrganizacao"
  | "idTipoMandato"
  | "idFuncao";

const NUMERIC_FIELDS: CamposNumericos[] = [
  "idRepresentacao",
  "idPessoa",
  "idOrganizacao",
  "idTipoMandato",
  "idFuncao",
];

const construirPayload = (dados: DadosMandatosForm): DadosMandatosPayload => {
  const payload = { ...dados } as Record<string, unknown>;

  NUMERIC_FIELDS.forEach((campo) => {
    const valor = dados[campo];

    if (valor === undefined || valor === null || valor === "") {
      delete payload[campo];
      return;
    }

    payload[campo] = Number(valor);
  });

  payload.observacaoMandato = dados.observacaoMandato ?? "";
  if (!payload.observacaoMandato) {
    delete payload.observacaoMandato;
  }

  return payload as DadosMandatosPayload;
};

export const FormularioMandatos = ({
  defaultValues,
  onSubmit,
  loading,
}: FormularioMandatosProps) => {
  const { opcoesEntidades, isLoading: isLoadingEntidades } = useEntidades();
  const { opcoesRepresentacao, isLoadingBuscaRepresentacoes } = useRepresentacoes();
  const { representantes, isLoading: isLoadingRepresentantes } = useRepresentantes();
  const { opcoesTipoMandatos, isLoading: isLoadingTipoMandatos } = useMandatos();
  const opcoesRepresentante = representantes?.map((representante) => ({
    value: representante.id.toString(),
    label: representante.nome,
  })) || [];
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<DadosMandatosForm>({
    resolver: zodResolver(dadosMandatosSchema),
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      methods.reset(defaultValues);
    }
  }, [defaultValues, methods]);

  const handleSubmit = async (dados: DadosMandatosForm) => {
    const payload = construirPayload(dados);

    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(payload);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setIsSubmitting(true);
    try {
      await criarMandato(payload);
      Swal.fire({
        text: "Mandato criado com sucesso",
        icon: "success",
        width: 500,
        showConfirmButton: false,
        timer: 1500,
      });
      methods.reset();
    } catch (error) {
      console.error("Erro ao criar o mandato:", error);
      const mensagem =
        error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
      Swal.fire({
        title: "Erro ao criar mandato",
        text: mensagem,
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
        onSubmit={methods.handleSubmit(handleSubmit)}
        aria-describedby="mandatos-form"
      >
        <div className="grid grid-cols-1 md:grid-cols-3  gap-4 mt-4">
          <SelectField
            options={opcoesRepresentacao || []}
            name="idRepresentacao"
            label="Representação"
            placeholder="Representação"
            id="field-representacao"
            required
            disabled={isLoadingBuscaRepresentacoes}
          />
          <SelectField
            options={opcoesRepresentante || []}
            name="idPessoa"
            label="Representante"
            placeholder="representante"
            id="field-representante"
            required
            disabled={isLoadingRepresentantes}
          />
          <SelectField
            options={opcoesEntidades || []}
            name="idOrganizacao"
            label="Entidade"
            placeholder="Selecione uma opção"
            required
            disabled={isLoadingEntidades}
          />

          <DateField
            name="dataInicio"
            label="Data de Início"
            id="field-data-inicio"
            required
          />
          <DateField
            name="dataFim"
            label="Data fim"
            id="field-data-fim"
            required
          />
          <SelectField
            options={opcoesTipoMandatos || []}
            name="idTipoMandato"
            label="Tipo Mandato"
            placeholder="tipo mandato"
            id="field-tipo-mandato"
            required
            disabled={isLoadingTipoMandatos}
          />
          <TextField
            label="Nome Indicação"
            name="nomeIndicacao"
            placeholder="nome indicação"
            id="field-nome-indicacao"
            required
          />
          <DateField
            name="dataIndicacao"
            label="Data Indicação"
            id="field-data-indicacao"
            required
          />
          <SelectField
            options={[
              { label: "titular", value: "1" },
              { label: "suplente", value: "2" },
            ]}
            name="idFuncao"
            label="Tipo Função"
            placeholder="tipo função"
            id="field-tipo-funcao"
            required
          />
          <TextAreaField
            name="observacaoMandato"
            label="Observação"
            id="field-observacao"
          />
        </div>

        <div className="flex items-center justify-end border-t border-gray-200 pt-4 mt-4">
          <ButtonSave 
            loading={loading ?? isSubmitting} 
            type="submit" 
            disabled={isLoadingBuscaRepresentacoes 
              || isLoadingRepresentantes 
              || isLoadingEntidades 
              || isLoadingTipoMandatos}
          />
        </div>
      </form>
    </FormProvider>
  );
};
