import { OrganizacaoRepresentante } from "@/types/organizacao";
import { Representante } from "@/types/representante";
import {
  DadosProfissionaisDados,
  DadosRepresentanteCompletos,
} from "@/types/representante-visualizacao";
import { httpAuthClient } from "./api";

export interface ParametrosBuscaRepresentantes {
  nome?: string;
  numeroRepresentante?: string;
  profissao?: string;
  categoria?: string;
  ativo?: boolean;
}
export interface RespostaApiRepresentantes {
  resultados: RepresentanteApi[];
  total: number;
}

export interface DadosBancariosRepresentante {
  agencia: string;
  banco: string;
  conta: string;
  tipo: string;
}

export interface RepresentanteApi {
  idPessoa: number;
  nome_civil: string;
  cpf?: string;
  profissao?: {
    dscrc_prfss: string;
  };
  categoria?: {
    nro_idf_catg: number;
    tpo_cta: string;
  };
  dataCadastro: string;
  dataAlteracao: string;
}

export interface RepresentanteFormatado {
  id: number;
  nome: string;
  numeroRepresentante: string;
  cpf?: string;
  profissao: string;
  categoria: string;
  dataCadastro: string;
  dataAlteracao: string;
}

export interface MandatoRepresentacao {
  idRepresentacao: number;
  nome: string;
  sigla: string;
}

export interface TipoMandato {
  idTipoMandato: number;
  descricao?: string
  nome: string;
}

export interface Funcao {
  idFuncao: number;
  nome: string;
  nomeFuncao: string;
}

/**
 * Interface para representar um mandato de representante
 * Baseada na estrutura da view VW_SGR_SgrMandato do backend
 */
export interface Mandato {
  /** Identificador único do mandato */
  id: number;
  /** Identificador da representação */
  idRepresentacao: number;
  /** Identificador do representante (pessoa física) */
  idRepresentante?: number;
  /** Identificador da organização */
  idOrganizacao?: number;
  /** Data de início do mandato */
  dataInicioMandato?: Date;
  /** Data de fim do mandato */
  dataFimMandato?: Date;
  idPessoa?: number;
  /** Unidade de medida do prazo do mandato */
  unidadePrazoMandato?: "dia" | "dias" | "ano" | "anos";
  /** Tipo do mandato */
  idTipoMandato?: number;
  /** Prazo do mandato em dias */
  prazoMandato?: number;
  /** Identificador da função */
  idFuncao?: number;
  /** Nome da indicação */
  nomeIndicacao?: string;
  /** Situação do mandato (-1 = a vencer, 0 = vencido) */
  situacao: number;
  /** Status de publicação */
  statusPublicacao?: number;
  /** Data da indicação */
  dataIndicacao?: Date;
  /** Observações do mandato */
  observacao?: string;
  /** Tipo de lançamento (M = Mandato, E = Evento) */
  tipoLancamento?: string;
  
  dataFim?: Date;
  dataInicio?: Date;
  representacao: MandatoRepresentacao;
  representante?: RepresentantePessoa;
  organizacao?: OrganizacaoMandato;
  tipoMandato: TipoMandato;
  funcao?: Funcao;
}

interface RepresentantePessoa {
  PessoaCNC?: PessoaCNC;
}

interface PessoaCNC {
  idPessoa: number;
  nome: string;
}

interface OrganizacaoMandato {
  idOrganizacao: number;
  idNumeroOrganizacao: number;
  entidadeOrganizacao: string;
  siglaOrganizacao: string;
}

export const buscarRepresentantes = async (
  parametros: ParametrosBuscaRepresentantes
): Promise<{ itens: Representante[]; total: number }> => {
  try {
    const queryParams = new URLSearchParams();

    if (parametros.nome) {
      queryParams.append("nome", parametros.nome);
    }

    if (parametros.numeroRepresentante) {
      queryParams.append("numeroRepresentante", parametros.numeroRepresentante);
    }

    if (parametros.profissao) {
      queryParams.append("profissao", parametros.profissao);
    }

    if (parametros.categoria) {
      queryParams.append("categoria", parametros.categoria);
    }

    if (parametros.ativo !== undefined) {
      queryParams.append("ativo", String(parametros.ativo));
    }

    const endpoint = `/representantes${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const resposta = await httpAuthClient(endpoint, {
      method: "GET",
    });
    const dados = await resposta.json();

    return dados;
  } catch (erro) {
    console.error("Erro ao buscar representantes:", erro);
    throw new Error("Falha ao carregar representantes. Tente novamente.");
  }
};

export const buscarRepresentantePorId = async (
  id: string
): Promise<DadosRepresentanteCompletos | null> => {
  const endpoint = `/representantes/${id}`;
  const resposta = await httpAuthClient(endpoint);
  return await resposta.json();
};

export const criarRepresentante = async (dados: unknown) => {
  const endpoint = `/representantes`;
  const resposta = await httpAuthClient(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });
  if (!resposta.ok) {
    throw new Error(`Erro ao criar representante. Status: ${resposta.status}`);
  }
  return await resposta.json();
};

export const atualizarDadosBancariosRepresentante = async (
  id: number,
  dados: DadosBancariosRepresentante
) => {
  const endpoint = `/representantes/${id}/dados-bancarios`;
  const resposta = await httpAuthClient(endpoint, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });
  if (!resposta.ok) {
    throw new Error(
      `Erro ao atualizar representante. Status: ${resposta.status}`
    );
  }
  return await resposta.json();
};

export const atualizarDadosProfissionaisRepresentante = async (
  id: number,
  dados: DadosProfissionaisDados
) => {
  const endpoint = `/representantes/${id}/dados-profissionais`;
  const resposta = await httpAuthClient(endpoint, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });
  if (!resposta.ok) {
    throw new Error(
      `Erro ao atualizar representante. Status: ${resposta.status}`
    );
  }
};
export const cadastrarDocumentosRepresentante = async (
  id: number,
  dados: { files: string[] }
) => {
  const endpoint = `/representantes/${id}/documentos`;
  const resposta = await httpAuthClient(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });
  if (!resposta.ok) {
    throw new Error(
      `Erro ao atualizar representante. Status: ${resposta.status}`
    );
  }
};

export interface ValidarExclusaoResponse {
  podeDeletar: boolean;
  motivo?: string;
  detalhes?: {
    totalMandatos: number;
    totalConvocacoes: number;
  };
}

export interface ExcluirRepresentanteResponse {
  sucesso: boolean;
  acao: "deletado" | "inativado";
  mensagem: string;
}

export const excluirRepresentante = async (
  id: number
): Promise<ExcluirRepresentanteResponse> => {
  const endpoint = `/representantes/${id}`;
  const resposta = await httpAuthClient(endpoint, {
    method: "DELETE",
  });

  if (!resposta.ok) {
    throw new Error(
      `Erro ao excluir representante. Status: ${resposta.status}`
    );
  }

  return await resposta.json();
};

export const validarExclusaoRepresentante = async (
  id: number
): Promise<ValidarExclusaoResponse> => {
  const endpoint = `/representantes/${id}/pode-excluir`;
  const resposta = await httpAuthClient(endpoint, {
    method: "GET",
  });

  if (!resposta.ok) {
    throw new Error(`Erro ao validar exclusão. Status: ${resposta.status}`);
  }

  return await resposta.json();
};
/**
 * Busca os mandatos de um representante específico
 * @param representanteId - ID do representante para buscar os mandatos
 * @returns Promise com array de mandatos do representante
 */
export const buscarMandatosPorRepresentanteId = async (
  representanteId: number
): Promise<Mandato[]> => {
  const endpoint = `/representantes/${representanteId}/mandatos`;
  const resposta = await httpAuthClient(endpoint);
  return await resposta.json();
};

/**
 * Busca as organizações de um representante específico
 * @param representanteId - ID do representante para buscar as organizações
 * @returns Promise com array de organizações do representante
 */
export const buscarOrganizacoesPorRepresentanteId = async (
  representanteId: number
): Promise<OrganizacaoRepresentante[]> => {
  const endpoint = `/representantes/${representanteId}/organizacoes`;
  const resposta = await httpAuthClient(endpoint);
  return await resposta.json();
};
