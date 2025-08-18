
import ContractDetailsClient from "@/components/contracts/ContractDetailsClient";

// This is a server component that renders the client component
export default function ContractDetailPage() {
  return (
    <div>
      {/* The title can be fetched here on the server in the future if needed */}
      <h1 className="text-3xl font-bold mb-6">Detalhes do Contrato</h1>
      <ContractDetailsClient />
    </div>
  );
}
