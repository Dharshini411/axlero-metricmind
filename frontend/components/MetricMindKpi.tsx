"use client";

import React from "react";
import { KpiItem } from "@/lib/analyticsUtils";

interface MetricMindKpiProps {
  items: KpiItem[];
}

export default function MetricMindKpi({ items }: MetricMindKpiProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="kpiContainer">
      {items.map((item, index) => {
        const isRevenueOrProfit =
          item.label.toLowerCase().includes("revenue") ||
          item.label.toLowerCase().includes("profit") ||
          item.label.toLowerCase().includes("sales");

        const isPositive =
          !item.formattedValue.startsWith("-") &&
          item.formattedValue !== "—";

        return (
          <div key={index} className="kpiCard">
            <div className="kpiHeader">
              <span className="kpiLabel">{item.label}</span>
              <div
                className={`kpiBadge ${
                  isRevenueOrProfit ? "badgeGreen" : "badgeCyan"
                }`}
              >
                {isPositive ? "↑ LIVE" : "—"}
              </div>
            </div>

            <div className="kpiValueRow">
              <span className="kpiValue">{item.formattedValue}</span>
            </div>

            <div className="kpiFooter">
              <span className="kpiFooterDot" />
              <span>Calculated from live dataset</span>
            </div>
          </div>
        );
      })}

      <style jsx>{`
        .kpiContainer {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 14px;
          margin: 16px 0;
          width: 100%;
        }

        .kpiCard {
          display: flex;
          flex-direction: column;
          padding: 18px 20px;
          border-radius: 14px;
          background: linear-gradient(
            145deg,
            rgba(15, 27, 52, 0.85) 0%,
            rgba(9, 18, 36, 0.95) 100%
          );
          border: 1px solid rgba(48, 78, 128, 0.45);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          position: relative;
          overflow: hidden;
          transition: transform 0.15s ease, border-color 0.15s ease;
        }

        .kpiCard::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #00f2fe 0%, #a855f7 100%);
        }

        .kpiCard:hover {
          transform: translateY(-2px);
          border-color: rgba(0, 242, 254, 0.4);
        }

        .kpiHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .kpiLabel {
          color: #94a3b8;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.6px;
          text-transform: uppercase;
        }

        .kpiBadge {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 10px;
          letter-spacing: 0.4px;
        }

        .badgeGreen {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .badgeCyan {
          background: rgba(0, 242, 254, 0.12);
          color: #00f2fe;
          border: 1px solid rgba(0, 242, 254, 0.25);
        }

        .kpiValueRow {
          margin: 6px 0 10px;
        }

        .kpiValue {
          color: #ffffff;
          font-size: clamp(22px, 2.2vw, 30px);
          font-weight: 700;
          letter-spacing: -0.5px;
          line-height: 1.15;
          background: linear-gradient(135deg, #ffffff 60%, #bae6fd 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .kpiFooter {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
          font-size: 11px;
          margin-top: auto;
        }

        .kpiFooterDot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #00f2fe;
          box-shadow: 0 0 6px #00f2fe;
        }
      `}</style>
    </div>
  );
}
