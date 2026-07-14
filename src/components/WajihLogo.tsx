import React from "react";

interface WajihLogoProps {
  size?: number;
  showText?: boolean;
  theme?: "light" | "dark";
  className?: string;
  horizontal?: boolean;
}

export default function WajihLogo({
  size = 80,
  showText = true,
  theme = "dark",
  className = "",
  horizontal = false,
}: WajihLogoProps) {
  const isLight = theme === "light";
  
  // Brand colors
  const greenPrimary = "#004B3E"; // Deep SAMA green
  const goldLight = "#C4A15A";   // Highlight gold
  const goldDark = "#96753D";    // Dark shadow gold for 3D bevel

  const logoSvg = (
    <svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="select-none"
    >
      {/* 1. Pointed SAMA Islamic Arch */}
      <path
        d="M 18,110 L 18,80 C 18,48 38,24 50,17 C 62,24 82,48 82,80 L 82,110"
        stroke={greenPrimary}
        strokeWidth="7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 2. Symmetrical 8-point SAMA Star */}
      <path
        d="M 50,30 L 52.2,38.5 L 58.5,35 L 55,41.2 L 60,43.5 L 55,45.8 L 58.5,52 L 52.2,48.5 L 50,57 L 47.8,48.5 L 41.5,52 L 45,45.8 L 40,43.5 L 45,41.2 L 41.5,35 L 47.8,38.5 Z"
        fill={greenPrimary}
      />

      {/* 3. 3D Beveled Arrowhead Pointer */}
      {/* Left facet (Dark Gold) */}
      <path
        d="M 50,60 L 35,105 L 50,94 Z"
        fill={goldDark}
      />
      {/* Right facet (Light Gold) */}
      <path
        d="M 50,60 L 65,105 L 50,94 Z"
        fill={goldLight}
      />
    </svg>
  );

  if (!showText) {
    return <div className={`inline-flex items-center justify-center ${className}`}>{logoSvg}</div>;
  }

  if (horizontal) {
    return (
      <div className={`flex items-center gap-4 ${className}`} dir="rtl">
        <div className="flex-shrink-0">{logoSvg}</div>
        <div className="text-right">
          <div className="flex items-center gap-1">
            <span
              className="text-2xl font-black tracking-tight font-sans"
              style={{ color: isLight ? "#0f172a" : "#ffffff", fontFamily: "Cairo, sans-serif" }}
            >
              وجيه
            </span>
            {/* Dots */}
            <div className="flex gap-0.5 mt-2 ml-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: greenPrimary }}></span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: greenPrimary }}></span>
              <span className="w-1.5 h-1.5 rounded-xs" style={{ backgroundColor: goldLight }}></span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] font-bold">
            <span style={{ color: goldLight }}>المساعد الذكي</span>
            <span style={{ color: isLight ? "#64748b" : "#94a3b8" }}>•</span>
            <span style={{ color: isLight ? "#004B3E" : "#4ade80" }}>لخدمات البنك المركزي السعودي</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center text-center p-4 ${className}`} dir="rtl">
      {/* Emblem */}
      <div className="mb-4 transform hover:scale-105 transition duration-300">
        {logoSvg}
      </div>

      {/* Wordmark "وجيه" */}
      <div className="flex items-center gap-1.5 justify-center">
        <h1
          className="text-4xl font-black tracking-tight"
          style={{
            color: isLight ? "#0f172a" : "#ffffff",
            fontFamily: "Cairo, sans-serif",
            fontWeight: 900
          }}
        >
          وجيه
        </h1>
        {/* Style dots exactly like the logo */}
        <div className="flex gap-0.5 mt-4">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: greenPrimary }}></span>
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: greenPrimary }}></span>
          <span className="w-2.5 h-2.5 rounded-xs rotate-12" style={{ backgroundColor: goldLight }}></span>
        </div>
      </div>

      {/* SAMA Separator */}
      <div className="w-48 h-[1.5px] my-3 flex items-center justify-between gap-2">
        <div className="flex-1 h-full opacity-30" style={{ background: `linear-gradient(to left, transparent, ${goldLight})` }}></div>
        <span className="text-[10px] font-bold tracking-widest uppercase opacity-80" style={{ color: goldLight }}>
          المساعد الذكي
        </span>
        <div className="flex-1 h-full opacity-30" style={{ background: `linear-gradient(to right, transparent, ${goldLight})` }}></div>
      </div>

      {/* Subtitle */}
      <p
        className="text-xs font-semibold max-w-xs leading-relaxed"
        style={{ color: isLight ? "#334155" : "#cbd5e1" }}
      >
        لخدمات البنك المركزي السعودي
      </p>
    </div>
  );
}
