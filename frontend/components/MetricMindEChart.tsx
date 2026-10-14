"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

export interface EChartProps {
  chartType: "bar" | "line" | "donut" | "horizontal_bar" | "kpi" | "table";
  title?: string;
  data: Record<string, unknown>[];
  xKey?: string;
  yKeys: string[];
  seriesNames?: string[];
  height?: number | string;
}

export default function MetricMindEChart({
  chartType,
  title,
  data,
  xKey,
  yKeys,
  seriesNames,
  height = 300,
}: EChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, "dark", {
        renderer: "canvas",
      });
    }

    const myChart = chartInstance.current;

    const colors = [
      "#00f2fe", // Electric Cyan
      "#3b82f6", // Vivid Blue
      "#a855f7", // Neon Purple
      "#10b981", // Emerald
      "#f59e0b", // Amber
      "#ec4899", // Pink
    ];

    let option: echarts.EChartsOption = {};

    if (chartType === "donut") {
      const dimensionKey = xKey || Object.keys(data[0])[0];
      const metricKey = yKeys[0] || Object.keys(data[0])[1];
      const pieData = data.map((item, idx) => ({
        name: String(item[dimensionKey] || `Item ${idx + 1}`),
        value: Number(item[metricKey] || 0),
        itemStyle: { color: colors[idx % colors.length] },
      }));

      option = {
        backgroundColor: "transparent",
        tooltip: {
          trigger: "item",
          backgroundColor: "rgba(10, 24, 46, 0.95)",
          borderColor: "rgba(0, 242, 254, 0.4)",
          textStyle: { color: "#f8fafc", fontSize: 12 },
          formatter: "{b}: {c} ({d}%)",
        },
        legend: {
          bottom: "2%",
          left: "center",
          textStyle: { color: "#94a3b8", fontSize: 11 },
          itemWidth: 10,
          itemHeight: 10,
        },
        series: [
          {
            name: title || "Distribution",
            type: "pie",
            radius: ["42%", "70%"],
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 6,
              borderColor: "#091224",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: "bold",
                color: "#00f2fe",
              },
            },
            labelLine: { show: false },
            data: pieData,
          },
        ],
      };
    } else if (chartType === "horizontal_bar") {
      const dimensionKey = xKey || Object.keys(data[0])[0];
      const categories = data.map((d) => String(d[dimensionKey] || "")).reverse();

      const seriesList = yKeys.map((yKey, sIdx) => {
        const values = data.map((d) => Number(d[yKey] || 0)).reverse();
        return {
          name: seriesNames?.[sIdx] || yKey.replace("_", " ").toUpperCase(),
          type: "bar" as const,
          data: values,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: "#1e3a8a" },
              { offset: 1, color: colors[sIdx % colors.length] },
            ]),
            borderRadius: [0, 4, 4, 0],
          },
        };
      });

      option = {
        backgroundColor: "transparent",
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          backgroundColor: "rgba(10, 24, 46, 0.95)",
          borderColor: "rgba(0, 242, 254, 0.4)",
          textStyle: { color: "#f8fafc", fontSize: 12 },
        },
        grid: { left: "20%", right: "8%", top: "8%", bottom: "8%" },
        xAxis: {
          type: "value",
          splitLine: { lineStyle: { color: "rgba(255, 255, 255, 0.07)" } },
          axisLabel: { color: "#94a3b8", fontSize: 10 },
        },
        yAxis: {
          type: "category",
          data: categories,
          axisLine: { lineStyle: { color: "rgba(255, 255, 255, 0.15)" } },
          axisLabel: { color: "#cbd5e1", fontSize: 11 },
        },
        series: seriesList,
      };
    } else if (chartType === "line") {
      const dimensionKey = xKey || Object.keys(data[0])[0];
      const categories = data.map((d) => String(d[dimensionKey] || ""));

      const seriesList = yKeys.map((yKey, sIdx) => {
        const values = data.map((d) => Number(d[yKey] || 0));
        const color = colors[sIdx % colors.length];
        return {
          name: seriesNames?.[sIdx] || yKey.replace("_", " ").toUpperCase(),
          type: "line" as const,
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          data: values,
          itemStyle: { color },
          lineStyle: {
            width: 3,
            color,
            shadowColor: `${color}88`,
            shadowBlur: 8,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `${color}55` },
              { offset: 1, color: `${color}00` },
            ]),
          },
        };
      });

      option = {
        backgroundColor: "transparent",
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(10, 24, 46, 0.95)",
          borderColor: "rgba(0, 242, 254, 0.4)",
          textStyle: { color: "#f8fafc", fontSize: 12 },
        },
        legend: {
          top: "2%",
          right: "4%",
          textStyle: { color: "#94a3b8", fontSize: 11 },
        },
        grid: { left: "6%", right: "4%", top: "16%", bottom: "12%", containLabel: true },
        xAxis: {
          type: "category",
          data: categories,
          axisLine: { lineStyle: { color: "rgba(255, 255, 255, 0.15)" } },
          axisLabel: { color: "#94a3b8", fontSize: 10 },
        },
        yAxis: {
          type: "value",
          splitLine: { lineStyle: { color: "rgba(255, 255, 255, 0.07)" } },
          axisLabel: {
            color: "#94a3b8",
            fontSize: 10,
            formatter: (val: number) => {
              if (Math.abs(val) >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
              if (Math.abs(val) >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
              return String(val);
            },
          },
        },
        series: seriesList,
      };
    } else {
      // Default: Vertical Bar Chart
      const dimensionKey = xKey || Object.keys(data[0])[0];
      const categories = data.map((d) => String(d[dimensionKey] || ""));

      const seriesList = yKeys.map((yKey, sIdx) => {
        const values = data.map((d) => Number(d[yKey] || 0));
        const color = colors[sIdx % colors.length];
        return {
          name: seriesNames?.[sIdx] || yKey.replace("_", " ").toUpperCase(),
          type: "bar" as const,
          data: values,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color },
              { offset: 1, color: "#1e3a8a" },
            ]),
            borderRadius: [4, 4, 0, 0],
          },
        };
      });

      option = {
        backgroundColor: "transparent",
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          backgroundColor: "rgba(10, 24, 46, 0.95)",
          borderColor: "rgba(0, 242, 254, 0.4)",
          textStyle: { color: "#f8fafc", fontSize: 12 },
        },
        legend: {
          top: "2%",
          right: "4%",
          textStyle: { color: "#94a3b8", fontSize: 11 },
        },
        grid: { left: "6%", right: "4%", top: "16%", bottom: "12%", containLabel: true },
        xAxis: {
          type: "category",
          data: categories,
          axisLine: { lineStyle: { color: "rgba(255, 255, 255, 0.15)" } },
          axisLabel: { color: "#94a3b8", fontSize: 10, rotate: categories.length > 6 ? 25 : 0 },
        },
        yAxis: {
          type: "value",
          splitLine: { lineStyle: { color: "rgba(255, 255, 255, 0.07)" } },
          axisLabel: {
            color: "#94a3b8",
            fontSize: 10,
            formatter: (val: number) => {
              if (Math.abs(val) >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
              if (Math.abs(val) >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
              return String(val);
            },
          },
        },
        series: seriesList,
      };
    }

    myChart.setOption(option, true);

    const handleResize = () => {
      myChart.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [chartType, title, data, xKey, yKeys, seriesNames]);

  return (
    <div
      style={{
        width: "100%",
        height: typeof height === "number" ? `${height}px` : height,
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
