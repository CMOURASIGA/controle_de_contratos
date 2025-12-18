import { httpAuthClient } from "./api";

export type PrioridadeRepresentacaoPayload = {
    descricao: string;
}

export type PrioridadeRepresentacao = {
    id: string;
    descricao: string;
    dataCadastro?: Date;
    dataAlteracao?: Date;
    usuarioDeCriacao?: string;
    usuarioDeAlteracao?: string;
}

export type RespostaPrioridadesRepresentacao = {
    itens: PrioridadeRepresentacao[];
    total: number;
}

export type PrioridadeRepresentacaoQueryFilters = {
    descricao?: string;
}


const endpointBase = "/prioridade-representacao";

export async function criarPrioridadeRepresentacao(data: PrioridadeRepresentacaoPayload) {
    const resposta = await httpAuthClient(endpointBase, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!resposta.ok) {
        throw new Error(`Erro ao criar prioridade de representação. Status: ${resposta.status}`);
    }
    return await resposta.json();
}

export async function atualizarPrioridadeRepresentacao(id: string, data: PrioridadeRepresentacaoPayload) {
    const endpoint = `${endpointBase}/${id}`;
    const resposta = await httpAuthClient(endpoint, {
        method: "PATCH",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!resposta.ok) {
        throw new Error(`Erro ao atualizar prioridade de representação. Status: ${resposta.status}`);
    }
    return await resposta.json();
}

export async function buscarPrioridadeRepresentacaoPorId(id: string): Promise<PrioridadeRepresentacao> {
    const endpoint = `${endpointBase}/${id}`;
    const resposta = await httpAuthClient(endpoint, {
        method: "GET",
    });
    if (!resposta.ok) {
        throw new Error(`Erro ao buscar prioridade de representação. Status: ${resposta.status}`);
    }
    return await resposta.json();
}

export async function buscarTodasPrioridadesRepresentacao(filtros?: PrioridadeRepresentacaoQueryFilters): Promise<RespostaPrioridadesRepresentacao> {
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
        throw new Error(`Erro ao buscar todas as áreas temáticas. Status: ${resposta.status}`);
    }
    return await resposta.json();
}

export const exportarPrioridadesRepresentacao = async (
  filtros?: PrioridadeRepresentacaoQueryFilters
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
