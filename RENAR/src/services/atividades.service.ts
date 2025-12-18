import { PrestacaoContasFormData } from "@/components/atividades/formularios/formulario-prestacao-conta";
import {
  Atividade,
  FiltrosAtividadesProps,
  ListaAtividadesResponse,
  NovaAtividadePayload,
  PrestacaContas,
  TipoAtividade,
} from "@/types/atividade.type";
import { httpAuthClient } from "./api";

export async function criarAtividade(data: NovaAtividadePayload) {
  const response = await httpAuthClient("/atividades", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorBody = await response
      .json()
      .catch(() => ({ message: "Erro ao criar a atividade." }));
    const message =
      (errorBody as { message?: string })?.message ??
      `Erro ao criar atividade. Status: ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}

export async function buscarAtividadePorId(id: string): Promise<Atividade> {
  const endpoint = `/atividades/${id}`;
  const response = await httpAuthClient(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      const errorBody = await response
        .json()
        .catch(() => ({ message: `Atividade com ID ${id} não encontrada.` }));
      const message =
        (errorBody as { message?: string })?.message ??
        `Atividade com ID ${id} não encontrada.`;
      throw new Error(message);
    }
    const errorBody = await response
      .json()
      .catch(() => ({ message: "Erro ao buscar atividade." }));
    const message =
      (errorBody as { message?: string })?.message ??
      `Erro ao buscar atividade. Status: ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}

export async function atualizarAtividade(
  id: number,
  data: Partial<NovaAtividadePayload>
): Promise<Atividade> {
  const endpoint = `/atividades/${id}`;
  const response = await httpAuthClient(endpoint, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response
      .json()
      .catch(() => ({ message: "Erro ao atualizar a atividade." }));
    const message =
      (errorBody as { message?: string })?.message ??
      `Erro ao atualizar atividade. Status: ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}

export async function listarTiposAtividade(): Promise<TipoAtividade[]> {
  const response = await httpAuthClient("/atividades/tipos", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Erro ao carregar tipos de atividade. Status: ${response.status}`
    );
  }

  return response.json();
}

export async function criarPrestacaoContas(
  id: number,
  data: PrestacaoContasFormData
) {
  const response = await httpAuthClient(`/atividades/${id}/prestacao-contas`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorBody = await response
      .json()
      .catch(() => ({ message: "Erro ao criar a prestação de contas." }));
    const message =
      (errorBody as { message?: string })?.message ??
      `Erro ao criar atividade. Status: ${response.status}`;
    throw new Error(message);
  }
}
export async function buscarPrestacaoContasPorId(
  id: number
): Promise<PrestacaContas> {
  const endpoint = `/atividades/${id}/prestacao-contas`;
  const response = await httpAuthClient(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar atividade. Status: ${response.status}`);
  }

  return response.json();
}
export async function listarAtividades(
  filtros: FiltrosAtividadesProps
): Promise<ListaAtividadesResponse> {
  try {
    const queryParams = new URLSearchParams();
    if (filtros.idRepresentante !== undefined) {
      queryParams.append("idRepresentante", filtros.idRepresentante.toString());
    }
    if (filtros.idRepresentacao !== undefined) {
      queryParams.append("idRepresentacao", filtros.idRepresentacao.toString());
    }
    if (filtros.idTipoAtividade !== undefined) {
      queryParams.append("idTipoAtividade", filtros.idTipoAtividade.toString());
    }
    if (filtros.statusAtividade !== undefined) {
      queryParams.append("statusAtividade", filtros.statusAtividade.toString());
    }
    if (filtros.descricaoAtividade) {
      queryParams.append("descricaoAtividade", filtros.descricaoAtividade);
    }
    if (filtros.dataInicioAtividade) {
      queryParams.append(
        "dataInicioAtividade",
        filtros.dataInicioAtividade.toISOString()
      );
    }
    if (filtros.dataFimAtividade) {
      queryParams.append(
        "dataFimAtividade",
        filtros.dataFimAtividade.toISOString()
      );
    }
    const response = await httpAuthClient(
      `/atividades?${queryParams.toString()}`,
      { method: "GET", headers: { "Content-Type": "application/json" } }
    );
    if (!response.ok) {
      throw new Error("Erro ao listar atividades");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function excluirAtividade(id: string | number): Promise<void> {
  const endpoint = `/atividades/${id}`;
  const response = await httpAuthClient(endpoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorBody = await response
      .json()
      .catch(() => ({ message: "Erro ao excluir a atividade." }));
    const message =
      (errorBody as { message?: string })?.message ??
      `Erro ao excluir atividade. Status: ${response.status}`;
    throw new Error(message);
  }
}
