/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CusteioRepresentacao,
  CreateCusteioRepresentacaoDto,
  FiltroBuscaRepresentacoesDto,
  Representacao,
  TipoCusteio,
  FonteCusteio,
  UpdateCusteioRepresentacaoDto,
} from "@/types/representacao.type";
import { httpAuthClient } from "./api";

export interface FiltrosRepresentacoesProps {
  idRepresentacao?: number;
  idNumeroOrganizacao?: number;
  situacao?: "ATIVO" | "INATIVO" | "AGUARDANDO" | "DECLINADO";
  tipo?: 0 | 1 | 2 | 3;
  idCategoria?: number;
  nome?: string;
}

//crie tipo para retorno dos dados de criação
type CriacaoRepresentacaoResponse = {
  idRepresentacao: number;
};

export const criacaoRepresentacao = async (
  data: unknown
): Promise<CriacaoRepresentacaoResponse> => {
  const endpoint = "/representacoes";
  const response = await httpAuthClient(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Erro ao cadastrar representação: ${responseJson?.message} (status: ${response.status})`
    );
  }
  return responseJson;
};

export const atualizacaoRepresentacao = async (
  id: number,
  data: Partial<any>
): Promise<any> => {
  const endpoint = `/representacoes/${id}`;
  const response = await httpAuthClient(endpoint, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(
      `Erro ao atualizar representação. Status: ${response.status}`
    );
  }
  // Status 204 (No Content) não retorna corpo, então retornamos sucesso
  if (response.status === 204) {
    return { success: true };
  }
  // Para outros status de sucesso, tenta fazer parse do JSON se houver conteúdo
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return { success: true };
};

export const fetchAllrepresentacoes = async (
  filtro: FiltroBuscaRepresentacoesDto
) => {
  const queryParams = new URLSearchParams();
  if (filtro.idRepresentacao !== undefined)
    queryParams.append("idRepresentacao", filtro.idRepresentacao.toString());
  if (filtro.idOrganizacao !== undefined)
    queryParams.append("idOrganizacao", filtro.idOrganizacao.toString());
  if (filtro.situacao) queryParams.append("situacao", filtro.situacao);
  if (filtro.tipo !== undefined)
    queryParams.append("tipo", filtro.tipo.toString());
  if (filtro.idCategoria !== undefined)
    queryParams.append("idCategoria", filtro.idCategoria.toString());
  if (filtro.nome) queryParams.append("nome", filtro.nome);
  const response = await httpAuthClient(
    `/representacoes?${queryParams.toString()}`
  );
  if (!response.ok) {
    throw new Error(`Erro ao buscar representação. Status: ${response.status}`);
  }
  return response.json();
};

export const buscarRepresentacaoPorId = async (
  id: string,
  incluirVinculo: boolean = false
): Promise<Representacao> => {
  const endpoint = `/representacoes/${id}?incluirVinculo=${incluirVinculo}`;
  const response = await httpAuthClient(endpoint, {
    method: "GET",
    next: {
      tags: ["representacao", id],
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Erro ao buscar representação. Status: ${response.status}`);
  }
  return response.json();
};

export async function listTodasRepesentacoes(
  filtros: FiltrosRepresentacoesProps
): Promise<{ itens: Representacao[]; total: number }> {
  try {
    const queryParams = new URLSearchParams();

    if (filtros.idRepresentacao !== undefined) {
      queryParams.append("idRepresentacao", filtros.idRepresentacao.toString());
    }
    if (filtros.idNumeroOrganizacao !== undefined) {
      queryParams.append(
        "idNumeroOrganizacao",
        filtros.idNumeroOrganizacao.toString()
      );
    }
    if (filtros.situacao) {
      queryParams.append("situacao", filtros.situacao);
    }
    if (filtros.tipo !== undefined) {
      queryParams.append("tipo", filtros.tipo.toString());
    }
    if (filtros.idCategoria !== undefined) {
      queryParams.append("idCategoria", filtros.idCategoria.toString());
    }
    if (filtros.nome) {
      queryParams.append("nome", filtros.nome);
    }

    const query = queryParams.toString();

    const response = await httpAuthClient(
      `/representacoes${query ? `?${query}` : ""}`,
      {
        next: {
          tags: ["representacoes", query],
        },
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Erro inesperado ao buscar representações:", error);
    return { itens: [], total: 0 };
  }
}

export async function removeRepresentacao(id: number) {
  const response = await httpAuthClient(`/representacoes/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(
      `Erro ao excluir representação. Status: ${response.status}`
    );
  }

  // Status 204 (No Content) não retorna corpo, então retornamos sucesso
  if (response.status === 204) {
    return { success: true };
  }

  // Para outros status de sucesso, tenta fazer parse do JSON se houver conteúdo
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return { success: true };
}

export interface RepresentacaoOrgaoItem {
  id: number;
  nome: string;
  tipo: "REPRESENTACAO" | "ORGAO";
}

export async function buscarRepresentacoesEOrgaos(
  nome?: string
): Promise<RepresentacaoOrgaoItem[]> {
  const queryParams = new URLSearchParams();
  if (nome) {
    queryParams.append("nome", nome);
  }

  const endpoint = `/representacoes/representacoes-orgaos${queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

  const response = await httpAuthClient(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Erro ao buscar representações e órgãos. Status: ${response.status}`
    );
  }

  return response.json();
}

export async function criarCusteioRepresentacao(
  data: CreateCusteioRepresentacaoDto
): Promise<CusteioRepresentacao> {
  const endpoint = "/representacoes/custeios";
  const response = await httpAuthClient(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || `Erro ao criar custeio. Status: ${response.status}`
    );
  }

  return response.json();
}

export async function atualizarCusteioRepresentacao(
  id: number,
  data: UpdateCusteioRepresentacaoDto
): Promise<CusteioRepresentacao> {
  const endpoint = `/representacoes/custeios/${id}`;
  const response = await httpAuthClient(endpoint, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || `Erro ao atualizar custeio. Status: ${response.status}`
    );
  }

  return response.json();
}

export async function deletarCusteioRepresentacao(
  id: number
): Promise<void> {
  const endpoint = `/representacoes/custeios/${id}`;
  const response = await httpAuthClient(endpoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || `Erro ao deletar custeio. Status: ${response.status}`
    );
  }
}

export async function buscarTiposCusteio(): Promise<TipoCusteio[]> {
  const endpoint = `/representacoes/custeios/tipos`;
  const response = await httpAuthClient(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Erro ao buscar tipos de custeio. Status: ${response.status}`
    );
  }

  return response.json();
}

export async function buscarFontesCusteio(): Promise<FonteCusteio[]> {
  const endpoint = `/representacoes/custeios/fontes`;
  const response = await httpAuthClient(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Erro ao buscar fontes de custeio. Status: ${response.status}`
    );
  }

  return response.json();
}
