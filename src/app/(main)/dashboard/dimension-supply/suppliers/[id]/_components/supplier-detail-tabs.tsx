"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ChartCard } from "../../../_components/chart-card";
import { StatusBadge } from "../../../_components/status-badge";
import { formatCurrency, formatDate, initials } from "../../../_lib/format";
import {
  contractsForSupplier,
  invoicesForSupplier,
  purchaseOrdersForSupplier,
  type Supplier,
  supplierPerformanceTrend,
} from "../../../_lib/mock-data";

const performanceConfig = {
  onTime: { label: "On-Time %", color: "var(--chart-1)" },
  quality: { label: "Quality %", color: "var(--chart-3)" },
} satisfies ChartConfig;

const spendConfig = {
  amount: { label: "Order Value", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function SupplierDetailTabs({ supplier }: { supplier: Supplier }) {
  const orders = purchaseOrdersForSupplier(supplier.id);
  const supplierInvoices = invoicesForSupplier(supplier.id);
  const supplierContracts = contractsForSupplier(supplier.id);
  const recentOrders = [...orders].sort((a, b) => (a.orderDate < b.orderDate ? 1 : -1)).slice(0, 8);

  const activity = [
    ...orders.slice(0, 3).map((o) => ({ label: `Purchase order ${o.id} placed`, date: o.orderDate })),
    ...supplierInvoices.slice(0, 3).map((i) => ({ label: `Invoice ${i.id} issued`, date: i.issueDate })),
    ...supplierContracts.slice(0, 2).map((c) => ({ label: `Contract ${c.id} started`, date: c.startDate })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <Tabs defaultValue="overview">
      <TabsList className="flex-wrap">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="contacts">Contacts</TabsTrigger>
        <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
        <TabsTrigger value="invoices">Invoices</TabsTrigger>
        <TabsTrigger value="contracts">Contracts</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Card>
          <CardContent className="flex flex-col gap-3">
            <p className="font-medium text-sm">Supplier Details</p>
            <DetailRow label="Payment Terms" value={supplier.paymentTerms} />
            <DetailRow label="Active Contracts" value={String(supplier.activeContracts)} />
            <DetailRow label="Category" value={supplier.category} />
            <DetailRow label="Location" value={`${supplier.city}, ${supplier.country}`} />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {supplier.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-3">
            <p className="font-medium text-sm">Snapshot</p>
            <DetailRow label="Total Orders" value={String(supplier.totalOrders)} />
            <DetailRow label="Total Spend" value={formatCurrency(supplier.totalSpend)} />
            <DetailRow
              label="Open Invoices"
              value={String(supplierInvoices.filter((i) => i.status !== "Paid").length)}
            />
            <DetailRow label="Contracts on File" value={String(supplierContracts.length)} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="contacts" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {supplier.contacts.map((contact) => (
          <Card key={contact.email}>
            <CardContent className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarFallback>{initials(contact.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-medium text-sm">{contact.name}</p>
                <p className="truncate text-muted-foreground text-xs">{contact.title}</p>
                <p className="truncate text-muted-foreground text-xs">{contact.email}</p>
                <p className="truncate text-muted-foreground text-xs">{contact.phone}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="orders">
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Expected Delivery</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length ? (
                orders.slice(0, 25).map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.id}</TableCell>
                    <TableCell>{formatDate(o.orderDate)}</TableCell>
                    <TableCell>{formatDate(o.expectedDelivery)}</TableCell>
                    <TableCell className="tabular-nums">{formatCurrency(o.amount)}</TableCell>
                    <TableCell>
                      <StatusBadge status={o.status} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-20 text-center text-muted-foreground">
                    No purchase orders yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      <TabsContent value="invoices">
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Purchase Order</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supplierInvoices.length ? (
                supplierInvoices.slice(0, 25).map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.id}</TableCell>
                    <TableCell>{inv.purchaseOrderId}</TableCell>
                    <TableCell>{formatDate(inv.issueDate)}</TableCell>
                    <TableCell>{formatDate(inv.dueDate)}</TableCell>
                    <TableCell className="tabular-nums">{formatCurrency(inv.amount)}</TableCell>
                    <TableCell>
                      <StatusBadge status={inv.status} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-20 text-center text-muted-foreground">
                    No invoices yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      <TabsContent value="contracts">
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supplierContracts.length ? (
                supplierContracts.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.title}</TableCell>
                    <TableCell>{formatDate(c.startDate)}</TableCell>
                    <TableCell>{formatDate(c.expiryDate)}</TableCell>
                    <TableCell className="tabular-nums">{formatCurrency(c.value)}</TableCell>
                    <TableCell>
                      <StatusBadge status={c.status} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-20 text-center text-muted-foreground">
                    No contracts on file.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      <TabsContent value="performance" className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <ChartCard title="Delivery & Quality Trend" config={performanceConfig} height="h-64">
          <LineChart data={supplierPerformanceTrend}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis domain={[50, 100]} tickLine={false} axisLine={false} width={32} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line dataKey="onTime" type="monotone" stroke="var(--color-onTime)" strokeWidth={2} dot={false} />
            <Line dataKey="quality" type="monotone" stroke="var(--color-quality)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartCard>
        <ChartCard title="Recent Order Value" config={spendConfig} height="h-64">
          <BarChart data={recentOrders.map((o) => ({ id: o.id, amount: o.amount }))}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="id" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 10 }} />
            <YAxis tickLine={false} axisLine={false} width={60} tickFormatter={(v) => formatCurrency(v)} />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
            <Bar dataKey="amount" fill="var(--color-amount)" radius={4} />
          </BarChart>
        </ChartCard>
      </TabsContent>

      <TabsContent value="activity">
        <Card>
          <CardContent className="flex flex-col gap-4">
            {activity.length ? (
              activity.map((event) => (
                <div key={`${event.label}-${event.date}`} className="flex items-start gap-3">
                  <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm">{event.label}</p>
                    <p className="text-muted-foreground text-xs">{formatDate(event.date)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No recent activity.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
