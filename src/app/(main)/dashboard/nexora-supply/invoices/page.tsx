import { PageHeader } from "../_components/page-header";
import { InvoicesTable } from "./_components/invoices-table";

export default function InvoicesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Invoices" description="Supplier invoices and their payment status." />
      <InvoicesTable />
    </div>
  );
}
