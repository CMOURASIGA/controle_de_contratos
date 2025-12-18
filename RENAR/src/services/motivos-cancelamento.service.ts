import {
  FiltrosMotivosCancelamentoProps,
  ListaMotivosCancelamentoResponse,
  CreateMotivoCancelamentoDto,
  UpdateMotivoCancelamentoDto,
} from "@/types/motivo-cancelamento.type";
import { httpAuthClient } from "./api";

export async function listarMotivosCancelamento(
  filtros: FiltrosMotivosCancelamentoProps
): Promise<ListaMotivosCancelamentoResponse> {
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
      `/motivos-cancelamento${query ? `?${query}` : ""}`,
      {
        next: {
          tags: ["motivos-cancelamento", query],
        },
      }
    );

    const result = await response.json();
    
    // A API pode retornar array direto ou objeto com itens/total
    if (Array.isArray(result)) {
      return { itens: result, total: result.length };
    }
    
    return result;
  } catch {
    return { itens: [], total: 0 };
  }
}

export const buscarMotivoCancelamentoPorId = async (id: string) => {
  const endpoint = `/motivos-cancelamento/${id}`;
  const response = await httpAuthClient(endpoint, {
    method: "GET",
    next: {
      tags: ["motivo-cancelamento", id],
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(
      `Erro ao buscar motivo de cancelamento. Status: ${response.status}`
    );
  }
  return await response.json();
};

export const criarMotivoCancelamento = async (
  data: CreateMotivoCancelamentoDto
) => {
  const endpoint = `/motivos-cancelamento`;
  const response = await httpAuthClient(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || `Erro ao criar motivo de cancelamento. Status: ${response.status}`
    );
  }
  return response.json();
};

export const atualizarMotivoCancelamento = async (
  id: string,
  data: UpdateMotivoCancelamentoDto
) => {
  const endpoint = `/motivos-cancelamento/${id}`;
  const response = await httpAuthClient(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || `Erro ao atualizar motivo de cancelamento. Status: ${response.status}`
    );
  }
  return response.json();
};

export const exportarMotivosCancelamento = async (
  filtros?: FiltrosMotivosCancelamentoProps
): Promise<Blob> => {
  const query = new URLSearchParams(
    Object.entries(filtros || {}).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  const endpoint = `/motivos-cancelamento/export${query ? `?${query}` : ""}`;
  const response = await httpAuthClient(endpoint, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      `Erro ao exportar motivos de cancelamento. Status: ${response.status}`
    );
  }

  return await response.blob();
};

