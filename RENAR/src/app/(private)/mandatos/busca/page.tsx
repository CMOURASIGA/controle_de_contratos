import { BuscaMandatos } from "@/components/mandatos/busca-mandatos";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Buscar Mandatos | RENAR",
    description: "Sistema de busca de mandatos cadastrados no RENAR"
};

export const revalidate = 60; // 1 minuto

export default function PaginaBuscaMandatos() {
    return <BuscaMandatos />;
}

