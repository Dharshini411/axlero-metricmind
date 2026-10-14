"use client";

import React from "react";
import styles from "./AnimatedAnalyticsHero.module.css";

// Keyframe coordinate sets for continuous Bézier wave morphing
// Main solid curve
const MAIN_LINE_A = "M 0 190 C 50 176, 110 162, 170 168 C 230 174, 270 214, 330 186 C 390 158, 425 180, 460 146 C 490 116, 505 76, 525 76 C 545 76, 565 124, 600 182 C 640 220, 680 152, 725 156 C 760 160, 780 166, 800 164";
const MAIN_LINE_B = "M 0 182 C 50 168, 110 152, 170 160 C 230 168, 270 204, 330 176 C 390 148, 425 170, 460 136 C 490 106, 505 66, 525 68 C 545 68, 565 116, 600 174 C 640 212, 680 144, 725 148 C 760 154, 780 158, 800 156";
const MAIN_LINE_C = "M 0 196 C 50 182, 110 172, 170 176 C 230 180, 270 222, 330 194 C 390 166, 425 188, 460 154 C 490 126, 505 86, 525 86 C 545 86, 565 134, 600 190 C 640 228, 680 160, 725 164 C 760 168, 780 174, 800 172";

// Hill Area 1 (Back Layer - Deep Violet/Navy)
const HILL_BACK_A = "M 0 220 C 80 200, 150 190, 220 205 C 300 225, 380 210, 450 170 C 510 130, 540 100, 570 110 C 610 125, 680 200, 740 210 C 770 215, 790 220, 800 218 L 800 330 L 0 330 Z";
const HILL_BACK_B = "M 0 210 C 80 190, 150 180, 220 195 C 300 215, 380 200, 450 160 C 510 120, 540 90, 570 100 C 610 115, 680 190, 740 200 C 770 205, 790 210, 800 208 L 800 330 L 0 330 Z";
const HILL_BACK_C = "M 0 228 C 80 208, 150 198, 220 212 C 300 232, 380 218, 450 178 C 510 138, 540 108, 570 118 C 610 132, 680 208, 740 218 C 770 222, 790 228, 800 224 L 800 330 L 0 330 Z";

// Hill Area 2 (Mid Layer - Indigo/Violet Gradient)
const HILL_MID_A = "M 0 205 C 60 190, 130 180, 190 190 C 260 205, 310 230, 380 200 C 440 170, 480 135, 530 115 C 570 98, 620 160, 670 195 C 720 215, 770 190, 800 195 L 800 330 L 0 330 Z";
const HILL_MID_B = "M 0 198 C 60 182, 130 172, 190 182 C 260 196, 310 222, 380 192 C 440 162, 480 126, 530 106 C 570 90, 620 152, 670 186 C 720 206, 770 182, 800 186 L 800 330 L 0 330 Z";
const HILL_MID_C = "M 0 212 C 60 198, 130 188, 190 198 C 260 212, 310 238, 380 208 C 440 178, 480 142, 530 122 C 570 104, 620 168, 670 202 C 720 222, 770 198, 800 202 L 800 330 L 0 330 Z";

// Hill Area 3 (Front Layer - Main Prominent Cyan/Electric Blue Hill)
const HILL_FRONT_A = `${MAIN_LINE_A} L 800 330 L 0 330 Z`;
const HILL_FRONT_B = `${MAIN_LINE_B} L 800 330 L 0 330 Z`;
const HILL_FRONT_C = `${MAIN_LINE_C} L 800 330 L 0 330 Z`;

// Secondary dashed cyan wave
const DASHED_A = "M 0 216 C 65 198, 125 186, 185 194 C 250 204, 300 238, 365 214 C 420 192, 465 212, 515 180 C 560 152, 600 220, 655 216 C 710 212, 755 194, 800 198";
const DASHED_B = "M 0 210 C 65 192, 125 180, 185 188 C 250 198, 300 230, 365 206 C 420 184, 465 204, 515 172 C 560 144, 600 212, 655 208 C 710 204, 755 186, 800 190";
const DASHED_C = "M 0 222 C 65 204, 125 192, 185 200 C 250 210, 300 244, 365 220 C 420 198, 465 218, 515 186 C 560 158, 600 226, 655 222 C 710 218, 755 200, 800 204";

export default function AnimatedAnalyticsHero() {
  return (
    <div
      className={styles.dashboardContainer}
      aria-label="MetricMind Animated Analytics Hero"
    >
      {/* Background Matrix Grid */}
      <div className={styles.gridBackground} />

      {/* Radial Cyan-Purple Aurora Glow */}
      <div className={styles.radialGlow} />

      {/* Floating Ambient Glowing Particles */}
      <div
        className={`${styles.particle} ${styles.particleCyan}`}
        style={{ top: "30%", left: "47%" }}
      />
      <div
        className={`${styles.particle} ${styles.particlePurple}`}
        style={{ top: "42%", left: "70%" }}
      />
      <div
        className={`${styles.particle} ${styles.particleCyan}`}
        style={{ top: "65%", left: "20%" }}
      />
      <div
        className={`${styles.particle} ${styles.particlePurple}`}
        style={{ top: "22%", left: "80%" }}
      />

      {/* Floating Metric Cards Layer (Exact recreation of reference screenshot) */}
      <div className={styles.cardsLayer}>
        {/* CARD 1: Total Revenue Mini Card */}
        <div className={`${styles.metricCard} ${styles.revenueCard}`}>
          <span className={styles.cardTitle}>Total Revenue</span>
          <span className={styles.revenueValue}>$2.48M</span>
          <span className={styles.growthText}>
            <span>↑</span> 12.4%
          </span>
          {/* 7 Continuously Animating Cyan/Blue Bars */}
          <div className={styles.barsContainer} aria-hidden="true">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <span
                key={num}
                className={`${styles.bar} ${styles[`bar${num}`]}`}
              />
            ))}
          </div>
        </div>

        {/* CARD 2: Sales Trend Mini Card */}
        <div className={`${styles.metricCard} ${styles.trendCard}`}>
          <div className={styles.trendHeader}>
            <span className={styles.trendTitle}>Sales Trend</span>
            <span className={styles.trendBadge}>↑ 8.6%</span>
          </div>
          {/* Continuously Flowing Neon Cyan Wave */}
          <div className={styles.trendWaveContainer} aria-hidden="true">
            <svg
              className={styles.trendWaveSvg}
              viewBox="0 0 456 42"
              preserveAspectRatio="none"
            >
              <path
                className={styles.trendWavePath}
                d="M 0 24 C 28 8, 56 36, 84 20 C 112 6, 140 34, 168 18 C 196 6, 214 26, 228 20 C 256 8, 284 36, 312 20 C 340 6, 368 34, 396 18 C 424 6, 442 26, 456 20"
              />
            </svg>
          </div>
        </div>

        {/* CARD 3: Circular Percentage Indicator Card */}
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

      {/* CONTINUOUS ANIMATED SVG HILL WAVES & LINE CHARTS */}
      <svg
        className={styles.mainChartSvg}
        viewBox="0 0 800 330"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          {/* Back Hill Gradient (Deep Indigo & Violet) */}
          <linearGradient id="hillGradBack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4338ca" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#312e81" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.02" />
          </linearGradient>

          {/* Mid Hill Gradient (Violet & Electric Blue) */}
          <linearGradient id="hillGradMid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#2563eb" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.02" />
          </linearGradient>

          {/* Front Hill Gradient (Vibrant Cyan & Sapphire Blue) */}
          <linearGradient id="hillGradFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.75" />
            <stop offset="35%" stopColor="#0284c7" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#00f2fe" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#00f2fe" stopOpacity="0.01" />
          </linearGradient>

          {/* Solid Main Line Curve Gradient */}
          <linearGradient id="mainLineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="45%" stopColor="#38bdf8" />
            <stop offset="75%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>

        {/* 1. BACK HILL WAVE (Layer 1 of 3) */}
        <path className={styles.hillAreaBack} d={HILL_BACK_A}>
          <animate
            attributeName="d"
            dur="8.5s"
            repeatCount="indefinite"
            values={`${HILL_BACK_A}; ${HILL_BACK_B}; ${HILL_BACK_C}; ${HILL_BACK_A}`}
            calcMode="spline"
            keyTimes="0; 0.33; 0.66; 1"
            keySplines="0.45 0 0.55 1; 0.45 0 0.55 1; 0.45 0 0.55 1"
          />
        </path>

        {/* 2. MID HILL WAVE (Layer 2 of 3) */}
        <path className={styles.hillAreaMid} d={HILL_MID_A}>
          <animate
            attributeName="d"
            dur="6.8s"
            repeatCount="indefinite"
            values={`${HILL_MID_A}; ${HILL_MID_B}; ${HILL_MID_C}; ${HILL_MID_A}`}
            calcMode="spline"
            keyTimes="0; 0.33; 0.66; 1"
            keySplines="0.45 0 0.55 1; 0.45 0 0.55 1; 0.45 0 0.55 1"
          />
        </path>

        {/* 3. FRONT PROMINENT HILL WAVE (Layer 3 of 3) */}
        <path className={styles.hillAreaFront} d={HILL_FRONT_A}>
          <animate
            attributeName="d"
            dur="7.2s"
            repeatCount="indefinite"
            values={`${HILL_FRONT_A}; ${HILL_FRONT_B}; ${HILL_FRONT_C}; ${HILL_FRONT_A}`}
            calcMode="spline"
            keyTimes="0; 0.33; 0.66; 1"
            keySplines="0.45 0 0.55 1; 0.45 0 0.55 1; 0.45 0 0.55 1"
          />
        </path>

        {/* 4. VIOLET ACCENT CONTOUR LINE */}
        <path
          className={styles.purpleAccentLine}
          d="M 0 198 C 60 185, 115 175, 175 178 C 240 182, 280 222, 340 196 C 400 170, 435 190, 470 156 C 500 126, 515 88, 535 88 C 555 88, 575 136, 610 194 C 650 230, 690 162, 735 166 S 780 176 800 172"
        />

        {/* 5. CYAN DASHED SECONDARY WAVE LINE */}
        <path className={styles.dashedSecondaryLine} d={DASHED_A}>
          <animate
            attributeName="d"
            dur="6.2s"
            repeatCount="indefinite"
            values={`${DASHED_A}; ${DASHED_B}; ${DASHED_C}; ${DASHED_A}`}
            calcMode="spline"
            keyTimes="0; 0.33; 0.66; 1"
            keySplines="0.45 0 0.55 1; 0.45 0 0.55 1; 0.45 0 0.55 1"
          />
        </path>

        {/* 6. BRIGHT SOLID CYAN/VIOLET MAIN WAVE LINE */}
        <path className={styles.solidMainLine} d={MAIN_LINE_A}>
          <animate
            attributeName="d"
            dur="7.2s"
            repeatCount="indefinite"
            values={`${MAIN_LINE_A}; ${MAIN_LINE_B}; ${MAIN_LINE_C}; ${MAIN_LINE_A}`}
            calcMode="spline"
            keyTimes="0; 0.33; 0.66; 1"
            keySplines="0.45 0 0.55 1; 0.45 0 0.55 1; 0.45 0 0.55 1"
          />
        </path>

        {/* Glowing Data Peak Nodes */}
        <circle className={styles.chartDot} cx="170" cy="168" r="3.2" />
        <circle className={styles.chartDotPurple} cx="330" cy="186" r="3" />
        <circle className={styles.chartDot} cx="460" cy="146" r="3.2" />
        <circle
          className={styles.chartDot}
          cx="525"
          cy="76"
          r="4.5"
          style={{ animationDuration: "1.5s" }}
        />
        <circle className={styles.chartDotPurple} cx="600" cy="182" r="3.2" />
        <circle className={styles.chartDot} cx="725" cy="156" r="3.5" />
        <circle className={styles.chartDot} cx="365" cy="214" r="2.5" />
        <circle className={styles.chartDotPurple} cx="515" cy="180" r="2.5" />
      </svg>
    </div>
  );
}
