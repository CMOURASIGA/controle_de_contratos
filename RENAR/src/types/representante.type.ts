export interface Representante {
  id: number;
  isNovo: boolean;
  idCategoria: number;
  idPaisComercial: number;
  idPaisResidencial: number;
  idProfissao: number;
  idUfComercial: number;
  idUfResidencial: number;

  nome: string;
  cpf: string;
  rg: string;
  orgaoEmissor: string;
  dataEmissaoOrgao: string;
  dataNascimento: string;
  naturalidade?: string | null;
  nis?: string;
  miniCurriculo?: string;

  // Emails
  email1: string;
  email2?: string | null;
  email3?: string | null;

  // Telefones
  telefoneResidencial?: string | null;
  telefoneComplementar?: string | null;

  // Endereço Residencial
  logradouroResidencial: string;
  numeroResidencial: string;
  complementoResidencia?: string;
  bairroResidencial: string;
  cidadeResidencial: string;
  cepResidencial: string;
  tipoEnderecoResidencial?: string | null;

  // Endereço Comercial
  logradouroComercial: string;
  numeroResidenciaComercial: string;
  complementoComercial?: string;
  bairroComercial: string;
  cidadeComercial: string;
  cepComercial: string;

  // Dados bancários
  numeroBanco: string;
  numeroAgencia: string;
  numeroContaCorrente: string;
  tipoConta: string;
  atuacoes: { atuacao: string; descricao: string }[];
  documentos: DocumentoRepresentante[];
}

interface DocumentoRepresentante {
  id: number;
  idRepresentante: number;
  nome: string;
  dataCadastro: string;
  usuarioCadastro: string;
}
