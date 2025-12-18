/**
 * Tipos relacionados aos representantes do sistema RENAR
 *
 * Este arquivo centraliza todas as interfaces e tipos relacionados aos representantes,
 * garantindo consistência em todo o projeto.
 */

/**
 * Interface para dados de profissão do representante
 */
export interface DadosProfissao {
  /** Identificador da profissão */
  id: number;

  /** Nome da profissão */
  nome: string;
}

/**
 * Interface para dados de categoria do representante
 */
export interface DadosCategoria {
  /** Identificador da categoria */
  id: number;

  /** Nome da categoria */
  nome: string;
}

/**
 * Interface para dados aninhados do representante
 */
export interface DadosRepresentante {
  /** Status do representante */
  ativo: boolean;
  /** Dados da profissão */
  profissao: DadosProfissao;

  /** Dados da categoria */
  categoria: DadosCategoria;
}

/**
 * Interface principal para representante baseada na estrutura da API
 */
export interface Representante {
  /** Identificador único do representante */
  id: number;

  /** Identificador único da pessoa */
  idPessoa: string;
  /** Nome completo do representante */
  nome: string;

  /** CPF do representante */
  cpf: string;

  /** Data de cadastro no sistema */
  dataCadastro: string;

  /** Data da última alteração dos dados */
  dataAlteracao: string;

  /** Dados aninhados do representante com profissão e categoria */
  representante: DadosRepresentante;

  /** Número do representante formatado (opcional) */
  numeroRepresentante?: string;

  /** Status de atividade do representante */
  inativo?: boolean;
}

/**
 * Interface para dados do representante vindos diretamente da API
 * Mantém a estrutura original da API para compatibilidade
 */
export interface RepresentanteApi {
  /** ID da pessoa na API */
  idPessoa: number;

  /** Nome civil conforme API */
  nome_civil: string;

  /** CPF (opcional na API) */
  cpf?: string;

  /** Dados da profissão */
  profissao?: {
    dscrc_prfss: string;
  };

  /** Dados da categoria */
  categoria?: {
    nro_idf_catg: number;
    tpo_cta: string;
  };

  /** Data de cadastro ISO */
  dataCadastro: string;

  /** Data de alteração ISO */
  dataAlteracao: string;
}

/**
 * Interface para parâmetros de busca de representantes
 */
export interface ParametrosBuscaRepresentantes {
  /** Nome para filtrar */
  nome?: string;

  /** Número do representante para filtrar */
  numeroRepresentante?: string;

  /** Profissão para filtrar */
  profissao?: string;

  /** Categoria para filtrar */
  categoria?: string;

  /** Situação do representante (true = ativo, false = inativo) */
  status?: boolean;
}

/**
 * Interface para formulário de busca de representantes
 */
export interface FormBuscaRepresentantes {
  /** Nome do representante */
  nome: string;

  /** Número do representante */
  numeroRepresentante: string;

  /** Profissão do representante */
  profissao: string;

  /** Categoria do representante */
  categoria: string;

  /** Situação do representante (string que será convertido para boolean) */
  ativo: string;
}

/**
 * Interface para resposta da API de representantes
 */
export interface RespostaApiRepresentantes {
  /** Lista de representantes retornados */
  resultados: RepresentanteApi[];

  /** Total de registros encontrados */
  total: number;
}

/**
 * Interface para propriedades de componentes que recebem lista de representantes
 */
export interface ListaRepresentantesProps {
  /** Lista de representantes */
  representantes: Representante[];

  /** Total de registros */
  total: number;

  /** Estado de carregamento */
  estaCarregando: boolean;
}

/**
 * Interface para propriedades de componentes que recebem um representante individual
 */
export interface RepresentanteIndividualProps {
  /** Dados do representante */
  representante: Representante;
}
