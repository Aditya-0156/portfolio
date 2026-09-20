import { useEffect, useImperativeHandle, useRef } from 'react';
import { drawSpectrum, colorsFrom } from '../../lib/spectrumDraw.js';
import { prefersReducedMotion } from '../../lib/motion.js';

const INTRO_LENGTH = 1.4; // seconds after startIntro during which the loop must run
const SCAN_MS = 1400;
const MARKER_FADE_MS = 240;
const CURSOR_FADE_MS = 240;

/**
 * The canvas: owns its frame loop (dirty flag, visibility, page-hidden, slow-frame watchdog),
 * its colours (read from the CSS tokens on mount and on every theme:change), the pointer marker,
 * the intro acquire, the scroll collapse and the research scan.
 *
 * Imperative API through `ref`: startIntro(atMs), finishIntro(), setCollapse(p), runScan(), redraw().
 */
export default function SpectrumCanvas({ ref, mode = 'live', model, onChannelHover, isPhone = false }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const st = useRef(null);
  if (st.current === null) {
    st.current = {
      running: false,
      dirty: true,
      lastDraw: 0,
      minFrame: isPhone ? 41 : 33,
      visible: true,
      reduced: prefersReducedMotion(),
      colors: null,
      size: { w: 0, h: 0, dpr: 1 },
      introStart: null,
      p: 0,
      cursor: null,
      lastCursor: null,
      cursorFadeFrom: -1e9,
      markerAlpha: mode === 'live' ? 0 : 1,
      scan: null,
      scanStart: 0,
      slowFrames: 0,
      watchdogStatic: false,
      breatheUntil: 0,
    };
  }

  useEffect(() => {
    const s = st.current;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      s.colors = colorsFrom((name) => cs.getPropertyValue(name));
    };

    const draw = (nowMs) => {
      if (!s.colors || s.size.w < 2) return;
      const t = nowMs / 1000;
      let markerAlpha = s.markerAlpha;
      if (mode === 'live' && s.introStart != null && s.markerAlpha < 1) {
        const dt = t - s.introStart;
        markerAlpha = Math.min(1, Math.max(0, (dt - 0.65) / (MARKER_FADE_MS / 1000)));
        if (markerAlpha >= 1) s.markerAlpha = 1;
      }
      let scan = null;
      if (s.scan != null) {
        const u = Math.min(1, (nowMs - s.scanStart) / SCAN_MS);
        scan = u;
        markerAlpha = u >= 1 ? Math.min(1, (nowMs - s.scanStart - SCAN_MS) / MARKER_FADE_MS) : 0;
        if (markerAlpha >= 1) {
          s.markerAlpha = 1;
          s.scan = null;
          scan = null;
        }
      }
      const cursorAlpha = s.cursor != null ? 1 : Math.max(0, 1 - (nowMs - s.cursorFadeFrom) / CURSOR_FADE_MS);
      const breathing = mode === 'live' && !s.reduced && !s.watchdogStatic && nowMs < s.breatheUntil;
      drawSpectrum(ctx, s.size, s.colors, model, {
        t,
        p: s.p,
        introStart: s.reduced ? null : s.introStart,
        breathing,
        markerAlpha,
        cursor: s.cursor != null ? s.cursor : s.lastCursor,
        cursorAlpha,
        scan,
        acquire: 1,
      });
    };

    const tick = (now) => {
      if (!s.visible || document.hidden) {
        s.running = false;
        return;
      }
      const introRunning = !s.reduced && s.introStart != null && now / 1000 < s.introStart + INTRO_LENGTH;
      const scanning = s.scan != null;
      const cursorFading = s.cursor == null && now - s.cursorFadeFrom < CURSOR_FADE_MS + 30;
      const breathing = mode === 'live' && !s.reduced && !s.watchdogStatic && now < s.breatheUntil;
      const animate = introRunning || scanning || cursorFading || breathing;
      if (!s.dirty && !animate) {
        s.running = false;
        return;
      }
      if (now - s.lastDraw >= s.minFrame) {
        const t0 = performance.now();
        draw(now);
        const cost = performance.now() - t0;
        if (cost > 40) {
          if (++s.slowFrames >= 2) s.watchdogStatic = true;
        } else s.slowFrames = 0;
        s.lastDraw = now;
        s.dirty = false;
      }
      requestAnimationFrame(tick);
    };

    const markDirty = () => {
      s.dirty = true;
      if (!s.running) {
        s.running = true;
        requestAnimationFrame(tick);
      }
    };
    /** Any interaction restarts the 12 s breathing window. */
    const touch = () => {
      s.breatheUntil = performance.now() + 12000;
      markDirty();
    };
    s.markDirty = markDirty;
    s.touch = touch;
    s.drawNow = () => draw(performance.now());

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(r.width));
      const h = Math.max(1, Math.round(r.height));
      if (w === s.size.w && h === s.size.h && dpr === s.size.dpr) return;
      s.size = { w, h, dpr };
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      draw(performance.now());
      markDirty();
    };

    readColors();
    resize();
    touch();
    const ro = new ResizeObserver(() => requestAnimationFrame(resize));
    ro.observe(wrap);

    const io = new IntersectionObserver(
      (entries) => {
        s.visible = entries.some((e) => e.isIntersecting);
        if (s.visible) markDirty();
      },
      { threshold: 0 },
    );
    io.observe(wrap);

    const onVisibility = () => {
      if (!document.hidden) touch();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const onTheme = () => {
      readColors();
      draw(performance.now());
      touch();
    };
    window.addEventListener('theme:change', onTheme);

    const mqReduced = matchMedia('(prefers-reduced-motion: reduce)');
    const onReduced = () => {
      s.reduced = mqReduced.matches;
      markDirty();
    };
    mqReduced.addEventListener('change', onReduced);

    let cleanupPointer = () => {};
    if (mode === 'live') {
      const channelAt = (e) => {
        const r = wrap.getBoundingClientRect();
        const x = (e.clientX - r.left) / Math.max(1, r.width);
        return model.nearestChannel(Math.min(1, Math.max(0, x)));
      };
      const setCursor = (ch) => {
        if (ch === s.cursor) return;
        s.cursor = ch;
        if (ch != null) s.lastCursor = ch;
        else s.cursorFadeFrom = performance.now();
        if (onChannelHover) onChannelHover(ch);
        touch();
      };
      const onMove = (e) => {
        if (e.pointerType !== 'mouse') return;
        setCursor(channelAt(e));
      };
      const onLeave = () => setCursor(null);
      const onDown = (e) => {
        if (e.pointerType === 'mouse') return;
        setCursor(channelAt(e));
      };
      wrap.addEventListener('pointermove', onMove);
      wrap.addEventListener('pointerleave', onLeave);
      wrap.addEventListener('pointerdown', onDown);
      cleanupPointer = () => {
        wrap.removeEventListener('pointermove', onMove);
        wrap.removeEventListener('pointerleave', onLeave);
        wrap.removeEventListener('pointerdown', onDown);
      };
    }

    return () => {
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('theme:change', onTheme);
      mqReduced.removeEventListener('change', onReduced);
      cleanupPointer();
      s.visible = false;
    };
  }, [mode, model, onChannelHover]);

  useImperativeHandle(
    ref,
    () => ({
      startIntro(atMs) {
        const s = st.current;
        if (s.reduced) {
          s.introStart = null;
          s.markerAlpha = 1;
        } else {
          s.introStart = (atMs == null ? performance.now() : atMs) / 1000;
          s.markerAlpha = 0;
        }
        s.touch && s.touch();
      },
      finishIntro() {
        const s = st.current;
        s.introStart = null;
        s.markerAlpha = 1;
        s.markDirty && s.markDirty();
      },
      setCollapse(p) {
        const s = st.current;
        const v = Math.min(1, Math.max(0, p));
        if (v === s.p) return;
        s.p = v;
        s.touch && s.touch();
      },
      runScan() {
        const s = st.current;
        if (s.reduced) {
          s.markerAlpha = 1;
        } else {
          s.scan = 0;
          s.scanStart = performance.now();
          s.markerAlpha = 0;
        }
        s.markDirty && s.markDirty();
      },
      redraw() {
        const s = st.current;
        s.drawNow && s.drawNow();
      },
    }),
    [],
  );

  return (
    <div ref={wrapRef} className="spectrum__wrap">
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}
