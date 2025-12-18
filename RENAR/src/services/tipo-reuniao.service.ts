import { httpAuthClient } from "./api";

export type TipoReuniaoPayload = {
    descricao: string;
}

export type TipoReuniao = {
    id: string;
    descricao: string;
    usuarioCadastro?: string;
    usuarioAlteracao?: string;
    dataCadastro?: Date;
    dataAlteracao?: Date;
}

export type RespostaTiposReuniao = {
    itens: TipoReuniao[];
    total: number;
}

export type TipoReuniaoQueryFilters = {
    descricao?: string;
}


const endpointBase = "/tipo-reuniao";

export async function criarTipoReuniao(data: TipoReuniaoPayload) {
    const resposta = await httpAuthClient(endpointBase, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!resposta.ok) {
        throw new Error(`Erro ao criar tipo de reunião. Status: ${resposta.status}`);
    }
    return await resposta.json();
}

export async function atualizarTipoReuniao(id: string, data: TipoReuniaoPayload) {
    const endpoint = `${endpointBase}/${id}`;
    const resposta = await httpAuthClient(endpoint, {
        method: "PATCH",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!resposta.ok) {
        throw new Error(`Erro ao atualizar tipo de reunião. Status: ${resposta.status}`);
    }
    return await resposta.json();
}

export async function buscarTipoReuniaoPorId(id: string): Promise<TipoReuniao> {
    const endpoint = `${endpointBase}/${id}`;
    const resposta = await httpAuthClient(endpoint, {
        method: "GET",
    });
    if (!resposta.ok) {
        throw new Error(`Erro ao buscar tipo de reunião. Status: ${resposta.status}`);
    }
    return await resposta.json();
}

export async function buscarTodosTipoReuniao(filtros?: TipoReuniaoQueryFilters): Promise<RespostaTiposReuniao> {
    let endpointComQuery = endpointBase;
    if (filtros) {
        const queryParams = new URLSearchParams();
        if (filtros.descricao) {
            queryParams.append("descricao", filtros.descricao);
        }
        const query = queryParams.toString();
        endpointComQuery = endpointComQuery + (query ? `?${query}` : "");
    }

    const resposta = await httpAuthClient(endpointComQuery, {
        method: "GET",
    });
    if (!resposta.ok) {
        throw new Error(`Erro ao buscar todos os tipos de reunião. Status: ${resposta.status}`);
    }
    return await resposta.json();
}

export const exportarTipoReuniao = async (
  filtros?: TipoReuniaoQueryFilters
): Promise<Blob> => {
  const query = new URLSearchParams(
    Object.entries(filtros || {}).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  const endpoint = `${endpointBase}/relatorio${query ? `?${query}` : ""}`;
  const response = await httpAuthClient(endpoint, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      `Erro ao exportar tipos de reunião. Status: ${response.status}`
    );
  }

  return await response.blob();
};
