import { useEffect, useRef } from 'react';
import { createField, cameraFor } from '../../lib/field.js';
import { mulberry32 } from '../../lib/prng.js';
import { prefersReducedMotion } from '../../lib/motion.js';
import './field.css';

const SEED = 0x5a17;
const BASE_FREQ = 0.00085; // field units per CSS pixel at zoom 1: lower means broader currents
const STEP = 1.6; // px a particle travels per frame
const MAX_LIFE = 320;
const FADE = 0.028; // how fast trails are painted out: lower is a longer trail

/** #RRGGBB or rgb(...) to [r, g, b]. */
function toRgb(value) {
  const v = String(value || '').trim();
  if (v.startsWith('#')) {
    const h = v.length === 4 ? v[1] + v[1] + v[2] + v[2] + v[3] + v[3] : v.slice(1, 7);
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  const m = v.match(/-?\d+(\.\d+)?/g);
  return m ? [Number(m[0]), Number(m[1]), Number(m[2])] : [0, 0, 0];
}

/**
 * The background is the design: a flow field of drifting currents that the page travels through.
 * Scrolling zooms the field out and pans across it, so each section arrives over a different part
 * of the same continuous landscape. The canvas sits behind everything and is never interactive.
 *
 * Reduced motion paints one still frame of the same field and stops.
 */
export default function FlowField({ count }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return undefined;

    const field = createField({ seed: SEED });
    const rand = mulberry32(SEED ^ 0x1234);
    const reduced = prefersReducedMotion();

    const s = {
      w: 0,
      h: 0,
      dpr: 1,
      n: 0,
      px: null,
      py: null,
      life: null,
      weight: null,
      colors: null,
      progress: 0,
      heroFade: 1,
      zoom: 1,
      panY: 0,
      panX: 0,
      intensity: 1,
      raf: 0,
      running: false,
      t: 0,
    };
    stateRef.current = s;

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      s.colors = {
        bg: toRgb(cs.getPropertyValue('--bg-0')),
        line: toRgb(cs.getPropertyValue('--fg-0')),
        accent: toRgb(cs.getPropertyValue('--accent')),
      };
    };

    const spawn = (i) => {
      s.px[i] = rand() * s.w;
      s.py[i] = rand() * s.h;
      s.life[i] = Math.floor(rand() * MAX_LIFE);
    };

    const allocate = () => {
      const area = s.w * s.h;
      const target = count || Math.round(Math.min(620, Math.max(180, area / 2600)));
      s.n = target;
      s.px = new Float32Array(target);
      s.py = new Float32Array(target);
      s.life = new Uint16Array(target);
      s.weight = new Uint8Array(target);
      for (let i = 0; i < target; i++) {
        spawn(i);
        const r = rand();
        s.weight[i] = r < 0.03 ? 2 : r < 0.26 ? 1 : 0;
      }
    };

    const paintBackground = () => {
      const [r, g, b] = s.colors.bg;
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(0, 0, s.w, s.h);
    };

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (w === s.w && h === s.h && dpr === s.dpr) return;
      s.w = w;
      s.h = h;
      s.dpr = dpr;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      allocate();
      paintBackground();
      if (reduced) paintStill();
    };

    /**
     * One simulation step for every particle. Strokes are batched by weight so the whole field is
     * three paths per frame: fine, bold, and the few accent currents.
     */
    const step = (alpha) => {
      const freq = BASE_FREQ / s.zoom;
      const [lr, lg, lb] = s.colors.line;
      const [ar, ag, ab] = s.colors.accent;
      const passes = [
        { weight: 0, width: 1, style: `rgba(${lr}, ${lg}, ${lb}, ${alpha * 0.85})` },
        { weight: 1, width: 1.6, style: `rgba(${lr}, ${lg}, ${lb}, ${alpha * 1.5})` },
        { weight: 2, width: 1.4, style: `rgba(${ar}, ${ag}, ${ab}, ${alpha * 2.1})` },
      ];
      ctx.lineCap = 'round';
      for (const pass of passes) {
        ctx.lineWidth = pass.width;
        ctx.strokeStyle = pass.style;
        ctx.beginPath();
        for (let i = 0; i < s.n; i++) {
          if (s.weight[i] !== pass.weight) continue;
          const x = s.px[i];
          const y = s.py[i];
          const a = field.angleAt(x * freq + s.panX, y * freq + s.panY, s.t);
          const nx = x + Math.cos(a) * STEP;
          const ny = y + Math.sin(a) * STEP;
          ctx.moveTo(x, y);
          ctx.lineTo(nx, ny);
          s.px[i] = nx;
          s.py[i] = ny;
          if (++s.life[i] > MAX_LIFE || nx < -40 || nx > s.w + 40 || ny < -40 || ny > s.h + 40) spawn(i);
        }
        ctx.stroke();
      }
    };

    /** Reduced motion: one still engraving of the same field, then nothing moves again. */
    function paintStill() {
      paintBackground();
      for (let i = 0; i < s.n; i++) spawn(i);
      for (let k = 0; k < 220; k++) step(0.06);
    }

    const frame = () => {
      s.raf = requestAnimationFrame(frame);
      if (document.hidden) return;

      const cam = cameraFor(s.progress, { heroFade: s.heroFade });
      // Ease the camera so a fast scroll does not snap the field.
      s.zoom += (cam.zoom - s.zoom) * 0.05;
      s.panY += (cam.panY - s.panY) * 0.05;
      s.intensity += (cam.intensity - s.intensity) * 0.06;
      s.panX += 0.00035;
      s.t += 0.0016;

      const [r, g, b] = s.colors.bg;
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${FADE})`;
      ctx.fillRect(0, 0, s.w, s.h);
      step(0.1 * s.intensity);
    };

    readColors();
    resize();

    const onResize = () => resize();
    window.addEventListener('resize', onResize);

    const onTheme = () => {
      readColors();
      paintBackground();
      if (reduced) paintStill();
    };
    window.addEventListener('theme:change', onTheme);

    const onScroll = () => {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      s.progress = Math.min(1, Math.max(0, window.scrollY / max));
      s.heroFade = Math.max(0, 1 - window.scrollY / Math.max(1, window.innerHeight * 0.9));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (!reduced) {
      s.zoom = cameraFor(s.progress, { heroFade: s.heroFade }).zoom;
      s.running = true;
      s.raf = requestAnimationFrame(frame);
    } else {
      paintStill();
    }

    return () => {
      cancelAnimationFrame(s.raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('theme:change', onTheme);
      window.removeEventListener('scroll', onScroll);
      s.running = false;
    };
  }, [count]);

  return <canvas ref={canvasRef} className="field" aria-hidden="true" />;
}
