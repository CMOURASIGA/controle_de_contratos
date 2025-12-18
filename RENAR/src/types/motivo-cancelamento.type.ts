export interface MotivoCancelamento {
  id: number;
  descricao: string;
  status: number;
}

export interface MotivoCancelamentoResponse {
  id: number;
  descricao: string;
  status: number;
  dataCadastro: string | null;
  dataAlteracao: string | null;
  dataAcao: string | null;
  usuarioCadastro: string | null;
  usuarioAlteracao: string | null;
}

export interface CreateMotivoCancelamentoDto {
  descricao: string;
  status: number;
}

export interface UpdateMotivoCancelamentoDto {
  descricao?: string;
  status?: number;
}

export interface MotivoCancelamentoFormData {
  descricao: string;
  status: number;
}

export interface FiltrosMotivosCancelamentoProps {
  nome?: string;
}

export interface ListaMotivosCancelamentoResponse {
  total?: number;
  itens?: MotivoCancelamentoResponse[];
}

