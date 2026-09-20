/**
 * Pure drawing of one Spectrum frame on a 2D context. No React, no DOM lookups.
 *
 * drawSpectrum(ctx, size, colors, model, state)
 *   size   = { w, h, dpr }                       CSS pixels and device pixel ratio
 *   colors = { trace, traceFill, grid, hairline, accent, accentDim, fg2 }   CSS colour strings
 *   model  = createSpectrum(...)
 *   state  = {
 *     t: seconds, p: collapse 0..1, introStart: seconds | null, breathing: bool | 0..1,
 *     acquire: 0..1   alpha of the whole plot (used while the canvas is acquiring)
 *     markerAlpha: 0..1   fault marker opacity (intro fade)
 *     cursor: channel index | null, cursorAlpha: 0..1
 *     scan: null | 0..1   research figure only: a scan line sweeping from the left edge to the
 *                         fault channel (drawn in fg2); the fault marker is expected to fade in
 *                         through markerAlpha once the scan arrives
 *   }
 */

export const TOKEN_MAP = {
  trace: '--trace',
  traceFill: '--trace-fill',
  grid: '--grid',
  hairline: '--hairline',
  accent: '--accent',
  accentDim: '--accent-dim',
  fg2: '--fg-2',
};

/** Build a colours object from a getter such as (name) => computedStyle.getPropertyValue(name). */
export function colorsFrom(getProperty) {
  const out = {};
  for (const key in TOKEN_MAP) out[key] = String(getProperty(TOKEN_MAP[key]) || '').trim();
  return out;
}

const pointCache = new WeakMap();
function pointsFor(model, w) {
  let entry = pointCache.get(model);
  if (!entry || entry.w !== w) {
    entry = { w, pts: model.samplePoints(w) };
    pointCache.set(model, entry);
  }
  return entry.pts;
}

const TOP_INSET = 6;   // px kept clear above the tallest peak
const V_MAX = 1.08;    // trace values reach about 1.05 where neighbouring tails add to a peak

export function drawSpectrum(ctx, size, colors, model, state) {
  const { w, h, dpr } = size;
  const t = state.t || 0;
  const p = state.p || 0;
  const acquire = state.acquire == null ? 1 : state.acquire;
  const markerAlpha = state.markerAlpha == null ? 1 : state.markerAlpha;
  const opts = { introStart: state.introStart == null ? null : state.introStart, breathing: state.breathing || false };

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  if (acquire <= 0 || w < 2 || h < 2) return;

  const bottom = h;
  const span = (h - TOP_INSET) / V_MAX;
  const yOf = (v) => bottom - v * span;

  ctx.lineWidth = 1;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'butt';

  const gridAlpha = (1 - p) * acquire;

  // 3 + 4. Sample the trace once; fill under it, then stroke it.
  const pts = pointsFor(model, w);
  const line = new Path2D();
  for (let s = 0; s < pts.length; s++) {
    const x = pts[s];
    const px = x * w;
    const py = yOf(model.sample(x, t, p, opts));
    if (s === 0) line.moveTo(px, py); else line.lineTo(px, py);
  }
  const fill = new Path2D(line);
  fill.lineTo(w, h);
  fill.lineTo(0, h);
  fill.closePath();
  ctx.fillStyle = colors.traceFill;
  ctx.fill(fill);

  // Instrument grid, drawn over the fill so it reads as one continuous grid rather than lines
  // that only show through where the trace is low.
  if (gridAlpha > 0.002) {
    ctx.globalAlpha = gridAlpha;
    ctx.strokeStyle = colors.grid;
    ctx.beginPath();
    for (let k = 1; k <= 5; k++) {
      const y = Math.round((h * k) / 6) + 0.5;
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();
    ctx.strokeStyle = colors.hairline;
    ctx.beginPath();
    const xg1 = Math.round(model.gapLeft * w) + 0.5;
    const xg2 = Math.round(model.gapRight * w) + 0.5;
    ctx.moveTo(xg1, 0); ctx.lineTo(xg1, h);
    ctx.moveTo(xg2, 0); ctx.lineTo(xg2, h);
    ctx.stroke();
    ctx.globalAlpha = acquire;
  }

  ctx.strokeStyle = colors.trace;
  ctx.stroke(line);

  // 5. Fault marker.
  const ma = (1 - p) * markerAlpha * acquire;
  if (ma > 0.002) {
    const fi = model.faultIndex;
    const xf = model.channelX(fi);
    const pxf = xf * w;
    const yf = yOf(model.sample(xf, t, p, opts));
    const yFloor = yOf(model.floorAt(xf, t));
    const chW = Math.max(6, model.spacing * w);
    ctx.globalAlpha = ma;
    ctx.fillStyle = colors.accentDim;
    ctx.fillRect(pxf - chW * 1.1, yf - 10, chW * 2.2, h - yf + 10);
    ctx.strokeStyle = colors.accent;
    ctx.beginPath();
    const xl = Math.round(pxf) + 0.5;
    ctx.moveTo(xl, 0);
    ctx.lineTo(xl, yFloor);
    ctx.stroke();
    ctx.fillStyle = colors.accent;
    ctx.fillRect(Math.round(pxf) - 2, Math.round(yf) - 2, 4, 4);
  }

  // 5b. Scan line (static figure): sweeps from x = 0 to the fault channel.
  if (state.scan != null && state.scan < 0.999) {
    const xEnd = model.channelX(model.faultIndex) * w;
    const xs = Math.round(state.scan * xEnd) + 0.5;
    ctx.globalAlpha = acquire * 0.9;
    ctx.strokeStyle = colors.fg2;
    ctx.beginPath();
    ctx.moveTo(xs, 0);
    ctx.lineTo(xs, h);
    ctx.stroke();
  }

  // 6. Cursor marker.
  if (state.cursor != null && state.cursorAlpha > 0.002) {
    const xc = model.channelX(state.cursor);
    const pxc = xc * w;
    const yc = yOf(model.sample(xc, t, p, opts));
    ctx.globalAlpha = state.cursorAlpha * acquire;
    ctx.strokeStyle = colors.fg2;
    ctx.beginPath();
    const xl = Math.round(pxc) + 0.5;
    ctx.moveTo(xl, 0);
    ctx.lineTo(xl, h);
    ctx.stroke();
    ctx.fillStyle = colors.fg2;
    ctx.fillRect(Math.round(pxc) - 1, Math.round(yc) - 1, 3, 3);
  }

  ctx.globalAlpha = 1;
}
