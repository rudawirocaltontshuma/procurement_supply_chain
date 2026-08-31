"use client";

import type { DataTableColumn, DataTableFilter } from "../../_components/data-table";
import { DataTable } from "../../_components/data-table";
import { StatusBadge } from "../../_components/status-badge";
import { formatCurrency, formatDate, formatNumber } from "../../_lib/format";
import { DEPARTMENTS, getSupplier, type PurchaseOrder, purchaseOrders } from "../../_lib/mock-data";

const columns: DataTableColumn<PurchaseOrder>[] = [
  {
    key: "id",
    header: "PO Number",
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
    key: "department",
    header: "Department",
    sortValue: (row) => row.department,
    render: (row) => <span className="text-sm">{row.department}</span>,
  },
  {
    key: "items",
    header: "Items",
    sortValue: (row) => row.itemCount,
    render: (row) => <span className="text-sm tabular-nums">{formatNumber(row.itemCount)}</span>,
  },
  {
    key: "amount",
    header: "Amount",
    sortValue: (row) => row.amount,
    render: (row) => <span className="font-medium text-sm tabular-nums">{formatCurrency(row.amount)}</span>,
  },
  {
    key: "orderDate",
    header: "Date",
    sortValue: (row) => row.orderDate,
    render: (row) => <span className="text-sm">{formatDate(row.orderDate)}</span>,
  },
  {
    key: "expectedDelivery",
    header: "Expected Delivery",
    sortValue: (row) => row.expectedDelivery,
    render: (row) => <span className="text-sm">{formatDate(row.expectedDelivery)}</span>,
  },
  {
    key: "status",
    header: "Status",
    sortValue: (row) => row.status,
    render: (row) => <StatusBadge status={row.status} />,
  },
];

const filters: DataTableFilter<PurchaseOrder>[] = [
  { key: "department", label: "Department", options: [...DEPARTMENTS], accessor: (row) => row.department },
  {
    key: "status",
    label: "Status",
    options: ["Draft", "Pending Approval", "Approved", "Sent", "Partially Received", "Received", "Closed", "Cancelled"],
    accessor: (row) => row.status,
  },
];

export function PurchaseOrdersTable() {
  return (
    <DataTable
      data={purchaseOrders}
      columns={columns}
      filters={filters}
      searchPlaceholder="Search purchase orders..."
      getRowId={(row) => row.id}
      pageSize={12}
    />
  );
}
