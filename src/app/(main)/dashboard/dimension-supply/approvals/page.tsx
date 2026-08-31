import { PageHeader } from "../_components/page-header";
import { ApprovalsQueue } from "./_components/approvals-queue";

export default function ApprovalsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Approvals" description="Review pending purchase requests and act on approval decisions." />
      <ApprovalsQueue />
    </div>
  );
}
