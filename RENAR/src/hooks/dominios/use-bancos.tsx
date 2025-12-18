import {
  buscarBancos,
  type Banco,
  type OpcaoBanco,
} from "@/services/dominios/bancos.service";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook para gerenciar dados de bancos
 * @returns Objeto contendo bancos e opções formatadas para combobox
 */
export function useBancos() {
  const {
    data: bancos,
    isLoading: carregandoBancos,
    error: erroBancos,
    refetch: recarregarBancos,
  } = useQuery({
    queryKey: ["bancos"],
    queryFn: buscarBancos,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
  });
  const opcoesBancos: OpcaoBanco[] =
    bancos?.map((banco: Banco) => ({
      label: `${banco?.numeroBanco?.toString().padStart(3, "0")} - ${
        banco.nome
      }`,
      value: banco.numeroBanco?.toString()?.trimEnd(),
      codigo: banco.numeroBanco?.toString()?.trimEnd(),
    })) || [];

  return {
    bancos,
    opcoesBancos,
    carregandoBancos,
    erroBancos,
    recarregarBancos,
  };
}
