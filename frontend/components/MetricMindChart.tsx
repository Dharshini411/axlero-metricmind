"use client";

import React, { useSyncExternalStore } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Row,
  ChartMeta,
  formatColumnLabel,
  formatMetricValue,
} from "@/lib/analyticsUtils";

interface MetricMindChartProps {
  data: Row[];
  chartMeta: ChartMeta;
}

const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

const PALETTE = [
  "#00f2fe", // Cyan
  "#a855f7", // Purple
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#6366f1", // Indigo
];

function abbreviateNumber(num: number): string {
  if (Math.abs(num) >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (Math.abs(num) >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(num) >= 1_000) {
    return `${(num / 1_000).toFixed(1)}k`;
  }
  return num.toLocaleString("en-US");
}

function truncateLabel(label: string, maxLength = 12): string {
  if (!label) return "";
  const str = String(label);
  return str.length > maxLength ? `${str.slice(0, maxLength - 1)}…` : str;
}

export default function MetricMindChart({ data, chartMeta }: MetricMindChartProps) {
  const mounted = useIsMounted();

  if (!data || data.length === 0) return null;

  const { type, xKey = Object.keys(data[0])[0], yKeys = [], title } = chartMeta;
  if (!xKey || yKeys.length === 0) return null;

  // Prepare chart dataset by ensuring numeric y-values are parsed numbers
  const chartData = data.map((row) => {
    const item: Record<string, unknown> = { ...row };
    for (const key of yKeys) {
      const val = row[key];
      const parsed = typeof val === "number" ? val : Number(val);
      item[key] = Number.isNaN(parsed) ? 0 : parsed;
    }
    return item;
  });

  const isPie = type === "pie";
  const isLine = type === "line";
  const isGroupedBar = type === "grouped_bar" || (type === "bar" && yKeys.length > 1);

  if (!mounted) {
    return (
      <div className="chartWrapper chartSkeleton">
        <div className="chartHeader">
          <span className="chartBadge">CHART</span>
          <strong className="chartTitle">{title || "Visualization"}</strong>
        </div>
        <div className="skeletonBox" />
      </div>
    );
  }

  return (
    <div className="chartWrapper">
      <div className="chartHeader">
        <div className="headerLeft">
          <span className="chartBadge">
            {isPie ? "PIE" : isLine ? "TREND" : isGroupedBar ? "COMPARISON" : "BAR"}
          </span>
          <strong className="chartTitle">{title || "Data Visualization"}</strong>
        </div>
        <span className="dataPointsCount">{chartData.length} data points</span>
      </div>

      <div className="chartCanvasContainer">
        <ResponsiveContainer width="100%" height={290}>
          {isPie ? (
            <PieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#091326",
                  borderColor: "rgba(45, 75, 125, 0.7)",
                  borderRadius: "10px",
                  color: "#f8fafc",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
                  fontSize: "12px",
                }}
                formatter={(val, name) => [
                  formatMetricValue(val, String(name)),
                  formatColumnLabel(String(name)),
                ]}
              />
              <Legend
                verticalAlign="bottom"
                wrapperStyle={{
                  paddingTop: "14px",
                  fontSize: "11px",
                  color: "#94a3b8",
                }}
              />
              <Pie
                data={chartData}
                dataKey={yKeys[0]}
                nameKey={xKey}
                cx="50%"
                cy="46%"
                innerRadius={50}
                outerRadius={85}
                paddingAngle={4}
                animationDuration={900}
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PALETTE[index % PALETTE.length]}
                    stroke="#081122"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
            </PieChart>
          ) : isLine ? (
            <LineChart
              data={chartData}
              margin={{ top: 15, right: 20, left: 0, bottom: 25 }}
            >
              <CartesianGrid
                stroke="rgba(255, 255, 255, 0.07)"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey={xKey}
                tick={{ fill: "#8fa3c7", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(45, 75, 125, 0.4)" }}
                tickFormatter={(val) => truncateLabel(String(val))}
                angle={chartData.length > 7 ? -25 : 0}
                textAnchor={chartData.length > 7 ? "end" : "middle"}
                interval={0}
              />
              <YAxis
                tick={{ fill: "#8fa3c7", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(45, 75, 125, 0.4)" }}
                tickFormatter={(val) => abbreviateNumber(Number(val))}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#091326",
                  borderColor: "rgba(45, 75, 125, 0.7)",
                  borderRadius: "10px",
                  color: "#f8fafc",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
                  fontSize: "12px",
                }}
                formatter={(val, name) => [
                  formatMetricValue(val, String(name)),
                  formatColumnLabel(String(name)),
                ]}
                labelStyle={{ color: "#7dd3fc", fontWeight: 600, marginBottom: "4px" }}
              />
              {yKeys.length > 1 && (
                <Legend
                  wrapperStyle={{
                    paddingTop: "10px",
                    fontSize: "11px",
                    color: "#94a3b8",
                  }}
                  formatter={(val) => formatColumnLabel(String(val))}
                />
              )}
              {yKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={key}
                  stroke={PALETTE[index % PALETTE.length]}
                  strokeWidth={2.8}
                  dot={{ r: 3.5, fill: PALETTE[index % PALETTE.length], strokeWidth: 0 }}
                  activeDot={{
                    r: 6,
                    fill: "#ffffff",
                    stroke: PALETTE[index % PALETTE.length],
                    strokeWidth: 2,
                  }}
                  animationDuration={1000}
                />
              ))}
            </LineChart>
          ) : (
            <BarChart
              data={chartData}
              margin={{ top: 15, right: 20, left: 0, bottom: 25 }}
            >
              <CartesianGrid
                stroke="rgba(255, 255, 255, 0.07)"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey={xKey}
                tick={{ fill: "#8fa3c7", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(45, 75, 125, 0.4)" }}
                tickFormatter={(val) => truncateLabel(String(val))}
                angle={chartData.length > 6 ? -25 : 0}
                textAnchor={chartData.length > 6 ? "end" : "middle"}
                interval={0}
              />
              <YAxis
                tick={{ fill: "#8fa3c7", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(45, 75, 125, 0.4)" }}
                tickFormatter={(val) => abbreviateNumber(Number(val))}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#091326",
                  borderColor: "rgba(45, 75, 125, 0.7)",
                  borderRadius: "10px",
                  color: "#f8fafc",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
                  fontSize: "12px",
                }}
                formatter={(val, name) => [
                  formatMetricValue(val, String(name)),
                  formatColumnLabel(String(name)),
                ]}
                labelStyle={{ color: "#7dd3fc", fontWeight: 600, marginBottom: "4px" }}
              />
              {yKeys.length > 1 && (
                <Legend
                  wrapperStyle={{
                    paddingTop: "10px",
                    fontSize: "11px",
                    color: "#94a3b8",
                  }}
                  formatter={(val) => formatColumnLabel(String(val))}
                />
              )}
              {yKeys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  name={key}
                  fill={PALETTE[index % PALETTE.length]}
                  radius={[5, 5, 0, 0]}
                  maxBarSize={48}
                  animationDuration={900}
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <style jsx>{`
        .chartWrapper {
          margin-top: 16px;
          border-radius: 14px;
          border: 1px solid rgba(40, 70, 115, 0.5);
          background: #081122;
          padding: 16px 18px 12px;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
        }

        .chartSkeleton {
          min-height: 320px;
        }

        .skeletonBox {
          height: 260px;
          background: rgba(15, 28, 52, 0.4);
          border-radius: 8px;
          margin-top: 14px;
        }

        .chartHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .headerLeft {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .chartBadge {
          padding: 2px 7px;
          border-radius: 6px;
          background: rgba(168, 85, 247, 0.15);
          color: #c084fc;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.8px;
          border: 1px solid rgba(168, 85, 247, 0.3);
        }

        .chartTitle {
          color: #f1f5f9;
          font-size: 13.5px;
          font-weight: 600;
        }

        .dataPointsCount {
          color: #64748b;
          font-size: 11px;
        }

        .chartCanvasContainer {
          width: 100%;
          min-height: 290px;
        }
      `}</style>
    </div>
  );
}
