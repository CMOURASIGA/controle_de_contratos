import { PageHeader } from "@/components/layouts/ui/page-header";
import { FormularioPrioridadeRepresentacao } from "@/components/prioridade-representacao/formularios/formulario-prioridade-representacao";

export const metadata = {
  title: "Novo Texto Web | RENAR",
};

export default function NovaPrioridadeRepresentacaoPage() {
  return (
    <>
      <PageHeader
        title="Cadastro de Prioridade de Representação"
        goBack
      />
      <FormularioPrioridadeRepresentacao />
    </>
  );
}