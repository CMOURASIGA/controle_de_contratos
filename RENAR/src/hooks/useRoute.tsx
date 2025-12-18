/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePathname, useRouter } from "next/navigation";

function objetosParaStrings(objeto: any, key: string) {
  const paresChaveValor = Object?.entries(objeto).map(
    ([chave, valor]: [string, any]) => {
      if (valor) return `${chave}=${valor?.[key] || valor}`;
    }
  );
  return paresChaveValor.filter((p) => p != undefined).join("&");
}

export default function useRoute() {
  const router = useRouter();
  const pathname = usePathname();

  function handleItemClick(values: any, key: string) {
    let params = "";
    if (values) params = "?" + objetosParaStrings(values, key);
    router.push(`${pathname}${params}`);
  }
  return { handleItemClick, router };
}
