export interface TipoMandato {
  idTipoMandato: number;
  descricao: string;
}

export interface TipoMandatoResponse {
  idTipoMandato: number;
  descricao: string;
  dataCadastro: string | null;
  dataAlteracao: string | null;
  usuarioDeCriacao: string | null;
  usuarioDeAlteracao: string | null;
}

export interface CreateTipoMandatoDto {
  descricao: string;
  usuarioDeCriacao?: string;
  usuarioDeAlteracao?: string;
}

export interface UpdateTipoMandatoDto {
  descricao?: string;
  usuarioDeCriacao?: string;
  usuarioDeAlteracao?: string;
}

export interface TipoMandatoFormData {
  descricao: string;
}

export interface FiltrosTiposMandatoProps {
  descricao?: string;
  dataCadastro?: string;
  dataAlteracao?: string;
  modificadoPor?: string;
}

export interface ListaTiposMandatoResponse {
  total?: number;
  itens?: TipoMandatoResponse[];
}

