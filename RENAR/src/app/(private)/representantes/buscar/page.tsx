import { PaginaBuscaRepresentantes } from "@/components/pages/representantes/buscar/pagina-busca-representantes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buscar Representantes | RENAR",
  description: "Sistema de busca de representantes cadastrados no RENAR",
};

export default function Buscar() {
  return <PaginaBuscaRepresentantes />;
}
