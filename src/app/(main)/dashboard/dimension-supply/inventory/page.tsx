import { PageHeader } from "../_components/page-header";
import { InventoryTable } from "./_components/inventory-table";

export default function InventoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Inventory" description="Stock levels across all warehouses, with reorder thresholds." />
      <InventoryTable />
    </div>
  );
}
