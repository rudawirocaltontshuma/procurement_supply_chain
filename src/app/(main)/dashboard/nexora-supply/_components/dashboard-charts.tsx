"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import type { ChartConfig } from "@/components/ui/chart";
import { ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { formatCurrency } from "../_lib/format";
import { monthlyProcurementVolume, poStatusBreakdown, savingsTrend } from "../_lib/mock-data";
import { ChartCard } from "./chart-card";

const spendConfig = {
  spend: { label: "Actual Spend", color: "var(--chart-1)" },
  budget: { label: "Budget", color: "var(--chart-2)" },
} satisfies ChartConfig;

const categoryConfig = {
  spend: { label: "Spend", color: "var(--chart-1)" },
} satisfies ChartConfig;

const performanceConfig = {
  onTime: { label: "On-Time %", color: "var(--chart-1)" },
  quality: { label: "Quality %", color: "var(--chart-3)" },
} satisfies ChartConfig;

const statusConfig = {
  count: { label: "Purchase Orders" },
} satisfies ChartConfig;

const savingsConfig = {
  savings: { label: "Savings", color: "var(--chart-2)" },
  target: { label: "Target", color: "var(--chart-4)" },
} satisfies ChartConfig;

const volumeConfig = {
  orders: { label: "Orders", color: "var(--chart-1)" },
  requests: { label: "Requests", color: "var(--chart-5)" },
} satisfies ChartConfig;

const STATUS_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
];

interface DashboardChartsProps {
  spendTrend: { month: string; spend: number; budget: number }[];
  spendByCategory: { category: string; spend: number }[];
  supplierPerformanceTrend: { month: string; onTime: number; quality: number }[];
}

export function DashboardCharts({ spendTrend, spendByCategory, supplierPerformanceTrend }: DashboardChartsProps) {
  const topCategories = spendByCategory.slice(0, 8);
  const statusData = poStatusBreakdown.map((s, i) => ({ ...s, fill: STATUS_COLORS[i % STATUS_COLORS.length] }));

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ChartCard title="Spend Trend" description="Actual spend vs. budget over the last 12 months" config={spendConfig}>
        <AreaChart data={spendTrend}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => formatCurrency(v)} width={70} />
          <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Area
            dataKey="budget"
            type="monotone"
            fill="var(--color-budget)"
            fillOpacity={0.1}
            stroke="var(--color-budget)"
            strokeDasharray="4 4"
          />
          <Area
            dataKey="spend"
            type="monotone"
            fill="var(--color-spend)"
            fillOpacity={0.25}
            stroke="var(--color-spend)"
          />
        </AreaChart>
      </ChartCard>

      <ChartCard title="Spend by Category" description="Top categories by year-to-date spend" config={categoryConfig}>
        <BarChart data={topCategories} layout="vertical" margin={{ left: 12 }}>
          <CartesianGrid horizontal={false} />
          <XAxis type="number" tickLine={false} axisLine={false} tickFormatter={(v) => formatCurrency(v)} />
          <YAxis
            dataKey="category"
            type="category"
            tickLine={false}
            axisLine={false}
            width={110}
            tick={{ fontSize: 11 }}
          />
          <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
          <Bar dataKey="spend" fill="var(--color-spend)" radius={4} />
        </BarChart>
      </ChartCard>

      <ChartCard
        title="Supplier Performance"
        description="On-time delivery and quality score trend"
        config={performanceConfig}
      >
        <LineChart data={supplierPerformanceTrend}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} domain={[50, 100]} width={36} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line dataKey="onTime" type="monotone" stroke="var(--color-onTime)" strokeWidth={2} dot={false} />
          <Line dataKey="quality" type="monotone" stroke="var(--color-quality)" strokeWidth={2} dot={false} />
        </LineChart>
      </ChartCard>

      <ChartCard
        title="Purchase Order Status"
        description="Distribution of purchase orders by status"
        config={statusConfig}
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="status" />} />
          <Pie
            data={statusData}
            dataKey="count"
            nameKey="status"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
            strokeWidth={4}
          >
            {statusData.map((entry) => (
              <Cell key={entry.status} fill={entry.fill} />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="status" />} />
        </PieChart>
      </ChartCard>

      <ChartCard title="Savings" description="Realized savings vs. target" config={savingsConfig}>
        <AreaChart data={savingsTrend}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => formatCurrency(v)} width={70} />
          <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Area
            dataKey="target"
            type="monotone"
            fill="var(--color-target)"
            fillOpacity={0.08}
            stroke="var(--color-target)"
            strokeDasharray="4 4"
          />
          <Area
            dataKey="savings"
            type="monotone"
            fill="var(--color-savings)"
            fillOpacity={0.25}
            stroke="var(--color-savings)"
          />
        </AreaChart>
      </ChartCard>

      <ChartCard
        title="Monthly Procurement"
        description="Purchase requests and orders raised per month"
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
    </div>
  );
}
