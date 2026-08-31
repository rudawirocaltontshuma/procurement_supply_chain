import { PageHeader } from "../_components/page-header";
import { SuppliersTable } from "./_components/suppliers-table";

export default function SuppliersPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Suppliers" description="Directory of all onboarded suppliers and their performance." />
      <SuppliersTable />
    </div>
  );
}
