import { PageHeader } from "../_components/page-header";
import { SettingsPanels } from "./_components/settings-panels";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Organization profile, notifications, approval thresholds, and access."
      />
      <SettingsPanels />
    </div>
  );
}
