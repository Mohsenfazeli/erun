import { useEffect, useRef } from "react";

/*
 * Hero visual: a field of small blue dots forming a flowing data landscape. Drawn on a canvas
 * (sharp on high-density screens), with every dot placed by sine and cosine wave functions:
 *
 * - a main wave surface seen in gentle perspective (near dots larger and stronger),
 * - a lighter ribbon of dots flowing above it, for depth,
 * - a few dispersed dots drifting on closed loops.
 *
 * Every moving term uses a whole multiple of the loop phase, so the motion repeats seamlessly
 * every LOOP_SECONDS with no visible reset. Colours come from CSS custom properties on
 * .particle-wave. It draws one still frame for reduced motion and pauses when the hero is off
 * screen or the tab is hidden. Dot counts scale with the drawing size and device.
 */

const LOOP_SECONDS = 32;
const FRAME_MS = 1000 / 30; // Slow motion: 30 fps is smooth and halves the work.
const TAU = Math.PI * 2;

type Palette = { strong: string; medium: string; light: string };

// Height of the main surface at (u across, v depth) for loop phase p. Roughly -1 … 1.
function surface(u: number, v: number, p: number) {
  // A slow swell that makes regions gently expand and contract.
  const swell = 1 + 0.28 * Math.sin(TAU * (0.5 * u - 0.3 * v) + p);
  return (
    swell *
    (0.55 * Math.sin(TAU * (1.05 * u + 0.35 * v) + p) +
      0.3 * Math.sin(TAU * (0.6 * u - 0.85 * v) - 2 * p + 1.1) +
      0.15 * Math.cos(TAU * (1.9 * u + 0.55 * v) + 3 * p + 0.5))
  );
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// Deterministic pseudo-random numbers, so dispersed dots sit in the same places every visit.
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

type Drifter = {
  x: number;
  y: number;
  rx: number;
  ry: number;
  k1: number;
  k2: number;
  phase: number;
  r: number;
};

function makeDrifters(count: number): Drifter[] {
  const rand = seeded(7);
  return Array.from({ length: count }, () => ({
    x: 0.12 + rand() * 0.86,
    y: 0.08 + rand() * 0.84,
    rx: 0.01 + rand() * 0.025,
    ry: 0.01 + rand() * 0.03,
    k1: 1 + Math.floor(rand() * 2),
    k2: 1 + Math.floor(rand() * 2),
    phase: rand() * TAU,
    r: 0.6 + rand() * 0.9,
  }));
}

export function ParticleWave() {
  const host = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = host.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!element || !canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let stacked = false;
    let cols = 0;
    let rows = 0;
    let drifters: Drifter[] = [];
    let frame = 0;
    let last = 0;
    let visible = true;
    const start = performance.now();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const styles = getComputedStyle(element);
    const color = (name: string, fallback: string) =>
      styles.getPropertyValue(name).trim() || fallback;
    const palette: Palette = {
      strong: color("--wave-strong", "#2f69da"),
      medium: color("--wave-medium", "#6b9aef"),
      light: color("--wave-light", "#a8c5f5"),
    };

    // Fade toward the text on the left and softly at the other edges.
    function edgeFade(x: number, y: number) {
      const fx = x / width;
      const fy = y / height;
      // Side by side with the text: a long fade on the left. Stacked: short fades only.
      const leftFade = stacked ? 0.12 : 0.38;
      return (
        smoothstep(0.02, leftFade, fx) *
        smoothstep(1, 0.93, fx) *
        smoothstep(0, 0.1, fy) *
        smoothstep(1, 0.9, fy)
      );
    }

    function dot(x: number, y: number, r: number, alpha: number) {
      if (alpha < 0.02) return;
      ctx!.globalAlpha = alpha;
      ctx!.beginPath();
      ctx!.arc(x, y, r, 0, TAU);
      ctx!.fill();
    }

    function draw(seconds: number) {
      if (!width || !height) return;
      const p = (TAU * (seconds % LOOP_SECONDS)) / LOOP_SECONDS;
      const scale = Math.min(1.25, Math.max(0.75, width / 820));
      ctx!.clearRect(0, 0, width, height);

      // Lighter ribbon in the back, flowing across the upper part.
      const ribbonDots = Math.round(cols * 1.6);
      ctx!.fillStyle = palette.light;
      for (let i = 0; i <= ribbonDots; i++) {
        const u = i / ribbonDots;
        for (let k = 0; k < 4; k++) {
          const spread = 0.022 * (1 + 0.6 * Math.sin(TAU * 1.3 * u - p + k));
          const y =
            height *
            (0.3 -
              0.12 * u +
              0.07 * Math.sin(TAU * (0.9 * u) + 2 * p + 0.4) +
              0.025 * Math.cos(TAU * 2.2 * u - p) +
              (k - 1.5) * spread);
          const x = width * (0.04 + 0.94 * u);
          dot(x, y, (0.7 + 0.25 * k) * scale, 0.55 * edgeFade(x, y));
        }
      }

      // Main surface, back rows first so nearer dots draw on top.
      for (let j = 0; j < rows; j++) {
        const v = j / (rows - 1);
        const perspective = 0.62 + 0.38 * v;
        ctx!.fillStyle = v < 0.34 ? palette.light : v < 0.67 ? palette.medium : palette.strong;
        for (let i = 0; i < cols; i++) {
          const u = i / (cols - 1);
          const h = surface(u, v, p);
          const x = width * (0.5 + (u - 0.5) * (0.82 + 0.2 * v));
          const y =
            height * (0.34 + 0.5 * Math.pow(v, 1.15) - 0.1 * u) - h * height * 0.085 * perspective;
          // Peaks catch more "light": stronger and slightly larger.
          const lift = 0.62 + 0.38 * (h + 1) * 0.5;
          const r = (0.65 + 1.25 * v) * (0.85 + 0.25 * lift) * scale;
          const alpha = (0.3 + 0.7 * v) * lift * edgeFade(x, y);
          dot(x, y, r, alpha);
        }
      }

      // Dispersed dots on slow closed loops.
      ctx!.fillStyle = palette.medium;
      for (const d of drifters) {
        const x = width * (d.x + d.rx * Math.sin(d.k1 * p + d.phase));
        const y = height * (d.y + d.ry * Math.cos(d.k2 * p + d.phase));
        dot(x, y, d.r * scale, 0.45 * edgeFade(x, y));
      }
      ctx!.globalAlpha = 1;
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
      const run = visible && !reduceMotion.matches && document.visibilityState === "visible";
      if (run && !frame) frame = requestAnimationFrame(tick);
      if (!run) stop();
    }

    function resize() {
      const box = element!.getBoundingClientRect();
      width = Math.round(box.width);
      height = Math.round(box.height);
      // The stylesheet sets the wave in normal flow (below the text) on narrow screens.
      stacked = getComputedStyle(element!).position !== "absolute";
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Density follows the drawing size; fewer dots on small or low-power devices.
      const lowPower = (navigator.hardwareConcurrency || 8) <= 4 ? 0.8 : 1;
      cols = Math.round(Math.min(84, Math.max(30, (width / 11) * lowPower)));
      rows = Math.round(Math.min(32, Math.max(14, (height / 20) * lowPower)));
      drifters = makeDrifters(Math.round(Math.min(70, width / 12)));
      // Still frame: the current pose, or a balanced mid-loop pose for reduced motion.
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
      className="particle-wave"
      role="img"
      aria-label="A slowly moving landscape of blue dots, an abstract picture of data taking shape"
    >
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}
