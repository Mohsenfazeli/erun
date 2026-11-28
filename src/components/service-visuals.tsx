/*
 * Animated illustrations for the three areas of expertise, shared by the homepage cards and
 * the service pages. Each one pictures its topic:
 *
 * - Economic Research: supply and demand curves, the equilibrium, and a demand shift.
 * - Advanced Analytics: a data series, a fitted trend and a forecast with an uncertainty band.
 * - Intelligent Reporting: data sources flowing into a report that writes itself and refreshes.
 *
 * Drawn as SVG in the site's colours (styles.css, .sv-*). Motion is CSS on one 8-second
 * timeline. The resting state is the finished picture, so reduced motion shows it complete.
 */

function Frame({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <div className={`service-visual ${className}`} aria-hidden="true">
      <div className="visual-topline">
        <span className="live-dot" />
      </div>
      <svg className="sv-svg" viewBox="0 0 340 190" preserveAspectRatio="xMidYMid meet">
        {children}
      </svg>
    </div>
  );
}

/** Economic Research: supply and demand, the equilibrium, then a shift in demand. */
export function ResearchVisual() {
  return (
    <Frame className="research-visual">
      {/* Axes: price up, quantity across. */}
      <path d="M40 16 V170 H322" className="sv-axis" />
      <path d="M36 22 L40 14 L44 22" className="sv-axis" />
      <path d="M314 166 L322 170 L314 174" className="sv-axis" />
      {/* Supply (rising) and demand (falling). */}
      <path d="M56 160 L312 32" className="sv-supply sv-draw sv-d1" pathLength={1} />
      <path d="M56 36 L300 153" className="sv-demand sv-draw sv-d2" pathLength={1} />
      {/* Equilibrium with guides to the axes. */}
      <path d="M183 97 V170 M183 97 H40" className="sv-guide sv-seq sv-s3" />
      <circle cx="183" cy="97" r="5" className="sv-point sv-pop sv-s3" />
      {/* Demand shifts out; a new equilibrium follows. */}
      <path d="M96 36 L322 144" className="sv-demand-shift sv-seq sv-s4" />
      <path d="M150 62 L178 62" className="sv-arrow sv-seq sv-s4" />
      <path d="M172 57 L179 62 L172 67" className="sv-arrow sv-seq sv-s4" />
      <circle cx="202" cy="87" r="5" className="sv-point-new sv-pop sv-s5" />
    </Frame>
  );
}

const observed = [
  [24, 146],
  [44, 136],
  [64, 142],
  [84, 124],
  [104, 130],
  [124, 112],
  [144, 118],
  [164, 100],
  [184, 104],
  [204, 88],
] as const;

/** Advanced Analytics: observations, a fitted trend and a forecast with a widening band. */
export function AnalyticsVisual() {
  return (
    <Frame className="model-visual">
      {[40, 80, 120, 160].map((y) => (
        <line key={y} x1="16" x2="324" y1={y} y2={y} className="sv-grid" />
      ))}
      <line x1="204" x2="204" y1="26" y2="170" className="sv-today" />
      {/* Fitted trend through the data. */}
      <path d="M24 148 L204 92" className="sv-fit sv-draw sv-d2" pathLength={1} />
      {/* Observed values. */}
      <path
        d={`M${observed.map(([x, y]) => `${x} ${y}`).join(" L")}`}
        className="sv-series sv-draw sv-d1"
        pathLength={1}
      />
      {observed.map(([x, y], i) => (
        <circle
          key={x}
          cx={x}
          cy={y}
          r="3.2"
          className="sv-obs sv-each"
          style={{ animationDelay: `${0.2 + i * 0.12}s` }}
        />
      ))}
      {/* Forecast with an uncertainty band that widens with time. */}
      <path
        d="M204 88 L244 72 L284 60 L324 46 L324 112 L284 104 L244 96 Z"
        className="sv-band sv-seq sv-s3"
      />
      <path d="M204 88 L244 84 L284 82 L324 79" className="sv-forecast sv-seq sv-s3" />
      <circle cx="324" cy="79" r="4.5" className="sv-point sv-pop sv-s4" />
    </Frame>
  );
}

const sources = [34, 82, 130];
const bars = [
  { x: 140, h: 18 },
  { x: 156, h: 28 },
  { x: 172, h: 22 },
  { x: 188, h: 36 },
  { x: 204, h: 44 },
];

/** Intelligent Reporting: sources feed a report that writes itself, then refreshes. */
export function ReportingVisual() {
  return (
    <Frame className="reporting-visual">
      {/* Data sources, with data flowing into the report. */}
      {sources.map((y, i) => {
        const route = `M76 ${y + 15} C 98 ${y + 15}, 100 97, 122 97`;
        return (
          <g key={y}>
            <rect x="16" y={y} width="56" height="30" rx="3" className="sv-card" />
            <rect x="24" y={y + 9} width="30" height="3" className="sv-line" />
            <rect x="24" y={y + 17} width="40" height="3" className="sv-line" />
            <path d={route} className="sv-link" />
            <circle r="2.6" className="sv-packet">
              <animateMotion
                dur="2.4s"
                repeatCount="indefinite"
                begin={`${-i * 0.8}s`}
                path={route}
              />
            </circle>
          </g>
        );
      })}
      {/* The report page writing itself. */}
      <rect x="124" y="14" width="124" height="164" rx="3" className="sv-card" />
      <rect x="124" y="14" width="124" height="5" className="sv-brand" />
      <rect x="136" y="30" width="62" height="6" className="sv-title sv-seq sv-s1" />
      <rect x="136" y="44" width="96" height="3" className="sv-line sv-seq sv-s1" />
      <rect x="136" y="51" width="82" height="3" className="sv-line sv-seq sv-s2" />
      {bars.map((b, i) => (
        <rect
          key={b.x}
          x={b.x}
          y={118 - b.h}
          width="11"
          height={b.h}
          className="sv-bar sv-grow"
          style={{ animationDelay: `${1.6 + i * 0.15}s` }}
        />
      ))}
      <line x1="136" x2="236" y1="118" y2="118" className="sv-grid" />
      <path
        d="M140 92 L162 84 L178 88 L194 74 L214 66 L232 60"
        className="sv-fit sv-draw sv-d3"
        pathLength={1}
      />
      <rect x="136" y="132" width="96" height="3" className="sv-line sv-seq sv-s4" />
      <rect x="136" y="139" width="74" height="3" className="sv-line sv-seq sv-s4" />
      <rect x="136" y="146" width="88" height="3" className="sv-line sv-seq sv-s5" />
      {/* Finished, and refreshed on a schedule. */}
      <g className="sv-pop sv-s5">
        <circle cx="236" cy="164" r="9" className="sv-badge" />
        <path d="M231.5 164 L235 167.5 L241 161" className="sv-check" />
      </g>
      <g className="sv-refresh">
        <path d="M296 76 A 20 20 0 1 1 278.7 86" className="sv-refresh-arc" />
        <path d="M272.4 89 L278.7 86 L279.3 93" className="sv-refresh-arc" />
      </g>
    </Frame>
  );
}
