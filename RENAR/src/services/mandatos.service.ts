import { DadosMandatosPayload } from "@/components/mandatos/formularios/formulario-mandatos";
import { httpAuthClient } from "./api";
import type { Mandato } from "./representantes.service";

export interface FiltrosMandatosProps {
  idRepresentacao?: number;
  idPessoa?: number;
  idOrganizacao?: number;
  idTipoMandato?: number;
  idFuncao?: number;
  situacao?: number;
  situacaoPublicacao?: number;
  dataInicioDe?: string;
  dataInicioAte?: string;
  dataFimDe?: string;
  dataFimAte?: string;
  nomeIndicacao?: string;
  tipoLancamento?: string;
}

export type ListaMandatosResponse = {
  itens: Mandato[];
  total: number;
  pagina: number;
  limite: number;
};

export const criarMandato = async (data: DadosMandatosPayload) => {
  const endpoint = `/mandatos`;
  const response = await httpAuthClient(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Erro ao criar o mandato. Status: ${response.status}`);
  }
  return response.json();
};

export const tiposMandatos = async () => {
  const endpoint = `/mandatos/tipos`;
  const response = await httpAuthClient(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Erro ao criar o mandato. Status: ${response.status}`);
  }
  return response.json() as Promise<{ id: number; descricao: string }[]>;
};
export async function listarMandatos(
  filtros: FiltrosMandatosProps
): Promise<ListaMandatosResponse> {
  try {
    const queryParams = new URLSearchParams();

    if (filtros.idRepresentacao !== undefined) {
      queryParams.append("idRepresentacao", filtros.idRepresentacao.toString());
    }

    if (filtros.idPessoa !== undefined) {
      queryParams.append("idPessoa", filtros.idPessoa.toString());
    }

    if (filtros.idOrganizacao !== undefined) {
      queryParams.append("idOrganizacao", filtros.idOrganizacao.toString());
    }

    if (filtros.idTipoMandato !== undefined) {
      queryParams.append("idTipoMandato", filtros.idTipoMandato.toString());
    }

    if (filtros.idFuncao !== undefined) {
      queryParams.append("idFuncao", filtros.idFuncao.toString());
    }

    if (filtros.situacao !== undefined) {
      queryParams.append("situacao", filtros.situacao.toString());
    }

    if (filtros.situacaoPublicacao !== undefined) {
      queryParams.append(
        "situacaoPublicacao",
        filtros.situacaoPublicacao.toString()
      );
    }

    if (filtros.dataInicioDe) {
      queryParams.append("dataInicioDe", filtros.dataInicioDe);
    }

    if (filtros.dataInicioAte) {
      queryParams.append("dataInicioAte", filtros.dataInicioAte);
    }

    if (filtros.dataFimDe) {
      queryParams.append("dataFimDe", filtros.dataFimDe);
    }

    if (filtros.dataFimAte) {
      queryParams.append("dataFimAte", filtros.dataFimAte);
    }

    if (filtros.nomeIndicacao) {
      queryParams.append("nomeIndicacao", filtros.nomeIndicacao);
    }

    if (filtros.tipoLancamento) {
      queryParams.append("tipoLancamento", filtros.tipoLancamento);
    }

    const query = queryParams.toString();

    const response = await httpAuthClient(
      `/mandatos${query ? `?${query}` : ""}`,
      {
        next: {
          tags: ["mandatos", query],
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar mandatos. Status: ${response.status}`);
    }

    return (await response.json()) as ListaMandatosResponse;
  } catch (error) {
    console.error("Erro inesperado ao buscar mandatos:", error);
    return { itens: [], total: 0, pagina: 1, limite: 10 };
  }
}

export const obterMandatoPorId = async (id: number): Promise<Mandato> => {
  const endpoint = `/mandatos/${id}`;
  const response = await httpAuthClient(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar mandato. Status: ${response.status}`);
  }

  return response.json();
};

export const atualizarMandato = async (
  id: number,
  dados: DadosMandatosPayload
): Promise<Mandato> => {
  const endpoint = `/mandatos/${id}`;
  const response = await httpAuthClient(endpoint, {
    method: "PATCH",
    body: JSON.stringify(dados),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao atualizar o mandato. Status: ${response.status}`);
  }

  return response.json();
};

export interface ValidarExclusaoMandatoDetalhes {
  representanteAtivo?: boolean;
  representacaoAtiva?: boolean;
  statusRepresentante?: number | string | null;
  statusRepresentacao?: string | null;
}

export interface ValidarExclusaoMandatoResponse {
  podeExcluir: boolean;
  motivo?: string;
  detalhes?: ValidarExclusaoMandatoDetalhes;
}

export const validarExclusaoMandato = async (
  id: number
): Promise<ValidarExclusaoMandatoResponse> => {
  const endpoint = `/mandatos/${id}/validar-exclusao`;
  const response = await httpAuthClient(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Erro ao validar a exclusão do mandato. Status: ${response.status}`
    );
  }

  return response.json();
};

export const ExcluirMandato = async (id: number) => {
  const endpoint = `/mandatos/${id}`;
  const response = await httpAuthClient(endpoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 409) {
    const data = await response.json().catch(() => ({}));
    const mensagem =
      (data as { message?: string })?.message ??
      "Não foi possível excluir o mandato.";
    throw new Error(mensagem);
  }

  if (!response.ok) {
    throw new Error(`Erro ao excluir mandato. Status: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};
