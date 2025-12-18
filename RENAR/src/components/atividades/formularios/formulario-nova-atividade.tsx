"use client";

import { ButtonSave } from "@/components/layouts/ui/buttons/button-save/button-save";
import CustomCollapse from "@/components/layouts/ui/collapse";
import { SelectField } from "@/components/layouts/ui/fields/select-field/select-field";
import { TextAreaField } from "@/components/layouts/ui/fields/text-area-field";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import { useAtividades } from "@/hooks/atividades/use-atividades";
import { useConsultarAtividade } from "@/hooks/atividades/use-consultar-atividade";
import { useRepresentacoes } from "@/hooks/representacoes/use-representacoes";
import { useRepresentantes } from "@/hooks/representantes/use-representantes";
import {
  atualizarAtividade,
  criarAtividade,
} from "@/services/atividades.service";
import { NovaAtividadePayload } from "@/types/atividade.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";

const statusOptions = [
  { label: "Não", value: "0" },
  { label: "Sim", value: "1" },
];

const novaAtividadeSchema = z
  .object({
    idRepresentante: z.string().min(1, "Selecione um representante"),
    idRepresentacao: z.string().min(1, "Selecione uma representação"),
    idTipoAtividade: z.string().min(1, "Selecione um tipo de atividade"),
    enderecoEvento: z.string().min(1, "Informe o endereço do evento"),
    descricaoAtividade: z.string().min(1, "Descreva a atividade"),
    descricaoPauta: z.string().optional(),
    dataInicioAtividade: z.string().min(1, "Informe a data de início"),
    dataFimAtividade: z.string().min(1, "Informe a data de fim"),
    statusHospedagem: z.enum(["0", "1"]),
    observacaoHospedagem: z.string().optional(),
    statusDiaria: z.enum(["0", "1"]),
    quantidadeDiaria: z.string().optional(),
    observacaodiaria: z.string().optional(),
    statusPassagem: z.enum(["0", "1"]),
    dataPassagemIda: z.string().optional(),
    companhiaIda: z.string().optional(),
    dataHoraVooIda: z.string().optional(),
    trechoIda: z.string().optional(),
    numeroVooIda: z.string().optional(),
    dataPassagemVolta: z.string().optional(),
    companhiaVolta: z.string().optional(),
    dataHoraVooVolta: z.string().optional(),
    trechoVolta: z.string().optional(),
    numeroVooVolta: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.dataInicioAtividade &&
      data.dataFimAtividade &&
      new Date(data.dataFimAtividade) <= new Date(data.dataInicioAtividade)
    ) {
      ctx.addIssue({
        path: ["dataFimAtividade"],
        code: z.ZodIssueCode.custom,
        message: "A data de fim deve ser maior que a data de início.",
      });
    }
  });

type NovaAtividadeFormData = z.infer<typeof novaAtividadeSchema>;

const defaultValues: Partial<NovaAtividadeFormData> = {
  statusHospedagem: "0",
  statusDiaria: "0",
  statusPassagem: "0",
};

const toISODateTime = (value?: string) => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toISOString();
};

const toLocalDateTime = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  // Formata para datetime-local (YYYY-MM-DDTHH:mm)
  // Usa métodos UTC para evitar problemas de timezone
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const toLocalDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  // Formata para date (YYYY-MM-DD)
  // Usa métodos UTC para evitar problemas de timezone
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toNumberOrUndefined = (value?: string) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const buildPayload = (values: NovaAtividadeFormData): NovaAtividadePayload => {
  const payload: NovaAtividadePayload = {
    idRepresentante: Number(values.idRepresentante),
    idRepresentacao: Number(values.idRepresentacao),
    idTipoAtividade: Number(values.idTipoAtividade),
    enderecoEvento: values.enderecoEvento,
    descricaoAtividade: values.descricaoAtividade,
    dataInicioAtividade:
      toISODateTime(values.dataInicioAtividade) ?? values.dataInicioAtividade,
    dataFimAtividade:
      toISODateTime(values.dataFimAtividade) ?? values.dataFimAtividade,
    statusHospedagem: Number(values.statusHospedagem) as 0 | 1,
    statusDiaria: Number(values.statusDiaria) as 0 | 1,
    statusPassagem: Number(values.statusPassagem) as 0 | 1,
  };

  if (values.descricaoPauta?.trim()) {
    payload.descricaoPauta = values.descricaoPauta.trim();
  }

  if (payload.statusHospedagem === 1) {
    const observacao = values.observacaoHospedagem?.trim();
    if (observacao) {
      payload.observacaoHospedagem = observacao;
    }
  }

  if (payload.statusDiaria === 1) {
    payload.quantidadeDiaria = toNumberOrUndefined(values.quantidadeDiaria);
    if (values.observacaodiaria?.trim()) {
      payload.observacaodiaria = values.observacaodiaria.trim();
    }
  } else if (values.observacaodiaria?.trim()) {
    payload.observacaodiaria = values.observacaodiaria.trim();
  }

  if (payload.statusPassagem === 1) {
    payload.dataPassagemIda = toISODateTime(values.dataPassagemIda);
    payload.companhiaIda = values.companhiaIda?.trim() || undefined;
    payload.dataHoraVooIda = toISODateTime(values.dataHoraVooIda);
    payload.trechoIda = values.trechoIda?.trim() || undefined;
    payload.numeroVooIda = values.numeroVooIda?.trim() || undefined;
    payload.dataPassagemVolta = toISODateTime(values.dataPassagemVolta);
    payload.companhiaVolta = values.companhiaVolta?.trim() || undefined;
    payload.dataHoraVooVolta = toISODateTime(values.dataHoraVooVolta);
    payload.trechoVolta = values.trechoVolta?.trim() || undefined;
    payload.numeroVooVolta = values.numeroVooVolta?.trim() || undefined;
  }

  return payload;
};

interface FormularioAtividadeProps {
  atividadeId?: string;
}

export function FormularioNovaAtividade(
  { atividadeId }: FormularioAtividadeProps = {} as FormularioAtividadeProps
) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!atividadeId;
  const { atividadeSelected } = useConsultarAtividade(atividadeId || "");

  const methods = useForm<NovaAtividadeFormData>({
    resolver: zodResolver(novaAtividadeSchema),
    defaultValues,
  });

  const { representantes } = useRepresentantes();
  const { opcoesRepresentacao } = useRepresentacoes();
  const { opcoesTiposAtividade, loadingTiposAtividade } = useAtividades();

  const representanteOptions = useMemo(
    () =>
      representantes?.map((representante) => ({
        value: representante.id.toString(),
        label: representante.nome,
      })) ?? [],
    [representantes]
  );

  const statusHospedagem = methods.watch("statusHospedagem");
  const statusDiaria = methods.watch("statusDiaria");
  const statusPassagem = methods.watch("statusPassagem");

  useEffect(() => {
    if (statusHospedagem !== "1") {
      methods.setValue("observacaoHospedagem", "");
    }
  }, [methods, statusHospedagem]);

  useEffect(() => {
    if (statusDiaria !== "1") {
      methods.setValue("quantidadeDiaria", "");
      methods.setValue("observacaodiaria", "");
    }
  }, [methods, statusDiaria]);

  useEffect(() => {
    if (statusPassagem !== "1") {
      methods.setValue("dataPassagemIda", "");
      methods.setValue("companhiaIda", "");
      methods.setValue("dataHoraVooIda", "");
      methods.setValue("trechoIda", "");
      methods.setValue("numeroVooIda", "");
      methods.setValue("dataPassagemVolta", "");
      methods.setValue("companhiaVolta", "");
      methods.setValue("dataHoraVooVolta", "");
      methods.setValue("trechoVolta", "");
      methods.setValue("numeroVooVolta", "");
    }
  }, [methods, statusPassagem]);

  const {
    formState: { errors },
  } = methods;

  // Preencher formulário quando atividade for carregada (modo edição)
  useEffect(() => {
    if (atividadeSelected && isEditMode) {
      const formData: Partial<NovaAtividadeFormData> = {
        idRepresentante: atividadeSelected.idRepresentante.toString(),
        idRepresentacao: atividadeSelected.idRepresentacao.toString(),
        idTipoAtividade: atividadeSelected.idTipoAtividade.toString(),
        enderecoEvento: atividadeSelected.enderecoEvento || "",
        descricaoAtividade: atividadeSelected.descricaoAtividade || "",
        descricaoPauta: atividadeSelected.descricaoPauta || "",
        dataInicioAtividade: toLocalDateTime(
          atividadeSelected.dataInicioAtividade
        ),
        dataFimAtividade: toLocalDateTime(atividadeSelected.dataFimAtividade),
        statusHospedagem: atividadeSelected.statusHospedagem.toString() as
          | "0"
          | "1",
        observacaoHospedagem: atividadeSelected.observacaoHospedagem || "",
        statusDiaria: atividadeSelected.statusDiaria.toString() as "0" | "1",
        quantidadeDiaria: atividadeSelected.quantidadeDiaria?.toString() || "",
        observacaodiaria: atividadeSelected.observacaodiaria || "",
        statusPassagem: atividadeSelected.statusPassagem.toString() as
          | "0"
          | "1",
        dataPassagemIda: toLocalDate(atividadeSelected.dataPassagemIda),
        companhiaIda: atividadeSelected.companhiaIda || "",
        dataHoraVooIda: toLocalDateTime(atividadeSelected.dataHoraVooIda),
        trechoIda: atividadeSelected.trechoIda || "",
        numeroVooIda: atividadeSelected.numeroVooIda || "",
        dataPassagemVolta: toLocalDate(atividadeSelected.dataPassagemVolta),
        companhiaVolta: atividadeSelected.companhiaVolta || "",
        dataHoraVooVolta: toLocalDateTime(atividadeSelected.dataHoraVooVolta),
        trechoVolta: atividadeSelected.trechoVolta || "",
        numeroVooVolta: atividadeSelected.numeroVooVolta || "",
      };
      methods.reset(formData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atividadeSelected, isEditMode]);

  const onSubmit = async (values: NovaAtividadeFormData) => {
    const payload = buildPayload(values);
    setIsSubmitting(true);
    try {
      if (isEditMode && atividadeId) {
        await atualizarAtividade(Number(atividadeId), payload);
        Swal.fire({
          text: "Atividade atualizada com sucesso",
          icon: "success",
          width: 480,
          timer: 1600,
          showConfirmButton: false,
        });
      } else {
        await criarAtividade(payload);
        Swal.fire({
          text: "Atividade criada com sucesso",
          icon: "success",
          width: 480,
          timer: 1600,
          showConfirmButton: false,
        });
        methods.reset(defaultValues);
      }
      queryClient.invalidateQueries({ queryKey: ["atividades"] });
      queryClient.invalidateQueries({ queryKey: ["atividade", atividadeId] });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : isEditMode
          ? "Não foi possível atualizar a atividade. Tente novamente."
          : "Não foi possível criar a atividade. Tente novamente.";
      Swal.fire({
        title: isEditMode
          ? "Erro ao atualizar atividade"
          : "Erro ao criar atividade",
        text: message,
        icon: "error",
        width: 520,
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
      >
        <CustomCollapse
          title={
            <h2 className="text-2xl font-bold cnc-text-brand-blue-600 my-4">
              Dados da atividade
            </h2>
          }
          defaultActive
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mr-1 ml-1">
            <SelectField
              options={opcoesRepresentacao}
              name="idRepresentacao"
              label="Representação"
              placeholder="Selecione uma representação"
              required
            />
            <SelectField
              options={representanteOptions}
              name="idRepresentante"
              label="Representante"
              placeholder="Selecione um representante"
              required
            />
            <SelectField
              options={opcoesTiposAtividade}
              name="idTipoAtividade"
              label="Tipo de atividade"
              placeholder="Selecione"
              disabled={loadingTiposAtividade}
              required
            />
            <TextField
              name="enderecoEvento"
              label="Endereço do evento"
              placeholder="Informe o endereço"
              required
            />
            <TextField
              name="dataInicioAtividade"
              label="Data e hora de início"
              type="datetime-local"
              required
            />
            <TextField
              name="dataFimAtividade"
              label="Data e hora de término"
              type="datetime-local"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 mt-4 mr-1 ml-1">
            <TextAreaField
              name="descricaoAtividade"
              label="Descrição da atividade"
              placeholder="Descreva os objetivos da atividade"
              error={errors.descricaoAtividade?.message as string | undefined}
              required
            />
            <TextAreaField
              name="descricaoPauta"
              label="Descrição da pauta (opcional)"
              placeholder="Inclua as pautas previstas"
              error={errors.descricaoPauta?.message as string | undefined}
            />
          </div>
        </CustomCollapse>

        <CustomCollapse
          title={
            <h2 className="text-2xl font-bold cnc-text-brand-blue-600 my-4">
              Custos e logística
            </h2>
          }
          defaultActive
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mr-1 ml-1">
            <SelectField
              options={statusOptions}
              name="statusHospedagem"
              label="Hospedagem"
              required
            />
            <SelectField
              options={statusOptions}
              name="statusDiaria"
              label="Diária"
              required
            />
            <SelectField
              options={statusOptions}
              name="statusPassagem"
              label="Passagem"
              required
            />
          </div>

          {statusHospedagem === "1" && (
            <div className="grid grid-cols-1 gap-4 mt-4 mr-1 ml-1">
              <TextAreaField
                name="observacaoHospedagem"
                label="Observações de hospedagem"
                placeholder="Descreva as necessidades de hospedagem"
                error={
                  errors.observacaoHospedagem?.message as string | undefined
                }
              />
            </div>
          )}

          {statusDiaria === "1" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mr-1 ml-1">
              <TextField
                name="quantidadeDiaria"
                label="Quantidade de diárias"
                type="number"
                min={0}
                placeholder="Ex.: 3"
              />
              <TextAreaField
                name="observacaodiaria"
                label="Observações sobre diárias"
                placeholder="Detalhes adicionais sobre as diárias"
              />
            </div>
          )}
        </CustomCollapse>

        {statusPassagem === "1" && (
          <CustomCollapse
            title={
              <h2 className="text-2xl font-bold cnc-text-brand-blue-600 my-4">
                Detalhes de passagem
              </h2>
            }
            defaultActive
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mr-1 ml-1">
              <TextField
                name="dataPassagemIda"
                label="Data da passagem (ida)"
                type="date"
              />
              <TextField
                name="companhiaIda"
                label="Companhia (ida)"
                placeholder="Ex.: GOL"
              />
              <TextField
                name="dataHoraVooIda"
                label="Data e hora do voo (ida)"
                type="datetime-local"
              />
              <TextField
                name="trechoIda"
                label="Trecho (ida)"
                placeholder="Ex.: BSB-CNF"
              />
              <TextField
                name="numeroVooIda"
                label="Número do voo (ida)"
                placeholder="Ex.: G3-1234"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mr-1 ml-1 mt-4">
              <TextField
                name="dataPassagemVolta"
                label="Data da passagem (volta)"
                type="date"
              />
              <TextField
                name="companhiaVolta"
                label="Companhia (volta)"
                placeholder="Ex.: LATAM"
              />
              <TextField
                name="dataHoraVooVolta"
                label="Data e hora do voo (volta)"
                type="datetime-local"
              />
              <TextField
                name="trechoVolta"
                label="Trecho (volta)"
                placeholder="Ex.: CNF-BSB"
              />
              <TextField
                name="numeroVooVolta"
                label="Número do voo (volta)"
                placeholder="Ex.: LA-5678"
              />
            </div>
          </CustomCollapse>
        )}

        <div className="flex items-center justify-end border-t border-gray-200 pt-4">
          <ButtonSave loading={isSubmitting} type="submit" />
        </div>
      </form>
    </FormProvider>
  );
}
