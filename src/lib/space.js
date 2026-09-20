// Procedural pieces for the voyage. Nothing here loads a model or an image: every shape is built
// from primitives and every glow is a canvas gradient, so the whole world ships as code.
import * as THREE from 'three';
import { mulberry32 } from './prng.js';

export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const smooth = (t) => t * t * (3 - 2 * t);
/** Rises 0 to 1 across [a, b] of the scroll, so a scene can be driven by where the reader is. */
export const band = (t, a, b) => clamp01((t - a) / (b - a));
/** A peak of height 1 at `at`, falling to 0 `half` either side. */
export const peak = (t, at, half, power = 1.6) => Math.pow(clamp01(1 - Math.abs(t - at) / half), power);

/** A soft radial sprite. */
export function glowTexture(stops, size = 256) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  stops.forEach(([at, col]) => g.addColorStop(at, col));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** A thin bright ring: shockwaves, photon rings, the ring plane of a disk seen edge on. */
export function ringTexture(col, thickness = 0.05) {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(Math.max(0, 0.88 - thickness * 3), 'rgba(0,0,0,0)');
  g.addColorStop(0.915, col);
  g.addColorStop(0.958, col);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 512);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

let DOT = null;
/** The soft round particle every point cloud uses. Built once. */
export function dotTexture() {
  if (DOT) return DOT;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.32, 'rgba(255,255,255,0.7)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  DOT = new THREE.CanvasTexture(c);
  DOT.colorSpace = THREE.SRGBColorSpace;
  return DOT;
}

export function sprite(tex, scale, opacity = 1, fog = true) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({
    map: tex, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: true, transparent: true, opacity, fog,
  }));
  s.scale.set(scale, scale, 1);
  return s;
}

/** A point cloud from a generator that fills p and c for each index. */
export function points(n, fill, { size = 1, opacity = 1, fog = true } = {}) {
  const pos = new Float32Array(n * 3);
  const col = new Float32Array(n * 3);
  const tmp = { p: [0, 0, 0], c: [1, 1, 1] };
  for (let i = 0; i < n; i++) {
    fill(i, tmp);
    pos[i * 3] = tmp.p[0]; pos[i * 3 + 1] = tmp.p[1]; pos[i * 3 + 2] = tmp.p[2];
    col[i * 3] = tmp.c[0]; col[i * 3 + 1] = tmp.c[1]; col[i * 3 + 2] = tmp.c[2];
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({
    map: dotTexture(), size, transparent: true, opacity, depthWrite: false,
    sizeAttenuation: true, blending: THREE.AdditiveBlending, vertexColors: true, fog,
  });
  return new THREE.Points(geo, mat);
}

/** A sphere of stars, in real stellar colours rather than plain white. */
export function starfield(n, radius, size, opacity, seed = 7) {
  const rand = mulberry32(seed);
  return points(n, (i, o) => {
    const r = radius * (0.55 + rand() * 0.45);
    const th = rand() * Math.PI * 2;
    const ph = Math.acos(2 * rand() - 1);
    o.p = [r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th)];
    // Most stars are dim and warm; a few are bright and blue.
    const bright = Math.pow(rand(), 2.4);
    const blue = rand();
    const w = 0.35 + bright * 0.65;
    o.c = [w * lerp(1, 0.78, blue), w * lerp(0.88, 0.9, blue), w * lerp(0.72, 1, blue)];
  }, { size, opacity, fog: false });
}

/**
 * An outward-flying shell of debris. `advance(u)` is driven by scroll rather than time, so the
 * blast expands exactly as fast as the reader scrolls into it.
 */
export function debrisShell(n, { reach = 1000, sizeScale = 1, hot = [1, 0.95, 0.82], cool = [1, 0.28, 0.1], seed = 11 } = {}) {
  const rand = mulberry32(seed);
  const dir = new Float32Array(n * 3);
  const speed = new Float32Array(n);
  const mesh = points(n, (i, o) => {
    const th = rand() * Math.PI * 2;
    const ph = Math.acos(2 * rand() - 1);
    // Slightly flattened and clumped, so it reads as a real remnant rather than a perfect ball.
    const clump = 0.78 + Math.pow(rand(), 3) * 0.5;
    dir[i * 3] = Math.sin(ph) * Math.cos(th) * clump;
    dir[i * 3 + 1] = Math.cos(ph) * 0.72 * clump;
    dir[i * 3 + 2] = Math.sin(ph) * Math.sin(th) * clump;
    speed[i] = 0.3 + Math.pow(rand(), 0.55);
    o.p = [0, 0, 0];
    const m = Math.pow(rand(), 1.5);
    o.c = [lerp(cool[0], hot[0], m), lerp(cool[1], hot[1], m), lerp(cool[2], hot[2], m)];
  }, { size: 2 * sizeScale, opacity: 0 });

  const pos = mesh.geometry.attributes.position.array;
  return {
    mesh,
    advance(u) {
      if (u <= 0) { mesh.material.opacity = 0; mesh.visible = false; return; }
      mesh.visible = true;
      const r = Math.pow(u, 0.6) * reach;
      for (let i = 0; i < n; i++) {
        const d = r * speed[i];
        pos[i * 3] = dir[i * 3] * d;
        pos[i * 3 + 1] = dir[i * 3 + 1] * d;
        pos[i * 3 + 2] = dir[i * 3 + 2] * d;
      }
      mesh.geometry.attributes.position.needsUpdate = true;
      mesh.material.opacity = clamp01(u * 7) * clamp01((1 - u) * 2.2);
      mesh.material.size = (1.2 + u * 6) * sizeScale;
    },
  };
}

/** An accretion disk: points on near-circular orbits, hotter toward the inside. */
export function accretionDisk(n, rIn, rOut, tint = [1, 0.55, 0.3], seed = 23) {
  const rand = mulberry32(seed);
  const ang = new Float32Array(n);
  const rad = new Float32Array(n);
  const mesh = points(n, (i, o) => {
    const u = Math.pow(rand(), 0.5);
    const r = lerp(rIn, rOut, u);
    const a = rand() * Math.PI * 2;
    ang[i] = a; rad[i] = r;
    o.p = [Math.cos(a) * r, (rand() - 0.5) * (0.5 + u * 2.6), Math.sin(a) * r];
    const heat = 1 - u;
    o.c = [lerp(tint[0] * 0.85, 1, heat), lerp(tint[1] * 0.6, 0.96, heat * heat), lerp(tint[2] * 0.5, 0.9, heat * heat * heat)];
  }, { size: 1.4, opacity: 0.95 });

  const pos = mesh.geometry.attributes.position.array;
  return {
    mesh,
    /** Keplerian: the inside laps the outside. `squeeze` shrinks the disk as the orbit decays. */
    spin(dt, squeeze = 1) {
      for (let i = 0; i < n; i++) {
        ang[i] += dt * (30 / (rad[i] + 5));
        const r = rad[i] * squeeze;
        pos[i * 3] = Math.cos(ang[i]) * r;
        pos[i * 3 + 2] = Math.sin(ang[i]) * r;
      }
      mesh.geometry.attributes.position.needsUpdate = true;
    },
  };
}

/** A face-on spiral galaxy with a hot core, blue arms and a dust lane. */
export function spiralGalaxy(n, radius, arms = 2, seed = 31) {
  const rand = mulberry32(seed);
  return points(n, (i, o) => {
    const u = Math.pow(rand(), 0.5);
    const r = u * radius;
    const arm = Math.floor(rand() * arms);
    const wind = r * 0.05;
    const spread = (1 - u) * 0.45 + 0.12;
    const a = (arm / arms) * Math.PI * 2 + wind + (rand() - 0.5) * spread;
    const bulge = u < 0.16 ? 1 : 0.18;
    o.p = [Math.cos(a) * r, (rand() - 0.5) * radius * 0.06 * bulge, Math.sin(a) * r];
    const heat = Math.pow(1 - u, 1.4);
    o.c = [lerp(0.5, 1, heat), lerp(0.6, 0.9, heat), lerp(1, 0.72, heat)];
  }, { size: 1.4, opacity: 0.9 });
}

/** A relativistic jet: a narrow cone of particles along +Y, hottest at the base. */
export function jet(n, length, spread, seed = 41) {
  const rand = mulberry32(seed);
  return points(n, (i, o) => {
    const u = Math.pow(rand(), 0.65);
    const r = u * spread * (0.16 + u);
    const a = rand() * Math.PI * 2;
    o.p = [Math.cos(a) * r, u * length, Math.sin(a) * r];
    const heat = Math.pow(1 - u, 1.2);
    o.c = [lerp(0.44, 0.95, heat), lerp(0.68, 0.98, heat), 1];
  }, { size: 1.8, opacity: 0.85 });
}

/** A banded gas giant: a lit sphere with latitude bands and a particle ring system. */
export function gasGiant(radius, seed = 53) {
  const rand = mulberry32(seed);
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 96, 96),
    new THREE.MeshStandardMaterial({ color: 0xc09a74, roughness: 0.95, metalness: 0.0 }),
  );
  g.add(body);
  const bands = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const t0 = i / 11, t1 = (i + 1) / 11;
    const hue = 0.075 + (i % 3) * 0.012;
    const light = 0.3 + ((i * 7) % 5) * 0.055;
    const band = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 1.004, 96, 28, 0, Math.PI * 2, t0 * Math.PI, (t1 - t0) * Math.PI),
      new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(hue, 0.4, light), roughness: 1, transparent: true, opacity: 0.9 }),
    );
    bands.add(band);
  }
  g.add(bands);
  const storm = new THREE.Mesh(
    new THREE.SphereGeometry(radius * 0.21, 36, 24),
    new THREE.MeshStandardMaterial({ color: 0xb9553a, roughness: 1 }),
  );
  storm.position.set(radius * 0.76, -radius * 0.22, radius * 0.5);
  storm.scale.set(1, 0.5, 1);
  g.add(storm);

  const ring = points(16000, (i, o) => {
    // Three ring groups with a gap between them, like a real system.
    const gap = rand();
    const u = gap < 0.45 ? rand() * 0.34 : gap < 0.8 ? 0.42 + rand() * 0.3 : 0.78 + rand() * 0.22;
    const r = radius * (1.28 + u * 1.15);
    const a = rand() * Math.PI * 2;
    o.p = [Math.cos(a) * r, (rand() - 0.5) * radius * 0.012, Math.sin(a) * r];
    const w = 0.42 + rand() * 0.5;
    o.c = [w, w * 0.92, w * 0.8];
  }, { size: 1.15, opacity: 0.85 });
  ring.rotation.set(0.38, 0, 0.16);
  g.add(ring);
  return { group: g, body, bands, ring };
}
