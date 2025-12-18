"use client";

import { PageHeader } from "@/components/layouts/ui/page-header";
import FormularioCriacaoTipoMandato from "@/components/tipos-mandato/formularios/formulario-criacao-tipo-mandato";

export default function NovoTipoMandato() {
  return (
    <>
      <PageHeader title="Cadastro de Tipo de Mandato" goBack />

      <div className="mx-auto max-sm:w-screen p-6 bg-white">
        <FormularioCriacaoTipoMandato />
      </div>
    </>
  );
}

