import { httpAuthClient } from "./api";

export type CategoriaPayload = {
    nomeCategoria: string;
}

export type Categoria = {
    idCategoria: string;
    nomeCategoria: string;
    dataCadastro: string;
    dataAlteracao: string;
}

export type RespostaCategorias = {
    itens: Categoria[];
    total: number;
}

export type CategoriaQueryFilters = {
    nomeCategoria?: string;
}


const endpointBase = "/categorias";

export async function criarCategoria(data: CategoriaPayload) {
    const resposta = await httpAuthClient(endpointBase, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!resposta.ok) {
        throw new Error(`Erro ao criar categoria. Status: ${resposta.status}`);
    }
    return await resposta.json();
}

export async function atualizarCategoria(id: string, data: CategoriaPayload) {
    const endpoint = `${endpointBase}/${id}`;
    const resposta = await httpAuthClient(endpoint, {
        method: "PATCH",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!resposta.ok) {
        throw new Error(`Erro ao atualizar categoria. Status: ${resposta.status}`);
    }
    return await resposta.json();
}

export async function buscarCategoriaPorId(id: string): Promise<Categoria> {
    const endpoint = `${endpointBase}/${id}`;
    const resposta = await httpAuthClient(endpoint, {
        method: "GET",
    });
    if (!resposta.ok) {
        throw new Error(`Erro ao buscar categoria. Status: ${resposta.status}`);
    }
    return await resposta.json();
}

export async function buscarTodasCategorias(filtros?: CategoriaQueryFilters): Promise<RespostaCategorias> {
    let endpointComQuery = endpointBase;
    if (filtros) {
        const queryParams = new URLSearchParams();
        if (filtros.nomeCategoria) {
            queryParams.append("nomeCategoria", filtros.nomeCategoria);
        }

        const query = queryParams.toString();

        endpointComQuery = endpointComQuery + (query ? `?${query}` : "");
    }

    const resposta = await httpAuthClient(endpointComQuery, {
        method: "GET",
    });
    if (!resposta.ok) {
        throw new Error(`Erro ao buscar todas as categorias. Status: ${resposta.status}`);
    }
    return await resposta.json();
}

export const exportarCategorias = async (
  filtros?: CategoriaQueryFilters
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
      `Erro ao exportar categorias. Status: ${response.status}`
    );
  }

  return await response.blob();
};
