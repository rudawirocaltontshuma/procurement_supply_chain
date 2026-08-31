"use client";

import type { DataTableColumn, DataTableFilter } from "../../_components/data-table";
import { DataTable } from "../../_components/data-table";
import { StatusBadge } from "../../_components/status-badge";
import { formatCurrency, formatDate } from "../../_lib/format";
import { CATEGORIES, type Contract, contracts, getSupplier } from "../../_lib/mock-data";

const columns: DataTableColumn<Contract>[] = [
  {
    key: "title",
    header: "Contract",
    sortValue: (row) => row.title,
    searchValue: (row) => `${row.title} ${row.id}`,
    render: (row) => (
      <div>
        <p className="font-medium text-sm">{row.title}</p>
        <p className="text-muted-foreground text-xs">{row.id}</p>
      </div>
    ),
  },
  {
    key: "supplier",
    header: "Supplier",
    sortValue: (row) => getSupplier(row.supplierId)?.name ?? "",
    searchValue: (row) => getSupplier(row.supplierId)?.name ?? "",
    render: (row) => <span className="text-sm">{getSupplier(row.supplierId)?.name ?? "Unknown"}</span>,
  },
  {
    key: "category",
    header: "Category",
    sortValue: (row) => row.category,
    render: (row) => <span className="text-sm">{row.category}</span>,
  },
  {
    key: "startDate",
    header: "Start Date",
    sortValue: (row) => row.startDate,
    render: (row) => <span className="text-sm">{formatDate(row.startDate)}</span>,
  },
  {
    key: "expiryDate",
    header: "Expiry",
    sortValue: (row) => row.expiryDate,
    render: (row) => <span className="text-sm">{formatDate(row.expiryDate)}</span>,
  },
  {
    key: "value",
    header: "Value",
    sortValue: (row) => row.value,
    render: (row) => <span className="font-medium text-sm tabular-nums">{formatCurrency(row.value)}</span>,
  },
  {
    key: "status",
    header: "Status",
    sortValue: (row) => row.status,
    render: (row) => <StatusBadge status={row.status} />,
  },
];

const filters: DataTableFilter<Contract>[] = [
  { key: "category", label: "Category", options: [...CATEGORIES], accessor: (row) => row.category },
  {
    key: "status",
    label: "Status",
    options: ["Active", "Draft", "Expiring Soon", "Expired", "Terminated"],
    accessor: (row) => row.status,
  },
];

export function ContractsTable() {
  return (
    <DataTable
      data={contracts}
      columns={columns}
      filters={filters}
      searchPlaceholder="Search contracts..."
      getRowId={(row) => row.id}
      pageSize={12}
    />
  );
}
