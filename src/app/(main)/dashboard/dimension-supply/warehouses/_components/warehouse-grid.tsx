import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { StatusBadge } from "../../_components/status-badge";
import { formatCurrency, formatNumber } from "../../_lib/format";
import { warehouses } from "../../_lib/mock-data";

export function WarehouseGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {warehouses.map((warehouse) => (
        <Card key={warehouse.id}>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium text-sm">{warehouse.name}</p>
                <p className="text-muted-foreground text-xs">
                  {warehouse.city}, {warehouse.country}
                </p>
              </div>
              <StatusBadge status={warehouse.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Capacity</p>
                <p className="font-medium tabular-nums">{formatNumber(warehouse.capacity)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Inventory Value</p>
                <p className="font-medium tabular-nums">{formatCurrency(warehouse.inventoryValue)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Manager</p>
                <p className="font-medium">{warehouse.manager}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Utilization</p>
                <p className="font-medium tabular-nums">{warehouse.utilization}%</p>
              </div>
            </div>

            <Progress value={warehouse.utilization} className="h-1.5" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
