"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ContractForm from "@/components/contracts/ContractForm";

export default function EditContractPage() {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    if (!id) return;
    async function fetchContract() {
      try {
        const response = await fetch(`/api/contracts/${id}`);
        if (!response.ok) {
          throw new Error("Contract not found");
        }
        const data = await response.json();
        setContract(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchContract();
  }, [id]);

  if (loading) {
    return <div>Carregando formulário...</div>;
  }

  if (!contract) {
    return <div>Contrato não encontrado.</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Editar Contrato</h1>
      <ContractForm initialData={contract} />
    </div>
  );
}
