"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, DollarSign, Percent, ShoppingBag, Filter, RefreshCw, BarChart2 } from "lucide-react";
import dynamic from "next/dynamic";
import { fetchAnalyticsQuery } from "@/mock/api";
import MetricMindDataTable from "./MetricMindDataTable";

const MetricMindEChart = dynamic(() => import("./MetricMindEChart"), {
  ssr: false,
});

interface KpiData {
  total_revenue: number;
  total_profit: number;
  profit_margin: number;
  total_quantity: number;
  total_orders: number;
}

interface AnalyticsResult {
  kpis: KpiData;
  monthly_trend: Record<string, unknown>[];
  regions: Record<string, unknown>[];
  countries: Record<string, unknown>[];
  top_products: Record<string, unknown>[];
  categories: Record<string, unknown>[];
}

export default function AnalyticsView() {
  const [data, setData] = useState<AnalyticsResult | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [status, setStatus] = useState("Completed");
  const [region, setRegion] = useState("All");
  const [channel, setChannel] = useState("All");

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetchAnalyticsQuery({
        order_status: status === "All" ? undefined : status,
        region: region === "All" ? undefined : region,
        sales_channel: channel === "All" ? undefined : channel,
      });
      setData(res);
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [status, region, channel]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title & Interactive Filter Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-blue-900/40 bg-slate-900/70 p-5 shadow-xl backdrop-blur-md md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Governed Business Analytics</h2>
          <p className="text-xs text-slate-400">
            Real-time aggregates calculated strictly from verified 2025 dataset
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950/80 px-2.5 py-1 text-xs text-slate-300">
            <Filter size={13} className="text-cyan-400" />
            <span className="text-[11px] text-slate-500">Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-transparent font-medium text-cyan-300 focus:outline-none"
            >
              <option value="Completed" className="bg-slate-900">Completed (Governed)</option>
              <option value="Returned" className="bg-slate-900">Returned</option>
              <option value="Cancelled" className="bg-slate-900">Cancelled</option>
              <option value="All" className="bg-slate-900">All Statuses</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950/80 px-2.5 py-1 text-xs text-slate-300">
            <span className="text-[11px] text-slate-500">Region:</span>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="bg-transparent font-medium text-cyan-300 focus:outline-none"
            >
              <option value="All" className="bg-slate-900">All Regions</option>
              <option value="North America" className="bg-slate-900">North America</option>
              <option value="Europe" className="bg-slate-900">Europe</option>
              <option value="Asia" className="bg-slate-900">Asia</option>
              <option value="Oceania" className="bg-slate-900">Oceania</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950/80 px-2.5 py-1 text-xs text-slate-300">
            <span className="text-[11px] text-slate-500">Channel:</span>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="bg-transparent font-medium text-cyan-300 focus:outline-none"
            >
              <option value="All" className="bg-slate-900">All Channels</option>
              <option value="Online" className="bg-slate-900">Online</option>
              <option value="Retail" className="bg-slate-900">Retail</option>
              <option value="Partner" className="bg-slate-900">Partner</option>
            </select>
          </div>

          <button
            onClick={loadAnalytics}
            className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      {data && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Revenue */}
          <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/90 to-blue-950/40 p-5 shadow-xl">
            <div className="flex items-center justify-between text-xs text-cyan-400">
              <span className="font-semibold uppercase tracking-wider">Total Revenue</span>
              <DollarSign size={16} />
            </div>
            <div className="mt-2 text-2xl font-extrabold text-white">
              ${(data.kpis.total_revenue / 1_000_000).toFixed(2)}M
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Net of discounts • {data.kpis.total_orders.toLocaleString()} orders
            </p>
          </div>

          {/* Card 2: Profit */}
          <div className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-slate-900/90 to-purple-950/40 p-5 shadow-xl">
            <div className="flex items-center justify-between text-xs text-violet-400">
              <span className="font-semibold uppercase tracking-wider">Total Profit</span>
              <TrendingUp size={16} />
            </div>
            <div className="mt-2 text-2xl font-extrabold text-white">
              ${(data.kpis.total_profit / 1_000_000).toFixed(2)}M
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Revenue minus product & shipping costs
            </p>
          </div>

          {/* Card 3: Margin */}
          <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-slate-900/90 to-emerald-950/40 p-5 shadow-xl">
            <div className="flex items-center justify-between text-xs text-emerald-400">
              <span className="font-semibold uppercase tracking-wider">Profit Margin</span>
              <Percent size={16} />
            </div>
            <div className="mt-2 text-2xl font-extrabold text-emerald-300">
              {data.kpis.profit_margin.toFixed(2)}%
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              (Profit / Revenue) × 100
            </p>
          </div>

          {/* Card 4: Quantity */}
          <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-slate-900/90 to-slate-950/40 p-5 shadow-xl">
            <div className="flex items-center justify-between text-xs text-blue-400">
              <span className="font-semibold uppercase tracking-wider">Units Sold</span>
              <ShoppingBag size={16} />
            </div>
            <div className="mt-2 text-2xl font-extrabold text-white">
              {data.kpis.total_quantity.toLocaleString()}
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Total transaction volume
            </p>
          </div>
        </div>
      )}

      {/* Main Charts Row */}
      {data && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Monthly Trend Chart */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Monthly Revenue & Profit Trends (2025)
            </h3>
            <MetricMindEChart
              chartType="line"
              title="Monthly Performance"
              data={data.monthly_trend}
              xKey="month_name"
              yKeys={["revenue", "profit"]}
              seriesNames={["Revenue", "Profit"]}
              height={280}
            />
          </div>

          {/* Regional Performance Chart */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet-400">
              Revenue by Global Region
            </h3>
            <MetricMindEChart
              chartType="bar"
              title="Regional Revenue"
              data={data.regions}
              xKey="region"
              yKeys={["revenue", "profit"]}
              seriesNames={["Revenue", "Profit"]}
              height={280}
            />
          </div>
        </div>
      )}

      {/* Secondary Charts & Distribution */}
      {data && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Category Distribution Donut */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Revenue by Category
            </h3>
            <MetricMindEChart
              chartType="donut"
              title="Category Distribution"
              data={data.categories}
              xKey="category"
              yKeys={["revenue"]}
              height={260}
            />
          </div>

          {/* Top Products Horizontal Bar */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl lg:col-span-2">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Top Performing Products by Profit
            </h3>
            <MetricMindEChart
              chartType="horizontal_bar"
              title="Top Products"
              data={data.top_products}
              xKey="product_name"
              yKeys={["profit"]}
              seriesNames={["Net Profit"]}
              height={260}
            />
          </div>
        </div>
      )}

      {/* Supporting Data Table */}
      {data && (
        <div className="space-y-3">
          <MetricMindDataTable
            title="Country Performance Breakdown"
            data={data.countries}
            pageSize={6}
          />
        </div>
      )}
    </div>
  );
}
