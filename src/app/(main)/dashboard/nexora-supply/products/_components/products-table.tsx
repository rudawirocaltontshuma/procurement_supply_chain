"use client";

import type { DataTableColumn, DataTableFilter } from "../../_components/data-table";
import { DataTable } from "../../_components/data-table";
import { StatusBadge } from "../../_components/status-badge";
import { formatCurrency, formatNumber } from "../../_lib/format";
import { CATEGORIES, getSupplier, type Product, products } from "../../_lib/mock-data";

const columns: DataTableColumn<Product>[] = [
  {
    key: "name",
    header: "Product",
    sortValue: (row) => row.name,
    searchValue: (row) => `${row.name} ${row.sku}`,
    render: (row) => <span className="font-medium text-sm">{row.name}</span>,
  },
  {
    key: "sku",
    header: "SKU",
    sortValue: (row) => row.sku,
    render: (row) => <span className="text-muted-foreground text-sm">{row.sku}</span>,
  },
  {
    key: "category",
    header: "Category",
    sortValue: (row) => row.category,
    render: (row) => <span className="text-sm">{row.category}</span>,
  },
  {
    key: "supplier",
    header: "Supplier",
    sortValue: (row) => getSupplier(row.supplierId)?.name ?? "",
    searchValue: (row) => getSupplier(row.supplierId)?.name ?? "",
    render: (row) => <span className="text-sm">{getSupplier(row.supplierId)?.name ?? "Unknown"}</span>,
  },
  {
    key: "unitCost",
    header: "Unit Cost",
    sortValue: (row) => row.unitCost,
    render: (row) => <span className="font-medium text-sm tabular-nums">{formatCurrency(row.unitCost)}</span>,
  },
  {
    key: "stock",
    header: "Stock",
    sortValue: (row) => row.stock,
    render: (row) => <span className="text-sm tabular-nums">{formatNumber(row.stock)}</span>,
  },
  {
    key: "status",
    header: "Status",
    sortValue: (row) => row.status,
    render: (row) => <StatusBadge status={row.status} />,
  },
];

const filters: DataTableFilter<Product>[] = [
  { key: "category", label: "Category", options: [...CATEGORIES], accessor: (row) => row.category },
  {
    key: "status",
    label: "Status",
    options: ["Active", "Discontinued", "Backordered", "New"],
    accessor: (row) => row.status,
  },
];

export function ProductsTable() {
  return (
    <DataTable
      data={products}
      columns={columns}
      filters={filters}
      searchPlaceholder="Search products..."
      getRowId={(row) => row.id}
      pageSize={12}
    />
  );
}
