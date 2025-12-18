import { ButtonOutline } from "@/components/layouts/ui/buttons/button-outline/button-outline";
import { ButtonSave } from "@/components/layouts/ui/buttons/button-save/button-save";
import { SelectField } from "@/components/layouts/ui/fields/select-field/select-field";
import { TextAreaField } from "@/components/layouts/ui/fields/text-area-field";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import DocsUpload from "@/components/layouts/ui/fields/upload-file/docs-field";
import { PlusIcon } from "@/components/layouts/ui/icons/plus";
import Table from "@/components/layouts/ui/table/table";
import { useProfissoes } from "@/hooks/dominios/use-profissoes";
import useAtuacoes from "@/hooks/use-atuacao";
import { useQueryString } from "@/hooks/useQueryParams";
import { queryClient } from "@/infra/tanStack/ReactQueryWrapper";
import { createDocuments } from "@/services/documentos.service";
import {
  atualizarDadosProfissionaisRepresentante,
  cadastrarDocumentosRepresentante,
} from "@/services/representantes.service";
import { DadosProfissionaisDados } from "@/types/representante-visualizacao";
import { Representante } from "@/types/representante.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";

const dadosProfissionaisSchema = z.object({
  profissaoId: z.string().optional(),
  miniCurriculo: z.string().optional(),
  atuacao: z.string().optional(),
  descricao: z.string().optional(),
});
type DadosProfissionais = z.infer<typeof dadosProfissionaisSchema>;

type Atuacao = {
  atuacao: string;
  descricao: string;
};

export function DadosProfissionaisForm() {
  const [docs, setDocs] = useState<{ file: File; name: string }[]>([]);
  const [dataAtuacao, setDataAtuacao] = useState<Atuacao[]>([]);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const { opcoesProfissoes } = useProfissoes();
  const { atuacoesOptions } = useAtuacoes();
  const { getAllQueryStrings } = useQueryString();
  const { representanteId } = getAllQueryStrings();
  const representanteSelected: Representante | undefined =
    queryClient.getQueryData(["representante", representanteId]);
  const methods = useForm<DadosProfissionais>({
    resolver: zodResolver(dadosProfissionaisSchema),
    defaultValues: {
      profissaoId: String(representanteSelected?.idProfissao),
      miniCurriculo: representanteSelected?.miniCurriculo,
    },
  });
  const columns = [
    {
      title: "Atuações",
      key: "atuacao",
      width: "40%",
    },
    { title: "Descrição", key: "descricao", width: "60%" },
  ];

  function addAtuacao() {
    const atuacao = atuacoesOptions.find(
      (a) => a.value == methods.getValues("atuacao")
    )?.label;
    const descricao = methods.getValues("descricao");
    if (!atuacao || !descricao) return;
    setDataAtuacao([...dataAtuacao, { atuacao: atuacao, descricao }]);
    methods.setValue("atuacao", "");
    methods.setValue("descricao", "");
  }

  useEffect(() => {
    if (!representanteSelected) return;
    methods.setValue(
      "profissaoId",
      String(representanteSelected?.idProfissao || 0)
    );
    methods.setValue(
      "miniCurriculo",
      representanteSelected?.miniCurriculo
        ? String(representanteSelected?.miniCurriculo)
        : ""
    );

    const AtuacoesArray: Atuacao[] = [];
    // Adicionar Atuações
    representanteSelected.atuacoes?.map((atuacao) => {
      AtuacoesArray.push({
        atuacao: atuacao.atuacao,
        descricao: atuacao.descricao,
      });
    });

    setDataAtuacao(AtuacoesArray);
  }, [representanteSelected]);

  async function onSubmit(data: DadosProfissionais) {
    const dataAtuacaoFormatado = dataAtuacao.map((a) => {
      return {
        tipo: atuacoesOptions.find((b) => b.label == a.atuacao)?.value || "",
        descricao: a.descricao,
      };
    });
    const payload: DadosProfissionaisDados = {
      atuacoes: dataAtuacaoFormatado,
      ...data,
    };
    setIsloading(true);
    atualizarDadosProfissionaisRepresentante(representanteId, payload)
      .then(async () => {
        if (docs.length > 0) {
          await createDocuments(
            docs.filter((doc) => doc.file != undefined).map((doc) => doc.file)
          )
            .then(async () => {
              if (representanteSelected?.id) {
                const dados = { files: docs.map((doc) => doc.name) };
                await cadastrarDocumentosRepresentante(
                  representanteSelected.id,
                  dados
                );
              }
            })
            .catch(() => {
              Swal.fire({
                text: "Erro ao anexar documentos",
                icon: "error",
                width: 500,
                showConfirmButton: false,
                timer: 1500,
              });
            });
        }
        Swal.fire({
          text: "Representante criado com sucesso",
          icon: "success",
          width: 500,
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch(() => {
        Swal.fire({
          text: "Erro ao criar representante",
          icon: "error",
          width: 500,
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .finally(() => setIsloading(false));
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        aria-describedby="dados-profissionais-form"
      >
        <div className="grid grid-cols-1 gap-4 mb-4">
          <SelectField
            options={opcoesProfissoes}
            name="profissaoId"
            label="Profissão"
            placeholder="profissão"
          />
          <TextAreaField
            label="Mini Currículo"
            name="miniCurriculo"
            placeholder="Descrição do currículo"
            id="field-mini-curriculo"
            rows={4}
          />

          <DocsUpload
            onChange={(files) => setDocs(files)}
            initialFiles={representanteSelected?.documentos?.map(
              (doc) => doc.nome
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <SelectField
            options={atuacoesOptions}
            name="atuacao"
            label="Atuações"
            placeholder="Atuações"
          />

          <TextField
            name="descricao"
            label="Descrição"
            placeholder="Descrição"
            id="field-descricao"
          />
          <div className="flex items-end">
            <ButtonOutline
              onClick={() => {
                addAtuacao();
              }}
              aria-label="Adicionar meio de comunicação"
            >
              <PlusIcon /> Adicionar
            </ButtonOutline>
          </div>
        </div>
        <Table data={dataAtuacao} columns={columns} />

        <div className="flex items-center justify-end border-t border-gray-200 pt-4 mt-4">
          <ButtonSave loading={isLoading} />
        </div>
      </form>
    </FormProvider>
  );
}
