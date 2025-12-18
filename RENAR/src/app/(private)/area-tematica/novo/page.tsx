import { FormularioAreaTematica } from "@/components/area-tematica/formularios/FormularioAreaTematica";
import { PageHeader } from "@/components/layouts/ui/page-header";

export const metadata = {
  title: "Nova Área Temática | RENAR",
};

export default function NovaAreaTematicaPage() {
  return (
    <>
      <PageHeader
        title="Cadastro de Área Temática"
        goBack
      />
      <FormularioAreaTematica />
    </>
  );
}