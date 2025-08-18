"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { TableToolbar } from "@/components/ui/TableToolbar";

const formSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  number: z.string().min(1, { message: "O número da conta é obrigatório." }),
});

export default function AccountingAccountsClient() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", number: "" },
  });

  async function fetchAccounts() {
    try {
      const response = await fetch("/api/accounting-accounts");
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error("Failed to fetch accounts", error);
      toast.error("Falha ao carregar contas contábeis.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleDialogOpen = (account = null) => {
    setSelectedAccount(account);
    form.reset({ name: account?.name || "", number: account?.number || "" });
    setIsDialogOpen(true);
  };

  const handleAlertOpen = (account) => {
    setSelectedAccount(account);
    setIsAlertOpen(true);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const isEditing = !!selectedAccount;
    const url = isEditing ? `/api/accounting-accounts/${selectedAccount.id}` : "/api/accounting-accounts";
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Operation failed");
      toast.success(isEditing ? "Conta atualizada!" : "Conta criada!");
      setIsDialogOpen(false);
      fetchAccounts();
    } catch (error) {
      toast.error("Ocorreu um erro.");
    }
  }

  async function onDelete() {
    if (!selectedAccount) return;
    try {
      await fetch(`/api/accounting-accounts/${selectedAccount.id}`, {
        method: "DELETE",
      });
      toast.success("Conta excluída!");
      setIsAlertOpen(false);
      fetchAccounts();
    } catch (error) {
      toast.error("Falha ao excluir a conta.");
    }
  }

  const filteredAccounts = accounts.filter(acc =>
    acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  import { TableSkeleton } from "@/components/ui/TableSkeleton";
// ... (imports)

// ... (schema)

export default function AccountingAccountsClient() {
  // ... (state and effects)

  if (loading) {
    return <TableSkeleton columns={3} />;
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
          statusFilter="all"
          onStatusChange={() => {}}
          onNewClick={() => handleDialogOpen()}
        />
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Número</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            "use client";

import { useState, useEffect } from "react";
// ... (imports)
import { TableSkeleton } from "@/components/ui/TableSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Book } from "lucide-react";

// ... (formSchema)

export default function AccountingAccountsClient() {
  // ... (state and effects)

  // ... (handlers)

  if (loading) {
    return <TableSkeleton columns={3} />;
  }

  return (
    <>
      <Card className="rounded-2xl shadow-sm border-slate-200 mt-8">
        <TableToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter="all"
          onStatusChange={() => {}}
          onNewClick={() => handleDialogOpen()}
        />
        <CardContent className="p-0">
          {filteredAccounts.length > 0 ? (
            <Table>
              {/* ... (Table Header) */}
              <TableBody>
                {filteredAccounts.map((acc) => (
                  <TableRow key={acc.id}>
                    {/* ... (Table Cells) */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={Book}
              title="Nenhuma conta contábil encontrada"
              description="Comece cadastrando uma nova conta para organizar suas despesas."
              actionText="Nova Conta Contábil"
              onActionClick={() => handleDialogOpen()}
            />
          )}
        </CardContent>
      </Card>

      {/* ... (Dialogs) */}
    </>
  );
}
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAccount ? "Editar" : "Nova"} Conta Contábil</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl><Input placeholder="Ex: Despesas de TI" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="number" render={({ field }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
                  <FormControl><Input placeholder="Ex: 401.01" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a conta "{selectedAccount?.name}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
