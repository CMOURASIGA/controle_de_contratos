import { httpAuthClient } from "./api";

export type TextoWebPayload = {
    tituloTexto: string;
    resumoTexto: string;
    descricaoTexto: string;
}

export type TextoWeb = {
    id: string;
    tituloTexto: string;
    resumoTexto: string;
    descricaoTexto: string;
}

export type RespostaTextosWeb = {
    itens: TextoWeb[];
    total: number;
}

export type TextoWebQueryFilters = {
    tituloTexto?: string;
    resumoTexto?: string;
}


const endpointBase = "/texto";

export async function criarTextoWeb(data: TextoWebPayload) {
    const resposta = await httpAuthClient(endpointBase, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!resposta.ok) {
        throw new Error(`Erro ao criar texto web. Status: ${resposta.status}`);
    }
    return await resposta.json();
}

export async function atualizarTextoWeb(id: string, data: TextoWebPayload) {
    const endpoint = `${endpointBase}/${id}`;
    const resposta = await httpAuthClient(endpoint, {
        method: "PATCH",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!resposta.ok) {
        throw new Error(`Erro ao atualizar texto web. Status: ${resposta.status}`);
    }
    return await resposta.json();
}

export async function buscarTextoWebPorId(id: string): Promise<TextoWeb> {
    const endpoint = `${endpointBase}/${id}`;
    const resposta = await httpAuthClient(endpoint, {
        method: "GET",
    });
    if (!resposta.ok) {
        throw new Error(`Erro ao buscar texto web. Status: ${resposta.status}`);
    }
    return await resposta.json();
}

export async function buscarTodosTextoWeb(filtros?: TextoWebQueryFilters): Promise<RespostaTextosWeb> {
    let endpointComQuery = endpointBase;
    if (filtros) {
        const queryParams = new URLSearchParams();
        if (filtros.tituloTexto) {
            queryParams.append("tituloTexto", filtros.tituloTexto);
        }

        if (filtros.resumoTexto) {
            queryParams.append("resumoTexto", filtros.resumoTexto);
        }

        const query = queryParams.toString();

        endpointComQuery = endpointComQuery + (query ? `?${query}` : "");
    }

    const resposta = await httpAuthClient(endpointComQuery, {
        method: "GET",
    });
    if (!resposta.ok) {
        throw new Error(`Erro ao buscar todos os textos web. Status: ${resposta.status}`);
    }
    return await resposta.json();
}

export const exportarTextosWeb = async (
  filtros?: TextoWebQueryFilters
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
