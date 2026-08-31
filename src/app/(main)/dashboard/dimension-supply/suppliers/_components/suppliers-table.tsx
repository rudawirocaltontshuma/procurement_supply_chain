"use client";

import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

import type { DataTableColumn, DataTableFilter } from "../../_components/data-table";
import { DataTable } from "../../_components/data-table";
import { StatusBadge } from "../../_components/status-badge";
import { formatCurrency, formatNumber, initials } from "../../_lib/format";
import { CATEGORIES, type Supplier, suppliers } from "../../_lib/mock-data";

const columns: DataTableColumn<Supplier>[] = [
  {
    key: "name",
    header: "Supplier",
    sortValue: (row) => row.name,
    searchValue: (row) => `${row.name} ${row.id}`,
    render: (row) => (
      <div className="flex items-center gap-2">
        <Avatar className="size-7">
          <AvatarFallback className="text-[10px]">{initials(row.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-medium text-sm">{row.name}</p>
          <p className="text-muted-foreground text-xs">{row.id}</p>
        </div>
      </div>
    ),
  },
  {
    key: "category",
    header: "Category",
    sortValue: (row) => row.category,
    render: (row) => <span className="text-sm">{row.category}</span>,
  },
  {
    key: "location",
    header: "Location",
    sortValue: (row) => row.city,
    searchValue: (row) => `${row.city} ${row.country}`,
    render: (row) => (
      <span className="text-sm">
        {row.city}, {row.country}
      </span>
    ),
  },
  {
    key: "orders",
    header: "Orders",
    sortValue: (row) => row.totalOrders,
    render: (row) => <span className="text-sm tabular-nums">{formatNumber(row.totalOrders)}</span>,
  },
  {
    key: "spend",
    header: "Spend",
    sortValue: (row) => row.totalSpend,
    render: (row) => <span className="font-medium text-sm tabular-nums">{formatCurrency(row.totalSpend)}</span>,
  },
  {
    key: "performance",
    header: "Performance",
    sortValue: (row) => row.performanceScore,
    render: (row) => (
      <div className="flex w-28 items-center gap-2">
        <Progress value={row.performanceScore} className="h-1.5" />
        <span className="w-8 text-right text-xs tabular-nums">{row.performanceScore}</span>
      </div>
    ),
  },
  {
    key: "risk",
    header: "Risk",
    sortValue: (row) => row.risk,
    render: (row) => <StatusBadge status={row.risk} />,
  },
  {
    key: "status",
    header: "Status",
    sortValue: (row) => row.status,
    render: (row) => <StatusBadge status={row.status} />,
  },
];

const filters: DataTableFilter<Supplier>[] = [
  { key: "category", label: "Category", options: [...CATEGORIES], accessor: (row) => row.category },
  {
    key: "status",
    label: "Status",
    options: ["Active", "Pending Approval", "Suspended", "Inactive"],
    accessor: (row) => row.status,
  },
  { key: "risk", label: "Risk", options: ["Low", "Medium", "High", "Critical"], accessor: (row) => row.risk },
];

export function SuppliersTable() {
  const router = useRouter();

  return (
    <DataTable
      data={suppliers}
      columns={columns}
      filters={filters}
      searchPlaceholder="Search suppliers..."
      getRowId={(row) => row.id}
      onRowClick={(row) => router.push(`/dashboard/dimension-supply/suppliers/${row.id}`)}
      pageSize={12}
    />
  );
}
