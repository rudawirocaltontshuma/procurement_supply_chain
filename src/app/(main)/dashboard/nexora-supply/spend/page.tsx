import { Banknote, PiggyBank, TrendingDown, TrendingUp } from "lucide-react";

import { PageHeader } from "../_components/page-header";
import { StatCard } from "../_components/stat-card";
import { formatCurrency } from "../_lib/format";
import { departmentSpend, totalSpend } from "../_lib/mock-data";
import { SpendCharts } from "./_components/spend-charts";

export default function SpendPage() {
  const totalBudget = departmentSpend.reduce((sum, d) => sum + d.budget, 0);
  const variance = totalBudget - totalSpend;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Spend Analytics"
        description="Enterprise spend across departments, categories, and suppliers."
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Spend" value={formatCurrency(totalSpend)} icon={Banknote} hint="Year to date" />
        <StatCard label="Total Budget" value={formatCurrency(totalBudget)} icon={PiggyBank} hint="Allocated" />
        <StatCard
          label="Variance"
          value={formatCurrency(Math.abs(variance))}
          icon={variance >= 0 ? TrendingUp : TrendingDown}
          hint={variance >= 0 ? "Under budget" : "Over budget"}
        />
        <StatCard label="Departments Tracked" value={String(departmentSpend.length)} icon={Banknote} />
      </div>

      <SpendCharts />
    </div>
  );
}
