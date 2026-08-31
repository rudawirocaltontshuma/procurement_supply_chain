import { PageHeader } from "../_components/page-header";
import { ReportsTabs } from "./_components/reports-tabs";

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Reports" description="Standard procurement and supply chain reports." />
      <ReportsTabs />
    </div>
  );
}
