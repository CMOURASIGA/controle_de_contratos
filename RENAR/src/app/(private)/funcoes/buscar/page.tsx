import ListagemFuncoes from "@/components/funcoes/listagem/listegem-funcoes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buscar Funções | RENAR",
  description: "Sistema de busca de funções cadastradas no RENAR",
};

export default function BuscarFuncoesPage() {
  return <ListagemFuncoes />;
}