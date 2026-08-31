"use client";

import type { DataTableColumn, DataTableFilter } from "../../_components/data-table";
import { DataTable } from "../../_components/data-table";
import { StatusBadge } from "../../_components/status-badge";
import { formatDate, formatNumber } from "../../_lib/format";
import { getSupplier, getWarehouse, type Receipt, receipts, warehouses } from "../../_lib/mock-data";

const columns: DataTableColumn<Receipt>[] = [
  {
    key: "id",
    header: "Receipt",
    sortValue: (row) => row.id,
    render: (row) => <span className="font-medium text-sm">{row.id}</span>,
  },
  {
    key: "purchaseOrderId",
    header: "Purchase Order",
    sortValue: (row) => row.purchaseOrderId,
    render: (row) => <span className="text-sm">{row.purchaseOrderId}</span>,
  },
  {
    key: "supplier",
    header: "Supplier",
    sortValue: (row) => getSupplier(row.supplierId)?.name ?? "",
    searchValue: (row) => getSupplier(row.supplierId)?.name ?? "",
    render: (row) => <span className="text-sm">{getSupplier(row.supplierId)?.name ?? "Unknown"}</span>,
  },
  {
    key: "itemCount",
    header: "Items",
    sortValue: (row) => row.itemCount,
    render: (row) => <span className="text-sm tabular-nums">{formatNumber(row.itemCount)}</span>,
  },
  {
    key: "date",
    header: "Date",
    sortValue: (row) => row.date,
    render: (row) => <span className="text-sm">{formatDate(row.date)}</span>,
  },
  {
    key: "warehouse",
    header: "Warehouse",
    sortValue: (row) => getWarehouse(row.warehouseId)?.name ?? "",
    render: (row) => <span className="text-sm">{getWarehouse(row.warehouseId)?.name ?? "Unknown"}</span>,
  },
  {
    key: "status",
    header: "Status",
    sortValue: (row) => row.status,
    render: (row) => <StatusBadge status={row.status} />,
  },
];

const filters: DataTableFilter<Receipt>[] = [
  {
    key: "warehouse",
    label: "Warehouse",
    options: warehouses.map((w) => w.name),
    accessor: (row) => getWarehouse(row.warehouseId)?.name ?? "",
  },
  {
    key: "status",
    label: "Status",
    options: ["Pending", "Partial", "Completed", "Rejected"],
    accessor: (row) => row.status,
  },
];

export function ReceiptsTable() {
  return (
    <DataTable
      data={receipts}
      columns={columns}
      filters={filters}
      searchPlaceholder="Search receipts..."
      getRowId={(row) => row.id}
      pageSize={12}
    />
  );
}
