import { httpAuthClient } from "../api";

type Setores = {
  id: string;
  nome: string;
  sigla: string;
};
export async function fetchAllSetores(): Promise<Setores[]> {
  try {
    const response = await httpAuthClient("/setores");
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar setores:", error);
    throw new Error("Falha ao carregar lista de setores");
  }
}
