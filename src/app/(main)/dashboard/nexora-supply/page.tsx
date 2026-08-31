import { Banknote, Boxes, Clock3, FileWarning, PackageCheck, PiggyBank, ShoppingCart, Truck } from "lucide-react";

import { DashboardCharts } from "./_components/dashboard-charts";
import { PageHeader } from "./_components/page-header";
import { StatCard } from "./_components/stat-card";
import { formatCurrency, formatNumber, formatPercent } from "./_lib/format";
import { kpis, spendByCategory, spendTrend, supplierPerformanceTrend } from "./_lib/mock-data";

export default function NexoraSupplyDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Nexora Supply"
        description="Procurement and supply chain overview across suppliers, orders, inventory, and spend."
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Total Spend" value={formatCurrency(kpis.totalSpend)} icon={Banknote} hint="Year to date" />
        <StatCard
          label="Pending Requests"
          value={formatNumber(kpis.pendingRequests)}
          icon={FileWarning}
          hint="Awaiting approval"
        />
        <StatCard
          label="Open Purchase Orders"
          value={formatNumber(kpis.openPurchaseOrders)}
          icon={ShoppingCart}
          hint="In progress"
        />
        <StatCard
          label="Active Suppliers"
          value={formatNumber(kpis.activeSuppliers)}
          icon={Truck}
          hint="Currently engaged"
        />
        <StatCard
          label="Outstanding Invoices"
          value={formatNumber(kpis.outstandingInvoices)}
          icon={PackageCheck}
          hint={formatCurrency(kpis.outstandingInvoiceValue)}
        />
        <StatCard
          label="YTD Savings"
          value={formatCurrency(kpis.totalSavings)}
          icon={PiggyBank}
          trend={{ value: "+8.4% vs target", positive: true }}
        />
        <StatCard
          label="On-Time Delivery"
          value={formatPercent(kpis.onTimeDeliveryRate)}
          icon={Clock3}
          hint="Supplier average"
        />
        <StatCard
          label="Contracts Expiring"
          value={formatNumber(kpis.contractsExpiringSoon)}
          icon={Boxes}
          hint="Within 60 days"
        />
      </div>

      <DashboardCharts
        spendTrend={spendTrend}
        spendByCategory={spendByCategory}
        supplierPerformanceTrend={supplierPerformanceTrend}
      />
    </div>
  );
}
