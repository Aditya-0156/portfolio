import { mulberry32 } from './prng.js';
import { createNoise1d } from './noise.js';

/**
 * Spectrum model: a 96-channel C+L band WDM comb with a guard gap, a noise floor,
 * a per-band tilt and one depressed (faulted) channel. Pure functions, no DOM.
 *
 * Units: x is 0..1 across the width, t is seconds, p is the collapse progress 0..1,
 * the returned trace value is 0..1 (0 = bottom of the plot).
 */
export const GUARD = 0.035;
const TWO_PI = Math.PI * 2;

const lerp = (a, b, u) => a + (b - a) * u;
const clamp01 = (u) => (u < 0 ? 0 : u > 1 ? 1 : u);
const easeOut = (u) => 1 - (1 - u) * (1 - u) * (1 - u);
const smoothstep = (u) => u * u * (3 - 2 * u);

export function createSpectrum({ seed = 0x5a17, channels = 96, faultChannel = 61 } = {}) {
  const n = channels;
  const half = n >> 1;                 // channels in the C band
  const cLast = half - 1;              // 47
  const lLast = n - half - 1;          // 47
  const faultIndex = faultChannel - 1;
  const gapLeft = 0.5 - GUARD / 2;     // right edge of the C band
  const gapRight = 0.5 + GUARD / 2;    // left edge of the L band

  const rand = mulberry32(seed);
  const noise = createNoise1d((seed ^ 0x9e3779b9) >>> 0);

  const xs = new Float64Array(n);
  const peaks = new Float64Array(n);
  const widths = new Float64Array(n);
  const phases = new Float64Array(n);

  for (let i = 0; i < n; i++) {
    const inC = i < half;
    const u = inC ? i / cLast : (i - half) / lLast;
    xs[i] = inC ? lerp(0, gapLeft, u) : lerp(gapRight, 1, u);
    const tilt = inC ? 0.04 * (u - 0.5) : -0.06 * (u - 0.5);
    const base = 0.78 + tilt + (rand() - 0.5) * 0.06;
    // Spec 5.3 gives 0.0028 + rand * 0.0006; at that width the valleys sit at half height and the
    // comb reads as a ripple. 0.65x keeps the Lorentzian shape and puts the valleys near the floor.
    widths[i] = (0.0028 + rand() * 0.0006) * 0.78;
    phases[i] = rand() * TWO_PI;
    peaks[i] = base - (i === faultIndex ? 0.5 : 0);
  }

  const spacing = xs[1] - xs[0];

  function channelX(i) {
    return xs[i];
  }

  function bandOf(i) {
    return i < half ? 'C' : 'L';
  }

  /** Index arithmetic from x: the nearest channel, or null strictly inside the guard gap. */
  function nearestChannel(x) {
    if (x > gapLeft && x < gapRight) return null;
    if (x <= gapLeft) {
      const k = Math.round((x / gapLeft) * cLast);
      return k < 0 ? 0 : k > cLast ? cLast : k;
    }
    const k = Math.round(((x - gapRight) / (1 - gapRight)) * lLast);
    return half + (k < 0 ? 0 : k > lLast ? lLast : k);
  }

  /** Nearest channel for sampling: never null (the gap resolves to the adjacent band edge). */
  function nearestForSample(x) {
    if (x <= gapLeft) {
      const k = Math.round((x / gapLeft) * cLast);
      return k < 0 ? 0 : k > cLast ? cLast : k;
    }
    if (x >= gapRight) {
      const k = Math.round(((x - gapRight) / (1 - gapRight)) * lLast);
      return half + (k < 0 ? 0 : k > lLast ? lLast : k);
    }
    return x < 0.5 ? cLast : half;
  }

  function floorAt(x, t) {
    return 0.1 + 0.015 * noise(x * 18 + t * 0.15) + 0.008 * noise(x * 90 - t * 0.4);
  }

  /**
   * Per-channel envelope: intro rise, collapse with a trailing edge, breathing.
   * opts.introStart: seconds on the same clock as t, or null for "no intro" (1).
   * opts.breathing: boolean or a 0..1 amplitude factor.
   */
  function envelope(i, t, p, introStart, breath) {
    let intro = 1;
    if (introStart != null) intro = easeOut(clamp01((t - introStart - i * 0.006) / 0.36));
    const collapse = p > 0 ? smoothstep(clamp01((p - (i / (n - 1)) * 0.3) / 0.7)) : 0;
    const breathe = breath > 0 ? 1 + 0.012 * breath * Math.sin(t * 0.7 + phases[i]) : 1;
    return intro * (1 - collapse) * breathe;
  }

  function breathFactor(b) {
    if (b === true) return 1;
    if (!b) return 0;
    return clamp01(+b);
  }

  /** Trace value 0..1 at x. opts = { introStart: seconds | null, breathing: bool | 0..1 } */
  function sample(x, t = 0, p = 0, opts) {
    const introStart = opts && opts.introStart != null ? opts.introStart : null;
    const breath = opts ? breathFactor(opts.breathing) : 0;
    let v = floorAt(x, t);
    const k = nearestForSample(x);
    const j0 = k > 0 ? k - 1 : 0;
    const j1 = k < n - 1 ? k + 1 : n - 1;
    for (let j = j0; j <= j1; j++) {
      const d = x - xs[j];
      const w = widths[j];
      const l = (w * w) / (d * d + w * w);
      v += peaks[j] * l * envelope(j, t, p, introStart, breath);
    }
    return v;
  }

  /**
   * Sample abscissae for a plot `widthPx` wide: about one point per 1.5 px, laid out so that every
   * channel centre is hit exactly (uniform sampling aliases the peaks at phone widths).
   */
  function samplePoints(widthPx) {
    const step = 1.5 / Math.max(widthPx, 2);
    const out = [];
    const sub = Math.max(2, Math.round(spacing / step));
    for (let i = 0; i < n - 1; i++) {
      if (i === cLast) {
        const g = Math.max(2, Math.round((gapRight - gapLeft) / step));
        for (let k = 0; k < g; k++) out.push(gapLeft + ((gapRight - gapLeft) * k) / g);
        continue;
      }
      for (let k = 0; k < sub; k++) out.push(xs[i] + (spacing * k) / sub);
    }
    out.push(xs[n - 1]);
    return Float64Array.from(out);
  }

  return {
    channels: n,
    half,
    faultIndex,
    gapLeft,
    gapRight,
    spacing,
    channelX,
    bandOf,
    nearestChannel,
    floorAt,
    sample,
    samplePoints,
  };
}
