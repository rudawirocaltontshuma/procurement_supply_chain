import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Tone = "green" | "amber" | "red" | "blue" | "gray" | "purple";

const TONE_CLASSES: Record<Tone, string> = {
  green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  red: "bg-red-500/10 text-red-600 dark:text-red-400",
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  gray: "bg-muted text-muted-foreground",
  purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
};

const STATUS_TONE: Record<string, Tone> = {
  // Supplier status
  Active: "green",
  "Pending Approval": "amber",
  Suspended: "red",
  Inactive: "gray",
  // Risk level
  Low: "green",
  Medium: "amber",
  High: "red",
  Critical: "red",
  // Purchase request status
  Draft: "gray",
  Submitted: "blue",
  Approved: "green",
  Rejected: "red",
  Converted: "purple",
  // Purchase order status
  Sent: "blue",
  "Partially Received": "amber",
  Received: "green",
  Closed: "gray",
  Cancelled: "red",
  // Contract status
  "Expiring Soon": "amber",
  Expired: "red",
  Terminated: "red",
  // Product status
  Discontinued: "gray",
  Backordered: "amber",
  New: "blue",
  // Inventory status
  "In Stock": "green",
  "Low Stock": "amber",
  "Out of Stock": "red",
  Overstock: "purple",
  // Receipt status
  Pending: "amber",
  Partial: "amber",
  Completed: "green",
  // Invoice status
  Paid: "green",
  Overdue: "red",
  Disputed: "purple",
  // Sourcing status
  Open: "blue",
  Evaluating: "amber",
  Awarded: "green",
  // Priority level
  Urgent: "red",
  // Warehouse status
  Operational: "green",
  "Limited Capacity": "amber",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const tone = STATUS_TONE[status] ?? "gray";
  return (
    <Badge variant="outline" className={cn("border-transparent font-medium", TONE_CLASSES[tone], className)}>
      {status}
    </Badge>
  );
}
