/*
 * Animated previews for the three Lab prototypes. Each one shows what its product
 * does (a dashboard, a report writing itself, a grounded chat), drawn in the
 * website's visual language: light-blue panel, hairline borders, brand-blue accents.
 * All motion is CSS; with reduced motion the final frame is shown.
 */

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="service-visual lab-visual" aria-hidden="true">
      <div className="visual-topline">
        <span className="live-dot" />
      </div>
      {children}
    </div>
  );
}

export function DashboardVisual() {
  const kpis = [
    { x: 0, value: 50 },
    { x: 116, value: 40 },
    { x: 232, value: 44 },
  ];
  return (
    <Frame>
      <svg className="lab-svg" viewBox="0 0 340 152" preserveAspectRatio="xMidYMid meet">
        {kpis.map((k, i) => (
          <g key={k.x} className={`lv-seq lv-s${i + 1}`}>
            <rect x={k.x} y="0" width="108" height="40" className="lv-card" />
            {/* Shapes stand in for the KPI label and value. */}
            <rect x={k.x + 8} y="9" width="26" height="3" className="lv-line" />
            <rect x={k.x + 8} y="22" width={k.value} height="9" className="lv-value-bar" />
            <rect
              x={k.x + 72}
              y="22"
              width="29"
              height="11"
              className={i === 2 ? "lv-pill-down" : "lv-pill-up"}
            />
          </g>
        ))}

        {/* Revenue chart with forecast */}
        <rect x="0" y="48" width="220" height="104" className="lv-card" />
        <rect x="8" y="56" width="70" height="3" className="lv-line" />
        {[80, 100, 120, 140].map((y) => (
          <line key={y} x1="8" x2="212" y1={y} y2={y} className="lv-grid" />
        ))}
        <line x1="150" x2="150" y1="66" y2="146" className="lv-today" />
        <path
          className="lv-band lv-seq lv-s5"
          d="M150 101 L165 92 L180 96 L195 84 L210 80 L210 104 L195 106 L180 116 L165 110 L150 101 Z"
        />
        <path
          className="lv-actual lv-draw"
          d="M10 128 L25 122 L40 126 L55 114 L70 118 L85 106 L100 110 L115 98 L130 104 L150 101"
        />
        <path className="lv-forecast lv-seq lv-s5" d="M150 101 L165 101 L180 106 L195 95 L210 92" />
        <circle cx="150" cy="101" r="3" className="lv-dot lv-seq lv-s4" />

        {/* Channel mix donut */}
        <rect x="232" y="48" width="108" height="104" className="lv-card" />
        <rect x="240" y="56" width="40" height="3" className="lv-line" />
        <g transform="translate(286 106) rotate(-90)">
          <circle r="26" className="lv-ring" />
          <circle r="26" className="lv-seg lv-seg-1" pathLength="100" />
          <circle r="26" className="lv-seg lv-seg-2" pathLength="100" />
          <circle r="26" className="lv-seg lv-seg-3" pathLength="100" />
        </g>
      </svg>
    </Frame>
  );
}

export function ReportVisual() {
  return (
    <Frame>
      <svg className="lab-svg" viewBox="0 0 340 152" preserveAspectRatio="xMidYMid meet">
        {/* Spreadsheet source */}
        <g>
          <rect x="6" y="46" width="62" height="58" className="lv-card" />
          <rect x="6" y="46" width="62" height="10" className="lv-sheet-head" />
          {[66, 76, 86, 96].map((y) => (
            <line key={y} x1="6" x2="68" y1={y} y2={y} className="lv-grid" />
          ))}
          {[26, 47].map((x) => (
            <line key={x} x1={x} x2={x} y1="46" y2="104" className="lv-grid" />
          ))}
        </g>

        {/* Flow into the report */}
        <line x1="74" x2="112" y1="75" y2="75" className="lv-track" />
        <circle cx="74" cy="75" r="2.5" className="lv-flow" />

        {/* The report page writing itself */}
        <rect x="118" y="0" width="112" height="152" className="lv-card lv-page" />
        <rect x="118" y="0" width="112" height="3" className="lv-brand-fill" />
        <rect x="128" y="12" width="44" height="3" className="lv-line" />
        <rect x="128" y="22" width="60" height="6" className="lv-value-bar" />
        <rect x="128" y="38" width="92" height="3" className="lv-line lv-seq lv-s1" />
        <rect x="128" y="45" width="84" height="3" className="lv-line lv-seq lv-s2" />
        <rect x="128" y="52" width="62" height="3" className="lv-line lv-seq lv-s3" />
        {[
          { x: 132, h: 18 },
          { x: 146, h: 26 },
          { x: 160, h: 22 },
          { x: 174, h: 32 },
          { x: 188, h: 38 },
        ].map((b, i) => (
          <rect
            key={b.x}
            x={b.x}
            y={100 - b.h}
            width="9"
            height={b.h}
            className={`lv-bar lv-grow lv-g${i + 1}`}
          />
        ))}
        <line x1="128" x2="220" y1="100" y2="100" className="lv-grid" />
        <rect x="128" y="110" width="92" height="3" className="lv-line lv-seq lv-s4" />
        <rect x="128" y="117" width="76" height="3" className="lv-line lv-seq lv-s5" />
        <rect x="128" y="124" width="86" height="3" className="lv-line lv-seq lv-s5" />

        {/* Generated + sent */}
        <g className="lv-seq lv-s6">
          <circle cx="214" cy="140" r="9" className="lv-stamp" />
          <path d="M210 140 L213 143 L218 137" className="lv-check" />
        </g>
        <g className="lv-seq lv-s7">
          <line x1="236" x2="262" y1="75" y2="75" className="lv-track" />
          <rect x="268" y="56" width="58" height="40" className="lv-card" />
          <path d="M268 56 L297 79 L326 56" className="lv-envelope" />
        </g>
      </svg>
    </Frame>
  );
}

export function AssistantVisual() {
  return (
    <Frame>
      <svg className="lab-svg" viewBox="0 0 340 152" preserveAspectRatio="xMidYMid meet">
        {/* Employee question */}
        <g className="lv-seq lv-s1">
          <rect x="142" y="4" width="186" height="26" className="lv-ink-fill" />
          <rect x="153" y="15.5" width="150" height="3" className="lv-line-light" />
        </g>

        {/* Assistant avatar */}
        <rect x="12" y="46" width="22" height="22" className="lv-brand-fill lv-seq lv-s2" />

        {/* Typing dots, then the answer */}
        <g className="lv-typing">
          <circle cx="50" cy="57" r="2.6" className="lv-typing-dot lv-t1" />
          <circle cx="60" cy="57" r="2.6" className="lv-typing-dot lv-t2" />
          <circle cx="70" cy="57" r="2.6" className="lv-typing-dot lv-t3" />
        </g>
        <g className="lv-seq lv-s4">
          <rect x="42" y="44" width="224" height="46" className="lv-card" />
          <rect x="53" y="57" width="190" height="3" className="lv-line" />
          <rect x="53" y="71" width="130" height="3" className="lv-line" />
        </g>

        {/* Citation from the handbook */}
        <g className="lv-seq lv-s5">
          <rect x="42" y="98" width="128" height="18" className="lv-cite" />
          <rect x="51" y="105.5" width="100" height="3" className="lv-cite-line" />
        </g>

        {/* Handbook source */}
        <g className="lv-seq lv-s3">
          <rect x="286" y="96" width="36" height="46" className="lv-card" />
          <rect x="286" y="96" width="5" height="46" className="lv-brand-fill" />
          {[108, 115, 122, 129].map((y) => (
            <line key={y} x1="297" x2="316" y1={y} y2={y} className="lv-grid" />
          ))}
          <path d="M282 107 C 230 107, 230 107, 176 107" className="lv-track lv-dashed" />
        </g>
      </svg>
    </Frame>
  );
}
