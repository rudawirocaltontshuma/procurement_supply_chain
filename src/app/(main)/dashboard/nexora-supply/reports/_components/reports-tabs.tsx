"use client";

import type { ReactNode } from "react";

import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ChartCard } from "../../_components/chart-card";
import { StatusBadge } from "../../_components/status-badge";
import { formatCurrency, formatDate } from "../../_lib/format";
import {
  contracts,
  departmentSpend,
  getSupplier,
  inventory,
  invoices,
  poStatusBreakdown,
  purchaseOrders,
  receipts,
  savingsTrend,
  spendByCategory,
  spendTrend,
  suppliers,
  topSuppliersBySpend,
} from "../../_lib/mock-data";

const spendConfig = { spend: { label: "Spend", color: "var(--chart-1)" } } satisfies ChartConfig;
const supplierConfig = { spend: { label: "Spend", color: "var(--chart-2)" } } satisfies ChartConfig;
const poConfig = { count: { label: "Purchase Orders", color: "var(--chart-1)" } } satisfies ChartConfig;
const invoiceConfig = { amount: { label: "Amount", color: "var(--chart-3)" } } satisfies ChartConfig;
const contractConfig = { value: { label: "Value", color: "var(--chart-4)" } } satisfies ChartConfig;
const inventoryConfig = { count: { label: "Items", color: "var(--chart-1)" } } satisfies ChartConfig;
const deliveryConfig = { count: { label: "Receipts", color: "var(--chart-2)" } } satisfies ChartConfig;
const savingsConfig = {
  savings: { label: "Savings", color: "var(--chart-2)" },
  target: { label: "Target", color: "var(--chart-4)" },
} satisfies ChartConfig;

function bucketCounts<T>(items: T[], accessor: (item: T) => string) {
  const map = new Map<string, number>();
  for (const item of items) map.set(accessor(item), (map.get(accessor(item)) ?? 0) + 1);
  return Array.from(map.entries()).map(([key, count]) => ({ key, count }));
}

export function ReportsTabs() {
  const overdueInvoiceCount = invoices.filter((i) => i.status === "Overdue").length;
  const invoiceStatusData = bucketCounts(invoices, (i) => i.status);
  const inventoryStatusData = bucketCounts(inventory, (i) => i.status);
  const receiptStatusData = bucketCounts(receipts, (r) => r.status);
  const contractStatusData = bucketCounts(contracts, (c) => c.status);

  return (
    <Tabs defaultValue="spend">
      <TabsList className="flex-wrap">
        <TabsTrigger value="spend">Spend</TabsTrigger>
        <TabsTrigger value="supplier">Supplier</TabsTrigger>
        <TabsTrigger value="po">Purchase Order</TabsTrigger>
        <TabsTrigger value="invoice">Invoice</TabsTrigger>
        <TabsTrigger value="contract">Contract</TabsTrigger>
        <TabsTrigger value="inventory">Inventory</TabsTrigger>
        <TabsTrigger value="delivery">Delivery</TabsTrigger>
        <TabsTrigger value="savings">Savings</TabsTrigger>
      </TabsList>

      <TabsContent value="spend" className="flex flex-col gap-4">
        <ChartCard title="Spend Report" description="Monthly actual spend vs. budget" config={spendConfig}>
          <LineChart data={spendTrend}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => formatCurrency(v)} width={70} />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
            <Line dataKey="spend" type="monotone" stroke="var(--color-spend)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartCard>
        <SimpleTable
          headers={["Category", "Spend"]}
          rows={spendByCategory.map((c) => ({ key: c.category, cells: [c.category, formatCurrency(c.spend)] }))}
        />
      </TabsContent>

      <TabsContent value="supplier" className="flex flex-col gap-4">
        <ChartCard title="Supplier Spend Report" description="Top suppliers by spend" config={supplierConfig}>
          <BarChart
            data={topSuppliersBySpend.slice(0, 8).map((s) => ({ name: s.name, spend: s.totalSpend }))}
            layout="vertical"
            margin={{ left: 12 }}
          >
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
        <SimpleTable
          headers={["Supplier", "Category", "Orders", "Spend", "Status"]}
          rows={topSuppliersBySpend.slice(0, 10).map((s) => ({
            key: s.id,
            cells: [
              s.name,
              s.category,
              String(s.totalOrders),
              formatCurrency(s.totalSpend),
              <StatusBadge key={s.id} status={s.status} />,
            ],
          }))}
        />
        <p className="text-muted-foreground text-xs">{suppliers.length} suppliers tracked across all categories.</p>
      </TabsContent>

      <TabsContent value="po" className="flex flex-col gap-4">
        <ChartCard title="Purchase Order Report" description="Orders by status" config={poConfig}>
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
            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
          </BarChart>
        </ChartCard>
        <SimpleTable
          headers={["PO Number", "Supplier", "Amount", "Status"]}
          rows={[...purchaseOrders]
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 10)
            .map((po) => ({
              key: po.id,
              cells: [
                po.id,
                getSupplier(po.supplierId)?.name ?? "Unknown",
                formatCurrency(po.amount),
                <StatusBadge key={po.id} status={po.status} />,
              ],
            }))}
        />
      </TabsContent>

      <TabsContent value="invoice" className="flex flex-col gap-4">
        <ChartCard title="Invoice Report" description="Invoices by status" config={invoiceConfig}>
          <BarChart data={invoiceStatusData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="key" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
            <YAxis tickLine={false} axisLine={false} width={32} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--chart-3)" radius={4} />
          </BarChart>
        </ChartCard>
        <SimpleTable
          headers={["Invoice", "Supplier", "Amount", "Due Date", "Status"]}
          rows={[...invoices]
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 10)
            .map((inv) => ({
              key: inv.id,
              cells: [
                inv.id,
                getSupplier(inv.supplierId)?.name ?? "Unknown",
                formatCurrency(inv.amount),
                formatDate(inv.dueDate),
                <StatusBadge key={inv.id} status={inv.status} />,
              ],
            }))}
        />
        <p className="text-muted-foreground text-xs">{overdueInvoiceCount} invoices currently overdue.</p>
      </TabsContent>

      <TabsContent value="contract" className="flex flex-col gap-4">
        <ChartCard title="Contract Report" description="Contracts by status" config={contractConfig}>
          <BarChart data={contractStatusData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="key"
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
            <Bar dataKey="count" fill="var(--chart-4)" radius={4} />
          </BarChart>
        </ChartCard>
        <SimpleTable
          headers={["Contract", "Supplier", "Value", "Expiry", "Status"]}
          rows={[...contracts]
            .sort((a, b) => b.value - a.value)
            .slice(0, 10)
            .map((c) => ({
              key: c.id,
              cells: [
                c.title,
                getSupplier(c.supplierId)?.name ?? "Unknown",
                formatCurrency(c.value),
                formatDate(c.expiryDate),
                <StatusBadge key={c.id} status={c.status} />,
              ],
            }))}
        />
      </TabsContent>

      <TabsContent value="inventory" className="flex flex-col gap-4">
        <ChartCard title="Inventory Report" description="Items by stock status" config={inventoryConfig}>
          <BarChart data={inventoryStatusData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="key" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
            <YAxis tickLine={false} axisLine={false} width={32} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--chart-1)" radius={4} />
          </BarChart>
        </ChartCard>
        <SimpleTable
          headers={["Status", "Item Count"]}
          rows={inventoryStatusData.map((d) => ({ key: d.key, cells: [d.key, String(d.count)] }))}
        />
      </TabsContent>

      <TabsContent value="delivery" className="flex flex-col gap-4">
        <ChartCard title="Delivery Report" description="Receipts by status" config={deliveryConfig}>
          <BarChart data={receiptStatusData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="key" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
            <YAxis tickLine={false} axisLine={false} width={32} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--chart-2)" radius={4} />
          </BarChart>
        </ChartCard>
        <SimpleTable
          headers={["Receipt", "Purchase Order", "Warehouse", "Date", "Status"]}
          rows={receipts.slice(0, 10).map((r) => ({
            key: r.id,
            cells: [
              r.id,
              r.purchaseOrderId,
              r.warehouseId,
              formatDate(r.date),
              <StatusBadge key={r.id} status={r.status} />,
            ],
          }))}
        />
      </TabsContent>

      <TabsContent value="savings" className="flex flex-col gap-4">
        <ChartCard title="Savings Report" description="Realized savings vs. target by month" config={savingsConfig}>
          <LineChart data={savingsTrend}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => formatCurrency(v)} width={70} />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
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
        <SimpleTable
          headers={["Department", "Spend", "Budget"]}
          rows={departmentSpend.map((d) => ({
            key: d.department,
            cells: [d.department, formatCurrency(d.spend), formatCurrency(d.budget)],
          }))}
        />
      </TabsContent>
    </Tabs>
  );
}

interface SimpleTableRow {
  key: string;
  cells: ReactNode[];
}

function SimpleTable({ headers, rows }: { headers: string[]; rows: SimpleTableRow[] }) {
  return (
    <Card>
      <CardContent className="overflow-x-auto px-0">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.key}>
                {row.cells.map((cell, j) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: cell position within a fixed-width row is a stable key
                  <TableCell key={j}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
