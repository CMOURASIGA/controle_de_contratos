import { PageHeader } from "@/components/layouts/ui/page-header";
import { FormularioNovoTextoWeb } from "@/components/textoWeb/formularios/FormularioTextoWeb";

export const metadata = {
  title: "Novo Texto Web | RENAR",
};

export default function NovoTextoWebPage() {
  return (
    <>
      <PageHeader
        title="Cadastro de Textos Web"
        goBack
      />
      <FormularioNovoTextoWeb />
    </>
  );
}