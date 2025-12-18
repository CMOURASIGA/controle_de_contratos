import { NovoAtuacaoFormData } from "@/components/atuacoes/formularios/formularios-novo-atuacao";
import { httpAuthClient } from "./api";

export type Atuacao = {
  id: number;
  nome: string;
  descricao: string;
  usuarioCadastro?: string;
  usuarioAlteracao?: string;
  dataCadastro?: Date;
  dataAlteracao?: Date;
};
type ResponseFetchAtuacoes = {
  itens: Atuacao[];
  total: number;
};
export interface FiltrosAtuacoesProps {
  nome: string;
  descricao?: string;
}
export async function fetchAllAtuacoes(
  filtros: FiltrosAtuacoesProps
): Promise<ResponseFetchAtuacoes> {
  try {
    const queryParams = new URLSearchParams();

    if (filtros.nome !== undefined) {
      queryParams.append("nome", filtros.nome.toString());
    }

    if (filtros.descricao !== undefined) {
      queryParams.append("descricao", filtros.descricao.toString());
    }
    const query = queryParams.toString();
    const response = await httpAuthClient(
      `/atuacoes${query ? `?${query}` : ""}`,
      {
        next: {
          tags: ["atuacoes", query],
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar atuacoes:", error);
    throw new Error("Falha ao carregar lista de atuacoes");
  }
}
export async function fetchAtuacoesById(id: string): Promise<Atuacao> {
  const endpoint = `/atuacoes/${id}`;
  const response = await httpAuthClient(endpoint, {
    method: "GET",
    next: {
      tags: ["atuacoes-by-id", id],
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Erro ao buscar representação. Status: ${response.status}`);
  }
  return await response.json();
}
export async function createAtuacoes(data: NovoAtuacaoFormData) {
  try {
    const response = await httpAuthClient("/atuacoes", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorBody = await response.json().catch();
      const message =
        (errorBody as { message?: string })?.message ??
        `Erro ao criar atuacao. Status: ${response.status}`;
      throw new Error(message);
    }
  } catch (error) {
    console.error("Erro ao buscar atuacao:", error);
    const mensagem =
      error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
    throw new Error(mensagem);
  }
}
export async function atualizarAtuacoes(id: number, data: NovoAtuacaoFormData) {
  try {
    const response = await httpAuthClient(`/atuacoes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
  } catch (error) {
    console.error("Erro ao buscar cargos:", error);
    throw new Error("Falha ao carregar lista de cargos");
  }
}
