"use client";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
} from "@/components/layouts/ui/drawer/drawer";
import { DateField } from "@/components/layouts/ui/fields/date-field/date-field";
import { SelectField } from "@/components/layouts/ui/fields/select-field/select-field";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import { useDrawer } from "@/hooks/use-drawer";
import { useQueryString } from "@/hooks/useQueryParams";
import { criarPessoa } from "@/services/pessoas.service";
import { Button } from "@cnc-ti/layout-basic";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import { useEffect, useState } from "react";
import { ButtonSave } from "@/components/layouts/ui/buttons/button-save/button-save";

const dadosPessoaSchema = z.object({
  nome: z.string().optional(),
  cpf: z.string().optional(),
  dataNascimento: z.string().optional(),
  sexo: z.string().optional(),
  formacao: z.string().optional(),
  estadoCivil: z.string().optional(),
  naturalidade: z.string().optional(),
});

export type DadosPessoa = z.infer<typeof dadosPessoaSchema>;

interface DetalhesRepresentacaoProps {
  nomeInicial?: string;
  onCadastroConcluido?: () => void;
}

export function DetalhesRepresentacao({
  nomeInicial = "",
  onCadastroConcluido,
}: DetalhesRepresentacaoProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const methods = useForm<DadosPessoa>({
    resolver: zodResolver(dadosPessoaSchema),
  });
  const { addQueryString } = useQueryString();
  const { closeDrawer, activeDrawer } = useDrawer();

  useEffect(() => {
    if (
      activeDrawer === "criar_pessoa" &&
      nomeInicial &&
      !methods.getValues("nome")
    ) {
      methods.setValue("nome", nomeInicial, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
    }
  }, [activeDrawer, nomeInicial, methods]);

  async function onSubmit(data: DadosPessoa) {
    setIsSubmitting(true);
    const cleanedCpf = data.cpf?.replace(/[^\d]/g, "");
    const pessoaData = { ...data, cpf: cleanedCpf };

    criarPessoa(pessoaData)
      .then((pessoa) => {
        Swal.fire({
          text: "Pessoa criada com sucesso",
          icon: "success",
          width: 500,
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          addQueryString("representanteId", pessoa.idRepresentante);
          closeDrawer();
          onCadastroConcluido?.();
        }, 1500);
        methods.reset();
      })
      .catch(() => {
        Swal.fire({
          text: "Erro ao criar a pessoa",
          icon: "error",
          width: 500,
          showConfirmButton: false,
          timer: 1500,
        });
      }).finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <>
      <Drawer width="900px" id="criar_pessoa" elevateIndex>
        <DrawerHeader>
          <div className="flex flex-row items-center gap-2 justify-center">
            <h3>Criar Pessoa</h3>
          </div>
        </DrawerHeader>
        <DrawerContent>
          <div className="mt-6 mb-10 space-y-10">
            {/* --- INFORMAÇÕES PRINCIPAIS --- */}
            <section>
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                Informações Principais
              </h3>
              <FormProvider {...methods}>
                <form
                  onSubmit={methods.handleSubmit(onSubmit)}
                  aria-describedby="dados-pessoais-form"
                >
                  {/* Endereço Comercial */}
                  <div className="mb-4">
                    <div className="grid grid-cols-3 gap-4">
                      <TextField
                        name="nome"
                        label="Nome"
                        placeholder="Nome"
                        id="field-nome"
                      />

                      <TextField
                        name="cpf"
                        label="CPF"
                        placeholder="Cpf"
                        id="field-cpf"
                      />
                      <DateField
                        name={"dataNascimento"}
                        label="Data de Nascimento"
                        id="field-data-nascimento"
                      />
                      <SelectField
                        label="Sexo"
                        name={"sexo"}
                        options={[
                          { label: "Masculino", value: "M" },
                          { label: "Feminino", value: "F" },
                        ]}
                        modal
                      />
                      <TextField
                        name="formacao"
                        label="Formação"
                        placeholder="Formação"
                        id="field-formacao"
                      />
                      <TextField
                        name="estadoCivil"
                        label="Estado Civil"
                        placeholder="Estado Civil"
                        id="field-estado-civil"
                      />
                      <TextField
                        name="naturalidade"
                        label="Naturalidade"
                        placeholder="Naturalidade"
                        id="field-naturalidade"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end border-t border-gray-200 pt-4 mt-4">
                    <ButtonSave type="submit" loading={isSubmitting} />
                  </div>
                </form>
              </FormProvider>
            </section>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
