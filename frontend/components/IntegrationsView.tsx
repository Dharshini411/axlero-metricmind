"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, ExternalLink, Cpu, Database, Network, GitBranch, RefreshCw } from "lucide-react";
import { fetchIntegrations } from "@/mock/api";

interface IntegrationItem {
  name: string;
  category: string;
  status: "Not Configured" | "Configured (Unverified)" | "Connected and Verified";
  description: string;
  docs_link: string;
  details: Record<string, unknown>;
}

export default function IntegrationsView() {
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const items = await fetchIntegrations();
      setIntegrations(items);
    } catch (err) {
      console.error("Failed to fetch integrations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStatusBadge = (status: IntegrationItem["status"]) => {
    switch (status) {
      case "Connected and Verified":
        return (
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
            <CheckCircle2 size={13} />
            <span>Connected & Verified</span>
          </div>
        );
      case "Configured (Unverified)":
        return (
          <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400">
            <AlertTriangle size={13} />
            <span>Configured (Unverified)</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-400">
            <XCircle size={13} />
            <span>Not Configured</span>
          </div>
        );
    }
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes("AI")) return <Cpu size={20} className="text-cyan-400" />;
    if (category.includes("Warehouse")) return <Database size={20} className="text-blue-400" />;
    if (category.includes("Semantic")) return <Network size={20} className="text-violet-400" />;
    return <GitBranch size={20} className="text-emerald-400" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="rounded-2xl border border-blue-900/40 bg-gradient-to-r from-slate-900/90 via-[#0a1529] to-slate-900/90 p-6 shadow-xl backdrop-blur-md">
        <h2 className="text-lg font-bold text-white">Platform Integrations</h2>
        <p className="mt-1 text-xs text-slate-400">
          Enterprise semantic warehouse and AI reasoning connectors. Real verified status.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {integrations.map((item) => (
          <div
            key={item.name}
            className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl transition-all hover:border-slate-700"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-950">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.name}</h3>
                    <span className="text-[11px] text-slate-400">{item.category}</span>
                  </div>
                </div>
                {getStatusBadge(item.status)}
              </div>

              <p className="mt-4 text-xs text-slate-300 leading-relaxed">
                {item.description}
              </p>

              {/* Status details */}
              <div className="mt-4 rounded-xl border border-slate-800/80 bg-slate-950/70 p-3 font-mono text-[11px] text-slate-400">
                {Object.entries(item.details).map(([k, v]) => (
                  <div key={k} className="flex justify-between py-0.5">
                    <span className="text-slate-500">{k}:</span>
                    <span className="text-slate-300">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-800/80 pt-3">
              <a
                href={item.docs_link}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300"
              >
                <span>Documentation</span>
                <ExternalLink size={12} />
              </a>

              <span className="text-[11px] text-slate-500">
                {item.status === "Connected and Verified" ? "Operational" : "Configure in .env"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
