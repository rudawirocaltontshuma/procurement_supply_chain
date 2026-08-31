"use client";

import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, XAxis, YAxis } from "recharts";

import type { ChartConfig } from "@/components/ui/chart";
import { ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ChartCard } from "../../_components/chart-card";
import { formatCurrency } from "../../_lib/format";
import {
  contracts,
  inventory,
  monthlyProcurementVolume,
  poStatusBreakdown,
  purchaseOrders,
  purchaseRequests,
  receipts,
  savingsTrend,
  spendByCategory,
  spendTrend,
  supplierPerformanceTrend,
  suppliers,
  warehouses,
} from "../../_lib/mock-data";

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

const volumeConfig = {
  orders: { label: "Orders", color: "var(--chart-1)" },
  requests: { label: "Requests", color: "var(--chart-5)" },
} satisfies ChartConfig;

const prStatusConfig = { count: { label: "Requests" } } satisfies ChartConfig;

const riskConfig = { count: { label: "Suppliers" } } satisfies ChartConfig;

const performanceConfig = {
  onTime: { label: "On-Time %", color: "var(--chart-1)" },
  quality: { label: "Quality %", color: "var(--chart-3)" },
} satisfies ChartConfig;

const supplierSpendConfig = { spend: { label: "Spend", color: "var(--chart-2)" } } satisfies ChartConfig;

const spendConfig = {
  spend: { label: "Spend", color: "var(--chart-1)" },
} satisfies ChartConfig;

const savingsConfig = {
  savings: { label: "Savings", color: "var(--chart-2)" },
  target: { label: "Target", color: "var(--chart-4)" },
} satisfies ChartConfig;

const inventoryConfig = {
  available: { label: "Available", color: "var(--chart-1)" },
  reserved: { label: "Reserved", color: "var(--chart-3)" },
} satisfies ChartConfig;

const statusConfig = { value: { label: "Inventory Items" } } satisfies ChartConfig;

const deliveryConfig = { count: { label: "Purchase Orders" } } satisfies ChartConfig;

const receiptConfig = { count: { label: "Receipts" } } satisfies ChartConfig;

function bucketCounts<T>(items: T[], accessor: (item: T) => string) {
  const map = new Map<string, number>();
  for (const item of items) {
    const key = accessor(item);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return Array.from(map.entries()).map(([key, count]) => ({ key, count }));
}

export function AnalyticsTabs() {
  const prStatusData = bucketCounts(purchaseRequests, (pr) => pr.status).map((d, i) => ({
    ...d,
    fill: COLORS[i % COLORS.length],
  }));
  const riskData = bucketCounts(suppliers, (s) => s.risk).map((d, i) => ({ ...d, fill: COLORS[i % COLORS.length] }));
  const supplierSpend = [...suppliers]
    .sort((a, b) => b.totalSpend - a.totalSpend)
    .slice(0, 8)
    .map((s) => ({ name: s.name, spend: s.totalSpend }));

  const invStatusData = bucketCounts(inventory, (i) => i.status).map((d, i) => ({
    ...d,
    fill: COLORS[i % COLORS.length],
  }));
  const warehouseUtilization = warehouses.map((w) => ({ name: w.name, utilization: w.utilization }));

  const leadTimeBuckets = [
    { label: "0-7 days", min: 0, max: 7 },
    { label: "8-14 days", min: 8, max: 14 },
    { label: "15-30 days", min: 15, max: 30 },
    { label: "31-60 days", min: 31, max: 60 },
    { label: "60+ days", min: 61, max: Number.POSITIVE_INFINITY },
  ];
  const deliveryLeadTime = leadTimeBuckets.map((bucket) => ({
    label: bucket.label,
    count: purchaseOrders.filter((po) => {
      const days = Math.round(
        (new Date(po.expectedDelivery).getTime() - new Date(po.orderDate).getTime()) / 86_400_000,
      );
      return days >= bucket.min && days <= bucket.max;
    }).length,
  }));

  const receiptStatusData = bucketCounts(receipts, (r) => r.status).map((d, i) => ({
    ...d,
    fill: COLORS[i % COLORS.length],
  }));

  const contractStatusData = bucketCounts(contracts, (c) => c.status).map((d, i) => ({
    ...d,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <Tabs defaultValue="procurement">
      <TabsList className="flex-wrap">
        <TabsTrigger value="procurement">Procurement</TabsTrigger>
        <TabsTrigger value="supplier">Supplier</TabsTrigger>
        <TabsTrigger value="spend">Spend</TabsTrigger>
        <TabsTrigger value="inventory">Inventory</TabsTrigger>
        <TabsTrigger value="delivery">Delivery</TabsTrigger>
      </TabsList>

      <TabsContent value="procurement" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Monthly Procurement Volume"
          description="Requests and orders raised per month"
          config={volumeConfig}
        >
          <BarChart data={monthlyProcurementVolume}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} width={32} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="requests" fill="var(--color-requests)" radius={4} />
            <Bar dataKey="orders" fill="var(--color-orders)" radius={4} />
          </BarChart>
        </ChartCard>
        <ChartCard
          title="Purchase Request Status"
          description="Breakdown of requests by lifecycle status"
          config={prStatusConfig}
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="key" />} />
            <Pie
              data={prStatusData}
              dataKey="count"
              nameKey="key"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}
              strokeWidth={4}
            >
              {prStatusData.map((entry) => (
                <Cell key={entry.key} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="key" />} />
          </PieChart>
        </ChartCard>
        <ChartCard
          title="Contract Status"
          description="Contracts by lifecycle status"
          config={{ count: { label: "Contracts" } } satisfies ChartConfig}
        >
          <BarChart data={contractStatusData} layout="vertical" margin={{ left: 12 }}>
            <CartesianGrid horizontal={false} />
            <XAxis type="number" tickLine={false} axisLine={false} />
            <YAxis
              dataKey="key"
              type="category"
              tickLine={false}
              axisLine={false}
              width={100}
              tick={{ fontSize: 11 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" radius={4}>
              {contractStatusData.map((entry) => (
                <Cell key={entry.key} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartCard>
      </TabsContent>

      <TabsContent value="supplier" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Supplier Performance Trend"
          description="On-time delivery and quality over time"
          config={performanceConfig}
        >
          <LineChart data={supplierPerformanceTrend}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis domain={[50, 100]} tickLine={false} axisLine={false} width={32} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line dataKey="onTime" type="monotone" stroke="var(--color-onTime)" strokeWidth={2} dot={false} />
            <Line dataKey="quality" type="monotone" stroke="var(--color-quality)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartCard>
        <ChartCard title="Supplier Risk Distribution" description="Suppliers grouped by risk level" config={riskConfig}>
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="key" />} />
            <Pie
              data={riskData}
              dataKey="count"
              nameKey="key"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}
              strokeWidth={4}
            >
              {riskData.map((entry) => (
                <Cell key={entry.key} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="key" />} />
          </PieChart>
        </ChartCard>
        <ChartCard title="Top Suppliers by Spend" config={supplierSpendConfig} className="lg:col-span-2">
          <BarChart data={supplierSpend} layout="vertical" margin={{ left: 12 }}>
            <CartesianGrid horizontal={false} />
            <XAxis type="number" tickLine={false} axisLine={false} tickFormatter={(v) => formatCurrency(v)} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              width={140}
              tick={{ fontSize: 11 }}
            />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
            <Bar dataKey="spend" fill="var(--color-spend)" radius={4} />
          </BarChart>
        </ChartCard>
      </TabsContent>

      <TabsContent value="spend" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Spend Trend" config={spendConfig}>
          <LineChart data={spendTrend}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => formatCurrency(v)} width={70} />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
            <Line dataKey="spend" type="monotone" stroke="var(--color-spend)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartCard>
        <ChartCard title="Savings vs. Target" config={savingsConfig}>
          <LineChart data={savingsTrend}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => formatCurrency(v)} width={70} />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="target"
              type="monotone"
              stroke="var(--color-target)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
            <Line dataKey="savings" type="monotone" stroke="var(--color-savings)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartCard>
        <ChartCard
          title="Category Spend"
          config={{ spend: { label: "Spend" } } satisfies ChartConfig}
          className="lg:col-span-2"
        >
          <BarChart data={spendByCategory}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
              interval={0}
              angle={-25}
              textAnchor="end"
              height={60}
            />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => formatCurrency(v)} width={70} />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
            <Bar dataKey="spend" radius={4}>
              {spendByCategory.map((entry, i) => (
                <Cell key={entry.category} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ChartCard>
      </TabsContent>

      <TabsContent value="inventory" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Inventory Status" description="Items by stock status" config={statusConfig}>
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="key" />} />
            <Pie
              data={invStatusData}
              dataKey="count"
              nameKey="key"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}
              strokeWidth={4}
            >
              {invStatusData.map((entry) => (
                <Cell key={entry.key} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="key" />} />
          </PieChart>
        </ChartCard>
        <ChartCard title="Warehouse Utilization" description="Capacity utilization by site" config={inventoryConfig}>
          <BarChart data={warehouseUtilization} layout="vertical" margin={{ left: 12 }}>
            <CartesianGrid horizontal={false} />
            <XAxis type="number" tickLine={false} axisLine={false} unit="%" />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              width={140}
              tick={{ fontSize: 11 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="utilization" fill="var(--color-available)" radius={4} />
          </BarChart>
        </ChartCard>
      </TabsContent>

      <TabsContent value="delivery" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Delivery Lead Time"
          description="Purchase orders bucketed by expected lead time"
          config={deliveryConfig}
        >
          <BarChart data={deliveryLeadTime}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <YAxis tickLine={false} axisLine={false} width={32} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--chart-1)" radius={4} />
          </BarChart>
        </ChartCard>
        <ChartCard title="Receipt Status" description="Goods receipts by completion status" config={receiptConfig}>
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="key" />} />
            <Pie
              data={receiptStatusData}
              dataKey="count"
              nameKey="key"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}
              strokeWidth={4}
            >
              {receiptStatusData.map((entry) => (
                <Cell key={entry.key} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="key" />} />
          </PieChart>
        </ChartCard>
        <ChartCard
          title="Purchase Order Status"
          description="Current status of all purchase orders"
          config={{ count: { label: "Orders" } } satisfies ChartConfig}
          className="lg:col-span-2"
        >
          <BarChart data={poStatusBreakdown}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="status"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={50}
            />
            <YAxis tickLine={false} axisLine={false} width={32} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" radius={4}>
              {poStatusBreakdown.map((entry, i) => (
                <Cell key={entry.status} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ChartCard>
      </TabsContent>
    </Tabs>
  );
}
