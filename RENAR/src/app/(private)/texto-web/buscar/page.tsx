import ListagemTextoWeb from "@/components/textoWeb/listagem/listegem-texto-web";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buscar Texto Web | RENAR",
  description: "Sistema de busca de textos web cadastrados no RENAR",
};

export default function BuscarTextoWebPage() {
  return <ListagemTextoWeb />;
}