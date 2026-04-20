"use client";

import { DESCRIPTOR_FAMILIES } from "@/lib/descriptors";

const SPAN = 360 / DESCRIPTOR_FAMILIES.length;

function annularSector(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startDeg: number,
  endDeg: number,
  gap = 2.5
): string {
  const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const s = rad(startDeg + gap / 2);
  const e = rad(endDeg - gap / 2);
  const large = endDeg - startDeg - gap > 180 ? 1 : 0;
  const cos = Math.cos,
    sin = Math.sin;
  return [
    `M ${cx + outerR * cos(s)} ${cy + outerR * sin(s)}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${cx + outerR * cos(e)} ${cy + outerR * sin(e)}`,
    `L ${cx + innerR * cos(e)} ${cy + innerR * sin(e)}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${cx + innerR * cos(s)} ${cy + innerR * sin(s)}`,
    `Z`,
  ].join(" ");
}

interface FlavorWheelProps {
  familyCounts: Record<string, number>;
  size?: number;
  showLabels?: boolean;
  className?: string;
  centerContent?: React.ReactNode;
}

export function FlavorWheel({
  familyCounts,
  size = 240,
  showLabels = true,
  className,
  centerContent,
}: FlavorWheelProps) {
  const cx = size / 2,
    cy = size / 2;
  const outerR = size * 0.46;
  const innerR = size * 0.22;
  const labelR = size * 0.36;
  const maxCount = Math.max(1, ...Object.values(familyCounts).filter(Boolean));

  return (
    <div className={`relative inline-block ${className ?? ""}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {DESCRIPTOR_FAMILIES.map((fam, i) => {
          const start = i * SPAN;
          const end = start + SPAN;
          const count = familyCounts[fam.key] ?? 0;
          const opacity = count > 0 ? 0.3 + (count / maxCount) * 0.7 : 0.12;
          const d = annularSector(cx, cy, innerR, outerR, start, end);
          const midRad = ((start + SPAN / 2 - 90) * Math.PI) / 180;
          const lx = cx + labelR * Math.cos(midRad);
          const ly = cy + labelR * Math.sin(midRad);

          return (
            <g key={fam.key}>
              <path
                d={d}
                fill={fam.color}
                opacity={opacity}
                style={{ transition: "opacity 0.4s ease" }}
              />
              {showLabels && size >= 180 && (
                <text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={Math.max(8, size * 0.048)}
                  fontWeight={count > 0 ? "700" : "400"}
                  fill={count > 0 ? fam.color : "#d1d5db"}
                  style={{
                    transition: "fill 0.3s ease",
                    fontFamily: "Inter, system-ui, sans-serif",
                  }}
                >
                  {fam.label}
                </text>
              )}
            </g>
          );
        })}
        {/* White inner circle */}
        <circle cx={cx} cy={cy} r={innerR - 3} fill="white" />
      </svg>
      {/* Center content overlay */}
      {centerContent && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            paddingTop: (cy - innerR + 3) * 0.5,
            paddingBottom: (cy - innerR + 3) * 0.5,
          }}
        >
          <div
            style={{
              width: (innerR - 3) * 2 * 0.9,
              height: (innerR - 3) * 2 * 0.9,
            }}
            className="flex items-center justify-center"
          >
            {centerContent}
          </div>
        </div>
      )}
    </div>
  );
}
