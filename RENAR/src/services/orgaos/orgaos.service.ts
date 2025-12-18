import {
  ExclusaoOrgaoResponse,
  Orgao,
  OrgaoFormData,
  OrgaoResponse,
  ValidacaoDelecaoOrgaosResponse,
} from "@/types/orgao.type";
import { httpAuthClient } from "../api";

export interface FiltrosOrgaosProps {
  nome?: string;
  situacao?: string;
  tipoOrgao?: string;
  entidade?: string;
}

export async function listTodosOrgaos(
  filtros: FiltrosOrgaosProps
): Promise<{ data: OrgaoResponse[]; total: number }> {
  try {
    const query = new URLSearchParams(
      Object.entries(filtros).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    const response = await httpAuthClient(
      `/orgaos${query ? `?${query}` : ""}`,
      {
        next: {
          tags: ["orgaos", query],
        },
      }
    );

    const result = await response.json();
    return result;
  } catch {
    return { data: [], total: 0 };
  }
}

export const buscarOrgaoPorId = async (id: string) => {
  const endpoint = `/orgaos/${id}`;
  const response = await httpAuthClient(endpoint, {
    method: "GET",
    next: {
      tags: ["orgao", id],
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Erro ao buscar representação. Status: ${response.status}`);
  }
  return await response.json();
};

export const NovoOrgao = async (data: OrgaoFormData) => {
  const endpoint = `/orgaos`;
  const response = await httpAuthClient(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Erro ao criar representação. Status: ${response.status}`);
  }
  return response.json();
};

export const AtualizarOrgao = async (id: string, data: OrgaoFormData) => {
  const endpoint = `/orgaos/${id}`;
  const response = await httpAuthClient(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(
      `Erro ao atualizar representação. Status: ${response.status}`
    );
  }
  return response.json();
};

export const ExcluirOrgao = async (
  id: string
): Promise<ExclusaoOrgaoResponse> => {
  const endpoint = `/orgaos/${id}`;
  const response = await httpAuthClient(endpoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(
      `Erro ao excluir representação. Status: ${response.status}`
    );
  }
  return response.json();
};

export const validarExclusaoDeOrgaos = async (
  id: number
): Promise<ValidacaoDelecaoOrgaosResponse | null> => {
  const endpoint = `/orgaos/pode-deletar/${id}`;
  const response = await httpAuthClient(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Erro ao validar exclusão. Status: ${response.status}`);
  }
  return response.json();
};

export const buscaVinculacaoOrgaos = async (id: string): Promise<Orgao[]> => {
  const endpoint = `/orgaos/vinculos/${id}`;
  const response = await httpAuthClient(endpoint, {
    method: "GET",
    next: {
      tags: ["orgao", id],
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Erro ao buscar representação. Status: ${response.status}`);
  }
  return await response.json();
};
