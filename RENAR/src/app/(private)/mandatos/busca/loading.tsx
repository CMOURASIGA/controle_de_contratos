import { Metadata } from "next";

import { BuscaMandatosSkeleton } from "@/components/mandatos/busca/busca-mandatos.skeleton";

export const metadata: Metadata = {
    title: "Carregando Mandatos | RENAR",
    description: "Sistema de carregando de mandatos cadastrados no RENAR"
};

export const revalidate = 60; // 1 minuto

export default function PaginaCarregandoMandatos() {
    return <BuscaMandatosSkeleton />;
}

