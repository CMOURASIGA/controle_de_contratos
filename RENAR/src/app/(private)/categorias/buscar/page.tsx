import ListagemCategoria from "@/components/categoria/listagem/listegem-categoria";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buscar Categoria | RENAR",
  description: "Sistema de busca de categorias cadastradas no RENAR",
};

export default function BuscarCategoriaPage() {
  return <ListagemCategoria />;
}