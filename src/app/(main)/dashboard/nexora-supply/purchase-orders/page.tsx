import { PageHeader } from "../_components/page-header";
import { PurchaseOrdersTable } from "./_components/purchase-orders-table";

export default function PurchaseOrdersPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Purchase Orders" description="Track orders issued to suppliers from draft through delivery." />
      <PurchaseOrdersTable />
    </div>
  );
}
