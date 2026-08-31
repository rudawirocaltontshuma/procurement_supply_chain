import { notFound } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

import { PageHeader } from "../../_components/page-header";
import { StatusBadge } from "../../_components/status-badge";
import { formatCurrency, formatDate, formatNumber, formatPercent, initials } from "../../_lib/format";
import { getSupplier } from "../../_lib/mock-data";
import { SupplierDetailTabs } from "./_components/supplier-detail-tabs";

export default async function SupplierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supplier = getSupplier(id);

  if (!supplier) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={supplier.name} description={`${supplier.id} • ${supplier.category}`} />

      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarFallback>{initials(supplier.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{supplier.name}</p>
              <p className="text-muted-foreground text-sm">
                {supplier.city}, {supplier.country}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-4">
            <div>
              <p className="text-muted-foreground text-xs">Status</p>
              <StatusBadge status={supplier.status} />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Risk</p>
              <StatusBadge status={supplier.risk} />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Total Spend</p>
              <p className="font-medium tabular-nums">{formatCurrency(supplier.totalSpend)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Onboarded</p>
              <p className="font-medium">{formatDate(supplier.onboardedDate)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat label="Total Orders" value={formatNumber(supplier.totalOrders)} />
        <MiniStat label="Performance Score" value={String(supplier.performanceScore)} />
        <MiniStat label="On-Time Delivery" value={formatPercent(supplier.onTimeDeliveryRate)} />
        <MiniStat label="Quality Score" value={String(supplier.qualityScore)} />
      </div>

      <SupplierDetailTabs supplier={supplier} />
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="gap-1 py-3">
      <CardContent className="px-4">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="font-semibold text-lg tabular-nums">{value}</p>
      </CardContent>
    </Card>
  );
}
