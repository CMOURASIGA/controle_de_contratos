import { FormularioNovaCategoria } from "@/components/categoria/formularios/FormularioCategoria";
import { PageHeader } from "@/components/layouts/ui/page-header";

export const metadata = {
  title: "Nova Categoria | RENAR",
};

export default function NovaCategoriaPage() {
  return (
    <>
      <PageHeader
        title="Cadastro de Categorias"
        goBack
      />
      <FormularioNovaCategoria />
    </>
  );
}