import { httpAuthClient } from "../api";

type Cargos = {
  codigo: string;
  descricao: string;
  usuarioCadastro?: string;
  usuarioAlteracao?: string;
  dataCadastro?: Date;
  dataAlteracao?: Date;
};
type ResponseFetchCargos = {
  itens: Cargos[];
  total: number;
};
export interface FiltrosCargosProps {
  descricao?: string;
  codigo?: string;
}
export async function fetchAllCargos(
  filtros: FiltrosCargosProps
): Promise<ResponseFetchCargos> {
  try {
    const queryParams = new URLSearchParams();

    if (filtros.codigo !== undefined) {
      queryParams.append("codigo", filtros.codigo.toString());
    }

    if (filtros.descricao !== undefined) {
      queryParams.append("descricao", filtros.descricao.toString());
    }
    const query = queryParams.toString();
    const response = await httpAuthClient(
      `/cargos${query ? `?${query}` : ""}`,
      {
        next: {
          tags: ["cargos", query],
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar cargos:", error);
    throw new Error("Falha ao carregar lista de cargos");
  }
}
export async function fetchCargoById(id: string): Promise<Cargos> {
  const endpoint = `/cargos/${id}`;
  const response = await httpAuthClient(endpoint, {
    method: "GET",
    next: {
      tags: ["cargos", id],
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
export async function createCargos(data: Cargos) {
  try {
    const response = await httpAuthClient("/cargos", {
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
        `Erro ao criar cargo. Status: ${response.status}`;
      throw new Error(message);
    }
  } catch (error) {
    console.error("Erro ao buscar cargos:", error);
    const mensagem =
      error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
    throw new Error(mensagem);
  }
}
export async function atualizarCargos(id: number, data: Cargos) {
  try {
    const response = await httpAuthClient(`/cargos/${id}`, {
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
