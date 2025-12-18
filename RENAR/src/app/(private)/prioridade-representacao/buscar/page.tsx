import ListagemPrioridadeRepresentacao from "@/components/prioridade-representacao/listagem/listegem-prioridade-representacao";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buscar Prioridade de Representação | RENAR",
  description: "Sistema de busca de prioridades de representação cadastradas no RENAR",
};

export default function BuscarPrioridadeRepresentacaoPage() {
  return <ListagemPrioridadeRepresentacao />;
}