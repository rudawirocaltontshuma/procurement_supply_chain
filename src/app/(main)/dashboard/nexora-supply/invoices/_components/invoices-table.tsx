"use client";

import type { DataTableColumn, DataTableFilter } from "../../_components/data-table";
import { DataTable } from "../../_components/data-table";
import { StatusBadge } from "../../_components/status-badge";
import { formatCurrency, formatDate } from "../../_lib/format";
import { getSupplier, type Invoice, invoices } from "../../_lib/mock-data";

const columns: DataTableColumn<Invoice>[] = [
  {
    key: "id",
    header: "Invoice",
    sortValue: (row) => row.id,
    render: (row) => <span className="font-medium text-sm">{row.id}</span>,
  },
  {
    key: "supplier",
    header: "Supplier",
    sortValue: (row) => getSupplier(row.supplierId)?.name ?? "",
    searchValue: (row) => getSupplier(row.supplierId)?.name ?? "",
    render: (row) => <span className="text-sm">{getSupplier(row.supplierId)?.name ?? "Unknown"}</span>,
  },
  {
    key: "purchaseOrderId",
    header: "Purchase Order",
    sortValue: (row) => row.purchaseOrderId,
    render: (row) => <span className="text-sm">{row.purchaseOrderId}</span>,
  },
  {
    key: "amount",
    header: "Amount",
    sortValue: (row) => row.amount,
    render: (row) => <span className="font-medium text-sm tabular-nums">{formatCurrency(row.amount)}</span>,
  },
  {
    key: "dueDate",
    header: "Due Date",
    sortValue: (row) => row.dueDate,
    render: (row) => <span className="text-sm">{formatDate(row.dueDate)}</span>,
  },
  {
    key: "status",
    header: "Status",
    sortValue: (row) => row.status,
    render: (row) => <StatusBadge status={row.status} />,
  },
];

const filters: DataTableFilter<Invoice>[] = [
  {
    key: "status",
    label: "Status",
    options: ["Pending", "Approved", "Paid", "Overdue", "Disputed"],
    accessor: (row) => row.status,
  },
];

export function InvoicesTable() {
  return (
    <DataTable
      data={invoices}
      columns={columns}
      filters={filters}
      searchPlaceholder="Search invoices..."
      getRowId={(row) => row.id}
      pageSize={12}
    />
  );
}
