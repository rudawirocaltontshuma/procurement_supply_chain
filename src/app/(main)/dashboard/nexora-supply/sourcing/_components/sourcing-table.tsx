"use client";

import type { DataTableColumn, DataTableFilter } from "../../_components/data-table";
import { DataTable } from "../../_components/data-table";
import { StatusBadge } from "../../_components/status-badge";
import { formatCurrency, formatDate } from "../../_lib/format";
import { CATEGORIES, type SourcingEvent, sourcingEvents } from "../../_lib/mock-data";

const columns: DataTableColumn<SourcingEvent>[] = [
  {
    key: "title",
    header: "Sourcing Event",
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
    key: "category",
    header: "Category",
    sortValue: (row) => row.category,
    render: (row) => <span className="text-sm">{row.category}</span>,
  },
  {
    key: "suppliers",
    header: "Suppliers",
    sortValue: (row) => row.supplierIds.length,
    render: (row) => <span className="text-sm tabular-nums">{row.supplierIds.length}</span>,
  },
  {
    key: "deadline",
    header: "Deadline",
    sortValue: (row) => row.deadline,
    render: (row) => <span className="text-sm">{formatDate(row.deadline)}</span>,
  },
  {
    key: "estimatedValue",
    header: "Estimated Value",
    sortValue: (row) => row.estimatedValue,
    render: (row) => <span className="font-medium text-sm tabular-nums">{formatCurrency(row.estimatedValue)}</span>,
  },
  {
    key: "status",
    header: "Status",
    sortValue: (row) => row.status,
    render: (row) => <StatusBadge status={row.status} />,
  },
];

const filters: DataTableFilter<SourcingEvent>[] = [
  { key: "category", label: "Category", options: [...CATEGORIES], accessor: (row) => row.category },
  {
    key: "status",
    label: "Status",
    options: ["Draft", "Open", "Evaluating", "Awarded", "Closed", "Cancelled"],
    accessor: (row) => row.status,
  },
];

export function SourcingTable() {
  return (
    <DataTable
      data={sourcingEvents}
      columns={columns}
      filters={filters}
      searchPlaceholder="Search sourcing events..."
      getRowId={(row) => row.id}
      pageSize={12}
    />
  );
}
