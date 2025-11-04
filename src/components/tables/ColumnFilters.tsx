"use client";

import { Table } from "@tanstack/react-table";
import { useState } from "react";

interface ColumnFiltersProps<TData> {
  table: Table<TData>;
  filterableColumns: string[];
}

export function ColumnFilters<TData>({
  table,
  filterableColumns = [],
}: ColumnFiltersProps<TData>) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  if (filterableColumns.length === 0) return null;

  const handleFilterChange = (columnId: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [columnId]: value
    }));
    
    table.getColumn(columnId)?.setFilterValue(value || undefined);
  };

  const clearFilter = (columnId: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[columnId];
      return newFilters;
    });
    
    table.getColumn(columnId)?.setFilterValue(undefined);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    filterableColumns.forEach(columnId => {
      table.getColumn(columnId)?.setFilterValue(undefined);
    });
  };

  // Get unique values for each column for dropdown options
  const getColumnOptions = (columnId: string) => {
    const column = table.getColumn(columnId);
    if (!column) return [];

    const uniqueValues = new Set<string>();
    table.getPreFilteredRowModel().rows.forEach(row => {
      const value = row.getValue(columnId);
      if (value != null && value !== "") {
        uniqueValues.add(String(value));
      }
    });
    
    return Array.from(uniqueValues).sort();
  };

  const hasActiveFilters = Object.values(activeFilters).some(value => value && value !== "");

  return (
    <div className="flex flex-col gap-3">
      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {filterableColumns.map((columnId) => {
          const column = table.getColumn(columnId);
          if (!column) return null;

          const columnDef = column.columnDef;
          const options = getColumnOptions(columnId);
          const currentValue = activeFilters[columnId] || "";

          return (
            <div key={columnId} className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                {String(columnDef.header)}:
              </label>
              <select
                value={currentValue}
                onChange={(e) => handleFilterChange(columnId, e.target.value)}
                className="h-8 rounded-lg border border-stroke bg-white px-2 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-strokedark dark:bg-boxdark dark:text-gray-300"
              >
                <option value="">All</option>
                {options.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              {currentValue && (
                <button
                  onClick={() => clearFilter(columnId)}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
        
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="h-8 rounded-lg bg-gray-200 px-3 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
          {Object.entries(activeFilters).map(([columnId, value]) => {
            if (!value) return null;
            const column = table.getColumn(columnId);
            if (!column) return null;
            
            return (
              <span
                key={columnId}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary dark:bg-primary/20"
              >
                {String(column.columnDef.header)}: {value}
                <button
                  onClick={() => clearFilter(columnId)}
                  className="hover:text-primary/70"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}