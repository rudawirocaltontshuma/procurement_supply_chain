import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  hint?: string;
  trend?: { value: string; positive?: boolean };
  className?: string;
}

export function StatCard({ label, value, icon: Icon, hint, trend, className }: StatCardProps) {
  return (
    <Card className={cn("gap-2 py-4", className)}>
      <CardContent className="flex items-start justify-between gap-3 px-4">
        <div className="min-w-0">
          <p className="truncate text-muted-foreground text-xs">{label}</p>
          <p className="mt-1 font-semibold text-xl tabular-nums">{value}</p>
          {hint ? <p className="mt-1 truncate text-muted-foreground text-xs">{hint}</p> : null}
          {trend ? (
            <p
              className={cn(
                "mt-1 font-medium text-xs",
                trend.positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
              )}
            >
              {trend.value}
            </p>
          ) : null}
        </div>
        {Icon ? (
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Icon className="size-4.5" />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
