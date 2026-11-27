import { useEffect, useId, useRef } from "react";

/*
 * Hero visual: an abstract picture of economic dynamics. One prominent trend curve, thinner
 * related curves, data points travelling along them, a dotted data field and soft shading
 * under the main curve. Drawn as SVG in CSS pixels (sharp at any resolution); colours come
 * from --primary through CSS classes in styles.css.
 *
 * Every moving term uses a whole multiple of the base phase, so the motion loops seamlessly
 * every LOOP_SECONDS. It renders one still frame for reduced motion, and pauses when the hero
 * is off screen or the tab is hidden.
 */

const LOOP_SECONDS = 18;
const SAMPLES = 64;
const FRAME_MS = 1000 / 30; // 30 fps is plenty for slow motion and halves the work.
const TAU = Math.PI * 2;

type Curve = (u: number, p: number) => number;

// u runs 0 → 1 across the width, the result 0 → 1 down the height, p is the loop phase.
const trend = (u: number) => 0.74 - 0.44 * u;

const primary: Curve = (u, p) =>
  trend(u) +
  0.055 * Math.sin(TAU * 1.1 * u + p) +
  0.03 * Math.sin(TAU * 2.3 * u - 2 * p + 1.3) +
  0.014 * Math.sin(TAU * 3.7 * u + 3 * p + 0.4);

// Related curves: each sits at its own distance from the main trend, which widens and narrows
// over time so the lines drift apart and back together.
// [offset, spread frequency, spread speed, wave amplitude, wave frequency, wave speed, phase];
// speeds are whole numbers so each curve loops with the main one.
type CurveSpec = readonly [number, number, number, number, number, number, number];
const secondarySpecs: CurveSpec[] = [
  [-0.12, 0.8, 1, 0.035, 1.6, -1, 0.6],
  [-0.05, 1.3, -2, 0.025, 2.8, 2, 2.1],
  [0.07, 0.6, 1, 0.03, 1.9, -2, 4.0],
  [0.15, 1.0, -1, 0.04, 1.2, 3, 5.2],
];
const secondaryCurves: Curve[] = secondarySpecs.map(
  ([offset, spreadFreq, spreadSpeed, amp, freq, speed, phase]) =>
    (u: number, p: number) =>
      trend(u) +
      offset * (0.7 + 0.3 * Math.sin(TAU * spreadFreq * u + spreadSpeed * p + phase)) +
      amp * Math.sin(TAU * freq * u + speed * p + phase),
);

// Points on the main curve, spread evenly, plus one on each of two related curves.
const travellers = [
  { curve: primary, offset: 0, size: "major" },
  { curve: primary, offset: 1 / 3, size: "major" },
  { curve: primary, offset: 2 / 3, size: "major" },
  { curve: secondaryCurves[1]!, offset: 0.15, size: "minor" },
  { curve: secondaryCurves[2]!, offset: 0.6, size: "minor" },
] as const;

function points(curve: Curve, p: number, w: number, h: number) {
  return Array.from({ length: SAMPLES + 1 }, (_, i) => {
    const u = i / SAMPLES;
    return [u * w, curve(u, p) * h] as const;
  });
}

// Smooth path through the samples (Catmull-Rom converted to cubic Bézier).
function smoothPath(pts: ReadonlyArray<readonly [number, number]>) {
  let d = `M${pts[0]![0].toFixed(1)} ${pts[0]![1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[Math.max(i - 1, 0)]!;
    const [x1, y1] = pts[i]!;
    const [x2, y2] = pts[i + 1]!;
    const [x3, y3] = pts[Math.min(i + 2, pts.length - 1)]!;
    const c1x = x1 + (x2 - x0) / 6;
    const c1y = y1 + (y2 - y0) / 6;
    const c2x = x2 - (x3 - x1) / 6;
    const c2y = y2 - (y3 - y1) / 6;
    d += `C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }
  return d;
}

export function EconomicFlow() {
  const id = useId().replace(/:/g, "");
  const host = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const primaryPath = useRef<SVGPathElement>(null);
  const areaPath = useRef<SVGPathElement>(null);
  const secondaryPaths = useRef<(SVGPathElement | null)[]>([]);
  const dots = useRef<(SVGGElement | null)[]>([]);

  useEffect(() => {
    const element = host.current;
    const canvas = svg.current;
    if (!element || !canvas) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let last = 0;
    let visible = true;
    const start = performance.now();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function draw(seconds: number) {
      if (!width || !height) return;
      const p = (TAU * (seconds % LOOP_SECONDS)) / LOOP_SECONDS;
      const main = points(primary, p, width, height);
      const line = smoothPath(main);
      primaryPath.current?.setAttribute("d", line);
      areaPath.current?.setAttribute("d", `${line}L${width} ${height}L0 ${height}Z`);
      secondaryCurves.forEach((curve, i) => {
        secondaryPaths.current[i]?.setAttribute("d", smoothPath(points(curve, p, width, height)));
      });
      travellers.forEach((traveller, i) => {
        const dot = dots.current[i];
        if (!dot) return;
        // Each point crosses the width once per loop and fades in and out at the edges.
        const u = (seconds / LOOP_SECONDS + traveller.offset) % 1;
        const x = u * width;
        const y = traveller.curve(u, p) * height;
        dot.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
        dot.style.opacity = Math.sin(Math.PI * u).toFixed(3);
      });
    }

    function tick(now: number) {
      frame = requestAnimationFrame(tick);
      if (now - last < FRAME_MS) return;
      last = now;
      draw((now - start) / 1000);
    }

    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
    }

    function update() {
      const shouldRun = visible && !reduceMotion.matches && document.visibilityState === "visible";
      if (shouldRun && !frame) frame = requestAnimationFrame(tick);
      if (!shouldRun) stop();
    }

    function resize() {
      const box = element!.getBoundingClientRect();
      width = Math.round(box.width);
      height = Math.round(box.height);
      canvas!.setAttribute("viewBox", `0 0 ${width} ${height}`);
      // A still frame: the starting pose, or a pleasant mid-loop pose for reduced motion.
      draw(reduceMotion.matches ? LOOP_SECONDS * 0.3 : (performance.now() - start) / 1000);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(element);
    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      update();
    });
    viewObserver.observe(element);
    document.addEventListener("visibilitychange", update);
    function motionChanged() {
      resize();
      update();
    }
    reduceMotion.addEventListener("change", motionChanged);
    resize();
    update();

    return () => {
      stop();
      resizeObserver.disconnect();
      viewObserver.disconnect();
      document.removeEventListener("visibilitychange", update);
      reduceMotion.removeEventListener("change", motionChanged);
    };
  }, []);

  return (
    <div
      ref={host}
      className="economic-flow"
      role="img"
      aria-label="Flowing curves and moving data points, an abstract picture of economic trends"
    >
      <svg ref={svg} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <pattern id={`${id}-dots`} width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="9" cy="9" r="1.1" className="flow-field-dot" />
          </pattern>
          <radialGradient id={`${id}-field-fade`} cx="58%" cy="52%" r="60%">
            <stop offset="0%" className="flow-stop-white" />
            <stop offset="100%" className="flow-stop-black" />
          </radialGradient>
          <mask id={`${id}-field-mask`}>
            <rect width="100%" height="100%" fill={`url(#${id}-field-fade)`} />
          </mask>
          {/* Fade the curves in from the left so they meet the headline softly. */}
          <linearGradient id={`${id}-edge-fade`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" className="flow-stop-black" />
            <stop offset="18%" className="flow-stop-white" />
            <stop offset="92%" className="flow-stop-white" />
            <stop offset="100%" className="flow-stop-black" />
          </linearGradient>
          <mask id={`${id}-edge-mask`}>
            <rect width="100%" height="100%" fill={`url(#${id}-edge-fade)`} />
          </mask>
          <linearGradient id={`${id}-shade`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" className="flow-shade-top" />
            <stop offset="70%" className="flow-shade-bottom" />
          </linearGradient>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#${id}-dots)`}
          mask={`url(#${id}-field-mask)`}
        />
        <g mask={`url(#${id}-edge-mask)`}>
          <path ref={areaPath} className="flow-area" fill={`url(#${id}-shade)`} />
          {secondaryCurves.map((_, i) => (
            <path
              key={i}
              ref={(node) => {
                secondaryPaths.current[i] = node;
              }}
              className={`flow-secondary flow-secondary-${i}`}
            />
          ))}
          <path ref={primaryPath} className="flow-primary" />
          {travellers.map((traveller, i) => (
            <g
              key={i}
              ref={(node) => {
                dots.current[i] = node;
              }}
              className={`flow-point flow-point-${traveller.size}`}
              style={{ opacity: 0 }}
            >
              <circle r={traveller.size === "major" ? 11 : 7} className="flow-point-halo" />
              <circle r={traveller.size === "major" ? 4.5 : 3} className="flow-point-core" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
