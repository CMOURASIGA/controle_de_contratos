/**
 * Tipos relacionados às organizações dos representantes
 * 
 * Este arquivo centraliza todas as interfaces e tipos relacionados às organizações,
 * garantindo consistência em todo o projeto.
 */

/**
 * Interface para organização do representante baseada no schema especificado
 */
export interface OrganizacaoRepresentante {
  /** Identificador único da organização */
  id: number;
  
  /** ID do representante */
  idRepresentante: number;
  
  /** Nome civil do representante */
  nomeCivil: string;
  
  /** Nome da organização */
  nomeOrganizacao: string;
  
  /** Descrição do cargo */
  descricaoCargo: string;
  
  /** Número de telefone */
  numeroTelefone: string;
  
  /** Email */
  email: string;
  
  /** Endereço do site (home) */
  enderecoHome: string;
  
  /** Observação */
  observacao: string;
}

/**
 * Interface para propriedades de componentes que recebem lista de organizações
 */
export interface ListaOrganizacoesProps {
  /** Lista de organizações */
  organizacoes: OrganizacaoRepresentante[];
  
  /** Estado de carregamento */
  estaCarregando: boolean;
}

/**
 * Interface para propriedades de componentes que recebem uma organização individual
 */
export interface OrganizacaoIndividualProps {
  /** Dados da organização */
  organizacao: OrganizacaoRepresentante;
}