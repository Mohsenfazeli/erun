/*
 * "Who We Are" visual: three overlapping circles (Economics, Analytics, Technology) with
 * Erun where all three meet. Thin outlines and soft fills in the brand colours (styles.css,
 * .venn-*). The circles settle into place once; with reduced motion they are simply shown.
 */

const circles = [
  { label: "Economics", cx: 200, cy: 138, lx: 200, ly: 84, tone: "venn-economics" },
  { label: "Analytics", cx: 138, cy: 246, lx: 98, ly: 290, tone: "venn-analytics" },
  { label: "Technology", cx: 262, cy: 246, lx: 302, ly: 290, tone: "venn-technology" },
] as const;

export function IntersectionDiagram() {
  return (
    <figure className="about-venn">
      <svg
        viewBox="0 0 400 380"
        role="img"
        aria-label="Three overlapping circles, Economics, Analytics and Technology, with Erun where all three meet"
      >
        {circles.map((c) => (
          <circle key={c.label} cx={c.cx} cy={c.cy} r="112" className={`venn-circle ${c.tone}`} />
        ))}
        {circles.map((c) => (
          <text key={c.label} x={c.lx} y={c.ly} textAnchor="middle" className="venn-label">
            {c.label}
          </text>
        ))}
        <circle cx="200" cy="210" r="30" className="venn-core" />
        <text x="200" y="216" textAnchor="middle" className="venn-core-label">
          Erun
        </text>
      </svg>
      <figcaption>Based in Victoria, British Columbia, Canada.</figcaption>
    </figure>
  );
}
