"use client";

import type { DataTableColumn, DataTableFilter } from "../../_components/data-table";
import { DataTable } from "../../_components/data-table";
import { StatusBadge } from "../../_components/status-badge";
import { formatCurrency, formatDate } from "../../_lib/format";
import { CATEGORIES, DEPARTMENTS, type PurchaseRequest, purchaseRequests } from "../../_lib/mock-data";

const columns: DataTableColumn<PurchaseRequest>[] = [
  {
    key: "title",
    header: "Request",
    sortValue: (row) => row.title,
    searchValue: (row) => `${row.title} ${row.id} ${row.requester}`,
    render: (row) => (
      <div>
        <p className="font-medium text-sm">{row.title}</p>
        <p className="text-muted-foreground text-xs">{row.id}</p>
      </div>
    ),
  },
  {
    key: "requester",
    header: "Requester",
    sortValue: (row) => row.requester,
    render: (row) => <span className="text-sm">{row.requester}</span>,
  },
  {
    key: "department",
    header: "Department",
    sortValue: (row) => row.department,
    render: (row) => <span className="text-sm">{row.department}</span>,
  },
  {
    key: "category",
    header: "Category",
    sortValue: (row) => row.category,
    render: (row) => <span className="text-sm">{row.category}</span>,
  },
  {
    key: "amount",
    header: "Amount",
    sortValue: (row) => row.amount,
    render: (row) => <span className="font-medium text-sm tabular-nums">{formatCurrency(row.amount)}</span>,
  },
  {
    key: "date",
    header: "Date",
    sortValue: (row) => row.dateSubmitted,
    render: (row) => <span className="text-sm">{formatDate(row.dateSubmitted)}</span>,
  },
  {
    key: "priority",
    header: "Priority",
    sortValue: (row) => row.priority,
    render: (row) => <StatusBadge status={row.priority} />,
  },
  {
    key: "status",
    header: "Status",
    sortValue: (row) => row.status,
    render: (row) => <StatusBadge status={row.status} />,
  },
];

const filters: DataTableFilter<PurchaseRequest>[] = [
  { key: "department", label: "Department", options: [...DEPARTMENTS], accessor: (row) => row.department },
  { key: "category", label: "Category", options: [...CATEGORIES], accessor: (row) => row.category },
  {
    key: "status",
    label: "Status",
    options: ["Draft", "Submitted", "Approved", "Rejected", "Converted"],
    accessor: (row) => row.status,
  },
  { key: "priority", label: "Priority", options: ["Low", "Medium", "High", "Urgent"], accessor: (row) => row.priority },
];

export function PurchaseRequestsTable() {
  return (
    <DataTable
      data={purchaseRequests}
      columns={columns}
      filters={filters}
      searchPlaceholder="Search requests..."
      getRowId={(row) => row.id}
      pageSize={12}
    />
  );
}
