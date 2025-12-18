import BuscaAtividades from "@/components/atividades/busca/busca-atividades";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Buscar Atividades | RENAR",
    description: "Sistema de busca de atividades cadastradas no RENAR"
};

export const revalidate = 60; // 1 minuto

export default function PaginaBuscaMandatos() {
    return <BuscaAtividades />;
}