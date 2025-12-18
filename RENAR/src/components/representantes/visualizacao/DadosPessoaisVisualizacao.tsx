"use client";

import { Avatar } from "@/components/layouts/ui/avatar";
import CustomCollapse from "@/components/layouts/ui/collapse";
import Label from "@/components/layouts/ui/label/label";
import { usePaises } from "@/hooks/dominios/use-paises";
import { useUfs } from "@/hooks/dominios/use-ufs";
import { DadosRepresentanteCompletos } from "@/types/representante-visualizacao";
import { formatarRg } from "@/utils";
import { formatDateToDDMMYYYY } from "@/utils/generate-format-date";
import { useMemo } from "react";

interface Contact {
  meio_contato: string;
  descricao: string;
  [key: string]: string | number | React.ReactNode;
}

export function DadosPessoaisVisualizacao({
  representanteSelected,
}: {
  representanteSelected?: DadosRepresentanteCompletos | null;
  isLoading: boolean;
}) {
  //const { representanteSelected } = useRepresentantes();
  const { ufs } = useUfs();
  const { paises } = usePaises();

  // Dados de contatos baseados nos dados reais do representante
  const contatos: Contact[] = useMemo(() => {
    if (!representanteSelected) return [];

    const contatosArray: Contact[] = [];

    // Adicionar emails
    if (representanteSelected.email1?.trim()) {
      contatosArray.push({
        meio_contato: "E-mail Principal",
        descricao: representanteSelected.email1.trim(),
      });
    }

    if (representanteSelected.email2?.trim()) {
      contatosArray.push({
        meio_contato: "E-mail Secundário",
        descricao: representanteSelected.email2.trim(),
      });
    }

    if (representanteSelected.email3?.trim()) {
      contatosArray.push({
        meio_contato: "E-mail Terciário",
        descricao: representanteSelected.email3.trim(),
      });
    }

    // Adicionar telefones
    if (representanteSelected.telefoneComplementar?.trim()) {
      contatosArray.push({
        meio_contato: "Telefone Complementar",
        descricao: representanteSelected.telefoneComplementar.trim(),
      });
    }

    if (representanteSelected.telefoneResidencial?.trim()) {
      contatosArray.push({
        meio_contato: "Telefone Residencial",
        descricao: representanteSelected.telefoneResidencial.trim(),
      });
    }

    return contatosArray;
  }, [representanteSelected]);

  // Função para obter o nome da UF pelo ID
  const obterNomeUfPorId = (idUf: number) => {
    if (!ufs || !idUf) return null;
    const uf = ufs.find((u) => u.id === idUf);
    return uf ? `${uf.nome} (${uf.sigla})` : null;
  };

  // Função para obter o nome do país pelo ID
  const obterNomePais = (idPais: number) => {
    if (!paises || !idPais) return null;
    const pais = paises.find((p) => p.id === idPais);
    return pais?.nome || null;
  };

  if (!representanteSelected) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-600">
          Nenhum representante selecionado para visualização.
        </p>
      </div>
    );
  }

  const dataEmissaoOrgao = representanteSelected.dataEmissaoOrgao
    ? formatDateToDDMMYYYY(representanteSelected.dataEmissaoOrgao)
    : "Não informado";
  const orgaoEmissor = representanteSelected.orgaoEmissor
    ? representanteSelected.orgaoEmissor
    : "Não informado";
  const profissao = representanteSelected.profissao?.descricaoProfissao
    ? representanteSelected.profissao.descricaoProfissao
    : "Profissão não informada";
  const rg = representanteSelected.rg
    ? formatarRg(representanteSelected.rg)
    : "Não informado";
  // const cpf = representanteSelected.cpf
  //   ? formatarCpf(representanteSelected.cpf)
  //   : "Não informado";
  const naturalidade = representanteSelected.naturalidade
    ? representanteSelected.naturalidade
    : "Não informado";
  const dataNascimento = representanteSelected.dataNascimento
    ? formatDateToDDMMYYYY(representanteSelected.dataNascimento)
    : "Não informado";
  const urlFoto = `${process.env.NEXT_PUBLIC_API_URL}/representantes/${representanteSelected.id}/foto`;
  return (
    <div className="mt-6 space-y-6">
      {/* Cabeçalho do Representante - Layout Melhorado */}
      <div className="bg-white rounded-lg py-6">
        <div className="flex flex-col lg:flex-row items-center gap-6 justify-between">
          {/* Avatar e Informações Principais */}
          <div className="flex items-center gap-4">
            <Avatar
              tamanho="grande"
              textoAlternativo={representanteSelected.nome}
              urlFoto={urlFoto}
            />
            <div className="flex-1 space-y-2">
              <h1 className="text-2xl font-bold text-[#004c99] leading-tight">
                {representanteSelected.nome}
              </h1>

              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  {profissao}
                </span>
              </div>
            </div>
          </div>
          <div className="h-px w-full bg-slate-100 lg:sr-only" />
          {/* Informações Adicionais */}
          <div className="lg:min-w-[250px] flex flex-col">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-primary text-sm font-bold leading-4">
                  Cadastro:
                </span>
                <span className="text-gray-900">
                  {formatDateToDDMMYYYY(representanteSelected.dataCadastro)}
                </span>
              </div>
              {representanteSelected.dataAlteracao !==
                representanteSelected.dataCadastro && (
                  <div className="flex justify-between">
                    <span className="text-primary text-sm font-bold leading-4">
                      Atualização:
                    </span>
                    <span className="text-gray-900">
                      {formatDateToDDMMYYYY(representanteSelected.dataAlteracao)}
                    </span>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-slate-100 " />
      {/* Dados Pessoais Detalhados */}
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

      <div className="border-b border-gray-200 my-6" />

      {/* Endereço */}
      <CustomCollapse
        title={
          <h2 className="text-xl font-bold cnc-text-brand-blue-600">
            Endereço
          </h2>
        }
        defaultActive
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          <Label
            label="País"
            value={obterNomePais(representanteSelected.idPaisResidencial)}
          />
          <Label
            label="UF"
            value={obterNomeUfPorId(representanteSelected.idUfResidencial)}
          />
          <Label
            label="Cidade"
            value={representanteSelected.cidadeResidencial}
          />
          <Label
            label="Bairro"
            value={representanteSelected.bairroResidencial}
          />
          <Label
            label="Logradouro"
            value={representanteSelected.logradouroResidencial}
          />
          <Label
            label="Número"
            value={representanteSelected.numeroResidencial}
          />
          <Label
            label="Complemento"
            value={representanteSelected.complementoResidencia}
          />
          <Label label="CEP" value={representanteSelected.cepResidencial} />
          <Label
            label="Tipo Endereço"
            value={representanteSelected.tipoEnderecoResidencial}
          />
        </div>
      </CustomCollapse>

      <div className="border-b border-gray-200 my-6" />

      {/* Contatos */}
      <CustomCollapse
        title={
          <h2 className="text-xl font-bold cnc-text-brand-blue-600">
            Contatos
          </h2>
        }
        defaultActive
      >
        <div className="mt-4">
          {contatos.length > 0 ? (
            <div className="space-y-6">
              {/* E-mails */}
              {contatos.filter((contato) =>
                contato.meio_contato.includes("E-mail")
              ).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      E-mails
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {contatos
                        .filter((contato) =>
                          contato.meio_contato.includes("E-mail")
                        )
                        .map((contato, index) => (
                          <Label
                            key={index}
                            label={contato.meio_contato}
                            value={contato.descricao}
                          />
                        ))}
                    </div>
                  </div>
                )}

              {/* Telefones */}
              {contatos.filter((contato) =>
                contato.meio_contato.includes("Telefone")
              ).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      Telefones
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {contatos
                        .filter((contato) =>
                          contato.meio_contato.includes("Telefone")
                        )
                        .map((contato, index) => (
                          <Label
                            key={index}
                            label={contato.meio_contato}
                            value={contato.descricao}
                          />
                        ))}
                    </div>
                  </div>
                )}
            </div>
          ) : (
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="text-center font-medium">
                  Nenhum contato cadastrado
                </p>
              </div>
            </div>
          )}
        </div>
      </CustomCollapse>
    </div>
  );
}
