export type Orgao = {
  id: string;
  idHierarquia: number;
  nome: string;
  vinculados?: Orgao[];
};

export type OrgaoDataResponse = {
  data: OrgaoResponse;
  mensagem: string;
};

export type OrgaoResponse = {
  id: number;
  nome: string;
  sigla: string;
  situacao: number;
  tipoOrgaoId: number;
  tipoOrgao: string;
};

export type OrgaoFormData = {
  entidade: string;
  orgaoNome: string;
  numero: string;
  sigla: string;
  vinculado: string;
  situacao: string;
  tipo: string;
};

export type ValidacaoDelecaoOrgaosResponse = {
  data: ValidacaoDelecaoOrgaosDataResponse;
  total: number;
  mensagem: string;
  motivo: string;
  error: boolean;
};

export type ExclusaoOrgaoResponse = {
  data: PodeDeletarOrgaoDataResponse;
  mensagem: string;
  error: boolean;
};

export type PodeDeletarOrgaoDataResponse = {
  podeSerDeletado: boolean;
};

export type ValidacaoDelecaoOrgaosDataResponse = {
  podeSerDeletado: boolean;
};
