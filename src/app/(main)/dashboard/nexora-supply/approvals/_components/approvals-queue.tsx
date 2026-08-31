"use client";

import * as React from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import type { DataTableColumn, DataTableFilter } from "../../_components/data-table";
import { DataTable } from "../../_components/data-table";
import { StatusBadge } from "../../_components/status-badge";
import { formatCurrency, formatDate, formatDateTime } from "../../_lib/format";
import { type ApprovalQueueItem, approvalQueue as initialApprovalQueue } from "../../_lib/mock-data";

export function ApprovalsQueue() {
  const [queue, setQueue] = React.useState<ApprovalQueueItem[]>(initialApprovalQueue);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const selected = queue.find((item) => item.id === selectedId) ?? null;

  function decide(itemId: string, decision: "Approved" | "Rejected") {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: decision,
              history: [
                ...item.history,
                {
                  actor: item.approver,
                  action: decision === "Approved" ? "Approved request" : "Rejected request",
                  date: new Date().toISOString().slice(0, 10),
                  note:
                    decision === "Approved" ? "Approved via approval workspace." : "Rejected via approval workspace.",
                },
              ],
            }
          : item,
      ),
    );
    toast(decision === "Approved" ? "Request approved" : "Request rejected", {
      description: `${itemId} has been ${decision.toLowerCase()}.`,
    });
  }

  const columns: DataTableColumn<ApprovalQueueItem>[] = [
    {
      key: "request",
      header: "Request",
      sortValue: (row) => row.requestTitle,
      searchValue: (row) => `${row.requestTitle} ${row.requestId} ${row.requester}`,
      render: (row) => (
        <div>
          <p className="font-medium text-sm">{row.requestTitle}</p>
          <p className="text-muted-foreground text-xs">{row.requestId}</p>
        </div>
      ),
    },
    {
      key: "requester",
      header: "Requester",
      sortValue: (row) => row.requester,
      render: (row) => <span className="text-sm">{row.requester}</span>,
    },
    {
      key: "amount",
      header: "Amount",
      sortValue: (row) => row.amount,
      render: (row) => <span className="font-medium text-sm tabular-nums">{formatCurrency(row.amount)}</span>,
    },
    {
      key: "approver",
      header: "Approver",
      sortValue: (row) => row.approver,
      render: (row) => <span className="text-sm">{row.approver}</span>,
    },
    {
      key: "submitted",
      header: "Submitted",
      sortValue: (row) => row.submitted,
      render: (row) => <span className="text-sm">{formatDate(row.submitted)}</span>,
    },
    {
      key: "priority",
      header: "Priority",
      sortValue: (row) => row.priority,
      render: (row) => <StatusBadge status={row.priority} />,
    },
    {
      key: "status",
      header: "Status",
      sortValue: (row) => row.status,
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const filters: DataTableFilter<ApprovalQueueItem>[] = [
    { key: "status", label: "Status", options: ["Pending", "Approved", "Rejected"], accessor: (row) => row.status },
    {
      key: "priority",
      label: "Priority",
      options: ["Low", "Medium", "High", "Urgent"],
      accessor: (row) => row.priority,
    },
  ];

  return (
    <>
      <DataTable
        data={queue}
        columns={columns}
        filters={filters}
        searchPlaceholder="Search approvals..."
        getRowId={(row) => row.id}
        onRowClick={(row) => setSelectedId(row.id)}
        pageSize={12}
      />

      <Sheet open={selected !== null} onOpenChange={(open) => !open && setSelectedId(null)}>
        <SheetContent className="sm:max-w-md">
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle>{selected.requestTitle}</SheetTitle>
                <SheetDescription>
                  {selected.requestId} • Requested by {selected.requester}
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-4 px-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium tabular-nums">{formatCurrency(selected.amount)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Priority</span>
                  <StatusBadge status={selected.priority} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={selected.status} />
                </div>
                <div>
                  <p className="mb-2 font-medium text-sm">Approval Timeline</p>
                  <div className="flex flex-col gap-3 border-l pl-4">
                    {selected.history.map((event) => (
                      <div key={`${event.actor}-${event.action}-${event.date}`} className="relative">
                        <div className="absolute top-1 -left-[21px] size-2 rounded-full bg-primary" />
                        <p className="text-sm">{event.action}</p>
                        <p className="text-muted-foreground text-xs">
                          {event.actor} • {formatDateTime(event.date)}
                        </p>
                        {event.note ? (
                          <p className="mt-0.5 text-muted-foreground text-xs italic">{event.note}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <SheetFooter className="flex-row gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  disabled={selected.status !== "Pending"}
                  onClick={() => decide(selected.id, "Rejected")}
                >
                  Reject
                </Button>
                <Button
                  className="flex-1"
                  disabled={selected.status !== "Pending"}
                  onClick={() => decide(selected.id, "Approved")}
                >
                  Approve
                </Button>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
}
