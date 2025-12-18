import { useSearchParams } from "next/navigation";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function objetosParaStrings(objeto: any, key: string) {
  const paresChaveValor = Object?.entries(objeto).map(
    ([chave, valor]: [string, any]) => {
      if (valor) return `${chave}=${valor?.[key] || valor}`;
    }
  );
  return paresChaveValor.filter((p) => p != undefined).join("&");
}

export const useQueryParams = () => {
  const searchParams = useSearchParams();
  const params: any = {};

  searchParams?.forEach((value: any, key: any) => {
    params[key] = value;
  });

  return params;
};
export const formatNumber = (num: number, locale: string = "pt-BR") => {
  return new Intl.NumberFormat(locale).format(num);
};

export function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

// Exportar funções de formatação de documentos
export { formatarCpf, formatarRg, ehCpfValido, ehRgValido } from "./formatarDocumentos";
