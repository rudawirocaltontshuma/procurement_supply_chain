import { PageHeader } from "../_components/page-header";
import { SourcingTable } from "./_components/sourcing-table";

export default function SourcingPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Sourcing" description="Active RFx events and supplier evaluation workspace." />
      <SourcingTable />
    </div>
  );
}
