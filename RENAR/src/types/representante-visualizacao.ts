import { Categoria } from "@/hooks/dominios/use-categorias";

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
  nis?: string;
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
  site?: string;
  faxComercial?: string;
  faxResidencial?: string;
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
  tipoEnderecoResidencial: "C" | "R";
  logradouroComercial: string;
  numeroResidenciaComercial: string;
  complementoComercial: string;
  bairroComercial: string;
  cidadeComercial: string;
  cepComercial: string;
  idUfComercial: number;
  idPaisComercial: number;
  idCategoria: number;
  idPronomeTratamento: number;
  idEntidade: number;

  responsavelCadastro?: string;
  responsavelAlteracao?: string;
  dataCadastro: string;
  dataAlteracao: string;

  /** Status - true para ativo, false para inativo */
  ativo?: boolean;

  profissao: {
    idProfissao: string;
    descricaoProfissao: string;
    dataAlteracao: string;
    dataCadastro: string;
    usuarioModificacao: string;
  };
  categoria: Categoria;
  isNovo: boolean;
  atuacoes: { atuacao: string; descricao: string }[];
  beneficio: string;
  miniCurriculo?: string;
  documentos: DocumentoRepresentante[];
}

interface DocumentoRepresentante {
  id: number;
  idRepresentante: number;
  nome: string;
  dataCadastro: string;
  usuarioCadastro: string;
}
export interface DadosProfissionaisDados {
  miniCurriculo?: string;
  atuacoes?: { tipo: string; descricao: string }[];
  profissaoId?: string;
}
