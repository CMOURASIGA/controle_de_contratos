"use client";

import { PageHeader } from "@/components/layouts/ui/page-header";
import FormularioCriacaoMotivoCancelamento from "@/components/motivos-cancelamento/formularios/formulario-criacao-motivo-cancelamento";

export default function NovoMotivoCancelamento() {
  return (
    <>
      <PageHeader title="Cadastro de Motivo de Cancelamento" goBack />

      <div className="mx-auto max-sm:w-screen p-6 bg-white">
        <FormularioCriacaoMotivoCancelamento />
      </div>
    </>
  );
}

