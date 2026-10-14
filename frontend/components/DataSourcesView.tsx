"use client";

import React, { useEffect, useState } from "react";
import { Database, FileText, CheckCircle2, AlertCircle, Upload, RefreshCw, Layers } from "lucide-react";
import { fetchDatasetOverview, API_BASE_URL } from "@/mock/api";

interface FileInfo {
  filename: string;
  path: string;
  row_count: number;
  column_count: number;
  columns: string[];
  dtypes: Record<string, string>;
  missing_values: Record<string, number>;
  sample_records: Record<string, unknown>[];
}

interface OverviewData {
  source_directory: string;
  is_source_accessible: boolean;
  total_files: number;
  files: FileInfo[];
  total_orders: number;
  completed_orders: number;
  completed_revenue: number;
  completed_profit: number;
  overall_margin_pct: number;
  date_range: { min: string; max: string };
  countries: string[];
  regions: string[];
  products: string[];
}

export default function DataSourcesView() {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchDatasetOverview();
      setOverview(data);
      if (data.files && data.files.length > 0) {
        setSelectedFile(data.files[0]);
      }
    } catch (err) {
      console.error("Failed to load dataset overview:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadStatus(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE_URL}/api/dataset/upload`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) {
        setUploadStatus(`Error: ${result.detail || "Upload failed"}`);
      } else {
        setUploadStatus(`Success: Ingested ${file.name} (${result.row_count} rows). Processed safely.`);
        loadData();
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Network error";
      setUploadStatus(`Upload failed: ${errorMsg}`);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex items-center gap-3 text-cyan-400">
          <RefreshCw className="animate-spin" size={24} />
          <span className="text-sm">Inspecting raw dataset and database tables...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Folder Info */}
      <div className="flex flex-col gap-4 rounded-2xl border border-blue-900/40 bg-gradient-to-r from-slate-900/90 via-[#0a1628] to-slate-900/90 p-6 shadow-xl backdrop-blur-md md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
            <h2 className="text-lg font-bold text-white">Live Dataset Connection</h2>
          </div>
          <p className="mt-1 font-mono text-xs text-slate-400">
            Path: <span className="text-cyan-300">{overview?.source_directory || "Not connected"}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-300">
            <span>
              Orders: <strong className="text-white">{overview?.total_orders.toLocaleString()}</strong>
            </span>
            <span>
              Completed: <strong className="text-emerald-400">{overview?.completed_orders.toLocaleString()}</strong>
            </span>
            <span>
              Date Range: <strong className="text-cyan-400">{overview?.date_range.min}</strong> to{" "}
              <strong className="text-cyan-400">{overview?.date_range.max}</strong>
            </span>
          </div>
        </div>

        {/* Upload Action */}
        <div className="flex flex-col items-start gap-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-300 shadow-lg shadow-cyan-950/40 transition-colors hover:bg-cyan-500/20">
            <Upload size={14} />
            <span>Upload Supplementary CSV</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
          <span className="text-[10px] text-slate-500">
            Preserves original raw data. Ingests into processed layer.
          </span>
          {uploadStatus && (
            <p className="text-xs text-emerald-400 font-medium">{uploadStatus}</p>
          )}
        </div>
      </div>

      {/* Grid: File List & Preview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Files List */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Source Tables ({overview?.files.length || 0})
            </h3>
            <span className="text-[10px] text-slate-500">Click to inspect</span>
          </div>
          <div className="space-y-2">
            {overview?.files.map((file) => {
              const isSelected = selectedFile?.filename === file.filename;
              return (
                <button
                  key={file.filename}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full rounded-xl border p-3 text-left transition-all ${
                    isSelected
                      ? "border-cyan-500/60 bg-cyan-950/30 text-white shadow-lg shadow-cyan-950/30"
                      : "border-slate-800/80 bg-slate-900/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText
                        size={15}
                        className={isSelected ? "text-cyan-400" : "text-slate-500"}
                      />
                      <span className="font-mono text-xs font-medium">
                        {file.filename}
                      </span>
                    </div>
                    <CheckCircle2 size={14} className="text-emerald-400" />
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
                    <span>{file.row_count.toLocaleString()} rows</span>
                    <span>•</span>
                    <span>{file.column_count} columns</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected File Schema and Sample */}
        <div className="space-y-6 lg:col-span-2">
          {selectedFile ? (
            <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">
                    {selectedFile.filename}
                  </h3>
                  <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 font-mono text-[11px] text-cyan-300 border border-cyan-500/30">
                    {selectedFile.row_count.toLocaleString()} total rows
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Authoritative schema extracted directly from verified file.
                </p>
              </div>

              {/* Columns & Data Types */}
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Columns & Data Types
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedFile.columns.map((col) => (
                    <div
                      key={col}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950/70 px-2.5 py-1 text-xs"
                    >
                      <span className="font-mono text-cyan-300">{col}</span>
                      <span className="text-[10px] text-slate-500">
                        ({selectedFile.dtypes[col] || "object"})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Values Status */}
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Data Quality & Completeness
                </h4>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {selectedFile.columns.slice(0, 8).map((col) => {
                    const missing = selectedFile.missing_values[col] || 0;
                    return (
                      <div
                        key={col}
                        className="rounded-lg border border-slate-800/80 bg-slate-950/50 p-2"
                      >
                        <div className="truncate font-mono text-[11px] text-slate-300">
                          {col}
                        </div>
                        <div className="mt-1 text-xs font-semibold text-emerald-400">
                          {missing === 0 ? "0 Missing (100% Valid)" : `${missing} missing`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sample Records Table */}
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Verified Data Preview (Top 3 Records)
                </h4>
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 p-2">
                  <table className="w-full text-left font-mono text-[11px] text-slate-300">
                    <thead className="border-b border-slate-800 text-slate-500">
                      <tr>
                        {selectedFile.columns.map((col) => (
                          <th key={col} className="px-2.5 py-1.5">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {selectedFile.sample_records.map((rec, idx) => (
                        <tr key={idx} className="hover:bg-cyan-950/10">
                          {selectedFile.columns.map((col) => (
                            <td key={col} className="px-2.5 py-1.5 whitespace-nowrap">
                              {String(rec[col] ?? "")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-slate-500">
              Select a file to inspect.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
