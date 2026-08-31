"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";

import type { ChartConfig } from "@/components/ui/chart";
import { ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { ChartCard } from "../../_components/chart-card";
import { formatCurrency } from "../../_lib/format";
import { departmentSpend, spendByCategory, spendTrend, topSuppliersBySpend } from "../../_lib/mock-data";

const spendConfig = {
  spend: { label: "Actual Spend", color: "var(--chart-1)" },
  budget: { label: "Budget", color: "var(--chart-2)" },
} satisfies ChartConfig;

const categoryConfig = { spend: { label: "Spend" } } satisfies ChartConfig;

const deptConfig = {
  spend: { label: "Spend", color: "var(--chart-1)" },
  budget: { label: "Budget", color: "var(--chart-4)" },
} satisfies ChartConfig;

const supplierConfig = { spend: { label: "Spend", color: "var(--chart-3)" } } satisfies ChartConfig;

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-1)",
  "var(--chart-2)",
];

export function SpendCharts() {
  const categoryData = spendByCategory.map((c, i) => ({ ...c, fill: COLORS[i % COLORS.length] }));
  const supplierData = topSuppliersBySpend.slice(0, 8).map((s) => ({ name: s.name, spend: s.totalSpend }));

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

      <ChartCard title="Category Distribution" description="Share of spend by category" config={categoryConfig}>
        <PieChart>
          <ChartTooltip
            content={
              <ChartTooltipContent hideLabel nameKey="category" formatter={(value) => formatCurrency(Number(value))} />
            }
          />
          <Pie
            data={categoryData}
            dataKey="spend"
            nameKey="category"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
            strokeWidth={4}
          >
            {categoryData.map((entry) => (
              <Cell key={entry.category} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ChartCard>

      <ChartCard title="Department Spend" description="Spend vs. budget by department" config={deptConfig}>
        <BarChart data={departmentSpend}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="department"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 10 }}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={50}
          />
          <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => formatCurrency(v)} width={70} />
          <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="budget" fill="var(--color-budget)" radius={4} />
          <Bar dataKey="spend" fill="var(--color-spend)" radius={4} />
        </BarChart>
      </ChartCard>

      <ChartCard title="Supplier Spend" description="Top suppliers by year-to-date spend" config={supplierConfig}>
        <BarChart data={supplierData} layout="vertical" margin={{ left: 12 }}>
          <CartesianGrid horizontal={false} />
          <XAxis type="number" tickLine={false} axisLine={false} tickFormatter={(v) => formatCurrency(v)} />
          <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={130} tick={{ fontSize: 11 }} />
          <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
          <Bar dataKey="spend" fill="var(--color-spend)" radius={4} />
        </BarChart>
      </ChartCard>
    </div>
  );
}
