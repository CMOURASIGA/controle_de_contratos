import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  change?: string;
  changeType?: "increase" | "decrease" | "warning";
}

export function StatCard({ label, value, icon: Icon, change, changeType }: StatCardProps) {
  const changeColor = {
    increase: "text-success",
    decrease: "text-destructive",
    warning: "text-warning",
  };

  return (
    <Card className="rounded-2xl shadow-sm border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-700">{label}</CardTitle>
        <Icon className="h-5 w-5 text-slate-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        {change && (
          <p className={cn("text-xs text-muted-foreground", changeType && changeColor[changeType])}>
            {change} vs. mês anterior
          </p>
        )}
      </CardContent>
    </Card>
  );
}