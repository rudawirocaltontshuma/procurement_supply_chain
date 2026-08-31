import { PageHeader } from "../_components/page-header";
import { ReceiptsTable } from "./_components/receipts-table";

export default function ReceiptsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Receipts" description="Goods receipts recorded against purchase orders." />
      <ReceiptsTable />
    </div>
  );
}
