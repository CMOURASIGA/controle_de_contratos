import {
  FiltrosTiposMandatoProps,
  ListaTiposMandatoResponse,
  CreateTipoMandatoDto,
  UpdateTipoMandatoDto,
} from "@/types/tipo-mandato.type";
import { httpAuthClient } from "./api";

export async function listarTiposMandato(
  filtros: FiltrosTiposMandatoProps
): Promise<ListaTiposMandatoResponse> {
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
      `/tipos-mandato${query ? `?${query}` : ""}`,
      {
        next: {
          tags: ["tipos-mandato", query],
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

export const buscarTipoMandatoPorId = async (id: string) => {
  const endpoint = `/tipos-mandato/${id}`;
  const response = await httpAuthClient(endpoint, {
    method: "GET",
    next: {
      tags: ["tipo-mandato", id],
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(
      `Erro ao buscar tipo de mandato. Status: ${response.status}`
    );
  }
  return await response.json();
};

export const criarTipoMandato = async (
  data: CreateTipoMandatoDto
) => {
  const endpoint = `/tipos-mandato`;
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
      error.message || `Erro ao criar tipo de mandato. Status: ${response.status}`
    );
  }
  return response.json();
};

export const atualizarTipoMandato = async (
  id: string,
  data: UpdateTipoMandatoDto
) => {
  const endpoint = `/tipos-mandato/${id}`;
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
      error.message || `Erro ao atualizar tipo de mandato. Status: ${response.status}`
    );
  }
  return response.json();
};

export const exportarTiposMandato = async (
  filtros?: FiltrosTiposMandatoProps
): Promise<Blob> => {
  const query = new URLSearchParams(
    Object.entries(filtros || {}).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  const endpoint = `/tipos-mandato/export${query ? `?${query}` : ""}`;
  const response = await httpAuthClient(endpoint, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      `Erro ao exportar tipos de mandato. Status: ${response.status}`
    );
  }

  return await response.blob();
};

