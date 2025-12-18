import { httpAuthClient } from "./api";

export type FuncaoPayload = {
    nomeFuncao: string;
    idHierarquia?: string;
}

export type Funcao = {
    id: string;
    nomeFuncao: string;
    idHierarquia?: string;
    nomePai?: string;
    dataCadastro?: Date;
    dataAlteracao?: Date;
}

export type RespostaFuncoes = {
    itens: Funcao[];
    total: number;
}

export type FuncaoQueryFilters = {
    id?: string;
    nomeFuncao?: string;
    idHierarquia?: string;
}

export type FuncaoSelectFilters = {

    nomeFuncao?: string;
    idHierarquia?: string;
}


const endpointBase = "/funcoes";

export async function criarFuncao(data: FuncaoPayload) {
    const resposta = await httpAuthClient(endpointBase, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!resposta.ok) {
        throw new Error(`Erro ao criar função. Status: ${resposta.status}`);
    }
    return await resposta.json();
}

export async function atualizarFuncao(id: string, data: FuncaoPayload) {
    const endpoint = `${endpointBase}/${id}`;
    const resposta = await httpAuthClient(endpoint, {
        method: "PATCH",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!resposta.ok) {
        throw new Error(`Erro ao atualizar função. Status: ${resposta.status}`);
    }
    return await resposta.json();
}

export async function buscarFuncaoPorId(id: string): Promise<Funcao> {
    const endpoint = `${endpointBase}/${id}`;
    const resposta = await httpAuthClient(endpoint, {
        method: "GET",
    });
    if (!resposta.ok) {
        throw new Error(`Erro ao buscar função. Status: ${resposta.status}`);
    }
    return await resposta.json();
}

export async function buscarTodasFuncoes(filtros?: FuncaoQueryFilters): Promise<RespostaFuncoes> {
    let endpointComQuery = endpointBase;
    if (filtros) {
        const queryParams = new URLSearchParams();
        if (filtros.nomeFuncao) {
            queryParams.append("nomeFuncao", filtros.nomeFuncao);
        }

        if (filtros.idHierarquia) {
            queryParams.append("idHierarquia", filtros.idHierarquia);
        }

        const query = queryParams.toString();

        endpointComQuery = endpointComQuery + (query ? `?${query}` : "");
    }

    const resposta = await httpAuthClient(endpointComQuery, {
        method: "GET",
    });
    if (!resposta.ok) {
        throw new Error(`Erro ao buscar todas as funções. Status: ${resposta.status}`);
    }
    return await resposta.json();
}

export const exportarFuncoes = async (
  filtros?: FuncaoQueryFilters
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
      `Erro ao exportar funções. Status: ${response.status}`
    );
  }

  return await response.blob();
};
