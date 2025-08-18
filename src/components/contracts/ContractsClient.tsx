"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  MoreHorizontal, 
  FileText, 
  Calendar, 
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { TableToolbar } from "@/components/ui/TableToolbar";

// Helper to format dates
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Helper to format currency
const formatCurrency = (value) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// Helper to get contract status
const getContractStatus = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);
  const daysUntilExpiry = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) {
    return { status: 'expired', label: 'Vencido', color: 'text-destructive', bgColor: 'bg-red-50', icon: AlertTriangle };
  } else if (daysUntilExpiry <= 30) {
    return { status: 'expiring', label: 'A Vencer', color: 'text-warning', bgColor: 'bg-orange-50', icon: Clock };
  } else {
    return { status: 'active', label: 'Ativo', color: 'text-success', bgColor: 'bg-green-50', icon: CheckCircle };
  }
};

export default function ContractsClient() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [contractToDelete, setContractToDelete] = useState(null);
  const router = useRouter();

  async function fetchContracts() {
    try {
      const res = await fetch("/api/contracts");
      const data = await res.json();
      setContracts(data);
    } catch (error) {
      console.error("Failed to fetch contracts", error);
      toast.error("Falha ao carregar contratos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchContracts();
  }, []);

  const handleDelete = async () => {
    if (!contractToDelete) return;

    try {
      const response = await fetch(`/api/contracts/${contractToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete contract');
      }

      toast.success("Contrato excluído com sucesso!");
      fetchContracts();
    } catch (error) {
      toast.error("Falha ao excluir o contrato.");
      console.error(error);
    } finally {
      setContractToDelete(null);
    }
  };

  const filteredContracts = useMemo(() => {
    let filtered = contracts;

    if (searchTerm) {
      filtered = filtered.filter(
        (contract) =>
          contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contract.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contract.costCenter?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((contract) => {
        const { status } = getContractStatus(contract.endDate);
        return status === statusFilter;
      });
    }

    return filtered;
  }, [contracts, searchTerm, statusFilter]);

  import { TableSkeleton } from "@/components/ui/TableSkeleton";
// ... (imports)

// ... (helpers)

export default function ContractsClient() {
  // ... (state and effects)

  if (loading) {
    return <TableSkeleton columns={7} />;
  }

  return (
    // ... (rest of the component)
  );
}

  return (
    <>
      <Card className="rounded-2xl shadow-sm border-slate-200 mt-8">
        <TableToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          onNewClick={() => router.push('/contracts/new')}
        />
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Contrato</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Centro de Custo</TableHead>
                <TableHead>Data de Vencimento</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            "use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  MoreHorizontal, 
  FileText, 
  Calendar, 
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { TableToolbar } from "@/components/ui/TableToolbar";
import { TableSkeleton } from "@/components/ui/TableSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";

// ... (helpers)

export default function ContractsClient() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [contractToDelete, setContractToDelete] = useState(null);
  const router = useRouter();

  // ... (fetchContracts, handleDelete, filteredContracts)

  if (loading) {
    return <TableSkeleton columns={7} />;
  }

  return (
    <>
      <Card className="rounded-2xl shadow-sm border-slate-200 mt-8">
        <TableToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          onNewClick={() => router.push('/contracts/new')}
        />
        <CardContent className="p-0">
          {filteredContracts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Contrato</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Centro de Custo</TableHead>
                  <TableHead>Data de Vencimento</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContracts.map((contract) => {
                  // ... (table row mapping)
                })}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={FileText}
              title="Nenhum contrato encontrado"
              description="Tente ajustar seus filtros ou crie um novo contrato."
              actionText="Novo Contrato"
              onActionClick={() => router.push('/contracts/new')}
            />
          )}
        </CardContent>
      </Card>

      {/* ... (AlertDialog) */}
    </>
  );
}
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!contractToDelete} onOpenChange={() => setContractToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o contrato "{contractToDelete?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

