// The maths behind the background: a seeded 3D value noise and the flow field derived from it.
// Pure functions, no DOM, so they can be tested in Node.
import { mulberry32 } from './prng.js';

const TAU = Math.PI * 2;
const smooth = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

/**
 * 3D value noise over a hashed lattice of size 64. Returns a value in [-1, 1] that is smooth in
 * every axis and repeats every 64 units. Trilinear interpolation with a smoothstep fade.
 */
export function createNoise3(seed = 1) {
  const N = 64;
  const MASK = N - 1;
  const rand = mulberry32(seed);
  const lattice = new Float32Array(N * N * N);
  for (let i = 0; i < lattice.length; i++) lattice[i] = rand() * 2 - 1;
  const at = (x, y, z) => lattice[(((x & MASK) * N + (y & MASK)) * N) + (z & MASK)];

  return function noise3(x, y, z) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const zi = Math.floor(z);
    const tx = smooth(x - xi);
    const ty = smooth(y - yi);
    const tz = smooth(z - zi);
    const c000 = at(xi, yi, zi);
    const c100 = at(xi + 1, yi, zi);
    const c010 = at(xi, yi + 1, zi);
    const c110 = at(xi + 1, yi + 1, zi);
    const c001 = at(xi, yi, zi + 1);
    const c101 = at(xi + 1, yi, zi + 1);
    const c011 = at(xi, yi + 1, zi + 1);
    const c111 = at(xi + 1, yi + 1, zi + 1);
    const x00 = lerp(c000, c100, tx);
    const x10 = lerp(c010, c110, tx);
    const x01 = lerp(c001, c101, tx);
    const x11 = lerp(c011, c111, tx);
    return lerp(lerp(x00, x10, ty), lerp(x01, x11, ty), tz);
  };
}

/**
 * The flow field. `angleAt` turns a point in field space into a direction; two octaves give the
 * currents a large shape and a finer texture inside it. Everything the camera does (zoom, pan,
 * drift over time) is applied by the caller before sampling, so the field itself is stateless.
 */
export function createField({ seed = 0x5a17, octaves = 2 } = {}) {
  const n1 = createNoise3(seed);
  const n2 = createNoise3((seed ^ 0x9e3779b9) >>> 0);

  function value(x, y, z) {
    let v = n1(x, y, z);
    if (octaves > 1) v += 0.45 * n2(x * 2.17 + 11.3, y * 2.17 - 7.1, z * 1.6);
    return v / (octaves > 1 ? 1.45 : 1);
  }

  /**
   * Direction in radians at a point in field space. The swing is deliberately under one full
   * turn: neighbouring particles then travel in nearly the same direction, so the field reads as
   * sweeping currents rather than crossing scribble. A constant bias tilts the whole flow.
   */
  function angleAt(x, y, z) {
    return value(x, y, z) * TAU * 0.4 + 0.5;
  }

  return { value, angleAt };
}

/**
 * The camera. Scroll progress 0..1 across the document maps to a zoom curve and a vertical pan,
 * so moving down the page feels like pulling back from the field and travelling across it.
 * `intensity` dims the field behind dense text and opens it up in the hero.
 */
export function cameraFor(progress, { heroFade = 1 } = {}) {
  const p = Math.min(1, Math.max(0, progress));
  // Out to a wide view through the middle of the page, then part of the way back in.
  const zoom = 1 + 0.85 * Math.sin(p * Math.PI) + 0.2 * p;
  const panY = p * 6.2;
  const intensity = 0.34 + 0.66 * heroFade;
  return { zoom, panY, intensity };
}
