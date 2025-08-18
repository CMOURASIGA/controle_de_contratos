"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Schema for form validation
const formSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  supplier: z.string().min(2, "Fornecedor é obrigatório"),
  focalPointEmail: z.string().email("Email inválido"),
  totalValue: z.coerce.number().positive("O valor deve ser positivo"),
  startDate: z.date({ required_error: "Data de início é obrigatória." }),
  endDate: z.date({ required_error: "Data de fim é obrigatória." }),
  costCenterId: z.string({ required_error: "Centro de custo é obrigatório." }),
  accountingAccountId: z.string({ required_error: "Conta contábil é obrigatória." }),
});

// Define the props for the component, including optional initialData
interface ContractFormProps {
  initialData?: z.infer<typeof formSchema> & { id: number };
}

export default function ContractForm({ initialData }: ContractFormProps) {
  const router = useRouter();
  const [costCenters, setCostCenters] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const isEditing = !!initialData;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      startDate: new Date(initialData.startDate),
      endDate: new Date(initialData.endDate),
      costCenterId: String(initialData.costCenterId),
      accountingAccountId: String(initialData.accountingAccountId),
    } : {
      name: "",
      supplier: "",
      focalPointEmail: "",
      totalValue: 0,
      startDate: undefined,
      endDate: undefined,
      costCenterId: undefined,
      accountingAccountId: undefined,
    },
  });

  useEffect(() => {
    async function fetchRelatedData() {
      try {
        const [costCentersRes, accountsRes] = await Promise.all([
          fetch("/api/cost-centers"),
          fetch("/api/accounting-accounts"),
        ]);
        setCostCenters(await costCentersRes.json());
        setAccounts(await accountsRes.json());
      } catch (error) {
        console.error("Failed to fetch related data", error);
      }
    }
    fetchRelatedData();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const url = isEditing ? `/api/contracts/${initialData.id}` : "/api/contracts";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || (isEditing ? "Failed to update contract" : "Failed to create contract"));
      }

      toast.success(isEditing ? "Contrato atualizado com sucesso!" : "Contrato criado com sucesso!");
      router.push("/contracts");
      router.refresh(); // Refresh server components
    } catch (error) {
      toast.error(error.message || "Ocorreu um erro.");
      console.error(error);
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Contrato" : "Novo Contrato"}</CardTitle>
        <CardDescription>
          {isEditing ? "Atualize os detalhes do contrato." : "Preencha os detalhes do novo contrato."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Form fields remain the same, react-hook-form handles the values */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <FormField name="name" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome do Contrato</FormLabel>
                                <FormControl><Input placeholder="Ex: Licença Software" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField name="supplier" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fornecedor</FormLabel>
                                <FormControl><Input placeholder="Ex: Microsoft" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField name="focalPointEmail" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email do Ponto Focal</FormLabel>
                                <FormControl><Input type="email" placeholder="contato@empresa.com" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField name="totalValue" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Valor Total (R$)</FormLabel>
                                <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                    <div className="space-y-4">
                        <FormField name="startDate" control={form.control} render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Data de Início</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                {field.value ? format(new Date(field.value), "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField name="endDate" control={form.control} render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Data de Fim</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                {field.value ? format(new Date(field.value), "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField name="costCenterId" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Centro de Custo</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {costCenters.map(cc => <SelectItem key={cc.id} value={String(cc.id)}>{cc.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField name="accountingAccountId" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Conta Contábil</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {accounts.map(acc => <SelectItem key={acc.id} value={String(acc.id)}>{acc.name} ({acc.number})</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
              <Button type="submit">{isEditing ? "Salvar Alterações" : "Salvar Contrato"}</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
