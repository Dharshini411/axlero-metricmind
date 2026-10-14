"use client";

import React from "react";
import styles from "./MetricMindAnimation.module.css";

// Keyframe coordinate sets for continuous Bézier wave morphing
const MAIN_LINE_A = "M 0 190 C 50 176, 110 162, 170 168 C 230 174, 270 214, 330 186 C 390 158, 425 180, 460 146 C 490 116, 505 76, 525 76 C 545 76, 565 124, 600 182 C 640 220, 680 152, 725 156 C 760 160, 780 166, 800 164";
const MAIN_LINE_B = "M 0 185 C 50 170, 110 154, 170 160 C 230 166, 270 206, 330 178 C 390 150, 425 172, 460 138 C 490 108, 505 68, 525 68 C 545 68, 565 116, 600 174 C 640 212, 680 144, 725 148 C 760 152, 780 160, 800 156";
const MAIN_LINE_C = "M 0 195 C 50 182, 110 170, 170 176 C 230 182, 270 222, 330 194 C 390 166, 425 188, 460 154 C 490 124, 505 84, 525 84 C 545 84, 565 132, 600 190 C 640 228, 680 160, 725 164 C 760 168, 780 174, 800 170";

const AREA_A = `${MAIN_LINE_A} L 800 300 L 0 300 Z`;
const AREA_B = `${MAIN_LINE_B} L 800 300 L 0 300 Z`;
const AREA_C = `${MAIN_LINE_C} L 800 300 L 0 300 Z`;

const DASHED_A = "M 0 216 C 65 198, 125 186, 185 194 C 250 204, 300 238, 365 214 C 420 192, 465 212, 515 180 C 560 152, 600 220, 655 216 C 710 212, 755 194, 800 198";
const DASHED_B = "M 0 210 C 65 192, 125 180, 185 188 C 250 198, 300 230, 365 206 C 420 184, 465 204, 515 172 C 560 144, 600 212, 655 208 C 710 204, 755 186, 800 190";
const DASHED_C = "M 0 222 C 65 204, 125 192, 185 200 C 250 210, 300 244, 365 220 C 420 198, 465 218, 515 186 C 560 158, 600 226, 655 222 C 710 218, 755 200, 800 204";

export default function MetricMindAnimation() {
  return (
    <div
      className={styles.dashboardContainer}
      aria-label="MetricMind Animated Dashboard"
    >
      {/* Background Grid */}
      <div className={styles.gridBackground} />

      {/* Radial Purple/Cyan Glow behind Central Hill Peak */}
      <div className={styles.radialGlow} />

      {/* Floating Ambient Particles */}
      <div
        className={`${styles.particle} ${styles.particleCyan}`}
        style={{ top: "32%", left: "48%" }}
      />
      <div
        className={`${styles.particle} ${styles.particlePurple}`}
        style={{ top: "45%", left: "72%" }}
      />
      <div
        className={`${styles.particle} ${styles.particleCyan}`}
        style={{ top: "68%", left: "22%" }}
      />
      <div
        className={`${styles.particle} ${styles.particlePurple}`}
        style={{ top: "25%", left: "82%" }}
      />

      {/* Floating Metric Cards Layer */}
      <div className={styles.cardsLayer}>
        {/* CARD A: Total Revenue */}
        <div className={`${styles.metricCard} ${styles.revenueCard}`}>
          <span className={styles.cardTitle}>Total Revenue</span>
          <span className={styles.growthText}>
            <span>↑</span> 12.4%
          </span>
          {/* 8 Continuously Animating Cyan/Blue Bars */}
          <div className={styles.barsContainer}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <span
                key={num}
                className={`${styles.bar} ${styles[`bar${num}`]}`}
              />
            ))}
          </div>
        </div>

        {/* CARD B: Sales Trend */}
        <div className={`${styles.metricCard} ${styles.trendCard}`}>
          <div className={styles.trendHeader}>
            <span className={styles.trendTitle}>Sales Trend</span>
            <span className={styles.trendBadge}>↑ 8.6%</span>
          </div>
          {/* Continuously Flowing Cyan Wave */}
          <div className={styles.trendWaveContainer}>
            <svg
              className={styles.trendWaveSvg}
              viewBox="0 0 456 42"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                className={styles.trendWavePath}
                d="M 0 24 C 28 8, 56 36, 84 20 C 112 6, 140 34, 168 18 C 196 6, 214 26, 228 20 C 256 8, 284 36, 312 20 C 340 6, 368 34, 396 18 C 424 6, 442 26, 456 20"
              />
            </svg>
          </div>
        </div>

        {/* CARD C: Profit Donut Chart Card */}
        <div className={`${styles.metricCard} ${styles.profitCard}`}>
          <div className={styles.donutWrapper}>
            <div className={styles.donutCenter}>
              <span className={styles.donutPercentage}>68%</span>
            </div>
          </div>
          <div className={styles.legendList}>
            <div className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.dotSales}`} />
              <span>Sales</span>
            </div>
            <div className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.dotRevenue}`} />
              <span>Revenue</span>
            </div>
            <div className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.dotProfit}`} />
              <span>Profit</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN LARGE WAVE AND HILL-SHAPED AREA CHART */}
      <svg
        className={styles.mainChartSvg}
        viewBox="0 0 800 300"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          {/* Rich Gradient for Area Fill Under Hill */}
          <linearGradient id="hillAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e40af" stopOpacity="0.72" />
            <stop offset="35%" stopColor="#4f46e5" stopOpacity="0.48" />
            <stop offset="70%" stopColor="#7c3aed" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#00f2fe" stopOpacity="0.02" />
          </linearGradient>

          {/* Stroke Gradient for Main Solid Cyan/Blue/Purple Curve */}
          <linearGradient id="mainLineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="42%" stopColor="#38bdf8" />
            <stop offset="75%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>

        {/* 1. Layered Blue & Purple Gradient Area Following the Hill */}
        <path className={styles.hillAreaFill} d={AREA_A}>
          <animate
            attributeName="d"
            dur="7.5s"
            repeatCount="indefinite"
            values={`${AREA_A}; ${AREA_B}; ${AREA_C}; ${AREA_A}`}
            calcMode="spline"
            keyTimes="0; 0.33; 0.66; 1"
            keySplines="0.45 0 0.55 1; 0.45 0 0.55 1; 0.45 0 0.55 1"
          />
        </path>

        {/* 2. Secondary Purple Glowing Contour Accent */}
        <path
          className={styles.purpleAccentLine}
          d="M 0 198 C 60 185, 115 175, 175 178 C 240 182, 280 222, 340 196 C 400 170, 435 190, 470 156 C 500 126, 515 88, 535 88 C 555 88, 575 136, 610 194 C 650 230, 690 162, 735 166 S 780 176 800 172"
        />

        {/* 3. Second Cyan Dashed Line Running Below Main Curve */}
        <path className={styles.dashedSecondaryLine} d={DASHED_A}>
          <animate
            attributeName="d"
            dur="6.5s"
            repeatCount="indefinite"
            values={`${DASHED_A}; ${DASHED_B}; ${DASHED_C}; ${DASHED_A}`}
            calcMode="spline"
            keyTimes="0; 0.33; 0.66; 1"
            keySplines="0.45 0 0.55 1; 0.45 0 0.55 1; 0.45 0 0.55 1"
          />
        </path>

        {/* 4. Bright Cyan Solid Line with Continuous Bézier Morphing */}
        <path className={styles.solidMainLine} d={MAIN_LINE_A}>
          <animate
            attributeName="d"
            dur="7.5s"
            repeatCount="indefinite"
            values={`${MAIN_LINE_A}; ${MAIN_LINE_B}; ${MAIN_LINE_C}; ${MAIN_LINE_A}`}
            calcMode="spline"
            keyTimes="0; 0.33; 0.66; 1"
            keySplines="0.45 0 0.55 1; 0.45 0 0.55 1; 0.45 0 0.55 1"
          />
        </path>

        {/* 5. Glowing Cyan & Purple Data Points Along the Peaks and Valleys */}
        <circle className={styles.chartDot} cx="170" cy="168" r="3.2" />
        <circle className={styles.chartDotPurple} cx="330" cy="186" r="3" />
        <circle className={styles.chartDot} cx="460" cy="146" r="3.2" />
        {/* Central Prominent Peak Glowing Point */}
        <circle
          className={styles.chartDot}
          cx="525"
          cy="76"
          r="4.2"
          style={{ animationDuration: "1.6s" }}
        />
        <circle className={styles.chartDotPurple} cx="600" cy="182" r="3.2" />
        <circle className={styles.chartDot} cx="725" cy="156" r="3.5" />
        {/* Additional accent dots on the dashed secondary line */}
        <circle className={styles.chartDot} cx="365" cy="214" r="2.5" />
        <circle className={styles.chartDotPurple} cx="515" cy="180" r="2.5" />
      </svg>
    </div>
  );
}
