"use client";

import React, { useState } from "react";
import { Row, formatColumnLabel, formatMetricValue } from "@/lib/analyticsUtils";

interface MetricMindTableProps {
  data: Row[];
  title?: string;
}

export default function MetricMindTable({ data, title }: MetricMindTableProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (!data || data.length === 0) return null;

  // Extract all unique columns from the rows to handle variable row schemas gracefully
  const columns: string[] = Array.from(
    new Set(data.flatMap((row) => Object.keys(row)))
  );

  const displayRows = expanded ? data : data.slice(0, 10);
  const hasMore = data.length > 10;

  function copyAsCsv() {
    try {
      const headerLine = columns.map((c) => `"${c}"`).join(",");
      const rowLines = data.map((row) =>
        columns
          .map((col) => {
            const val = row[col];
            if (val === null || val === undefined) return '""';
            return `"${String(val).replace(/"/g, '""')}"`;
          })
          .join(",")
      );
      const csv = [headerLine, ...rowLines].join("\n");
      void navigator.clipboard.writeText(csv);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard write failure
    }
  }

  return (
    <div className="tableContainer">
      <div className="tableToolbar">
        <div className="toolbarTitle">
          <span className="tableIcon">⊞</span>
          <strong>{title || "Query Results"}</strong>
          <span className="rowCountBadge">
            {data.length} {data.length === 1 ? "row" : "rows"}
          </span>
        </div>

        <button
          className="copyCsvBtn"
          onClick={copyAsCsv}
          title="Copy table data as CSV"
        >
          {copied ? "✓ Copied CSV" : "Copy CSV"}
        </button>
      </div>

      <div className="tableScrollContainer">
        <table className="dataTable">
          <thead>
            <tr>
              <th className="rowNumCol">#</th>
              {columns.map((col) => (
                <th key={col}>{formatColumnLabel(col)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="rowNumCell">{rowIndex + 1}</td>
                {columns.map((col) => {
                  const rawVal = row[col];
                  const formatted = formatMetricValue(rawVal, col);
                  const isNumber =
                    typeof rawVal === "number" ||
                    (typeof rawVal === "string" && /^[0-9.,$-]+%?$/.test(rawVal.trim()));

                  return (
                    <td
                      key={col}
                      className={isNumber ? "numericCell" : "textCell"}
                      title={String(rawVal ?? "null")}
                    >
                      {formatted}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="tableFooter">
          <button
            className="toggleRowsBtn"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded
              ? "Show first 10 rows"
              : `Show all ${data.length} rows (${data.length - 10} more)`}
          </button>
        </div>
      )}

      <style jsx>{`
        .tableContainer {
          margin-top: 14px;
          border-radius: 12px;
          border: 1px solid rgba(40, 70, 115, 0.5);
          background: #081122;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
        }

        .tableToolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          background: #0c182e;
          border-bottom: 1px solid rgba(35, 58, 95, 0.45);
        }

        .toolbarTitle {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #f1f5f9;
          font-size: 12.5px;
        }

        .tableIcon {
          color: #00f2fe;
          font-size: 14px;
        }

        .rowCountBadge {
          padding: 2px 7px;
          border-radius: 10px;
          background: rgba(0, 242, 254, 0.1);
          color: #7dd3fc;
          font-size: 11px;
          font-weight: 600;
          border: 1px solid rgba(0, 242, 254, 0.2);
        }

        .copyCsvBtn {
          padding: 4px 10px;
          border-radius: 6px;
          background: rgba(30, 50, 90, 0.4);
          border: 1px solid rgba(50, 80, 130, 0.4);
          color: #94a3b8;
          font-size: 11px;
          font-weight: 500;
          transition: all 0.15s ease;
        }

        .copyCsvBtn:hover {
          color: #00f2fe;
          background: rgba(30, 50, 90, 0.7);
          border-color: rgba(0, 242, 254, 0.35);
        }

        .tableScrollContainer {
          overflow-x: auto;
          max-height: 420px;
          overflow-y: auto;
        }

        .dataTable {
          width: 100%;
          border-collapse: collapse;
          font-size: 12.5px;
          text-align: left;
        }

        .dataTable th {
          position: sticky;
          top: 0;
          z-index: 2;
          padding: 10px 14px;
          background: #0f1c34;
          color: #7dd3fc;
          font-weight: 600;
          letter-spacing: 0.3px;
          border-bottom: 1px solid rgba(45, 75, 120, 0.6);
          white-space: nowrap;
        }

        .rowNumCol {
          width: 44px;
          text-align: center;
          color: #55698a;
          font-weight: 500;
        }

        .dataTable td {
          padding: 9px 14px;
          border-bottom: 1px solid rgba(35, 58, 95, 0.35);
          white-space: nowrap;
          color: #cbd5e1;
        }

        .dataTable tbody tr:hover {
          background: rgba(20, 38, 72, 0.45);
        }

        .rowNumCell {
          text-align: center;
          color: #55698a;
          font-size: 11px;
        }

        .numericCell {
          text-align: right;
          font-variant-numeric: tabular-nums;
          font-weight: 500;
          color: #e2e8f0;
        }

        .textCell {
          text-align: left;
        }

        .tableFooter {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px 14px;
          background: #0a1426;
          border-top: 1px solid rgba(35, 58, 95, 0.4);
        }

        .toggleRowsBtn {
          color: #38bdf8;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 6px;
          transition: background 0.15s ease;
        }

        .toggleRowsBtn:hover {
          background: rgba(56, 189, 248, 0.1);
        }
      `}</style>
    </div>
  );
}
