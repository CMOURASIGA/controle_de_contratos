"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from 'lucide-react';

// Helper to format dates
const formatDate = (dateString) => new Date(dateString).toLocaleDateString("pt-BR", { timeZone: 'UTC' });
// Helper to format currency
const formatCurrency = (value) => (value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function ContractDetailsClient() {
  const [contract, setContract] = useState(null);
  const [expenseForm, setExpenseForm] = useState({ description: '', amount: '', date: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const fetchContractDetails = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const response = await fetch(`/api/contracts/${id}`);
      if (!response.ok) throw new Error('Contrato não encontrado');
      const data = await response.json();
      setContract(data);
    } catch (_err) {
      setError('Falha ao carregar o contrato.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchContractDetails();
  }, [fetchContractDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseForm(prev => ({ ...prev, [name]: value }));
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!expenseForm.description || !expenseForm.amount || !expenseForm.date) {
      setError('Todos os campos da despesa são obrigatórios.');
      return;
    }
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...expenseForm, contractId: id })
      });
      if (!response.ok) throw new Error('Falha ao adicionar despesa');
      setExpenseForm({ description: '', amount: '', date: '' });
      fetchContractDetails(); // Refresh data
    } catch (_err) {
      setError('Falha ao adicionar despesa.');
    }
  };

  const totalSpent = contract?.expenses.reduce((sum, exp) => sum + exp.amount, 0) ?? 0;
  const remainingBalance = (contract?.totalValue ?? 0) - totalSpent;

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!contract) return <div>Contrato não encontrado.</div>;

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => router.push('/contracts')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para a Lista
      </Button>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Valor Total</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{formatCurrency(contract.totalValue)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Gasto</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-red-600">{formatCurrency(totalSpent)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Saldo Restante</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-green-600">{formatCurrency(remainingBalance)}</p></CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader><CardTitle>Detalhes do Contrato</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Fornecedor:</strong> {contract.supplier}</p>
              <p><strong>Ponto Focal:</strong> {contract.focalPointEmail}</p>
              <p><strong>Início:</strong> {formatDate(contract.startDate)}</p>
              <p><strong>Vencimento:</strong> {formatDate(contract.endDate)}</p>
              <p><strong>Centro de Custo:</strong> {contract.costCenter.name}</p>
              <p><strong>Conta Contábil:</strong> {contract.accountingAccount.name} ({contract.accountingAccount.number})</p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader><CardTitle>Adicionar Despesa</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleExpenseSubmit} className="flex flex-col md:flex-row gap-2">
                <Input name="description" value={expenseForm.description} onChange={handleInputChange} placeholder="Descrição" required />
                <Input name="amount" type="number" value={expenseForm.amount} onChange={handleInputChange} placeholder="Valor" step="0.01" required className="w-32"/>
                <Input name="date" type="date" value={expenseForm.date} onChange={handleInputChange} required className="w-40"/>
                <Button type="submit">Adicionar</Button>
              </form>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Despesas Registradas</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contract.expenses.length > 0 ? (
                    contract.expenses.map(exp => (
                      <TableRow key={exp.id}>
                        <TableCell>{exp.description}</TableCell>
                        <TableCell>{formatDate(exp.date)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(exp.amount)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center h-24">Nenhuma despesa registrada.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
