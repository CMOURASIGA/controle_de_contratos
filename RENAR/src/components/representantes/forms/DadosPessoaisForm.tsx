import { ButtonOutline } from "@/components/layouts/ui/buttons/button-outline/button-outline";
import CustomCollapse from "@/components/layouts/ui/collapse";
import { RadioField } from "@/components/layouts/ui/fields/radio-field/radio-field";
import { SelectField } from "@/components/layouts/ui/fields/select-field/select-field";
import { TextField } from "@/components/layouts/ui/fields/text-field/text-field";
import { PlusIcon } from "@/components/layouts/ui/icons/plus";

import { ButtonSave } from "@/components/layouts/ui/buttons/button-save/button-save";
import { TextAreaField } from "@/components/layouts/ui/fields/text-area-field";
import ImgUpload from "@/components/layouts/ui/fields/upload-file/img-field";
import Label from "@/components/layouts/ui/label/label";
import Table from "@/components/layouts/ui/table/table";
import { useFormRepresentantes } from "@/hooks/representantes/use-form-representantes";
import { formatarCpf, formatarRg } from "@/utils";
import { formatDateToDDMMYYYY } from "@/utils/generate-format-date";
import { useMemo } from "react";
import { FormProvider } from "react-hook-form";
import { DadosPessoaisFormSkeleton } from "./dados-pessoais-form-skeleton";

export function DadosPessoaisForm() {
  const {
    representanteSelected,
    representanteId,
    isLoading,
    methods,
    onSubmit,
    setFoto,
    opcoesPaises,
    isBrasilResidencial,
    ufsOptions,
    cidadesOptionsResidencial,
    isBrasilComercial,
    cidadesOptionsComercial,
    addContact,
    dataContacts,
    columns,
    getOpcoesContatoDisponiveis,
    isSubmitting,
    buscarCepResidencial,
    buscarCepComercial,
    formatarCep,
    isLoadingCepResidencial,
    isLoadingCepComercial,
    errorCepResidencial,
    errorCepComercial,
    opcoesCategorias,
    opcoesPronomes,
    opcoesEntidades,
  } = useFormRepresentantes();

  const dataEmissaoOrgao = representanteSelected?.dataEmissaoOrgao
    ? formatDateToDDMMYYYY(representanteSelected.dataEmissaoOrgao)
    : "Não informado";
  const orgaoEmissor = representanteSelected?.orgaoEmissor
    ? representanteSelected.orgaoEmissor
    : "Não informado";

  const rg = representanteSelected?.rg
    ? formatarRg(representanteSelected.rg)
    : "Não informado";
  // const cpf = representanteSelected?.cpf
  //   ? formatarCpf(representanteSelected.cpf)
  //   : "Não informado";
  const profissao = representanteSelected?.profissao?.descricaoProfissao
    ? representanteSelected.profissao.descricaoProfissao
    : "Profissão não informada";
  const naturalidade = representanteSelected?.naturalidade
    ? representanteSelected.naturalidade
    : "Não informado";
  const dataNascimento = representanteSelected?.dataNascimento
    ? formatDateToDDMMYYYY(representanteSelected.dataNascimento)
    : "Não informado";

  const urlFoto = useMemo(
    () =>
      `${process.env.NEXT_PUBLIC_API_URL}/representantes/${representanteId}/foto`,
    [representanteId]
  );

  if (isLoading) return <DadosPessoaisFormSkeleton />;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        aria-describedby="dados-pessoais-form"
      >
        <div className="bg-white rounded-lg py-6">
          <div className="flex flex-col lg:flex-row items-center gap-6 justify-between">
            {/* Avatar e Informações Principais */}
            <div className="flex items-center gap-4">
              <ImgUpload onChange={(file) => setFoto(file)} urlfoto={urlFoto} />
              <div className="flex-1 space-y-2">
                <h1 className="text-2xl font-bold text-[#004c99] leading-tight">
                  {representanteSelected?.nome}
                </h1>

                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    {profissao}
                  </span>
                </div>
              </div>
            </div>
            <div className="h-px w-full bg-slate-100 lg:sr-only" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Label label="Identidade" value={rg} />
          <Label label="Data de Emissão" value={dataEmissaoOrgao} />
          <Label label="Órgão Emissor" value={orgaoEmissor} />
          <Label label="Data de Nascimento" value={dataNascimento} />
          {/* <Label
          label="NIS"
          value={representanteSelected.nis}
        /> */}
          <Label label="Naturalidade" value={naturalidade} />
        </div>

        {/* Situação do Representante */}
        <div className="my-6">
          <fieldset className="border border-gray-200 rounded-lg p-4">
            <legend className="text-lg font-semibold text-gray-700 px-2">
              Situação do Representante
            </legend>
            <p className="text-sm text-gray-600 mb-4">
              Defina se o representante está ativo ou inativo no sistema.
            </p>
            <div className="flex gap-6">
              <div>
                <RadioField name="ativo" label="Ativo" value="true" />
              </div>
              <div>
                <RadioField name="ativo" label="Inativo" value="false" />
              </div>
            </div>
          </fieldset>
        </div>

        <CustomCollapse
          title={
            <h1 className="text-2xl font-bold cnc-text-brand-blue-600 my-4">
              Endereços
            </h1>
          }
          defaultActive
        >
          {/* Seleção de Endereço Preferencial */}
          <div className="mb-6">
            <fieldset className="border border-gray-200 rounded-lg p-4">
              <legend className="text-lg font-semibold text-gray-700 px-2">
                Endereço Preferencial
              </legend>
              <p className="text-sm text-gray-600 mb-4">
                Selecione qual endereço deve ser considerado como principal para
                correspondências e contatos.
              </p>
              <div className="flex gap-4">
                <div>
                  <RadioField
                    name="statusEndereco"
                    label="Residencial"
                    value="R"
                  />
                </div>
                <div>
                  <RadioField
                    name="statusEndereco"
                    label="Comercial"
                    value="C"
                  />
                </div>
              </div>
            </fieldset>
          </div>

          {/* Endereço Residencial */}
          <div className="mb-8 mr-1 ml-1">
            <div className="mb-4 pb-2 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700">
                Endereço Residencial
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="cnc-w-full">
                <label className="text-sm block mb-1 font-medium text-gray-600">
                  CEP
                  {isBrasilResidencial && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <div className="relative">
                  <TextField
                    name="enderecoCepResidencial"
                    placeholder="CEP"
                    id="field-cep-residencial"
                    onChange={(e) => {
                      const cep = e.target.value;
                      const cepFormatado = formatarCep(cep);
                      methods.setValue("enderecoCepResidencial", cepFormatado);
                    }}
                    onBlur={(e) => {
                      const cep = e.target.value;
                      buscarCepResidencial(cep);
                    }}
                  />
                  {isLoadingCepResidencial && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2  border-t-blue-600"></div>
                    </div>
                  )}
                </div>
                {errorCepResidencial && (
                  <p className="text-red-500 text-xs mt-1">
                    CEP não encontrado
                  </p>
                )}
              </div>
              <div className="cnc-w-full">
                <label className="text-sm block mb-1 font-medium text-gray-600">
                  País<span className="text-red-500">*</span>
                </label>
                <SelectField
                  options={opcoesPaises}
                  name="idPaisResidencial"
                  placeholder="País"
                  disabled={isLoadingCepResidencial}
                />
              </div>

              <div className="cnc-w-full">
                <label className="text-sm block mb-1 font-medium text-gray-600">
                  UF
                  {isBrasilResidencial && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <SelectField
                  options={ufsOptions}
                  name="idUfResidencial"
                  placeholder="UF"
                  disabled={isLoadingCepResidencial}
                />
              </div>

              <div className="cnc-w-full">
                <label className="text-sm block mb-1 font-medium text-gray-600">
                  Cidade
                  {isBrasilResidencial && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <SelectField
                  options={cidadesOptionsResidencial}
                  name="enderecoCidadeResidencial"
                  placeholder="Cidade"
                  disabled={isLoadingCepResidencial}
                />
              </div>

              <div className="cnc-w-full">
                <label className="text-sm block mb-1 font-medium text-gray-600">
                  Bairro
                  {isBrasilResidencial && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <TextField
                  name="enderecoBairroResidencial"
                  placeholder="Bairro"
                  id="field-bairro-residencial"
                  disabled={isLoadingCepResidencial}
                />
              </div>

              <div className="cnc-w-full">
                <label className="text-sm block mb-1 font-medium text-gray-600">
                  Logradouro
                  {isBrasilResidencial && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <TextField
                  name="enderecoLogradouroResidencial"
                  placeholder="Logradouro"
                  id="field-logradouro-residencial"
                  disabled={isLoadingCepResidencial}
                />
              </div>

              <div className="cnc-w-full">
                <label className="text-sm block mb-1 font-medium text-gray-600">
                  Complemento
                </label>
                <TextField
                  name="enderecoComplementoResidencial"
                  placeholder="Complemento"
                  id="field-complemento-residencial"
                  disabled={isLoadingCepResidencial}
                />
              </div>

              <div className="cnc-w-full">
                <label className="text-sm block mb-1 font-medium text-gray-600">
                  Número
                  {isBrasilResidencial && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <TextField
                  name="enderecoNumeroResidencial"
                  placeholder="Número"
                  id="field-numero-residencial"
                  disabled={isLoadingCepResidencial}
                />
              </div>
            </div>
          </div>

          {/* Endereço Comercial */}
          <div className="mb-4 mr-1 ml-1">
            <div className="mb-4 pb-2 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700">
                Endereço Comercial
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="cnc-w-full">
                <label className="text-sm block mb-1 font-medium text-gray-600">
                  CEP
                  {isBrasilComercial && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <TextField
                    name="enderecoCepComercial"
                    placeholder="CEP"
                    id="field-cep-comercial"
                    onChange={(e) => {
                      const cep = e.target.value;
                      const cepFormatado = formatarCep(cep);
                      methods.setValue("enderecoCepComercial", cepFormatado);
                    }}
                    onBlur={(e) => {
                      const cep = e.target.value;
                      buscarCepComercial(cep);
                    }}
                  />
                  {isLoadingCepComercial && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2  border-t-blue-600"></div>
                    </div>
                  )}
                </div>
                {errorCepComercial && (
                  <p className="text-red-500 text-xs mt-1">
                    CEP não encontrado
                  </p>
                )}
              </div>

              <div className="cnc-w-full">
                <label className="text-sm block mb-1 font-medium text-gray-600">
                  País<span className="text-red-500">*</span>
                </label>
                <SelectField
                  options={opcoesPaises}
                  name="idPaisComercial"
                  placeholder="País"
                  disabled={isLoadingCepComercial}
                />
              </div>

              <div className="cnc-w-full">
                <label className="text-sm block mb-1 font-medium text-gray-600">
                  UF
                  {isBrasilComercial && <span className="text-red-500">*</span>}
                </label>
                <SelectField
                  options={ufsOptions}
                  name="idUfComercial"
                  placeholder="UF"
                  disabled={isLoadingCepComercial}
                />
              </div>

              <div className="cnc-w-full">
                <label className="text-sm block mb-1 font-medium text-gray-600">
                  Cidade
                  {isBrasilComercial && <span className="text-red-500">*</span>}
                </label>
                <SelectField
                  options={cidadesOptionsComercial}
                  name="enderecoCidadeComercial"
                  placeholder="Cidade"
                  disabled={isLoadingCepComercial}
                />
              </div>

              <div className="cnc-w-full">
                <label className="text-sm block mb-1 font-medium text-gray-600">
                  Bairro
                  {isBrasilComercial && <span className="text-red-500">*</span>}
                </label>
                <TextField
                  name="enderecoBairroComercial"
                  placeholder="Bairro"
                  id="field-bairro-comercial"
                  disabled={isLoadingCepComercial}
                />
              </div>

              <div className="cnc-w-full">
                <label className="text-sm block mb-1 font-medium text-gray-600">
                  Logradouro
                  {isBrasilComercial && <span className="text-red-500">*</span>}
                </label>
                <TextField
                  name="enderecoLogradouroComercial"
                  placeholder="Logradouro"
                  id="field-logradouro-comercial"
                  disabled={isLoadingCepComercial}
                />
              </div>

              <div className="cnc-w-full">
                <label className="text-sm block mb-1 font-medium text-gray-600">
                  Complemento
                </label>
                <TextField
                  name="enderecoComplementoComercial"
                  placeholder="Complemento"
                  id="field-complemento-comercial"
                  disabled={isLoadingCepComercial}
                />
              </div>

              <div className="cnc-w-full">
                <label className="text-sm block mb-1 font-medium text-gray-600">
                  Número
                  {isBrasilComercial && <span className="text-red-500">*</span>}
                </label>
                <TextField
                  name="enderecoNumeroComercial"
                  placeholder="Número"
                  id="field-numero-comercial"
                  disabled={isLoadingCepComercial}
                />
              </div>
            </div>
          </div>
        </CustomCollapse>

        <div className="border-b border-gray-200 my-4 pb-4" />

        <CustomCollapse
          title={
            <h1 className="text-2xl font-bold cnc-text-brand-blue-600 my-4">
              Outras Informações
            </h1>
          }
          defaultActive
        >
          <div className="grid grid-cols-3 gap-4 my-4 pb-4 mr-1 ml-1">
            <SelectField
              options={opcoesEntidades}
              name="idEntidade"
              label="Entidade"
              placeholder="entidade"
              id="field-entidade"
            />

            <SelectField
              options={opcoesCategorias}
              name="idCategoria"
              label="Categoria"
              placeholder="categoria"
              id="field-categoria"
            />
            <SelectField
              options={opcoesPronomes}
              name="idPronomeTratamento"
              label="Pronome de Tratamento"
              placeholder="pronome de tratamento"
            />
            <TextAreaField
              label="Beneficiario (Seguro Viagem)"
              name="beneficiario"
              placeholder="beneficiario"
              id="field-beneficiario"
            />
          </div>
        </CustomCollapse>

        <CustomCollapse
          title={
            <h1 className="text-2xl font-bold cnc-text-brand-blue-600 my-4">
              Contatos
            </h1>
          }
          defaultActive
        >
          <div className="grid grid-cols-3 gap-4 mb-4">
            <SelectField
              options={getOpcoesContatoDisponiveis}
              name="meio_contato"
              label="Meio de Contato"
              placeholder="Selecione o tipo de contato"
            />

            <TextField
              name="descricao"
              label="Contato"
              placeholder="Contato"
              id="field-descricao"
            />
            <div className="flex items-end">
              <ButtonOutline
                onClick={() => {
                  addContact();
                }}
                aria-label="Adicionar meio de comunicação"
              >
                <PlusIcon /> Adicionar
              </ButtonOutline>
            </div>
          </div>
          <Table data={dataContacts} columns={columns} />
        </CustomCollapse>

        <div className="flex items-center justify-end border-t border-gray-200 pt-4 mt-4">
          <ButtonSave loading={isSubmitting} />
        </div>
      </form>
    </FormProvider>
  );
}
