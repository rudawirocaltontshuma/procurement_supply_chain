"use client";

import type { DataTableColumn, DataTableFilter } from "../../_components/data-table";
import { DataTable } from "../../_components/data-table";
import { StatusBadge } from "../../_components/status-badge";
import { formatNumber } from "../../_lib/format";
import { getProduct, getWarehouse, type InventoryItem, inventory, warehouses } from "../../_lib/mock-data";

const columns: DataTableColumn<InventoryItem>[] = [
  {
    key: "product",
    header: "Product",
    sortValue: (row) => getProduct(row.productId)?.name ?? "",
    searchValue: (row) => `${getProduct(row.productId)?.name ?? ""} ${getProduct(row.productId)?.sku ?? ""}`,
    render: (row) => <span className="font-medium text-sm">{getProduct(row.productId)?.name ?? "Unknown"}</span>,
  },
  {
    key: "sku",
    header: "SKU",
    sortValue: (row) => getProduct(row.productId)?.sku ?? "",
    render: (row) => <span className="text-muted-foreground text-sm">{getProduct(row.productId)?.sku ?? "—"}</span>,
  },
  {
    key: "warehouse",
    header: "Warehouse",
    sortValue: (row) => getWarehouse(row.warehouseId)?.name ?? "",
    render: (row) => <span className="text-sm">{getWarehouse(row.warehouseId)?.name ?? "Unknown"}</span>,
  },
  {
    key: "available",
    header: "Available",
    sortValue: (row) => row.available,
    render: (row) => <span className="text-sm tabular-nums">{formatNumber(row.available)}</span>,
  },
  {
    key: "reserved",
    header: "Reserved",
    sortValue: (row) => row.reserved,
    render: (row) => <span className="text-sm tabular-nums">{formatNumber(row.reserved)}</span>,
  },
  {
    key: "incoming",
    header: "Incoming",
    sortValue: (row) => row.incoming,
    render: (row) => <span className="text-sm tabular-nums">{formatNumber(row.incoming)}</span>,
  },
  {
    key: "reorderLevel",
    header: "Reorder Level",
    sortValue: (row) => row.reorderLevel,
    render: (row) => <span className="text-sm tabular-nums">{formatNumber(row.reorderLevel)}</span>,
  },
  {
    key: "status",
    header: "Status",
    sortValue: (row) => row.status,
    render: (row) => <StatusBadge status={row.status} />,
  },
];

const filters: DataTableFilter<InventoryItem>[] = [
  {
    key: "warehouse",
    label: "Warehouse",
    options: warehouses.map((w) => w.name),
    accessor: (row) => getWarehouse(row.warehouseId)?.name ?? "",
  },
  {
    key: "status",
    label: "Status",
    options: ["In Stock", "Low Stock", "Out of Stock", "Overstock"],
    accessor: (row) => row.status,
  },
];

export function InventoryTable() {
  return (
    <DataTable
      data={inventory}
      columns={columns}
      filters={filters}
      searchPlaceholder="Search inventory..."
      getRowId={(row) => row.id}
      pageSize={12}
    />
  );
}
