"use client";
import { PageHeader } from "@/components/layouts/ui/page-header";
import { FormularioMandatos } from "@/components/mandatos/formularios/formulario-mandatos";

export default function NovoOrgao() {
  return (
    <>
      <PageHeader title="Cadastro de Mandatos" goBack />

      <div className=" mx-auto max-sm:w-screen p-6 bg-white ">
        <FormularioMandatos />
      </div>
    </>
  );
}
