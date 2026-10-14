"use client";

import React, { useState } from "react";
import { Copy, Check, X, Globe, Code2 } from "lucide-react";

export interface ApiTrace {
  endpoint: string;
  method?: string;
  request_payload?: Record<string, unknown>;
  status_code?: number;
  execution_time_ms?: number;
  timestamp?: string;
  sanitized?: boolean;
}

interface ViewApiCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiTrace?: ApiTrace | null;
  rawResponse?: unknown;
}

export default function ViewApiCallModal({
  isOpen,
  onClose,
  apiTrace,
  rawResponse,
}: ViewApiCallModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !apiTrace) return null;

  const fullPayload = {
    request: {
      endpoint: apiTrace.endpoint,
      method: apiTrace.method || "POST",
      timestamp: apiTrace.timestamp,
      payload: apiTrace.request_payload,
    },
    response: {
      status: apiTrace.status_code || 200,
      execution_time_ms: apiTrace.execution_time_ms,
      data_preview: rawResponse,
    },
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(fullPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-violet-500/30 bg-[#091124] p-6 shadow-2xl shadow-violet-950/50">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
              <Globe size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                API Request & Execution Trace
              </h3>
              <p className="text-[11px] text-slate-400">
                HTTP {apiTrace.method || "POST"} • {apiTrace.endpoint} •{" "}
                <span className="text-emerald-400">Status {apiTrace.status_code || 200}</span>
                {apiTrace.execution_time_ms ? ` (${apiTrace.execution_time_ms} ms)` : ""}
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

        {/* JSON Request & Response Explorer */}
        <div className="relative mb-4 overflow-hidden rounded-xl border border-slate-800 bg-[#040814]">
          <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/80 px-4 py-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Code2 size={14} className="text-violet-400" />
              <span>Sanitized Request & Response Payload</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-400 transition-colors hover:bg-violet-500/20"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy API Trace</span>
                </>
              )}
            </button>
          </div>
          <pre className="max-h-72 overflow-x-auto p-4 font-mono text-xs text-violet-300 leading-relaxed">
            <code>{JSON.stringify(fullPayload, null, 2)}</code>
          </pre>
        </div>

        {/* Security / Governance notice */}
        <p className="text-[11px] text-slate-500">
          • All credentials, tokens, and internal paths are masked according to MetricMind security policies.
        </p>

        {/* Footer */}
        <div className="mt-4 flex justify-end">
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
