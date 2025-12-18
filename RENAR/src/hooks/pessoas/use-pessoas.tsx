import { fetchAPessoasByName } from "@/services/pessoas.service";
import { useQuery } from "@tanstack/react-query";

interface Pessoa {
  id: string;
  nome: string;
  idRepresentante: string;
}

interface PessoaOption {
  label: string;
  value: string;
}

export function usePessoas(searchTerm: string, enabled = true) {
  return useQuery<Pessoa[], Error, PessoaOption[]>({
    queryKey: ["pessoas", searchTerm],
    queryFn: () => fetchAPessoasByName(searchTerm),
    enabled: enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
    select: (data) =>
      data?.map((pessoa) => ({
        value: String(pessoa.id),
        label: pessoa.nome,
      })) || [],
  });
}
