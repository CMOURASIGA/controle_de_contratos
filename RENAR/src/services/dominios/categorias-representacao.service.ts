import { httpAuthClient } from "../api";

type CategoriaRepresentacao = {
  id: string;
  nome: string;
};
export async function fetchAllCategoriasRepresentacao(): Promise<
  CategoriaRepresentacao[]
> {
  try {
    const response = await httpAuthClient("/dominios/categorias-representacao");
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar categorias de representação:", error);
    throw new Error("Falha ao carregar lista categorias de representação");
  }
}
