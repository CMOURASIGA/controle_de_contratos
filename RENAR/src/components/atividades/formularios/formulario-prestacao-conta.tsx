import { ButtonSave } from "@/components/layouts/ui/buttons/button-save/button-save";
import CustomCollapse from "@/components/layouts/ui/collapse";
import { DateField } from "@/components/layouts/ui/fields/date-field/date-field";
import { SelectField } from "@/components/layouts/ui/fields/select-field/select-field";
import { TextAreaField } from "@/components/layouts/ui/fields/text-area-field";
import {
  formatCurrency,
  TextField,
} from "@/components/layouts/ui/fields/text-field/text-field";
import { useConsultarPrestacaoContas } from "@/hooks/atividades/use-consultar-prestacao-contas";
import { useSetores } from "@/hooks/dominios/use-setores";
import { criarPrestacaoContas } from "@/services/atividades.service";
import { formatDateToYYYYMMDD } from "@/utils/generate-format-date";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";

const PrestacaoContaSchema = z
  .object({
    // Dados Prestação
    setor: z.string("Selecine um setor"),
    trecho: z.string("Informe o local"),
    bilhete: z.string("Informe a numeração do bilhete"),
    diaria: z.string("Informe o valor referente a diária"),
    quantidadeDias: z.string("Informe a quantidade de dias"),
    totalDiarias: z.string().optional(),
    observacao: z.string().optional(),

    // Período do Traslado
    inicioTraslado: z.string("Informe a data de início do traslado"),
    fimTraslado: z.string("Informe a data fim do traslado"),

    // Base para Prestação
    despesasComprovada: z.string("Informe o valor das Despensas"),
    despesasNaoComprovada: z.string("Informe o valor das Despensas"),
    outrasDespesasComprovada: z.string("Informe o valor das Despensas"),
    despesasTransporte: z.string("Informe o valor das Despensas"),
    adiantamento: z.string("Informe o valor do adiantamento"),

    subtotalDespesas: z.string().default("0"),
    totalDespesas: z.string().default("0"),
    subtotalReembolsadoDespesas: z.string().default("0"),
    totalSaldo: z.string().default("0"),
  })
  .superRefine((data, ctx) => {
    if (
      data.inicioTraslado &&
      data.fimTraslado &&
      new Date(data.fimTraslado) <= new Date(data.inicioTraslado)
    ) {
      ctx.addIssue({
        path: ["fimTraslado"],
        code: z.ZodIssueCode.custom,
        message: "A data de fim deve ser maior que a data de início.",
      });
    }
  });
export type PrestacaoContasFormData = z.infer<typeof PrestacaoContaSchema>;

export function FormularioPrestacaoContas({ id }: { id: number }) {
  const { prestacaoContasSelected } = useConsultarPrestacaoContas(id);
  const { opcoesSetores } = useSetores();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const methods = useForm({
    resolver: zodResolver(PrestacaoContaSchema),
  });

  const { watch } = methods;
  const quantidadeDias = watch("quantidadeDias");
  const valorDiaria = watch("diaria");
  const despesasComprovadas = watch("despesasComprovada");
  const despesasNaoComprovadas = watch("despesasNaoComprovada");
  const subTotal = watch("subtotalDespesas");
  const outrasDespesas = watch("outrasDespesasComprovada");
  const despesasTransporte = watch("despesasTransporte");
  const adiantamento = watch("adiantamento");
  const totaDespesas = watch("totalDespesas");

  useEffect(() => {
    if (quantidadeDias && valorDiaria) {
      const onlyNumbers = Number(valorDiaria.replace(/\D/g, ""));
      const total = +quantidadeDias * onlyNumbers;
      methods.setValue("totalDiarias", formatCurrency(total.toString()));
    } else {
      methods.setValue("totalDiarias", formatCurrency("0"));
    }
  }, [quantidadeDias, valorDiaria]);

  useEffect(() => {
    const total =
      Number(despesasComprovadas?.replace(/\D/g, "") || 0) +
      Number(despesasNaoComprovadas?.replace(/\D/g, "") || 0);

    methods.setValue("subtotalDespesas", formatCurrency(total.toString()));
  }, [despesasComprovadas, despesasNaoComprovadas]);

  useEffect(() => {
    const totalReembolsado =
      Number(outrasDespesas?.replace(/\D/g, "") || 0) +
      Number(despesasTransporte?.replace(/\D/g, "") || 0);

    const total = totalReembolsado + Number(subTotal?.replace(/\D/g, "") || 0);
    methods.setValue("totalDespesas", formatCurrency(total.toString()));
    methods.setValue(
      "subtotalReembolsadoDespesas",
      formatCurrency(totalReembolsado.toString())
    );
  }, [subTotal, outrasDespesas, despesasTransporte]);

  useEffect(() => {
    const totalSaldo =
      Number(totaDespesas?.replace(/\D/g, "") || 0) -
      Number(adiantamento?.replace(/\D/g, "") || 0);
    methods.setValue("totalSaldo", formatCurrency(totalSaldo.toString()));
  }, [adiantamento]);

  useEffect(() => {
    if (!prestacaoContasSelected) return;

    methods.reset({
      adiantamento: prestacaoContasSelected.valorAdiantamento || "",
      bilhete: prestacaoContasSelected.numeroBilhete || "",
      despesasComprovada: prestacaoContasSelected.despesasComprovadas || "",
      despesasNaoComprovada:
        prestacaoContasSelected.despesasNaoComprovadas || "",
      despesasTransporte: prestacaoContasSelected.despesasLocomocao || "",
      outrasDespesasComprovada: prestacaoContasSelected.despesasExtras || "",
      diaria: prestacaoContasSelected.valorDiaria || "",
      inicioTraslado: formatDateToYYYYMMDD(
        prestacaoContasSelected.dataInicioViagem
      ),
      fimTraslado: formatDateToYYYYMMDD(prestacaoContasSelected.dataFimViagem),
      observacao: prestacaoContasSelected.observacao || "",
      quantidadeDias: prestacaoContasSelected.quantidadeDias?.toString() || "",
      setor: prestacaoContasSelected.nomeSetor || "",
      trecho: prestacaoContasSelected.trechoViagem || "",
    });
  }, [prestacaoContasSelected, methods]);

  const onSubmit = async (values: PrestacaoContasFormData) => {
    console.log(values);

    setIsSubmitting(true);
    await criarPrestacaoContas(id, values)
      .then(() => {
        Swal.fire({
          text: "Prestação de Contas criada com sucesso",
          icon: "success",
          width: 480,
          timer: 1600,
          showConfirmButton: false,
        });
      })
      .catch(() => {
        Swal.fire({
          text: "Erro ao criar a prestação de Contas",
          icon: "error",
          width: 480,
          timer: 1600,
          showConfirmButton: true,
        });
      })
      .finally(() => setIsSubmitting(false));
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
              Dados Prestação de Conta
            </h2>
          }
          defaultActive
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mr-1 ml-1 mb-4">
            <SelectField
              options={opcoesSetores}
              id="field-id-setor"
              name="setor"
              label="Setor"
              placeholder="Selecione um setor"
              required
            />

            <TextField
              id="field-trecho"
              name="trecho"
              label="Trecho/Cidade"
              placeholder="Informe o local"
              required
            />
            <TextField
              id="field-bilhete"
              name="bilhete"
              label="Bilhete Áereo"
              placeholder="Informe o número do bilhete"
              required
            />
            <TextField
              id="field-valor-diaria"
              name="diaria"
              label="Valor Diária"
              type="money"
              placeholder="Informe o valor da diária"
              required
            />
            <TextField
              id="field-quantidade-dias"
              name="quantidadeDias"
              label="Quantidade de Dias"
              placeholder="Informe o número de dias"
              required
            />
            <TextField
              id="field-total-diarias"
              name="totalDiarias"
              label="Valor Total (Diárias)"
              type="money"
              className="bg-gray-300"
              disabled
            />
          </div>
          <TextAreaField
            name="observacao"
            label="Observações"
            placeholder="Descreva as observações"
          />
        </CustomCollapse>

        <CustomCollapse
          title={
            <h2 className="text-2xl font-bold cnc-text-brand-blue-600 my-4">
              Período do Traslado
            </h2>
          }
          defaultActive
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mr-1 ml-1">
            <DateField
              name="inicioTraslado"
              label="Início"
              id="field-inicio-data-traslado"
              required
            />
            <DateField
              name="fimTraslado"
              label="Fim"
              id="field-fim-data-traslado"
              required
            />
          </div>
        </CustomCollapse>

        <CustomCollapse
          title={
            <h2 className="text-2xl font-bold cnc-text-brand-blue-600 my-4">
              Base para Prestação de Contas
            </h2>
          }
          defaultActive
        >
          <div className="grid grid-cols-2 gap-4 mr-2 ml-1">
            <div className="flex flex-col gap-y-6">
              <TextField
                id="field-despesa-comprovada"
                name="despesasComprovada"
                label="Despesa Comprovada com hospedagem, alimentação, etc"
                type="money"
                placeholder="Informe o valor das despesa comprovada"
                required
              />
              <TextField
                id="field-despesa-nao-comprovada"
                name="despesasNaoComprovada"
                label="Despesa Não Comprovadas"
                type="money"
                placeholder="Informe o valor das despesa não comprovada"
                required
              />
              <TextField
                id="field-outras-comprovada"
                name="outrasDespesasComprovada"
                label="Outras Despesas Comprovadas (Reembolsáveis)"
                type="money"
                placeholder="Informe o valor das outras despesa"
                required
              />
              <TextField
                id="field-despesas-transporte"
                name="despesasTransporte"
                label="Táxi (embarque/desembarque)"
                type="money"
                placeholder="Informe o valor das despesas de transporte"
                required
              />
              <TextField
                id="field-adiantamento"
                name="adiantamento"
                label="Adiantamento Recebido"
                type="money"
                placeholder="Informe o valor do adiantamento recebido"
                required
              />
            </div>

            <div className="flex flex-col gap-y-6">
              <TextField
                id="field-subtotal-despesa"
                name="subtotalDespesas"
                label="Sub Total Despesas (Comprovadas + Não Comprovadas)"
                type="money"
                className="bg-gray-300"
                disabled
              />
              <TextField
                id="field-subtotal-reembolsado-despesa"
                name="subtotalReembolsadoDespesas"
                label="Sub Total Reembolsado (Outras + Transporte)"
                type="money"
                className="bg-gray-300"
                disabled
              />

              <TextField
                id="field-total-despesa"
                name="totalDespesas"
                label="Total de Despesas"
                type="money"
                className="bg-gray-300"
                disabled
              />
              <TextField
                id="field-saldo"
                name="totalSaldo"
                label="Saldo"
                type="money"
                className="bg-gray-300"
                disabled
              />
            </div>
          </div>
        </CustomCollapse>

        <div className="flex items-center justify-end border-t border-gray-200 pt-4">
          <ButtonSave loading={isSubmitting} type="submit" />
        </div>
      </form>
    </FormProvider>
  );
}
