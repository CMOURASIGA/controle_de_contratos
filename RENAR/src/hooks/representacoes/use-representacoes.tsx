import { useQueryString } from "@/hooks/useQueryParams";
import { fetchAllrepresentacoes } from "@/services/representacoes.service";
import {
  FiltroBuscaRepresentacoesDto,
  Representacao,
} from "@/types/representacao.type";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

export function useRepresentacoes() {
  const { getAllQueryStrings } = useQueryString();
  const { id_entidade, situacao, categoria, nme_rprstc } = getAllQueryStrings();

  function tradutorDadosCadastro(data: dadosPrincipaisRepresentacaoDto) {
    const payload: Record<string, string | number | null> = {
      idCategoria: Number(data.areaTematica),
      idOrganizacao: 1995,
    };
    if (data.representacaoNome) {
      payload.nome = data.representacaoNome;
    }
    if (data.sigla) {
      payload.sigla = data.sigla;
    }
    if (data.perfil) {
      payload.perfil = data.perfil;
    }
    if (data.dataCriacao) {
      payload.dataCriacao = data.dataCriacao;
    }
    if (data.competencia) {
      payload.competencia = data.competencia;
    }
    if (data.enderecoHomepageLegislacao) {
      payload.enderecoHomepageLegislacao = data.enderecoHomepageLegislacao;
    }
    if (data.enderecoHomepageComposicao) {
      payload.enderecoHomepageComposicao = data.enderecoHomepageComposicao;
    }
    if (data.grauPrioridade) {
      payload.grauPrioridade = data.grauPrioridade;
    }
    const idOrgaoPaiStr = data.idOrgaoPai !== null && data.idOrgaoPai !== undefined
      ? String(data.idOrgaoPai)
      : "";
    const idRepresentacaoPaiStr = data.idRepresentacaoPai !== null && data.idRepresentacaoPai !== undefined
      ? String(data.idRepresentacaoPai)
      : "";

    const idOrgaoPaiValue = idOrgaoPaiStr !== "" && !Number.isNaN(Number(idOrgaoPaiStr))
      ? Number(idOrgaoPaiStr)
      : null;
    const idRepresentacaoPaiValue = idRepresentacaoPaiStr !== "" && !Number.isNaN(Number(idRepresentacaoPaiStr))
      ? Number(idRepresentacaoPaiStr)
      : null;

    if (idOrgaoPaiValue !== null) {
      payload.idOrgaoPai = idOrgaoPaiValue;
      payload.idRepresentacaoPai = null;
    } else if (idRepresentacaoPaiValue !== null) {
      payload.idRepresentacaoPai = idRepresentacaoPaiValue;
      payload.idOrgaoPai = null;
    } else {
      payload.idOrgaoPai = null;
      payload.idRepresentacaoPai = null;
    }
    if (data.perfilWeb) {
      payload.perfilWeb = data.perfilWeb;
    }
    if (data.situacaoPublicacaoPerfil) {
      payload.situacaoPublicacaoPerfil = Number(data.situacaoPublicacaoPerfil);
    }
    if (data.tipoDados) {
      payload.tipoDados = Number(data.tipoDados);
    }
    if (data.situacao && data.situacao !== "") {
      // Converter valores antigos para novos
      const situacaoMap: Record<string, string> = {
        "-1": "ATIVO",
        "0": "INATIVO",
        "1": "AGUARDANDO",
        "2": "DECLINADO",
      };
      payload.situacao = situacaoMap[data.situacao] || data.situacao;
    }
    if (data.dataLimiteApresentacaoWeb) {
      payload.dataLimiteApresentacaoWeb = data.dataLimiteApresentacaoWeb;
    }

    return payload;
  }

  function tradutorDadosCusteio(
    data: Partial<formularioRepresentacaoAtualizacaoDto>
  ) {
    return {
      //Verificar o stts_pblcc_prfl
      sta_passg: Number(data?.passagem) ?? null,
      sta_diar: Number(data?.diaria) ?? null,
      sta_trsld: Number(data?.translado) ?? null,
      sta_hpdg: Number(data.hospedagem) ?? null,
      sta_ajd_cst: Number(data.ajudaCusto) ?? null,
      sta_rmnrc: Number(data.remuneracao) ?? null,
    };
  }

  function tradutorDadosPrincipaisAtualizacao(
    data: Partial<formularioRepresentacaoAtualizacaoDto>
  ) {
    const payload: Record<string, string | number | null> = {};

    // Campos opcionais - apenas adiciona se tiver valor
    if (data.representacaoNome) {
      payload.nome = data.representacaoNome;
    }
    if (data.areaTematica && Number(data.areaTematica) > 0) {
      payload.idCategoria = Number(data.areaTematica);
    }
    if (data.sigla) {
      payload.sigla = data.sigla;
    }
    if (data.grauPrioridade) {
      payload.grauPrioridade = data.grauPrioridade;
    }
    if (data.situacao && data.situacao !== "") {
      // Converter valores antigos para novos
      const situacaoMap: Record<string, string> = {
        "-1": "ATIVO",
        "0": "INATIVO",
        "1": "AGUARDANDO",
        "2": "DECLINADO",
      };
      payload.situacao = situacaoMap[data.situacao] || data.situacao;
    }
    if (data.tipoDados && data.tipoDados !== "") {
      payload.tipoDados = Number(data.tipoDados);
    }
    const idOrgaoPaiStr = data.idOrgaoPai !== null && data.idOrgaoPai !== undefined
      ? String(data.idOrgaoPai)
      : "";
    const idRepresentacaoPaiStr = data.idRepresentacaoPai !== null && data.idRepresentacaoPai !== undefined
      ? String(data.idRepresentacaoPai)
      : "";

    const idOrgaoPaiValue = idOrgaoPaiStr !== "" && !Number.isNaN(Number(idOrgaoPaiStr))
      ? Number(idOrgaoPaiStr)
      : null;
    const idRepresentacaoPaiValue = idRepresentacaoPaiStr !== "" && !Number.isNaN(Number(idRepresentacaoPaiStr))
      ? Number(idRepresentacaoPaiStr)
      : null;
    console.log("idOrgaoPaiValue", idOrgaoPaiValue);
    console.log("idRepresentacaoPaiValue", idRepresentacaoPaiValue);
    console.log("payload", payload);
    if (idOrgaoPaiValue !== null) {
      payload.idOrgaoPai = idOrgaoPaiValue;
      payload.idRepresentacaoPai = null;
    } else if (idRepresentacaoPaiValue !== null) {
      payload.idRepresentacaoPai = idRepresentacaoPaiValue;
      payload.idOrgaoPai = null;
    } else {
      payload.idOrgaoPai = null;
      payload.idRepresentacaoPai = null;
    }
    console.log("payload final", payload);
    return payload;
  }

  function tradutorInformacoesAtualizacao(
    data: Partial<formularioRepresentacaoAtualizacaoDto>
  ) {
    return {
      competencia: data.competencia ?? null,
      sta_cmptnc: Number(data?.competenciaWeb) ? -1 : 0,
      perfil: data.perfil ?? null,
      perfilWeb: data?.publicarWeb ? String(data.publicarWeb) : null,
      enderecoHomepageComposicao: data?.siteComposicao ?? null,
      enderecoHomepageLegislacao: data?.siteLegislacao ?? null,
      perfilRepresentacao: data.perfilRepresentacao ?? null,
    };
  }

  const situacaoMap: Record<
    string,
    "ATIVO" | "INATIVO" | "AGUARDANDO" | "DECLINADO"
  > = {
    "-1": "ATIVO",
    "0": "INATIVO",
    "1": "AGUARDANDO",
    "2": "DECLINADO",
  };

  const params: FiltroBuscaRepresentacoesDto = {
    idOrganizacao: id_entidade ? parseInt(id_entidade) : undefined,
    situacao:
      situacao && situacaoMap[situacao] ? situacaoMap[situacao] : undefined,
    idCategoria: categoria ? parseInt(categoria) : undefined,
    nome: nme_rprstc || undefined,
  };

  const {
    data: representacoes,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["representacoes", params],
    queryFn: () => fetchAllrepresentacoes(params),
  });

  const opcoesRepresentacao =
    (representacoes &&
      representacoes?.itens.map((representacao: Representacao) => ({
        value: representacao.idRepresentacao.toString(),
        label: representacao.nome,
      }))) ||
    [];

  return {
    tradutorDadosCusteio,
    tradutorDadosCadastro,
    tradutorDadosPrincipaisAtualizacao,
    tradutorInformacoesAtualizacao,
    representacoes,
    error,
    isLoadingBuscaRepresentacoes: isLoading,
    refetchBuscaRepresentacoes: refetch,
    opcoesRepresentacao,
  };
}

export const schemaFormularioDadosPrincipaisRepresentacao = z.object({
  entidade: z.string().optional(),
  representacaoNome: z.string().optional(),
  vinculado: z.string().optional(),
  areaTematica: z.string().min(1, "Área temática é obrigatória"),
  numero: z.string().optional(),
  sigla: z.string().optional(),
  grauPrioridade: z.string().optional(),
  situacao: z.string().optional(),
  represetanteNome: z.string().optional(),
  perfil: z.string().optional(),
  dataCriacao: z.string().optional(),
  competencia: z.string().optional(),
  enderecoHomepageLegislacao: z.string().optional(),
  enderecoHomepageComposicao: z.string().optional(),
  idOrgaoPai: z.string().nullable().optional(),
  idRepresentacaoPai: z.string().nullable().optional(),
  perfilWeb: z.string().optional(),
  situacaoPublicacaoPerfil: z.string().optional(),
  tipoDados: z.string().optional(),
  dataLimiteApresentacaoWeb: z.string().optional(),
});

export const schemaFormularioDadosPrincipaisRepresentacaoAtualizacao = z.object(
  {
    representacaoNome: z.string().min(1, "Representação é obrigatória"),
    vinculado: z.string().optional(), // Campo interno para o select, não é obrigatório
    areaTematica: z.string().optional(),
    numero: z.string().optional(),
    sigla: z.string().optional(),
    grauPrioridade: z.string().optional(),
    situacao: z.string().optional(),
    tipoDados: z.string().optional(),
    represetanteNome: z.string().optional(),
    idRepresentacaoPai: z.string().nullable().optional(),
    idOrgaoPai: z.string().nullable().optional(),
  }
);

export const schemaFormularioAtualizacaoRepresentacao = z.object({
  representacaoNome: z.string().nullable().optional(),
  vinculado: z.string().nullable().optional(),
  areaTematica: z.string().optional(),
  numero: z.string().nullable().optional(),
  sigla: z.string().optional(),
  grauPrioridade: z.string().optional(),
  situacao: z.string().optional(),
  tipoDados: z.string().optional(),
  perfil: z.string().optional(),
  perfilWeb: z.string().optional(),
  perfilRepresentacao: z.string().optional(),
  siteComposicao: z.string().optional(),
  competencia: z.string().optional(),
  siteLegislacao: z.string().optional(),
  represetanteNome: z.string().optional(),
  publicarWeb: z.boolean().optional(),
  competenciaWeb: z.boolean().optional(),
  passagem: z.string().optional(),
  ajudaCusto: z.string().optional(),
  diaria: z.string().optional(),
  remuneracao: z.string().optional(),
  translado: z.string().optional(),
  hospedagem: z.string().optional(),
  idRepresentacaoPai: z.string().nullable().optional(),
  idOrgaoPai: z.string().nullable().optional(),
});

// TypeScript type inferido do schema
export type dadosPrincipaisRepresentacaoDto = z.infer<
  typeof schemaFormularioDadosPrincipaisRepresentacao
>;
export type atualizacaoDadosPrincipaisRepresentacaoDto = z.infer<
  typeof schemaFormularioDadosPrincipaisRepresentacaoAtualizacao
>;

export type formularioRepresentacaoAtualizacaoDto = z.infer<
  typeof schemaFormularioAtualizacaoRepresentacao
>;
