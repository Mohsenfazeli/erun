import { useEffect, useRef } from "react";

/*
 * Hero visual: a data landscape of small blue dots. A grid of points on a wave surface is
 * projected in true perspective (nearer points larger and stronger), coloured by height, with:
 *
 * - a soft highlight that sweeps across the surface, like a scan through the data,
 * - two marker points riding the surface with a slow pulse, like highlighted observations,
 * - a gentle lift under the mouse pointer (devices with a fine pointer only).
 *
 * Every moving term uses a whole multiple of the loop phase, so the motion repeats seamlessly
 * every LOOP_SECONDS. Colours come from CSS custom properties on .particle-wave. It draws one
 * still frame for reduced motion (no pointer effect) and pauses off screen or in a hidden tab.
 */

const LOOP_SECONDS = 36;
const FRAME_MS = 1000 / 45;
const TAU = Math.PI * 2;

type Rgb = [number, number, number];

function hexToRgb(value: string, fallback: Rgb): Rgb {
  const m = /^#?([0-9a-f]{6})$/i.exec(value.trim());
  if (!m) return fallback;
  const n = parseInt(m[1]!, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mix(a: Rgb, b: Rgb, t: number): string {
  const k = Math.min(1, Math.max(0, t));
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * k)},${Math.round(a[1] + (b[1] - a[1]) * k)},${Math.round(a[2] + (b[2] - a[2]) * k)})`;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// Surface height at (x across, -1.6 … 1.6; z depth, 0 far … 1 near) for loop phase p. About -1 … 1.
function height(x: number, z: number, p: number) {
  const swell = 1 + 0.25 * Math.sin(0.9 * x - 1.3 * z + p);
  return (
    swell *
    (0.5 * Math.sin(1.7 * x + 2.1 * z + p) +
      0.3 * Math.sin(2.9 * x - 1.6 * z - 2 * p + 0.8) +
      0.2 * Math.cos(4.3 * x + 3.7 * z + 3 * p + 0.3))
  );
}

const X_SPAN = 1.6;
const AMPLITUDE = 0.3;

// Marker points riding the surface: grid position and pulse offset.
const markers = [
  { x: 0.55, z: 0.62, offset: 0 },
  { x: -0.15, z: 0.84, offset: 0.5 },
];

export function ParticleWave() {
  const host = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = host.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!element || !canvas || !ctx) return;

    let width = 0;
    let height_ = 0;
    let stacked = false;
    let cols = 0;
    let rows = 0;
    let frame = 0;
    let last = 0;
    let visible = true;
    const start = performance.now();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");

    const styles = getComputedStyle(element);
    const strong = hexToRgb(styles.getPropertyValue("--wave-strong"), [47, 105, 218]);
    const medium = hexToRgb(styles.getPropertyValue("--wave-medium"), [107, 154, 239]);
    const light = hexToRgb(styles.getPropertyValue("--wave-light"), [168, 197, 245]);
    // Five colour steps from trough (light) to crest (strong), so dots can be drawn in batches.
    const palette = [0, 0.25, 0.5, 0.75, 1].map((t) =>
      t < 0.5 ? mix(light, medium, t * 2) : mix(medium, strong, (t - 0.5) * 2),
    );

    // Pointer, eased toward its target so the lift follows smoothly.
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, strength: 0, target: 0 };

    function project(x: number, z: number, y: number) {
      const depth = 1 + 2.4 * (1 - z); // 1 near … 3.4 far
      const scale = 1 / depth;
      const sx = width * 0.55 + x * width * 0.42 * scale;
      const sy = height_ * 0.14 + (1 - y / 0.95) * height_ * 0.7 * scale;
      return { sx, sy, scale };
    }

    function edgeFade(sx: number, sy: number) {
      const fx = sx / width;
      const fy = sy / height_;
      // Side by side with the text: a long fade on the left. Stacked: short fades only.
      const leftFade = stacked ? 0.1 : 0.36;
      return (
        smoothstep(0.0, leftFade, fx) *
        smoothstep(1, 0.94, fx) *
        smoothstep(0.02, 0.12, fy) *
        smoothstep(1, 0.9, fy)
      );
    }

    function draw(seconds: number) {
      if (!width || !height_) return;
      const t = (seconds % LOOP_SECONDS) / LOOP_SECONDS;
      const p = TAU * t;
      // The scan crosses the surface once per loop, entering and leaving off screen.
      const sweep = -X_SPAN - 0.6 + t * (2 * X_SPAN + 1.2);
      const dotScale = Math.min(1.25, Math.max(0.8, width / 820));

      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;
      pointer.strength += (pointer.target - pointer.strength) * 0.08;
      const lift = pointer.strength;
      const liftRadius = Math.max(90, width * 0.16);

      ctx!.clearRect(0, 0, width, height_);
      const batches: number[][] = palette.map(() => []);

      // Far rows first, so nearer dots draw on top.
      for (let j = 0; j < rows; j++) {
        // More rows toward the front, so spacing looks even after perspective.
        const z = 1 - (1 - j / (rows - 1)) ** 1.45;
        for (let i = 0; i < cols; i++) {
          const x = -X_SPAN + (2 * X_SPAN * i) / (cols - 1);
          const h = height(x, z, p);
          const projected = project(x, z, h * AMPLITUDE);
          const { sx, scale } = projected;
          let sy = projected.sy;
          const fade = edgeFade(sx, sy);
          if (fade < 0.02) continue;

          const scan = Math.exp(-((x - sweep) ** 2) / 0.05);
          let boost = 0.6 * scan;
          if (lift > 0.01) {
            const d = Math.hypot(sx - pointer.x, sy - pointer.y);
            if (d < liftRadius) {
              const k = lift * (1 - d / liftRadius) ** 2;
              sy -= k * 26 * scale * 2;
              boost += 0.7 * k;
            }
          }

          const level = Math.min(1, (h + 1) / 2 + 0.25 * boost);
          const alpha =
            Math.min(1, (0.18 + 0.75 * scale * 1.6) * (0.55 + 0.45 * level) + 0.35 * boost) * fade;
          const r = (0.55 + 1.9 * scale) * (0.85 + 0.3 * level + 0.35 * boost) * dotScale;
          batches[Math.min(4, Math.round(level * 4))]!.push(sx, sy, r, alpha);
        }
      }

      batches.forEach((batch, b) => {
        ctx!.fillStyle = palette[b]!;
        for (let k = 0; k < batch.length; k += 4) {
          ctx!.globalAlpha = batch[k + 3]!;
          ctx!.beginPath();
          ctx!.arc(batch[k]!, batch[k + 1]!, batch[k + 2]!, 0, TAU);
          ctx!.fill();
        }
      });

      // Marker points with a slow pulse (eight pulses per loop).
      for (const m of markers) {
        const h = height(m.x, m.z, p);
        const { sx, sy, scale } = project(m.x, m.z, h * AMPLITUDE);
        const fade = edgeFade(sx, sy);
        if (fade < 0.05) continue;
        const pulse = (t * 8 + m.offset) % 1;
        ctx!.strokeStyle = palette[4]!;
        ctx!.lineWidth = 1.2;
        ctx!.globalAlpha = (1 - pulse) * 0.7 * fade;
        ctx!.beginPath();
        ctx!.arc(sx, sy, (6 + 26 * pulse) * scale * 1.6 * dotScale, 0, TAU);
        ctx!.stroke();
        ctx!.globalAlpha = 0.95 * fade;
        ctx!.fillStyle = palette[4]!;
        ctx!.beginPath();
        ctx!.arc(sx, sy, 4.8 * scale * 1.6 * dotScale, 0, TAU);
        ctx!.fill();
        ctx!.globalAlpha = fade;
        ctx!.fillStyle = "#fff";
        ctx!.beginPath();
        ctx!.arc(sx, sy, 1.8 * scale * 1.6 * dotScale, 0, TAU);
        ctx!.fill();
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
      height_ = Math.round(box.height);
      // The stylesheet sets the wave in normal flow (below the text) on narrow screens.
      stacked = getComputedStyle(element!).position !== "absolute";
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height_ * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Density follows the drawing size; fewer dots on small or low-power devices.
      const lowPower = (navigator.hardwareConcurrency || 8) <= 4 ? 0.8 : 1;
      cols = Math.round(Math.min(78, Math.max(34, (width / 11) * lowPower)));
      rows = Math.round(Math.min(34, Math.max(16, (height_ / 17) * lowPower)));
      // Still frame: the current pose, or a balanced pose for reduced motion.
      draw(reduceMotion.matches ? LOOP_SECONDS * 0.42 : (performance.now() - start) / 1000);
    }

    // The canvas ignores the pointer (so buttons stay clickable); track it on the window.
    function onPointerMove(event: PointerEvent) {
      if (!finePointer.matches || reduceMotion.matches) return;
      const box = element!.getBoundingClientRect();
      const x = event.clientX - box.left;
      const y = event.clientY - box.top;
      const inside = x >= 0 && y >= 0 && x <= box.width && y <= box.height;
      pointer.tx = x;
      pointer.ty = y;
      if (inside && pointer.target === 0) {
        pointer.x = x;
        pointer.y = y;
      }
      pointer.target = inside ? 1 : 0;
    }
    function onPointerLeave() {
      pointer.target = 0;
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(element);
    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      update();
    });
    viewObserver.observe(element);
    document.addEventListener("visibilitychange", update);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
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
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
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
