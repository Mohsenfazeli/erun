import { useEffect, useRef } from "react";

/*
 * "Who We Are" visual: three overlapping circles (Economics, Analytics, Technology) with
 * Erun where all three meet. Thin outlines and soft fills in the brand colours (styles.css,
 * .venn-*).
 *
 * Motion, all CSS:
 * - when the section scrolls into view, each outline draws itself and its fill fades in,
 *   then the labels and the Erun core appear;
 * - afterwards the circles drift very slowly around their places, so the overlaps breathe;
 * - a small dot orbits each outline, and a soft ring pulses out from the core;
 * - hovering a circle (desktop) lifts its fill.
 *
 * The entrance is armed by script, so without script, or with reduced motion, the finished
 * diagram simply shows.
 */

const R = 112;
const circles = [
  { label: "Economics", cx: 200, cy: 138, lx: 200, ly: 84, tone: "venn-economics" },
  { label: "Analytics", cx: 138, cy: 246, lx: 98, ly: 290, tone: "venn-analytics" },
  { label: "Technology", cx: 262, cy: 246, lx: 302, ly: 290, tone: "venn-technology" },
] as const;

export function IntersectionDiagram() {
  const figure = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = figure.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    element.classList.add("venn-armed");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        element.classList.add("venn-in");
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <figure ref={figure} className="about-venn">
      <svg
        viewBox="0 0 400 380"
        role="img"
        aria-label="Three overlapping circles, Economics, Analytics and Technology, with Erun where all three meet"
      >
        {circles.map((c, i) => (
          <g key={c.label} className={`venn-group venn-group-${i} ${c.tone}`}>
            <circle cx={c.cx} cy={c.cy} r={R} pathLength={1} className="venn-circle" />
            <g className="venn-orbit" style={{ transformOrigin: `${c.cx}px ${c.cy}px` }}>
              <circle cx={c.cx} cy={c.cy - R} r="3.5" className="venn-orbit-dot" />
            </g>
            <text x={c.lx} y={c.ly} textAnchor="middle" className="venn-label">
              {c.label}
            </text>
          </g>
        ))}
        <g className="venn-centre">
          <circle cx="200" cy="210" r="30" className="venn-pulse" />
          <circle cx="200" cy="210" r="30" className="venn-core" />
          <text x="200" y="216" textAnchor="middle" className="venn-core-label">
            Erun
          </text>
        </g>
      </svg>
      <figcaption>Based in Victoria, British Columbia, Canada.</figcaption>
    </figure>
  );
}
