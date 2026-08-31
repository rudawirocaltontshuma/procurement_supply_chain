import { PageHeader } from "../_components/page-header";
import { PurchaseRequestsTable } from "./_components/purchase-requests-table";

export default function PurchaseRequestsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Purchase Requests"
        description="Requests submitted by teams awaiting review and conversion to purchase orders."
      />
      <PurchaseRequestsTable />
    </div>
  );
}
