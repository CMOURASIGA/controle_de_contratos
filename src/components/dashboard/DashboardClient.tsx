"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { FileText, DollarSign, BarChart, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";

const mockStats = [
  {
    label: "Contratos Ativos",
    value: "152",
    icon: FileText,
    change: "+2.5%",
    changeType: "increase",
  },
  {
    label: "Total Vigente",
    value: "R$ 1.2M",
    icon: DollarSign,
    change: "+10%",
    changeType: "increase",
  },
  {
    label: "Média Ticket",
    value: "R$ 8.1K",
    icon: BarChart,
    change: "-1.2%",
    changeType: "decrease",
  },
  {
    label: "Próximos a Vencer",
    value: "8",
    icon: AlertTriangle,
    change: "em 30 dias",
    changeType: "warning",
  },
];

export default function DashboardClient() {
  return (
    <>
      <PageHeader
        title="Dashboard Executivo"
        description="Visão geral dos contratos e despesas."
      >
        <Button>Novo Contrato</Button>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8">
        {mockStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <SectionCard
          title="Despesas por Mês"
          className="lg:col-span-2"
          description="Gráfico de despesas dos últimos 6 meses."
        >
          {/* Chart component will go here */}
          <div className="h-64 bg-slate-200 rounded-lg flex items-center justify-center">
            <p className="text-slate-500">Chart Placeholder</p>
          </div>
        </SectionCard>

        <SectionCard
          title="Vencem nos Próximos 30 Dias"
          description="Contratos com vencimento próximo."
        >
          {/* Contracts list will go here */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Contrato #{120 + i}</p>
                  <p className="text-sm text-muted-foreground">Centro de Custo {i + 1}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">R$ {5000 * (i + 1)}</p>
                  <Button variant="link" size="sm" className="h-auto p-0">Ver</Button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}