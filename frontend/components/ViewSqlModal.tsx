"use client";

import React, { useState } from "react";
import { Copy, Check, X, Database, Terminal } from "lucide-react";

export interface SqlTrace {
  sql: string;
  params?: Record<string, unknown>;
  metric_definitions?: string[];
  execution_engine?: string;
  rows_returned?: number;
  is_preview?: boolean;
}

interface ViewSqlModalProps {
  isOpen: boolean;
  onClose: () => void;
  sqlTrace?: SqlTrace | null;
}

export default function ViewSqlModal({
  isOpen,
  onClose,
  sqlTrace,
}: ViewSqlModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !sqlTrace) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlTrace.sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-cyan-500/30 bg-[#081326] p-6 shadow-2xl shadow-cyan-950/50">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <Database size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Executed Analytical SQL
              </h3>
              <p className="text-[11px] text-slate-400">
                {sqlTrace.execution_engine || "SQLite 3.x Analytical Engine"} • {sqlTrace.rows_returned ?? 0} rows returned
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Metric Definitions */}
        {sqlTrace.metric_definitions && sqlTrace.metric_definitions.length > 0 && (
          <div className="mb-4 rounded-xl border border-blue-900/40 bg-slate-900/60 p-3">
            <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
              Governed Metric Formulas
            </h4>
            <ul className="space-y-1 text-xs text-slate-300">
              {sqlTrace.metric_definitions.map((def, idx) => (
                <li key={idx} className="font-mono text-[11px] text-slate-300">
                  • {def}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* SQL Code Block */}
        <div className="relative mb-4 overflow-hidden rounded-xl border border-slate-800 bg-[#040914]">
          <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/80 px-4 py-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Terminal size={14} className="text-cyan-400" />
              <span>Query Plan SQL</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-400 transition-colors hover:bg-cyan-500/20"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy SQL</span>
                </>
              )}
            </button>
          </div>
          <pre className="max-h-64 overflow-x-auto p-4 font-mono text-xs text-cyan-300 leading-relaxed">
            <code>{sqlTrace.sql}</code>
          </pre>
        </div>

        {/* Bound Parameters */}
        {sqlTrace.params && Object.keys(sqlTrace.params).length > 0 && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
            <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Bound Parameters
            </h4>
            <pre className="font-mono text-[11px] text-slate-300">
              {JSON.stringify(sqlTrace.params, null, 2)}
            </pre>
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
