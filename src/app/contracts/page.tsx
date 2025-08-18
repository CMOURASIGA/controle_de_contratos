import ContractsClient from "@/components/contracts/ContractsClient";
import { PageHeader } from "@/components/layout/PageHeader";

export default function ContractsPage() {
  return (
    <>
      <PageHeader
        title="Gestão de Contratos"
        description="Gerencie todos os contratos da organização."
      />
      <ContractsClient />
    </>
  );
}
