import { Z } from "@/lib/zIndex";

type GlowProps = {
  x: number;
  y: number;
  /** Diameter of the glow circle in px. Default 120. */
  size?: number;
  /** CSS colour for the glow. Default warm amber. */
  color?: string;
  /** Opacity 0–1. Default 0.55. */
  opacity?: number;
};

/**
 * Soft radial glow — place at the same x/y as a lamp, offset so it
 * centres on the lamp head. The glow renders below furniture (z = carpet)
 * so it tints the floor without covering sprites.
 */
export default function Glow({
  x,
  y,
  size = 120,
  color = "rgba(255, 200, 80, 0.6)",
  opacity = 0.55,
}: GlowProps) {
  const half = size / 2;
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: x - half,
        top: y - half,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${Math.round(size * 0.18)}px)`,
        opacity,
        zIndex: 10,
        pointerEvents: "none",
      }}
    />
  );
}