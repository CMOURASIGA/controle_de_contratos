import { FormularioFuncao } from "@/components/funcoes/formularios/formulario-funcao";
import { PageHeader } from "@/components/layouts/ui/page-header";

export const metadata = {
  title: "Nova Função | RENAR",
};

export default function NovoFuncaoPage() {
  return (
    <>
      <PageHeader
        title="Cadastro de Funções"
        goBack
      />
      <FormularioFuncao />
    </>
  );
}