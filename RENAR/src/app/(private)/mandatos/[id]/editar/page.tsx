import { Metadata } from "next";
import { notFound } from "next/navigation";

import { EditarMandato } from "@/components/mandatos/editar-mandato";

export const metadata: Metadata = {
  title: "Editar Mandato | RENAR",
  description: "Edite os dados cadastrados para o mandato selecionado",
};

export default async function PaginaEditarMandato({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mandatoId = Number(id);

  if (Number.isNaN(mandatoId)) {
    notFound();
  }

  return <EditarMandato id={mandatoId} />;
}
