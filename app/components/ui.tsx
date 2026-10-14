import React from "react";

/** Praise (script) is for large headings only. Body copy is Lora. */
export const displayFont: React.CSSProperties = {
  fontFamily: "var(--font-display, 'Palatino Linotype', Georgia, serif)",
};

/** Soft French-beige light. Pure CSS gradient (no blur filter), so it is cheap to paint. */
export function Glow({
  className = "",
  strength = 0.25,
}: {
  className?: string;
  strength?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full ${className}`}
      style={{
        background: `radial-gradient(closest-side, rgba(173,125,86,${strength}), transparent)`,
      }}
    />
  );
}

/** Thin concentric circles. Pass your own positioning classes. */
export function Rings({ className = "", rings = 4 }: { className?: string; rings?: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 400"
      fill="none"
      className={`pointer-events-none ${className}`}
    >
      {Array.from({ length: rings }, (_, i) => (
        <circle
          key={i}
          cx="200"
          cy="200"
          r={60 + i * 45}
          stroke="rgba(205,180,158,0.14)"
          strokeWidth="1"
          strokeDasharray={i % 2 ? "2 6" : undefined}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

/** Huge faded word behind a section. */
export function Watermark({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`watermark pointer-events-none absolute select-none leading-none ${className}`}
      style={displayFont}
    >
      {children}
    </span>
  );
}

/** Simple "N" monogram, replaces the old diamond/star mark. */
export function Monogram({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-fill)] text-[var(--rd-300)] ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.62, lineHeight: 1, ...displayFont }}
    >
      N
    </span>
  );
}