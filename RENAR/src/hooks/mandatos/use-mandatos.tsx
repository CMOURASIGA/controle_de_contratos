import { tiposMandatos } from "@/services/mandatos.service";
import { useQuery } from "@tanstack/react-query";

export default function useMandatos() {
  const { data: tipoMandatos, isLoading } = useQuery({
    queryKey: ["bancos"],
    queryFn: tiposMandatos,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
  });

  const opcoesTipoMandatos = tipoMandatos?.map((tipo) => ({
    label: tipo.descricao,
    value: tipo.id.toString(),
  }));

  return {
    opcoesTipoMandatos,
    tipoMandatos,
    isLoading,
  };
}
