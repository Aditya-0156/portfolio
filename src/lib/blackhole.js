// A black hole built the way the picture of one actually reads: a black sphere, a flat accretion
// disk seen near edge on, and the same disk lensed into a halo that arcs over the top and under
// the bottom. The disk is a shader, not a cloud of dots, so it is smooth, banded, hotter toward
// the inside, and brighter on the side rotating toward you.
import * as THREE from 'three';

const DISK_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const DISK_FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uInner;     // inner edge, as a fraction of the quad's half width
  uniform float uSpin;      // how fast the gas shears round
  uniform float uBeam;      // Doppler beaming: how much brighter the approaching side runs
  uniform float uOpacity;
  uniform float uTurb;      // turbulence, which rises as an inspiral tightens
  uniform vec3  uHot;
  uniform vec3  uMid;
  uniform vec3  uCool;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float r = length(p);
    if (r > 1.0 || r < uInner) discard;

    float ang = atan(p.y, p.x);
    // Keplerian shear: the inside laps the outside, which is what gives the disk its streaks.
    float shear = uTime * uSpin / pow(max(r, uInner), 1.5);
    float streak = fbm(vec2(ang * 2.4 + shear, r * 7.0));
    float bands  = fbm(vec2(ang * 0.9 + shear * 0.55, r * 26.0));
    float grain  = fbm(vec2(ang * 9.0 - shear * 1.7, r * 48.0));

    // Temperature: 1 at the inner edge, 0 at the rim.
    float temp = smoothstep(1.0, uInner, r);
    vec3 col = mix(uCool, uMid, temp);
    col = mix(col, uHot, pow(temp, 2.6));

    float density = mix(0.32, 0.78, streak) * mix(0.6, 1.05, bands) * mix(0.85, 1.05, grain);
    density = mix(density, density * (0.6 + 1.1 * grain), uTurb);

    // Soft at both edges so the disk has no cut line.
    float edge = smoothstep(1.0, 0.80, r) * smoothstep(uInner, uInner * 1.18, r);
    // The side coming toward the camera runs brighter and bluer.
    float doppler = 1.0 + uBeam * cos(ang);

    float a = density * edge * uOpacity * doppler;
    gl_FragColor = vec4(col * (0.26 + 0.9 * temp) * doppler, clamp(a, 0.0, 1.0));
  }
`;

function diskMaterial({ inner, spin, beam, turb = 0, hot, mid, cool }) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uInner: { value: inner },
      uSpin: { value: spin },
      uBeam: { value: beam },
      uOpacity: { value: 1 },
      uTurb: { value: turb },
      uHot: { value: new THREE.Color(hot) },
      uMid: { value: new THREE.Color(mid) },
      uCool: { value: new THREE.Color(cool) },
    },
    vertexShader: DISK_VERT,
    fragmentShader: DISK_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
}

/**
 * createBlackHole({ radius, tilt }) returns { group, update(elapsed, camera, opts) }.
 *
 * `group` holds the horizon, the flat disk and the lensed halo. The halo is billboarded at the
 * camera every frame, because the halo is light from the far side of the disk bent around the
 * hole and so always faces whoever is looking.
 */
export function createBlackHole({ radius = 16, tilt = 0.18, spin = 1, seed = 0 } = {}) {
  const group = new THREE.Group();

  // The horizon writes depth, so the far half of the disk is properly hidden behind it.
  const horizon = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 64, 64),
    new THREE.MeshBasicMaterial({ color: 0x000000, depthWrite: true }),
  );
  group.add(horizon);

  const OUTER = radius * 7.2;
  const INNER = (radius * 2.35) / OUTER;

  // The flat disk, lying in the hole's equator and seen near edge on.
  const diskMat = diskMaterial({
    inner: INNER, spin: 0.55 * spin, beam: 0.42,
    hot: 0xfff4e2, mid: 0xffb063, cool: 0xc4451a,
  });
  const disk = new THREE.Mesh(new THREE.PlaneGeometry(OUTER * 2, OUTER * 2, 1, 1), diskMat);
  disk.rotation.x = -Math.PI / 2 + tilt;
  disk.renderOrder = 2;
  group.add(disk);

  // The halo: the far side of the disk, lensed over the top and under the bottom. Slightly
  // tighter and hotter than the flat disk, and always turned to face the camera.
  const haloMat = diskMaterial({
    inner: (radius * 1.62) / (OUTER * 0.86), spin: 0.32 * spin, beam: 0.3,
    hot: 0xfff8ee, mid: 0xffc27e, cool: 0xd06a28,
  });
  haloMat.uniforms.uOpacity.value = 0.7;
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(OUTER * 1.72, OUTER * 1.72, 1, 1), haloMat);
  halo.renderOrder = 3;
  group.add(halo);

  // The photon ring: the thin bright line right at the edge of the shadow.
  const ringMat = diskMaterial({
    inner: 0.93, spin: 0.1 * spin, beam: 0.16,
    hot: 0xffffff, mid: 0xfff0d6, cool: 0xffd9a0,
  });
  ringMat.uniforms.uOpacity.value = 1.1;
  const photon = new THREE.Mesh(new THREE.PlaneGeometry(radius * 5.4, radius * 5.4, 1, 1), ringMat);
  photon.renderOrder = 4;
  group.add(photon);

  const mats = [diskMat, haloMat, ringMat];
  const offset = seed * 13.77;

  return {
    group,
    horizon,
    disk,
    halo,
    /**
     * opts.opacity scales the whole thing, opts.turb drives how churned the gas looks, and
     * opts.squeeze pulls the disk in as an orbit decays.
     */
    update(elapsed, camera, { opacity = 1, turb = 0, squeeze = 1 } = {}) {
      const t = elapsed + offset;
      mats.forEach((m) => { m.uniforms.uTime.value = t; m.uniforms.uTurb.value = turb; });
      diskMat.uniforms.uOpacity.value = opacity;
      haloMat.uniforms.uOpacity.value = 0.7 * opacity;
      ringMat.uniforms.uOpacity.value = 1.1 * opacity;
      disk.scale.setScalar(squeeze);
      halo.scale.setScalar(THREE.MathUtils.lerp(1, 0.86, 1 - squeeze));
      if (camera) {
        halo.quaternion.copy(camera.quaternion);
        photon.quaternion.copy(camera.quaternion);
      }
    },
    dispose() {
      horizon.geometry.dispose();
      horizon.material.dispose();
      [disk, halo, photon].forEach((m) => { m.geometry.dispose(); m.material.dispose(); });
    },
  };
}
