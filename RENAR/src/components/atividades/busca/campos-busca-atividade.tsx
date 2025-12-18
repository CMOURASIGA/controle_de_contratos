import { BuscaContainer } from "@/components/layouts/busca-container";
import { ButtonSearch } from "@/components/layouts/ui/buttons/button-search/button-search";
import { DateField } from "@/components/layouts/ui/fields/date-field/date-field";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import { SelectFieldRepresentante } from "@/components/shared/select-field-representante";
import { SelectFieldRepresentacao } from "@/components/shared/select-field-representacao";
import { FiltrosAtividadesProps } from "@/types/atividade.type";
import { Collapsible, CollapsibleContent, CollapsibleTrigger, Combobox } from "@cnc-ti/layout-basic";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

interface CamposBuscaAtividadesProps {
  filtros?: FiltrosAtividadesProps;
  enviarFiltros: (filtros: Partial<FiltrosAtividadesProps>) => void;
  loading: boolean;
}

const opcoesStatusAtividade = [
  { label: "Novo", value: "0" },
  { label: "Validado", value: "1" },
  { label: "Cancelado", value: "2" },
  { label: "Cancelado/Validado", value: "3" },
];

type FormFiltrosAtividades = {
  idRepresentante?: string;
  idRepresentacao?: string;
  idTipoAtividade?: number;
  statusAtividade?: string;
  descricaoAtividade?: string;
  dataInicioAtividade?: Date;
  dataFimAtividade?: Date;
};

export default function CamposBuscaAtividades({
  filtros,
  enviarFiltros,
  loading,
}: CamposBuscaAtividadesProps) {
  const [mostrarAvancados, setMostrarAvancados] = useState(false);
  const isUpdatingFromWatch = useRef(false);

  const methods = useForm<FormFiltrosAtividades>({
    defaultValues: {
      idRepresentante: filtros?.idRepresentante?.toString(),
      idRepresentacao: filtros?.idRepresentacao?.toString(),
      statusAtividade:
        filtros?.statusAtividade !== undefined ? String(filtros.statusAtividade) : undefined,
      dataInicioAtividade: filtros?.dataInicioAtividade,
      dataFimAtividade: filtros?.dataFimAtividade,
      descricaoAtividade: filtros?.descricaoAtividade,
    },
  });

  useEffect(() => {
    if (!isUpdatingFromWatch.current) {
      const currentValues = methods.getValues();
      const newValues = {
        idRepresentante: filtros?.idRepresentante?.toString() || "",
        idRepresentacao: filtros?.idRepresentacao?.toString() || "",
        statusAtividade:
          filtros?.statusAtividade !== undefined ? String(filtros.statusAtividade) : undefined,
        dataInicioAtividade: filtros?.dataInicioAtividade ?? undefined,
        dataFimAtividade: filtros?.dataFimAtividade ?? undefined,
        descricaoAtividade: filtros?.descricaoAtividade ?? "",
      };

      const hasChanges =
        currentValues.idRepresentante !== newValues.idRepresentante ||
        currentValues.idRepresentacao !== newValues.idRepresentacao ||
        currentValues.statusAtividade !== newValues.statusAtividade ||
        currentValues.descricaoAtividade !== newValues.descricaoAtividade ||
        currentValues.dataInicioAtividade?.getTime() !== newValues.dataInicioAtividade?.getTime() ||
        currentValues.dataFimAtividade?.getTime() !== newValues.dataFimAtividade?.getTime();

      if (hasChanges) {
        methods.reset(newValues);
      }
    }
    isUpdatingFromWatch.current = false;
  }, [filtros, methods]);

  const onSubmit = (formData: FormFiltrosAtividades) => {
    isUpdatingFromWatch.current = true;

    const valoresAtuais = methods.getValues();
    const dadosParaProcessar = formData.idRepresentante ? formData : { ...formData, idRepresentante: valoresAtuais.idRepresentante };

    const filtrosPreparados: Partial<FiltrosAtividadesProps> = {};

    if (formData.idRepresentacao && formData.idRepresentacao.trim() !== "") {
      const valor = Number(formData.idRepresentacao);
      if (!Number.isNaN(valor) && valor > 0) {
        filtrosPreparados.idRepresentacao = valor;
      }
    }

    const idRepresentanteParaProcessar = dadosParaProcessar.idRepresentante || valoresAtuais.idRepresentante;
    if (idRepresentanteParaProcessar && String(idRepresentanteParaProcessar).trim() !== "") {
      const valor = Number(idRepresentanteParaProcessar);
      if (!Number.isNaN(valor) && valor > 0) {
        filtrosPreparados.idRepresentante = valor;
      }
    }

    if (formData.statusAtividade !== undefined && formData.statusAtividade !== null && formData.statusAtividade !== "") {
      const valor = Number(formData.statusAtividade);
      if (!Number.isNaN(valor)) {
        filtrosPreparados.statusAtividade = valor;
      }
    }

    if (formData.dataInicioAtividade) {
      filtrosPreparados.dataInicioAtividade = formData.dataInicioAtividade;
    }

    if (formData.dataFimAtividade) {
      filtrosPreparados.dataFimAtividade = formData.dataFimAtividade;
    }

    if (formData.descricaoAtividade?.trim()) {
      filtrosPreparados.descricaoAtividade = formData.descricaoAtividade.trim();
    }

    enviarFiltros(filtrosPreparados);

    setTimeout(() => {
      isUpdatingFromWatch.current = false;
    }, 500);
  };

  return (
    <BuscaContainer>
      <div className="flex justify-content-between">
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="w-full"
            aria-label="Filtros de busca de mandatos"
          >
            <Collapsible
              open={mostrarAvancados}
              onOpenChange={setMostrarAvancados}
              className="flex flex-col gap-4 w-full"
            >
              <div className="grid grid-cols-1 xl:grid-cols-[repeat(5,minmax(0,1fr))] gap-4 w-full items-end">

                <SelectFieldRepresentante
                  name="idRepresentante"
                  label="Representante"
                  placeholder="Buscar representante"
                  value={filtros?.idRepresentante}
                />

                <SelectFieldRepresentacao
                  name="idRepresentacao"
                  label="Representação"
                  placeholder="Buscar representação"
                  value={filtros?.idRepresentacao}
                />

                <TextField
                  name="descricaoAtividade"
                  label="Descrição da atividade"
                  placeholder="Descrição da atividade"
                  inputMode="text"
                />

                <Controller
                  name="statusAtividade"
                  render={({ field }) => (
                    <div>
                      <label className="text-sm block mb-1 font-medium text-gray-600">
                        Status
                      </label>
                      <Combobox
                        placeholder="Selecione um status"
                        options={opcoesStatusAtividade}
                        command={{
                          placeholder: "Pesquisar tipo",
                          emptyMessage: "Nenhum tipo encontrado",
                        }}
                        value={field.value || ""}
                        onChange={(value) =>
                          field.onChange(value ? value : "")
                        }
                      />
                    </div>
                  )}
                />

                <div className="flex items-end justify-end gap-2">
                  <CollapsibleTrigger asChild>
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label={
                        mostrarAvancados
                          ? "Ocultar filtros avançados"
                          : "Mostrar filtros avançados"
                      }
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${mostrarAvancados ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                  </CollapsibleTrigger>
                  <ButtonSearch
                    loading={loading}
                    aria-label="Buscar atividades"
                    className="h-10"
                  />
                </div>
              </div>

              <CollapsibleContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full border-t pt-4">
                  <DateField name="dataInicioAtividade" label="Data início" />
                  <DateField name="dataFimAtividade" label="Data fim" />
                </div>
              </CollapsibleContent>

            </Collapsible>


          </form>

        </FormProvider>
      </div>

    </BuscaContainer>
  )
}