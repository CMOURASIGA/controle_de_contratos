import { PageHeader } from "@/components/layouts/ui/page-header";
import { FormularioNovoTipoReuniao } from "@/components/tipo-reuniao/formularios/Formulario-tipo-reuniao";

export const metadata = {
  title: "Novo Tipo Reunião | RENAR",
};

export default function NovoTipoReuniaoPage() {
  return (
    <>
      <PageHeader
        title="Cadastro de Tipo Reunião"
        goBack
      />
      <FormularioNovoTipoReuniao />
    </>
  );
}