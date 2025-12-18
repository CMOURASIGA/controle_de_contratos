import { httpAuthClient } from "../api";

type Profissao = {
  id: string;
  nome: string;
};
export async function fetchAllProfissoes(): Promise<Profissao[]> {
  try {
    const response = await httpAuthClient("/profissoes");
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar profissões:", error);
    throw new Error("Falha ao carregar lista de profissões");
  }
}
