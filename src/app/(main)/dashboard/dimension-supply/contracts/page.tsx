import { PageHeader } from "../_components/page-header";
import { ContractsTable } from "./_components/contracts-table";

export default function ContractsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Contracts" description="Supplier agreements, terms, and renewal windows." />
      <ContractsTable />
    </div>
  );
}
