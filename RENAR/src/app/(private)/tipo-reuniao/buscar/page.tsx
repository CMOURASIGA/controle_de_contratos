import ListagemTipoReuniao from "@/components/tipo-reuniao/listagem/listegem-tipo-reuniao";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buscar Tipo Reunião | RENAR",
  description: "Sistema de busca de tipos de reunião cadastrados no RENAR",
};

export default function BuscarTipoReuniaoPage() {
  return <ListagemTipoReuniao />;
}