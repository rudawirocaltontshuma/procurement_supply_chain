import { PageHeader } from "../_components/page-header";
import { AnalyticsTabs } from "./_components/analytics-tabs";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Analytics"
        description="Deep-dive analytics across procurement, suppliers, spend, inventory, and delivery."
      />
      <AnalyticsTabs />
    </div>
  );
}
