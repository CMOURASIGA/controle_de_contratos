export type StatusBinario = 0 | 1;

export interface TipoAtividade {
  id: number;
  nome?: string;
  descricao?: string;
}

export interface NovaAtividadePayload {
  idRepresentante: number;
  idRepresentacao: number;
  idTipoAtividade: number;
  enderecoEvento: string;
  descricaoAtividade: string;
  descricaoPauta?: string;
  dataInicioAtividade: string;
  dataFimAtividade: string;
  statusHospedagem: StatusBinario;
  observacaoHospedagem?: string;
  statusDiaria: StatusBinario;
  quantidadeDiaria?: number;
  observacaodiaria?: string;
  statusPassagem: StatusBinario;
  dataPassagemIda?: string;
  companhiaIda?: string;
  dataHoraVooIda?: string;
  trechoIda?: string;
  numeroVooIda?: string;
  dataPassagemVolta?: string;
  companhiaVolta?: string;
  dataHoraVooVolta?: string;
  trechoVolta?: string;
  numeroVooVolta?: string;
}

export interface FiltrosAtividadesProps {
  idRepresentante?: number;
  idRepresentacao?: number;
  idTipoAtividade?: number;
  statusAtividade?: number;
  descricaoAtividade?: string;
  dataInicioAtividade?: Date;
  dataFimAtividade?: Date;
}

export interface ListaAtividadesResponse {
  total: number;
  itens: Atividade[];
}

export interface Atividade {
  id: number;
  idRepresentante: number;
  idRepresentacao: number;
  idTipoAtividade: number;
  enderecoEvento: string;
  descricaoAtividade: string;
  descricaoPauta?: string;
  dataInicioAtividade: string;
  dataFimAtividade: string;
  statusHospedagem: StatusBinario;
  observacaoHospedagem?: string;
  statusDiaria: StatusBinario;
  quantidadeDiaria?: number;
  observacaodiaria?: string;
  statusPassagem: StatusBinario;
  dataPassagemIda?: string;
  companhiaIda?: string;
  dataHoraVooIda?: string;
  trechoIda?: string;
  numeroVooIda?: string;
  dataPassagemVolta?: string;
  companhiaVolta?: string;
  dataHoraVooVolta?: string;
  trechoVolta?: string;
  numeroVooVolta?: string;
  usuarioDeCriacao?: string;
  usuarioDeAlteracao?: string;
  dataCadastro?: string;
  dataAlteracao?: string;
  statusAtividade?: number;
  Representante?: {
    idRepresentante: number;
    nome: string;
  };
  Representacao?: {
    idRepresentacao: number;
    nome: string;
  };
  TipoAtividade?: {
    id: number;
    descricao: string;
  };
  Orgao?: {
    nome: string;
  };
}

export interface PessoaCNC {
  id: number;
  nome: string;
}

export interface PrestacaContas {
  id: number;
  idAtividade: number;
  trechoViagem: string;
  nomeSetor: string;
  dataInicioViagem: Date;
  dataFimViagem: string;
  valorDiaria: string;
  quantidadeDias: number;
  despesasExtras: string;
  despesasComprovadas: string;
  despesasNaoComprovadas: string;
  despesasLocomocao: string;
  valorAdiantamento: string;
  numeroBilhete: string;
  observacao: string;
}
