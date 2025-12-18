/**
 * Arquivo de exportação centralizada dos tipos do sistema RENAR
 * 
 * Este arquivo facilita as importações dos tipos em todo o projeto,
 * permitindo importações mais limpas e organizadas.
 */

// Tipos relacionados aos representantes
export type {
  Representante,
  RepresentanteApi,
  ParametrosBuscaRepresentantes,
  FormBuscaRepresentantes,
  RespostaApiRepresentantes,
  ListaRepresentantesProps,
  RepresentanteIndividualProps,
} from "./representante";

export type {
  StatusBinario,
  TipoAtividade,
  NovaAtividadePayload,
} from "./atividade.type";