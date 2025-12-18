import { opcoesAreaTematica } from "@/constants/areas-tematicas";
import { opcoesCusteio } from "@/constants/representacao/custeio";
import { opcoesPrioridade } from "@/constants/representacao/prioridade";
import { opcoesSituacao } from "@/constants/representacao/situacao";
import { opcoesTipo } from "@/constants/representacao/tipo";

export const getCusteio = (value: number) => {
  const custeio = opcoesCusteio.find((row) => Number(row.value) === value);
  return custeio;
};

export const getOpcoesCusteio = (opcoes?: string[]) => {
  if (!opcoes || opcoes.length === 0) {
    return opcoesCusteio;
  }

  return opcoesCusteio.filter((row) => opcoes.includes(row.value));
};

export const getAreaTematica = (value: number) => {
  const areaTematica = opcoesAreaTematica?.find(
    (row) => Number(row.value) === value
  );

  return areaTematica;
};

export const getSituacaoRepresentacao = (value: number) => {
  const situacao = opcoesSituacao?.find((row) => Number(row.value) === value);
  return situacao;
};

export const getTipoRepresentacao = (value: number) => {
  const tipo = opcoesTipo?.find((row) => Number(row.value) === value);
  return tipo;
};

export const getGrauPrioridadeRepresentacao = (value: number) => {
  const prioridade = opcoesPrioridade?.find(
    (row) => Number(row.value) === value
  );
  return prioridade;
};
