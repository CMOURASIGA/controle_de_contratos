import { httpAuthClient } from "./api";

export type AreaTematicaPayload = {
    nome: string;
    descricaoWeb: string;
}

export type AreaTematica = {
    idCategoriaRepresentacao: string;
    nome: string;
    descricaoWeb: string;
}

export type RespostaAreasTematicas = {
    itens: AreaTematica[];
    total: number;
}

export type AreaTematicaQueryFilters = {
    nome?: string;
    descricaoWeb?: string;
}


const endpointBase = "/area-tematica";

export async function criarAreaTematica(data: AreaTematicaPayload) {
    const resposta = await httpAuthClient(endpointBase, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!resposta.ok) {
        throw new Error(`Erro ao criar área temática. Status: ${resposta.status}`);
    }
    return await resposta.json();
}

export async function atualizarAreaTematica(id: string, data: AreaTematicaPayload) {
    const endpoint = `${endpointBase}/${id}`;
    const resposta = await httpAuthClient(endpoint, {
        method: "PATCH",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!resposta.ok) {
        throw new Error(`Erro ao atualizar área temática. Status: ${resposta.status}`);
    }
    return await resposta.json();
}

export async function buscarAreaTematicaPorId(id: string): Promise<AreaTematica> {
    const endpoint = `${endpointBase}/${id}`;
    const resposta = await httpAuthClient(endpoint, {
        method: "GET",
    });
    if (!resposta.ok) {
        throw new Error(`Erro ao buscar área temática. Status: ${resposta.status}`);
    }
    return await resposta.json();
}

export async function buscarTodasAreasTematicas(filtros?: AreaTematicaQueryFilters): Promise<RespostaAreasTematicas> {
    let endpointComQuery = endpointBase;
    if (filtros) {
        const queryParams = new URLSearchParams();
        if (filtros.nome) {
            queryParams.append("nome", filtros.nome);
        }

        if (filtros.descricaoWeb) {
            queryParams.append("descricaoWeb", filtros.descricaoWeb);
        }

        const query = queryParams.toString();

        endpointComQuery = endpointComQuery + (query ? `?${query}` : "");
    }

    const resposta = await httpAuthClient(endpointComQuery, {
        method: "GET",
    });
    if (!resposta.ok) {
        throw new Error(`Erro ao buscar todas as áreas temáticas. Status: ${resposta.status}`);
    }
    return await resposta.json();
}

export const exportarAreasTematicas = async (
  filtros?: AreaTematicaQueryFilters
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
      `Erro ao exportar textos web. Status: ${response.status}`
    );
  }

  return await response.blob();
};
