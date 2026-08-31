import { PageHeader } from "../_components/page-header";
import { WarehouseGrid } from "./_components/warehouse-grid";

export default function WarehousesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Warehouses" description="Distribution centers, capacity, and inventory value on hand." />
      <WarehouseGrid />
    </div>
  );
}
