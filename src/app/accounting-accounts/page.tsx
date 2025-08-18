
import AccountingAccountsClient from "@/components/accounting-accounts/AccountingAccountsClient";
import { PageHeader } from "@/components/layout/PageHeader";

export default function AccountingAccountsPage() {
  return (
    <>
      <PageHeader
        title="Plano de Contas"
        description="Gerencie as contas contábeis para categorização de despesas."
      />
      <AccountingAccountsClient />
    </>
  );
}
