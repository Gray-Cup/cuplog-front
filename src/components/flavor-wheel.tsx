"use client";

import { useMemo } from "react";
import { DESCRIPTOR_FAMILIES, type DescriptorTag } from "@/lib/descriptors";

// ── Geometry helpers ──────────────────────────────────────────────────────────

function arc(
  cx: number, cy: number,
  r0: number, r1: number,
  a0: number, a1: number, // degrees from top, clockwise
  gap: number
): string {
  const rad = (d: number) => ((d - 90) * Math.PI) / 180;
  const s = rad(a0 + gap / 2);
  const e = rad(a1 - gap / 2);
  const large = a1 - a0 - gap > 180 ? 1 : 0;
  const cos = Math.cos, sin = Math.sin;
  return [
    `M ${cx + r1 * cos(s)} ${cy + r1 * sin(s)}`,
    `A ${r1} ${r1} 0 ${large} 1 ${cx + r1 * cos(e)} ${cy + r1 * sin(e)}`,
    `L ${cx + r0 * cos(e)} ${cy + r0 * sin(e)}`,
    `A ${r0} ${r0} 0 ${large} 0 ${cx + r0 * cos(s)} ${cy + r0 * sin(s)}`,
    "Z",
  ].join(" ");
}

// Tangential rotation so text runs along the arc edge, readable from outside
function tangentRotation(midDeg: number): number {
  // Flip text on the left half so it stays upright
  return midDeg > 180 ? midDeg - 180 : midDeg;
}

function lighten(hex: string, t: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.round(r + (255 - r) * t)},${Math.round(g + (255 - g) * t)},${Math.round(b + (255 - b) * t)})`;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface FlavorWheelProps {
  familyCounts: Record<string, number>;
  descriptors?: DescriptorTag[];
  size?: number;
  showLabels?: boolean;
  className?: string;
  centerContent?: React.ReactNode;
}

export function FlavorWheel({
  familyCounts,
  descriptors = [],
  size = 240,
  showLabels = true,
  className,
  centerContent,
}: FlavorWheelProps) {
  const cx = size / 2;
  const cy = size / 2;

  // Ring radii
  const holeR = size * 0.20;
  const midR  = size * 0.335;
  const outR  = size * 0.478;

  // Gaps between slices (degrees)
  const FAM_GAP = 2.8;
  const CAT_GAP = 1.2;

  const FAM_SPAN = 360 / DESCRIPTOR_FAMILIES.length; // 45°
  const maxCount = Math.max(1, ...Object.values(familyCounts).filter(Boolean));

  // Per-subcategory active counts
  const activeCats = useMemo(() => {
    const map: Record<string, number> = {};
    for (const d of descriptors) {
      const fam = DESCRIPTOR_FAMILIES.find((f) => f.key === d.family);
      if (!fam) continue;
      const group = fam.items.find((g) => g.descriptors.includes(d.label));
      if (group) {
        const key = `${d.family}::${group.category}`;
        map[key] = (map[key] ?? 0) + 1;
      }
    }
    return map;
  }, [descriptors]);

  const showSubRing = size >= 80;
  const showFamLabels = showLabels && size >= 140;
  const showCatLabels = showLabels && size >= 140;

  // Midpoint of family ring for labels
  const famLabelR = (holeR + midR) / 2;
  // Midpoint of subcategory ring for labels
  const catLabelR = (midR + outR) / 2;

  const filterId = `whl-glow-${Math.round(size)}`;

  return (
    <div
      className={`relative inline-block shrink-0 ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {DESCRIPTOR_FAMILIES.map((fam, fi) => {
          const famStart = fi * FAM_SPAN;
          const famEnd   = famStart + FAM_SPAN;
          const famMid   = famStart + FAM_SPAN / 2;
          const count    = familyCounts[fam.key] ?? 0;
          const famActive = count > 0;
          const famOpacity = famActive
            ? 0.30 + (count / maxCount) * 0.50
            : 0.09;

          // Family ring path (inner band)
          const famPath = arc(
            cx, cy, holeR, showSubRing ? midR : outR,
            famStart, famEnd, FAM_GAP
          );

          // Label position inside family ring
          const famRad = ((famMid - 90) * Math.PI) / 180;
          const flx = cx + famLabelR * Math.cos(famRad);
          const fly = cy + famLabelR * Math.sin(famRad);
          const famRotation = tangentRotation(famMid);

          return (
            <g key={fam.key}>
              {/* ── Family ring ── */}
              <path
                d={famPath}
                fill={fam.color}
                opacity={famOpacity}
                filter={famActive ? `url(#${filterId})` : undefined}
                style={{ transition: "opacity 0.4s" }}
              />

              {/* ── Subcategory ring ── */}
              {showSubRing && fam.items.map((group, gi) => {
                const n  = fam.items.length;
                const gs = FAM_SPAN / n;
                const gStart = famStart + gi * gs;
                const gEnd   = gStart + gs;
                const gMid   = gStart + gs / 2;
                const key    = `${fam.key}::${group.category}`;
                const active = (activeCats[key] ?? 0) > 0;

                const gPath = arc(cx, cy, midR, outR, gStart, gEnd, CAT_GAP);

                // Label at midpoint of subcategory ring
                const gRad = ((gMid - 90) * Math.PI) / 180;
                const glx = cx + catLabelR * Math.cos(gRad);
                const gly = cy + catLabelR * Math.sin(gRad);
                const catRotation = tangentRotation(gMid);

                // Arc length in px — hide label if segment is too narrow
                const arcLen = (gs - CAT_GAP) * (Math.PI / 180) * catLabelR;
                const catFontSize = Math.max(6, size * 0.037);
                const labelFits = arcLen > catFontSize * 2.5;

                return (
                  <g key={key}>
                    <path
                      d={gPath}
                      fill={active ? fam.color : lighten(fam.color, 0.60)}
                      opacity={active ? 0.88 : 0.14}
                      filter={active ? `url(#${filterId})` : undefined}
                      style={{ transition: "opacity 0.35s, fill 0.35s" }}
                    />
                    {/* Subcategory label — only when active and arc is wide enough */}
                    {showCatLabels && active && labelFits && (
                      <text
                        x={glx}
                        y={gly}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={catFontSize}
                        fontWeight="600"
                        fill="white"
                        transform={`rotate(${catRotation}, ${glx}, ${gly})`}
                        style={{
                          fontFamily: "Inter, system-ui, sans-serif",
                          letterSpacing: "-0.01em",
                          pointerEvents: "none",
                          textShadow: "0 1px 3px rgba(0,0,0,0.3)",
                        }}
                      >
                        {group.category}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* ── Family label (inside inner ring) ── */}
              {showFamLabels && (
                <text
                  x={flx}
                  y={fly}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={Math.max(7, size * 0.044)}
                  fontWeight={famActive ? "700" : "500"}
                  fill={famActive ? fam.color : "#c9c9c9"}
                  transform={`rotate(${famRotation}, ${flx}, ${fly})`}
                  style={{
                    transition: "fill 0.3s",
                    fontFamily: "Inter, system-ui, sans-serif",
                    letterSpacing: "-0.01em",
                    pointerEvents: "none",
                  }}
                >
                  {fam.label}
                </text>
              )}
            </g>
          );
        })}

        {/* White centre disc */}
        <circle cx={cx} cy={cy} r={holeR - 1.5} fill="white" />
        {/* Inner border ring */}
        <circle cx={cx} cy={cy} r={holeR - 1} fill="none" stroke="#efefef" strokeWidth="1" />
        {/* Mid separator between family and subcategory rings */}
        {showSubRing && (
          <circle cx={cx} cy={cy} r={midR} fill="none" stroke="white" strokeWidth="2" opacity="0.7" />
        )}
      </svg>

      {centerContent && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            style={{ width: (holeR - 5) * 2, height: (holeR - 5) * 2 }}
            className="flex items-center justify-center"
          >
            {centerContent}
          </div>
        </div>
      )}
    </div>
  );
}
