"use client";

import React, { useState, useMemo } from "react";

interface DataTableProps {
  data: Record<string, unknown>[];
  title?: string;
  pageSize?: number;
}

export default function MetricMindDataTable({
  data,
  title,
  pageSize = 6,
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDirection === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredData, sortKey, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const pagedRows = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (col: string) => {
    if (sortKey === col) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(col);
      setSortDirection("desc");
    }
  };

  const formatCellValue = (col: string, val: unknown): string => {
    if (val === null || val === undefined) return "—";
    if (typeof val === "number") {
      if (col.includes("pct") || col.includes("margin")) {
        return `${val.toFixed(2)}%`;
      }
      if (col.includes("revenue") || col.includes("profit") || col.includes("cost") || col.includes("price")) {
        return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
      return val.toLocaleString();
    }
    return String(val);
  };

  if (!data || data.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-slate-400">
        No records available to display.
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border border-blue-900/40 bg-slate-950/70 p-4 shadow-xl backdrop-blur-md">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        {title && (
          <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            {title}
          </h4>
        )}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="border-b border-slate-800 bg-slate-900/50 text-[11px] uppercase tracking-wider text-slate-400">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  className="cursor-pointer px-3 py-2.5 transition-colors hover:text-cyan-300"
                >
                  <div className="flex items-center gap-1">
                    <span>{col.replace(/_/g, " ")}</span>
                    {sortKey === col && (
                      <span className="text-cyan-400">
                        {sortDirection === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {pagedRows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className="transition-colors hover:bg-cyan-950/20"
              >
                {columns.map((col) => (
                  <td key={col} className="px-3 py-2 font-mono text-[11.5px]">
                    {formatCellValue(col, row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} -{" "}
            {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
            {sortedData.length} entries
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="rounded border border-slate-800 px-2 py-0.5 text-xs transition-colors hover:border-slate-600 disabled:opacity-40"
            >
              Prev
            </button>
            <span className="px-1 text-cyan-400">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded border border-slate-800 px-2 py-0.5 text-xs transition-colors hover:border-slate-600 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
