import { useId, type CSSProperties } from "react";

// Barres du haut du logo : position, taille et déplacement de l'animation (maquette Figma)
const TOP_BARS = [
  { x: 0, y: 3.33, height: 11, dy: 5 },
  { x: 4, y: 0, height: 14, dy: 7 },
  { x: 8, y: 2, height: 12, dy: 3 },
  { x: 12, y: 5, height: 9, dy: 6 },
  { x: 16, y: 0, height: 14, dy: 4 },
];

// Barres du bas (fixes)
const BOTTOM_BARS = [
  { x: 0, y: 11, height: 8 },
  { x: 4, y: 5.66, height: 15 },
  { x: 8, y: 11.33, height: 5 },
  { x: 12, y: 11, height: 9 },
  { x: 16, y: 11.33, height: 6 },
];

// Icône du logo, animée comme un égaliseur.
// Le SVG est écrit directement dans la page pour que l'animation CSS fonctionne partout.
export default function LogoIcon({ className = "" }: { className?: string }) {
  // Identifiants uniques des dégradés (le logo peut apparaître 2 fois sur la même page)
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");

  return (
    <svg width="19" height="21" viewBox="0 0 19 21" aria-hidden="true" className={`shrink-0 ${className}`}>
      <defs>
        <linearGradient id={`${id}-top`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#f99885" />
          <stop offset="1" stopColor="#df392b" />
        </linearGradient>
        <linearGradient id={`${id}-bottom`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#f4320b" />
          <stop offset="1" stopColor="#5465f7" />
        </linearGradient>
      </defs>

      {BOTTOM_BARS.map((bar) => (
        <rect key={`b${bar.x}`} x={bar.x} y={bar.y} width="3" height={bar.height} rx="1.5" fill={`url(#${id}-bottom)`} />
      ))}
      {TOP_BARS.map((bar) => (
        <rect
          key={`t${bar.x}`}
          x={bar.x}
          y={bar.y}
          width="3"
          height={bar.height}
          rx="1.5"
          fill={`url(#${id}-top)`}
          className="animate-equalizer motion-reduce:animate-none"
          style={{ "--dy": `${bar.dy}px` } as CSSProperties}
        />
      ))}
    </svg>
  );
}
