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
import { 
  MoreHorizontal, 
  Building, 
  Edit, 
  Trash2, 
} from "lucide-react";
import { TableToolbar } from "@/components/ui/TableToolbar";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
});

export default function CostCentersClient() {
  const [costCenters, setCostCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedCostCenter, setSelectedCostCenter] = useState(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  });

  async function fetchCostCenters() {
    try {
      const response = await fetch("/api/cost-centers");
      const data = await response.json();
      setCostCenters(data);
    } catch (error) {
      console.error("Failed to fetch cost centers", error);
      toast.error("Falha ao carregar centros de custo");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCostCenters();
  }, []);

  const handleDialogOpen = (costCenter = null) => {
    setSelectedCostCenter(costCenter);
    form.reset({ name: costCenter?.name || "" });
    setIsDialogOpen(true);
  };

  const handleAlertOpen = (costCenter) => {
    setSelectedCostCenter(costCenter);
    setIsAlertOpen(true);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const isEditing = !!selectedCostCenter;
    const url = isEditing ? `/api/cost-centers/${selectedCostCenter.id}` : "/api/cost-centers";
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Operation failed");
      }

      toast.success(isEditing ? "Centro de custo atualizado!" : "Centro de custo criado!");
      setIsDialogOpen(false);
      fetchCostCenters();
    } catch (error) {
      toast.error("Ocorreu um erro.");
    }
  }

  async function onDelete() {
    if (!selectedCostCenter) return;
    try {
      await fetch(`/api/cost-centers/${selectedCostCenter.id}`, {
        method: "DELETE",
      });
      toast.success("Centro de custo excluído!");
      setIsAlertOpen(false);
      fetchCostCenters();
    } catch (error) {
      toast.error("Falha ao excluir centro de custo.");
    }
  }

  const filteredCostCenters = costCenters.filter(cc =>
    cc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  import { TableSkeleton } from "@/components/ui/TableSkeleton";
// ... (imports)

// ... (schema)

export default function CostCentersClient() {
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
                <TableHead>Nome do Centro de Custo</TableHead>
                <TableHead>Contratos Associados</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            "use client";

import { useState, useEffect } from "react";
// ... (imports)
import { TableSkeleton } from "@/components/ui/TableSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Building } from "lucide-react";

// ... (formSchema)

export default function CostCentersClient() {
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
          {filteredCostCenters.length > 0 ? (
            <Table>
              {/* ... (Table Header) */}
              <TableBody>
                {filteredCostCenters.map((cc) => (
                  <TableRow key={cc.id}>
                    {/* ... (Table Cells) */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={Building}
              title="Nenhum centro de custo encontrado"
              description="Comece cadastrando um novo centro de custo para organizar seus contratos."
              actionText="Novo Centro de Custo"
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
            <DialogTitle>{selectedCostCenter ? "Editar" : "Novo"} Centro de Custo</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: TI, RH" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              Tem certeza que deseja excluir o centro de custo "{selectedCostCenter?.name}"?
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

