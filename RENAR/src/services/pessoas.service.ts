import { DadosPessoa } from "@/components/representantes/pessoa/PessoaDrawer";
import { httpAuthClient } from "./api";

export async function fetchAPessoasByName(search: string) {
  const queryParams = new URLSearchParams();
  queryParams.append("nome", search);

  const endpoint = `/pessoas-fisicas${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const res = await httpAuthClient(endpoint, {
    method: "GET",
  });
  if (!res.ok) throw new Error("Erro ao buscar pessoa fisica");
  return res.json();
}

export async function criarPessoa(dados: DadosPessoa) {
  const res = await httpAuthClient("/pessoas-fisicas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error("Erro ao criar pessoa fisica");
  return res.json();
}
