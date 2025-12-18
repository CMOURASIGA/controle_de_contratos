import { NovoTipoOrgaoFormData } from "@/components/tipo-orgaos/formularios/formulario-novo-tipo-orgao";
import { httpAuthClient } from "../api";

export type TipoOrgaos = {
  id: string;
  nome: string;
  usuarioCadastro?: string;
  usuarioAlteracao?: string;
  dataCadastro?: Date;
  dataAlteracao?: Date;
};
type ResponseFetchTipoOrgaos = {
  itens: TipoOrgaos[];
  total: number;
};
export interface FiltrosTipoOrgaosProps {
  nome?: string;
}
export async function fetchAllTipoOrgaos(
  filtros: FiltrosTipoOrgaosProps
): Promise<ResponseFetchTipoOrgaos> {
  try {
    const queryParams = new URLSearchParams();

    if (filtros.nome !== undefined) {
      queryParams.append("nome", filtros.nome.toString());
    }

    const query = queryParams.toString();
    const response = await httpAuthClient(
      `/orgaos/tipos${query ? `?${query}` : ""}`,
      {
        next: {
          tags: ["tipos-orgaos", query],
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar tipos de orgaos:", error);
    throw new Error("Falha ao carregar lista de tipos de orgaos");
  }
}
export async function fetchTipoOrgaosById(id: string): Promise<TipoOrgaos> {
  const endpoint = `/orgaos/tipos/${id}`;
  const response = await httpAuthClient(endpoint, {
    method: "GET",
    next: {
      tags: ["orgaos-id", id],
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(
      `Erro ao buscar tipos de órgão. Status: ${response.status}`
    );
  }
  return await response.json();
}
export async function createTipoOrgaos(data: NovoTipoOrgaoFormData) {
  try {
    const response = await httpAuthClient("/orgaos/tipos", {
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
    console.error("Erro ao buscar tipos de orgaos:", error);
    const mensagem =
      error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
    throw new Error(mensagem);
  }
}
export async function atualizarTipoOrgaos(
  id: number,
  data: NovoTipoOrgaoFormData
) {
  try {
    const response = await httpAuthClient(`/orgaos/tipos/${id}`, {
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
    console.error("Erro ao buscar tipos de orgaos:", error);
    throw new Error("Falha ao carregar lista de tipos de orgaos");
  }
}
