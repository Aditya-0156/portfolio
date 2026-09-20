import { mulberry32 } from './prng.js';

/**
 * 1D value noise with cosine interpolation over a seeded lattice.
 * createNoise1d(seed) -> noise(x): a smooth function of x in [-1, 1], periodic with period `size`.
 */
export function createNoise1d(seed, size = 256) {
  const rand = mulberry32(seed);
  const mask = size - 1;
  const lattice = new Float64Array(size);
  for (let i = 0; i < size; i++) lattice[i] = rand() * 2 - 1;
  return function noise(x) {
    const xf = Math.floor(x);
    const f = x - xf;
    const i0 = xf & mask;
    const i1 = (i0 + 1) & mask;
    const mu = (1 - Math.cos(f * Math.PI)) * 0.5;
    return lattice[i0] * (1 - mu) + lattice[i1] * mu;
  };
}
