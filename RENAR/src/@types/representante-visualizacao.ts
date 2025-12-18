import { Categoria, Profissao } from ".";

/**
 * Interface para dados do representante retornados pelo hook useConsultarRepresentante
 */
export interface RepresentanteVisualizacao {
  id: number;
  numero: string;
  nome: string;
  profissao: string;
  categoria: string;
  dataInclusao: string;
  dataAlteracao: string;
  inativo: boolean;
}

/**
 * Interface para dados completos do representante (formato da API fornecido pelo usuário)
 */
export interface DadosRepresentanteCompletos {
  id: number;
  idProfissao: number;
  nome: string;
  cpf: string;
  dataNascimento: string | null;
  naturalidade: string | null;
  dataEmissaoOrgao: string | null;
  orgaoEmissor: string;
  rg: string;
  numeroBanco: string;
  numeroAgencia: string;
  numeroContaCorrente: string;
  tipoConta: string;
  email1: string;
  email2: string;
  email3: string;
  telefoneComplementar: string;
  telefoneResidencial: string;
  logradouroResidencial: string;
  numeroResidencial: string;
  complementoResidencia: string;
  bairroResidencial: string;
  cidadeResidencial: string;
  cepResidencial: string;
  idUfResidencial: number;
  idPaisResidencial: number;
  tipoEnderecoResidencial: string;
  logradouroComercial: string;
  numeroResidenciaComercial: string;
  complementoComercial: string;
  bairroComercial: string;
  cidadeComercial: string;
  cepComercial: string;
  idUfComercial: number;
  idPaisComercial: number;

  responsavelCadastro?: string;
  responsavelAlteracao?: string;
  dataCadastro: string;
  dataAlteracao: string;

  profissao: Profissao;
  categoria: Categoria;
}
