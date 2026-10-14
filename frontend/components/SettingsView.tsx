"use client";

import React, { useState, useEffect } from "react";
import { Sliders, Sun, Moon, Play, Pause, Save, Check, RefreshCw } from "lucide-react";

export default function SettingsView() {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [accentColor, setAccentColor] = useState("cyan");
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [defaultStatus, setDefaultStatus] = useState("Completed");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedAnim = localStorage.getItem("mm_animations");
    if (savedAnim !== null) setAnimationsEnabled(savedAnim === "true");

    const savedMotion = localStorage.getItem("mm_reduced_motion");
    if (savedMotion !== null) setReducedMotion(savedMotion === "true");

    const savedAccent = localStorage.getItem("mm_accent");
    if (savedAccent) setAccentColor(savedAccent);
  }, []);

  const handleSave = () => {
    localStorage.setItem("mm_animations", String(animationsEnabled));
    localStorage.setItem("mm_reduced_motion", String(reducedMotion));
    localStorage.setItem("mm_accent", accentColor);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="rounded-2xl border border-blue-900/40 bg-gradient-to-r from-slate-900/90 via-[#0a1529] to-slate-900/90 p-6 shadow-xl backdrop-blur-md">
        <h2 className="text-lg font-bold text-white">System Settings</h2>
        <p className="mt-1 text-xs text-slate-400">
          Configure visual aesthetics, continuous animation behavior, and analytical defaults.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Appearance & Animation Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl">
          <div className="mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders size={18} className="text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Visual & Animation Controls</h3>
          </div>

          <div className="space-y-5">
            {/* Continuous Animation Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">
                  Continuous Hero Animations
                </div>
                <div className="text-[11px] text-slate-400">
                  Continuous animated bars, neon line curves, and layered hill area waves.
                </div>
              </div>
              <button
                onClick={() => setAnimationsEnabled(!animationsEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  animationsEnabled ? "bg-cyan-500" : "bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    animationsEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Reduced Motion Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">
                  Accessibility Reduced Motion
                </div>
                <div className="text-[11px] text-slate-400">
                  Disable undulating movements for vestibular comfort.
                </div>
              </div>
              <button
                onClick={() => setReducedMotion(!reducedMotion)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  reducedMotion ? "bg-cyan-500" : "bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    reducedMotion ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Accent Theme */}
            <div>
              <div className="text-xs font-semibold text-white mb-2">
                Primary Neon Accent
              </div>
              <div className="flex items-center gap-3">
                {[
                  { name: "cyan", hex: "#00f2fe", label: "Electric Cyan (Default)" },
                  { name: "violet", hex: "#a855f7", label: "Neon Violet" },
                  { name: "blue", hex: "#3b82f6", label: "Sapphire Blue" },
                ].map((col) => (
                  <button
                    key={col.name}
                    onClick={() => setAccentColor(col.name)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs transition-all ${
                      accentColor === col.name
                        ? "border-cyan-400 bg-cyan-950/40 text-white"
                        : "border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span>{col.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Defaults Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl">
          <div className="mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders size={18} className="text-violet-400" />
            <h3 className="text-sm font-bold text-white">Governed Analytics Defaults</h3>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-white block mb-1">
                Default Order Filter
              </label>
              <select
                value={defaultStatus}
                onChange={(e) => setDefaultStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="Completed">Completed Orders Only (Governed Business Practice)</option>
                <option value="All">All Transactions (Gross)</option>
              </select>
              <p className="mt-1 text-[11px] text-slate-500">
                Governed BI rule: Revenue and profit calculations exclude returned/cancelled orders by default.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-white block mb-1">
                Currency Display Format
              </label>
              <div className="flex gap-2">
                {["$", "€", "£", "₹"].map((sym) => (
                  <button
                    key={sym}
                    onClick={() => setCurrencySymbol(sym)}
                    className={`h-9 w-12 rounded-xl border font-mono text-sm transition-all ${
                      currencySymbol === sym
                        ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold"
                        : "border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">Local Database Engine:</span> SQLite 3 with pre-materialized indexes on `orders(order_date, order_status, country, region)`.
            </div>
          </div>
        </div>
      </div>

      {/* Save Action */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-900/30 transition-all hover:opacity-95"
        >
          {saved ? <Check size={14} className="text-emerald-300" /> : <Save size={14} />}
          <span>{saved ? "Settings Saved" : "Save Preferences"}</span>
        </button>
      </div>
    </div>
  );
}
