"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
  Column,
  RowData,
} from "@tanstack/react-table";
import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableToolbar } from "./DataTableToolbar";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "select";
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} searchKey={searchKey} />
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const canSort = header.column.getCanSort();
                      const isSorted = header.column.getIsSorted();
                      
                      return (
                        <TableCell
                          key={header.id}
                          isHeader
                          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                          {header.isPlaceholder ? null : (
                            <div className="space-y-2">
                              {/* Header with sorting */}
                              <div
                                className={`flex items-center space-x-2 ${
                                  canSort ? "cursor-pointer select-none group" : ""
                                }`}
                                onClick={
                                  canSort
                                    ? header.column.getToggleSortingHandler()
                                    : undefined
                                }
                              >
                                <span className="transition-colors group-hover:text-gray-700 dark:group-hover:text-gray-300">
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                                </span>
                                {canSort && (
                                  <div className="flex flex-col space-y-[-2px]">
                                    <svg
                                      className={`h-3 w-3 transition-colors ${
                                        isSorted === "asc"
                                          ? "text-primary dark:text-primary"
                                          : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400"
                                      }`}
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 15l7-7 7 7"
                                      />
                                    </svg>
                                    <svg
                                      className={`h-3 w-3 transition-colors ${
                                        isSorted === "desc"
                                          ? "text-primary dark:text-primary"
                                          : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400"
                                      }`}
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                      />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              
                              {/* Filter under header */}
                              {header.column.getCanFilter() && (
                                <div className="flex justify-start">
                                  <Filter column={header.column} />
                                </div>
                              )}
                            </div>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell 
                          key={cell.id} 
                          className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center text-gray-500 dark:text-gray-400"
                    >
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

// Filter Component
function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};
  const [value, setValue] = useState(columnFilterValue ?? "");

  // Debounce filter updates
  useEffect(() => {
    const timeout = setTimeout(() => {
      column.setFilterValue(value || undefined);
    }, 300);

    return () => clearTimeout(timeout);
  }, [value, column]);

  // Get unique values for select filter
  const getUniqueValues = () => {
    const uniqueValues = new Set<string>();
    column.getFacetedRowModel()?.flatRows.forEach((row) => {
      const value = row.getValue(column.id);
      if (value != null && value !== "") {
        uniqueValues.add(String(value));
      }
    });
    return Array.from(uniqueValues).sort();
  };

  if (filterVariant === "select") {
    const uniqueValues = getUniqueValues();
    
    return (
      <select
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        className="w-full max-w-[120px] text-xs h-7 rounded border border-stroke px-2 text-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 dark:border-strokedark dark:bg-boxdark dark:text-gray-300"
      >
        <option value="">All</option>
        {uniqueValues.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    );
  }

  // Default to text input
  return (
    <input
      type="text"
      value={value as string}
      onChange={(e) => setValue(e.target.value)}
      placeholder={`Filter...`}
      className="w-full max-w-[120px] text-xs h-7 rounded border border-stroke px-2 text-gray-700 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 dark:border-strokedark dark:bg-boxdark dark:text-gray-300 dark:placeholder-gray-500"
    />
  );
}