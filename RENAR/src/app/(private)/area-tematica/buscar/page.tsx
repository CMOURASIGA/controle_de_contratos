import ListagemAreaTematica from "@/components/area-tematica/listagem/listegem-area-tematica";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buscar Área Temática | RENAR",
  description: "Sistema de busca de áreas temáticas cadastradas no RENAR",
};

export default function BuscarAreaTematicaPage() {
  return <ListagemAreaTematica />;
}