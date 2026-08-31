"use client";

import * as React from "react";

import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
  searchValue?: (row: T) => string;
  className?: string;
  headClassName?: string;
}

export interface DataTableFilter<T> {
  key: string;
  label: string;
  options: string[];
  accessor: (row: T) => string;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  filters?: DataTableFilter<T>[];
  searchPlaceholder?: string;
  onRowClick?: (row: T) => void;
  getRowId: (row: T) => string;
  pageSize?: number;
  emptyMessage?: string;
}

function preventNav(event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}

function SortIcon({ active, direction }: { active?: boolean; direction?: "asc" | "desc" }) {
  if (!active) return <ArrowUpDown className="size-3 text-muted-foreground/50" />;
  if (direction === "asc") return <ArrowUp className="size-3" />;
  return <ArrowDown className="size-3" />;
}

export function DataTable<T>({
  data,
  columns,
  filters = [],
  searchPlaceholder = "Search...",
  onRowClick,
  getRowId,
  pageSize = 10,
  emptyMessage = "No results.",
}: DataTableProps<T>) {
  const [search, setSearch] = React.useState("");
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string>>({});
  const [sort, setSort] = React.useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [page, setPage] = React.useState(0);

  const filtered = React.useMemo(() => {
    let rows = data;
    if (search.trim()) {
      const query = search.trim().toLowerCase();
      rows = rows.filter((row) =>
        columns.some((col) => {
          const value = col.searchValue ? col.searchValue(row) : String(col.render(row) ?? "");
          return value.toLowerCase().includes(query);
        }),
      );
    }
    for (const filter of filters) {
      const value = activeFilters[filter.key];
      if (value && value !== "all") {
        rows = rows.filter((row) => filter.accessor(row) === value);
      }
    }
    return rows;
  }, [data, search, activeFilters, filters, columns]);

  const sorted = React.useMemo(() => {
    if (!sort) return filtered;
    const column = columns.find((c) => c.key === sort.key);
    if (!column) return filtered;
    const withValue = filtered.map((row) => ({
      row,
      value: column.sortValue ? column.sortValue(row) : String(column.render(row) ?? ""),
    }));
    withValue.sort((a, b) => {
      if (typeof a.value === "number" && typeof b.value === "number") {
        return sort.direction === "asc" ? a.value - b.value : b.value - a.value;
      }
      const cmp = String(a.value).localeCompare(String(b.value));
      return sort.direction === "asc" ? cmp : -cmp;
    });
    return withValue.map((v) => v.row);
  }, [filtered, sort, columns]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const pageRows = sorted.slice(currentPage * pageSize, currentPage * pageSize + pageSize);

  const pageNumbers = React.useMemo(() => {
    const cp = currentPage + 1;
    if (pageCount <= 3) return Array.from({ length: pageCount }, (_, i) => i + 1);
    if (cp <= 2) return [1, 2, 3];
    if (cp >= pageCount - 1) return [pageCount - 2, pageCount - 1, pageCount];
    return [cp - 1, cp, cp + 1];
  }, [currentPage, pageCount]);

  function toggleSort(key: string) {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, direction: "asc" };
      if (prev.direction === "asc") return { key, direction: "desc" };
      return null;
    });
    setPage(0);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
          />
        </div>
        {filters.map((filter) => (
          <Select
            key={filter.key}
            value={activeFilters[filter.key] ?? "all"}
            onValueChange={(value) => {
              setActiveFilters((prev) => ({ ...prev, [filter.key]: value }));
              setPage(0);
            }}
          >
            <SelectTrigger className="w-full sm:w-40" size="sm">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{`All ${filter.label}`}</SelectItem>
              {filter.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className={col.headClassName}>
                  <button
                    type="button"
                    className={cn(
                      "flex items-center gap-1 font-medium text-xs",
                      col.sortValue ? "cursor-pointer hover:text-foreground" : "cursor-default",
                    )}
                    onClick={() => col.sortValue && toggleSort(col.key)}
                    disabled={!col.sortValue}
                  >
                    {col.header}
                    {col.sortValue ? <SortIcon active={sort?.key === col.key} direction={sort?.direction} /> : null}
                  </button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length ? (
              pageRows.map((row) => (
                <TableRow
                  key={getRowId(row)}
                  className={onRowClick ? "cursor-pointer" : undefined}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-muted-foreground text-sm">
          Showing {pageRows.length} of {sorted.length.toLocaleString()} results
        </p>
        {pageCount > 1 ? (
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent className="gap-1.5">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  className={currentPage === 0 ? "pointer-events-none opacity-50" : undefined}
                  onClick={(event) => {
                    preventNav(event);
                    setPage((p) => Math.max(0, p - 1));
                  }}
                />
              </PaginationItem>
              {pageNumbers.map((num) => (
                <PaginationItem key={num}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === num - 1}
                    onClick={(event) => {
                      preventNav(event);
                      setPage(num - 1);
                    }}
                  >
                    {num}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  className={currentPage >= pageCount - 1 ? "pointer-events-none opacity-50" : undefined}
                  onClick={(event) => {
                    preventNav(event);
                    setPage((p) => Math.min(pageCount - 1, p + 1));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        ) : null}
      </div>
    </div>
  );
}
