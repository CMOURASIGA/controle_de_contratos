export interface OrganizacaoDto {
  idOrganizacao: number;
  idNumeroOrganizacao: number;
  entidadeOrganizacao: string;
  siglaOrganizacao: string;
}

export type Representacao = {
  idRepresentacao: number;
  idOrganizacao: number | null;
  organizacao?: OrganizacaoDto | null;
  idCategoria: number;
  nome: string;
  sigla: string;
  perfil: string | null;
  dataCriacao: string;
  idHierarquia: number | null;
  competencia: string | null;
  enderecoHomepageLegislacao: string | null;
  enderecoHomepageComposicao: string | null;
  categoria: string | null;
  grauPrioridade: string | null;
  perfilWeb: string;
  situacaoPublicacaoPerfil: number;
  dataLimiteApresentacaoWeb: string | null;
  tipoDados: number;
  dataCadastro: string;
  dataAlteracao: string;
  descricaoSituacao: string | null;
  statusSituacao: "ATIVO" | "INATIVO" | "AGUARDANDO" | "DECLINADO";
  idOrgaoPai: number | null;
  idRepresentacaoPai: number | null;
  usuarioDeAlteracao: string;
  usuarioDeInclusao: string;
  vinculados?: Partial<Representacao>[];
  custeioRepresentacao?: CusteioRepresentacao[];
  // Campos adicionais retornados pela API (formato legado)
  perfilRepresentacao?: string | null;
  staPassg?: number | null;
  staHpdg?: number | null;
  staDiar?: number | null;
  staRmnrc?: number | null;
  staTrsld?: number | null;
  staAjdCst?: number | null;
  cmptncRprstc?: string | null;
  staCmptnc?: number | null;
  sttsPblccPrfl?: number | null;
  endHmpgCmpsc?: string | null;
  endHmpgLgslc?: string | null;
};

export type FiltroBuscaRepresentacoesDto = {
  idRepresentacao?: number;
  idOrganizacao?: number;
  situacao?: "ATIVO" | "INATIVO" | "AGUARDANDO" | "DECLINADO";
  tipo?: 0 | 1 | 2 | 3;
  idCategoria?: number;
  nome?: string;
};

export interface FonteCusteio {
  idFonteCusteio: number;
  codigoChave: string;
  descricaoChave: string;
  dataCadastro: string;
  dataAlteracao: string;
  usuarioCriacao: string;
  usuarioAlteracao: string;
  idUsuario: number;
}

export interface TipoCusteio {
  idTipoCusteio: number;
  descricaoTipoCusteio: string;
  status: boolean;
}

export interface CusteioRepresentacao {
  idCusteioRepresentacao: number;
  idRepresentacao: number;
  idTipoCusteio: number;
  idFonteCusteio: number;
  dataCriacao?: string;
  fonteCusteio?: FonteCusteio;
  tipoCusteio?: TipoCusteio;
}

export interface CreateCusteioRepresentacaoDto {
  idRepresentacao: number;
  idTipoCusteio: number;
  idFonteCusteio: number;
  dataCriacao?: string;
}

export interface UpdateCusteioRepresentacaoDto {
  idRepresentacao?: number;
  idTipoCusteio?: number;
  idFonteCusteio?: number;
  dataCriacao?: string;
}
