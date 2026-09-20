import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { buildProbe } from '../../lib/probe.js';
import {
  lerp, clamp01, smooth, band, peak, glowTexture, ringTexture, sprite, points,
  starfield, debrisShell, accretionDisk, spiralGalaxy, jet, gasGiant,
} from '../../lib/space.js';
import { useNova } from '../../hooks/useNova.js';
import { useRipple } from '../../hooks/useRipple.js';
import './voyage.css';

// The road. Eight sections of the page, eight stations along it, so the camera arrives where
// the reader does: launch, a gas giant, the supernova, its remnant, the merger, a quasar, the
// cluster, and the deep field at the end.
const Z0 = 180;
const Z1 = -4250;
const zAt = (t) => lerp(Z0, Z1, t);

// The eight sections of the page, in the order they are travelled.
const SECTION_IDS = ['top', 'now', 'work', 'projects', 'research', 'stack', 'education', 'contact'];

/**
 * Sections are not the same height, so raw scroll does not arrive at station three when the
 * reader arrives at the third section. This measures where each section actually starts and
 * builds a piecewise map from real scroll to station space, so every set piece fires exactly
 * when its section comes up. Remeasured whenever the layout can have changed.
 */
function measureStations() {
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const anchors = SECTION_IDS.map((id, i) => {
    if (i === 0) return 0;
    const el = document.getElementById(id);
    if (!el) return i / (SECTION_IDS.length - 1);
    return clamp01((el.getBoundingClientRect().top + window.scrollY - 72) / max);
  });
  // Keep it monotonic, and pin the last station to the end of the page.
  for (let i = 1; i < anchors.length; i++) anchors[i] = Math.max(anchors[i], anchors[i - 1] + 0.001);
  anchors[anchors.length - 1] = 1;
  return anchors;
}

/** Raw scroll 0..1 to station space 0..1, where station i sits exactly at i / (n - 1). */
function toStationSpace(raw, anchors) {
  const n = anchors.length - 1;
  if (raw <= anchors[0]) return 0;
  for (let i = 0; i < n; i++) {
    if (raw <= anchors[i + 1]) {
      const span = anchors[i + 1] - anchors[i] || 1;
      return (i + (raw - anchors[i]) / span) / n;
    }
  }
  return 1;
}

// The set pieces, placed just past the station that reads them.
const P_GIANT = new THREE.Vector3(-250, -40, -520);
const P_NOVA = new THREE.Vector3(52, 18, -1130);
const P_REMNANT = new THREE.Vector3(-52, 12, -1775);
const P_MERGER = new THREE.Vector3(-62, -12, -2400);
const P_QUASAR = new THREE.Vector3(104, 32, -3040);

// The probe's flight plan, one entry per station. `side` and `lift` are fractions of the visible
// frame, so the staging holds on a phone as well as a wide screen. `lead` is how far ahead of the
// camera it rides, and it swings between near and far so the craft genuinely travels in depth
// rather than sitting at a fixed offset. `watch` is what it turns to face on that leg.
const FLIGHT = [
  { side: 0.50, lift: -0.02, lead: 110, watch: null },
  { side: -0.30, lift: 0.18, lead: 195, watch: 'giant' },
  { side: 0.46, lift: -0.14, lead: 140, watch: 'nova' },
  { side: -0.34, lift: 0.22, lead: 235, watch: 'remnant' },
  { side: 0.42, lift: -0.06, lead: 150, watch: 'merger' },
  { side: -0.38, lift: 0.16, lead: 205, watch: 'quasar' },
  { side: 0.30, lift: 0.26, lead: 265, watch: null },
  { side: -0.18, lift: 0.34, lead: 330, watch: null },
];

/**
 * The voyage. A fixed canvas behind the whole page: the probe leaves at the top, and the reader
 * travels with it past a gas giant, a supernova, the remnant it leaves, a black hole merger, a
 * quasar and a cluster of galaxies. Two of those set pieces do not stay inside the canvas: the
 * blast forges the colour of the text it passes, and the merger ripples the layout.
 */
// What the blast paints and what the wave moves. Text leaves for the forge, because the gradient
// is clipped to glyphs; structural blocks for the ripple, because the reveal animations already
// own the transforms on the text inside them.
const FORGE_TARGETS = [
  'h1', 'h2', 'h3', 'h4', 'p', 'li', 'figcaption',
  '.t-mono', '.t-mono-label', '.readout__value', '.facts__value', '.copy-email__address',
].join(', ');
const RIPPLE_TARGETS = [
  '.entry', '.card', '.pub', '.readout', '.flagship', '.stack__group',
  '.more__item', '.arch__step', '.facts__cell', '.copy-email',
].join(', ');

export default function Voyage({ reduced, isPhone }) {
  const canvasRef = useRef(null);
  const nova = useNova(!reduced, FORGE_TARGETS);
  const ripple = useRipple(!reduced, RIPPLE_TARGETS);

  useEffect(() => {
    const canvas = canvasRef.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: !isPhone, alpha: false, powerPreference: 'high-performance' });
    } catch {
      return undefined; // No WebGL: the page keeps its flat background and reads normally.
    }
    const DPR = Math.min(window.devicePixelRatio || 1, isPhone ? 1.5 : 1.75);
    renderer.setPixelRatio(DPR);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    // Fog resolves to black so additive particles genuinely vanish with distance, which is what
    // makes each station arrive out of the dark instead of sitting there waiting.
    scene.fog = new THREE.Fog(0x000000, 320, 1250);
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.5, 9000);

    const SMALL = isPhone;
    const N = (full, phone) => (SMALL ? phone : full);

    // Dark is a cosmos of light on black. Light is the same voyage drawn as ink on paper: the
    // particle clouds stop adding light and start laying down pigment, and the glows, which only
    // exist to brighten a dark sky, stand down. Collected here so the swap is one pass.
    const cloudMats = [];
    const glowSprites = [];
    const INK = new THREE.Color(0x141517);

    const TEX = {
      white: glowTexture([[0, 'rgba(255,255,255,1)'], [0.24, 'rgba(206,224,255,0.5)'], [1, 'rgba(0,0,0,0)']]),
      hot: glowTexture([[0, 'rgba(255,253,248,1)'], [0.18, 'rgba(255,206,150,0.8)'], [0.48, 'rgba(255,104,52,0.26)'], [1, 'rgba(0,0,0,0)']]),
      ember: glowTexture([[0, 'rgba(255,176,116,0.95)'], [0.33, 'rgba(255,92,54,0.32)'], [1, 'rgba(0,0,0,0)']]),
      blue: glowTexture([[0, 'rgba(240,248,255,1)'], [0.28, 'rgba(126,186,255,0.48)'], [1, 'rgba(0,0,0,0)']]),
      ringHot: ringTexture('rgba(255,216,180,0.95)'),
      ringCold: ringTexture('rgba(158,204,255,0.9)'),
      ringThin: ringTexture('rgba(255,238,210,0.95)', 0.026),
    };

    // ── Sky ───────────────────────────────────────────────────────────────
    const sky = starfield(N(8000, 2600), 3000, 2.1, 0.85);
    scene.add(sky);
    const nearDust = points(N(1600, 500), (i, o) => {
      o.p = [(Math.random() - 0.5) * 700, (Math.random() - 0.5) * 460, -Math.random() * 2200];
      const w = 0.4 + Math.random() * 0.4;
      o.c = [w * 0.82, w * 0.88, w];
    }, { size: 1.2, opacity: 0.45, fog: false });
    scene.add(nearDust);

    const ambient = new THREE.AmbientLight(0x9fb2cc, 0.42);
    scene.add(ambient);
    const homeStar = new THREE.PointLight(0xfff1dc, 7, 0, 1.3);
    homeStar.position.set(140, 80, 340);
    scene.add(homeStar);
    const blastLight = new THREE.PointLight(0xffb478, 0, 0, 1.7);
    blastLight.position.copy(P_NOVA);
    scene.add(blastLight);
    const mergerLight = new THREE.PointLight(0xaed4ff, 0, 0, 1.7);
    mergerLight.position.copy(P_MERGER);
    scene.add(mergerLight);

    // ── The probe ─────────────────────────────────────────────────────────
    const { group: probe } = buildProbe();
    probe.scale.setScalar(SMALL ? 0.5 : 0.62);
    scene.add(probe);
    // A key and a rim that travel with the craft, so it always reads as a lit machine.
    const probeKey = new THREE.PointLight(0xfff0dc, 520, 260, 1.4);
    probeKey.position.set(40, 34, 46);
    probe.add(probeKey);
    const probeRim = new THREE.PointLight(0x9cc6ff, 380, 230, 1.5);
    probeRim.position.set(-46, -12, -40);
    probe.add(probeRim);
    const probeGlint = sprite(TEX.white, 7, 0.4);
    probeGlint.position.set(0, 2, 0);
    probe.add(probeGlint);

    // ── 02 · Gas giant ────────────────────────────────────────────────────
    const giant = gasGiant(132);
    giant.group.position.copy(P_GIANT);
    scene.add(giant.group);
    const giantKey = new THREE.DirectionalLight(0xfff0dc, 4.4);
    giantKey.position.set(300, 120, 260);
    giant.group.add(giantKey);
    const giantRim = new THREE.DirectionalLight(0x74a0ff, 1.0);
    giantRim.position.set(-220, -60, -180);
    giant.group.add(giantRim);

    // ── 03 · Supernova ────────────────────────────────────────────────────
    const progenitor = new THREE.Mesh(
      new THREE.SphereGeometry(26, 48, 48),
      new THREE.MeshBasicMaterial({ color: 0xff8f5c }),
    );
    progenitor.position.copy(P_NOVA);
    scene.add(progenitor);
    const progenitorGlow = sprite(TEX.ember, 210, 0.9);
    progenitorGlow.position.copy(P_NOVA);
    scene.add(progenitorGlow);

    const flash = sprite(TEX.hot, 10, 0, false); flash.position.copy(P_NOVA); scene.add(flash);
    const core = sprite(TEX.white, 10, 0, false); core.position.copy(P_NOVA); scene.add(core);
    const shockA = sprite(TEX.ringHot, 10, 0); shockA.position.copy(P_NOVA); scene.add(shockA);
    const shockB = sprite(TEX.ringCold, 10, 0); shockB.position.copy(P_NOVA); scene.add(shockB);
    const blast = debrisShell(N(16000, 5000), { reach: 1150, sizeScale: SMALL ? 1.4 : 1.15 });
    blast.mesh.position.copy(P_NOVA);
    scene.add(blast.mesh);

    // ── 04 · The remnant ──────────────────────────────────────────────────
    const remnant = points(N(9000, 3000), (i, o) => {
      const a = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      const r = 150 + Math.pow(Math.random(), 0.38) * 230;
      // Filaments: the shell is not smooth, it is torn into strands.
      const fil = 1 + Math.sin(a * 8 + ph * 6) * 0.18 + Math.sin(ph * 11) * 0.08;
      o.p = [Math.sin(ph) * Math.cos(a) * r * fil, Math.cos(ph) * r * 0.66 * fil, Math.sin(ph) * Math.sin(a) * r * fil];
      const m = Math.random();
      o.c = [lerp(1, 0.42, m), lerp(0.46, 0.66, m), lerp(0.28, 1, m)];
    }, { size: 2.1, opacity: 0 });
    remnant.position.copy(P_REMNANT);
    scene.add(remnant);
    const neutronStar = sprite(TEX.blue, 34, 0); neutronStar.position.copy(P_REMNANT); scene.add(neutronStar);
    const remnantGlow = sprite(TEX.ember, 520, 0); remnantGlow.position.copy(P_REMNANT); scene.add(remnantGlow);

    // ── 05 · Black hole merger ────────────────────────────────────────────
    const binary = new THREE.Group();
    binary.position.copy(P_MERGER);
    binary.rotation.y = 0.5;
    scene.add(binary);
    function blackHole(radius, diskSeed) {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.SphereGeometry(radius, 48, 48), new THREE.MeshBasicMaterial({ color: 0x000000 })));
      const photon = sprite(TEX.ringThin, radius * 7.4, 0.95);
      g.add(photon);
      const disk = accretionDisk(N(6000, 2200), radius * 2, radius * 8, [1, 0.6, 0.34], diskSeed);
      disk.mesh.rotation.x = 0.34;
      g.add(disk.mesh);
      return { g, disk, photon };
    }
    const bhA = blackHole(13, 23);
    const bhB = blackHole(10.5, 29);
    binary.add(bhA.g, bhB.g);
    const kilonova = debrisShell(N(10000, 3200), { reach: 900, sizeScale: SMALL ? 1.2 : 1, hot: [0.92, 0.98, 1], cool: [0.62, 0.36, 1], seed: 17 });
    kilonova.mesh.position.copy(P_MERGER);
    scene.add(kilonova.mesh);
    const mergeFlash = sprite(TEX.blue, 10, 0, false); mergeFlash.position.copy(P_MERGER); scene.add(mergeFlash);
    // Three rings leaving together: what the page ripple is a picture of.
    const waves = [0, 1, 2].map(() => {
      const s = sprite(TEX.ringCold, 10, 0);
      s.position.copy(P_MERGER);
      scene.add(s);
      return s;
    });

    // ── 06 · Quasar ───────────────────────────────────────────────────────
    const quasar = new THREE.Group();
    quasar.position.copy(P_QUASAR);
    quasar.rotation.z = 0.34;
    scene.add(quasar);
    quasar.add(new THREE.Mesh(new THREE.SphereGeometry(15, 48, 48), new THREE.MeshBasicMaterial({ color: 0x000000 })));
    const qDisk = accretionDisk(N(8000, 2600), 27, 128, [1, 0.74, 0.46], 37);
    qDisk.mesh.rotation.x = 0.16;
    quasar.add(qDisk.mesh);
    quasar.add(sprite(TEX.ringThin, 112, 0.9));
    const jetUp = jet(N(4000, 1400), 620, 34);
    const jetDown = jet(N(4000, 1400), 620, 34, 43);
    jetDown.rotation.z = Math.PI;
    quasar.add(jetUp, jetDown);
    const qCore = sprite(TEX.blue, 160, 0.75);
    quasar.add(qCore);

    // ── 07 · The cluster ──────────────────────────────────────────────────
    const cluster = new THREE.Group();
    scene.add(cluster);
    [
      [-420, 120, -3640, 190, 0.5, 2],
      [330, -160, -3860, 240, -0.8, 2],
      [-120, 210, -4060, 160, 1.2, 3],
      [500, 90, -4260, 260, 0.3, 2],
      [-560, -80, -4460, 200, -0.4, 2],
    ].forEach(([x, y, z, r, tilt, arms], i) => {
      const gal = spiralGalaxy(N(5200, 1800), r, arms, 31 + i * 7);
      gal.position.set(x, y, z);
      gal.rotation.set(tilt, i * 1.3, tilt * 0.4);
      cluster.add(gal);
      const coreGlow = sprite(TEX.white, r * 0.42, 0.5);
      coreGlow.position.set(x, y, z);
      cluster.add(coreGlow);
    });

    // Collected once the whole scene exists, then repainted whenever the theme changes.
    scene.traverse((o) => {
      if (o.isPoints) cloudMats.push({ mat: o.material, base: o.material.opacity });
      else if (o.isSprite && o !== probeGlint) glowSprites.push({ s: o, base: o.material.opacity });
    });

    let isLight = document.documentElement.dataset.theme === 'light';
    const paintTheme = () => {
      isLight = document.documentElement.dataset.theme === 'light';
      const ground = isLight ? 0xf7f7f5 : 0x000000;
      renderer.setClearColor(isLight ? 0xf7f7f5 : 0x05060a, 1);
      scene.fog.color.setHex(ground);
      cloudMats.forEach(({ mat }) => {
        mat.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;
        mat.vertexColors = !isLight;
        if (isLight) mat.color.copy(INK);
        else mat.color.setHex(0xffffff);
        mat.needsUpdate = true;
      });
      // The glows exist to brighten a dark sky. On paper they would only wash it out.
      glowSprites.forEach(({ s: sp }) => { sp.userData.muted = isLight; });
      ambient.intensity = isLight ? 1.15 : 0.42;
      homeStar.intensity = isLight ? 3 : 7;
    };
    window.addEventListener('theme:change', paintTheme);
    paintTheme();

    // ── Scroll ────────────────────────────────────────────────────────────
    const st = { t: 0, target: 0, raf: 0, w: 0, h: 0, anchors: measureStations() };
    const readScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      st.target = toStationSpace(clamp01(window.scrollY / max), st.anchors);
    };
    const remeasure = () => { st.anchors = measureStations(); readScroll(); };
    readScroll();
    st.t = st.target;
    window.addEventListener('scroll', readScroll, { passive: true });
    // The page grows as fonts land and sections reveal, so the map is rebuilt as that settles.
    const ro = new ResizeObserver(remeasure);
    ro.observe(document.documentElement);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);

    const resize = () => {
      st.w = window.innerWidth;
      st.h = window.innerHeight;
      st.anchors = measureStations();
      camera.aspect = st.w / st.h;
      camera.updateProjectionMatrix();
      renderer.setSize(st.w, st.h);
    };
    resize();
    window.addEventListener('resize', resize);

    // Project a world point to viewport pixels, for the effects that leave the canvas.
    const proj = new THREE.Vector3();
    const toScreen = (v) => {
      proj.copy(v).project(camera);
      return { x: (proj.x * 0.5 + 0.5) * st.w, y: (-proj.y * 0.5 + 0.5) * st.h, z: proj.z };
    };
    // World units to viewport pixels at a given depth, so the DOM front matches the 3D front.
    const pxPerUnit = (worldPos) => {
      const dist = camera.position.distanceTo(worldPos);
      return st.h / (2 * Math.tan((camera.fov * Math.PI) / 360) * Math.max(dist, 1));
    };

    const look = new THREE.Vector3();
    const clock = new THREE.Clock();
    // Scratch objects for aiming the probe, allocated once.
    const probeAim = new THREE.Vector3();
    const probeQuat = new THREE.Quaternion();
    const probeBasis = new THREE.Matrix4();
    const UP = new THREE.Vector3(0, 1, 0);
    const TIP = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
    const WATCH = { giant: P_GIANT, nova: P_NOVA, remnant: P_REMNANT, merger: P_MERGER, quasar: P_QUASAR };

    // Sprite opacity is written all over the frame; this is the one gate that mutes them on paper.
    const glow = (spr, value) => { spr.material.opacity = spr.userData.muted ? 0 : value; };

    function frame() {
      st.raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      const time = clock.getElapsedTime();
      st.t += (st.target - st.t) * 0.055;
      const t = st.t;

      // ── Flight ──
      const camZ = zAt(t);
      const sway = Math.sin(t * 8.4) * 30;
      camera.position.set(sway, 16 + Math.sin(t * 5.6) * 14, camZ);
      look.set(sway * 0.35, 6, camZ - 320);
      camera.lookAt(look);
      camera.rotation.z = Math.sin(t * 4.8) * 0.028;

      // The probe is flown, not parked. Between stations it crosses the frame and changes its
      // distance, and it turns to put its dish on whatever is out there on that leg.
      const fi0 = clamp01(t) * (FLIGHT.length - 1);
      const fa = Math.min(FLIGHT.length - 2, Math.floor(fi0));
      const fm = smooth(clamp01(fi0 - fa));
      const legA = FLIGHT[fa];
      const legB = FLIGHT[fa + 1];
      const lead = lerp(legA.lead, legB.lead, fm);
      const halfH = lead * Math.tan((camera.fov * Math.PI) / 360);
      const halfW = halfH * camera.aspect;
      probe.position.set(
        sway + lerp(legA.side, legB.side, fm) * halfW + Math.sin(time * 0.27) * 4,
        6 + lerp(legA.lift, legB.lift, fm) * halfH + Math.sin(time * 0.35) * 3,
        camZ - lead,
      );

      // Aim mostly at the subject but keep some of the heading, so the craft is turned toward
      // the event in three quarter view rather than presenting the dish flat to the camera.
      const watch = fm < 0.5 ? legA.watch : legB.watch;
      const subject = watch ? WATCH[watch] : null;
      probeAim.set(probe.position.x * 1.35, probe.position.y - 16, probe.position.z - 360);
      if (subject) probeAim.lerp(subject, 0.62);
      probeBasis.lookAt(probe.position, probeAim, UP);
      probeQuat.setFromRotationMatrix(probeBasis);
      // The dish points along +Y in the model, so tip it onto the line of sight.
      probeQuat.multiply(TIP);
      // Eased rather than snapped, so a turn reads as the craft coming about.
      probe.quaternion.slerp(probeQuat, 0.04);
      probe.rotateZ(Math.sin(time * 0.16) * 0.004);
      const probeFade = clamp01(1 - band(t, 0.80, 0.94));
      probe.visible = probeFade > 0.02;
      if (probe.visible) {
        probeKey.intensity = 520 * probeFade;
        probeRim.intensity = 380 * probeFade;
        probeGlint.material.opacity = 0.4 * probeFade;
      }

      // ── 02 · gas giant ──
      giant.body.rotation.y = time * 0.045;
      giant.bands.rotation.y = time * 0.045;
      giant.ring.rotation.y = time * 0.016;

      // ── 03 · supernova ──
      const u = band(t, 0.235, 0.42);
      const pre = clamp01(1 - band(t, 0.215, 0.255));
      progenitor.visible = pre > 0.01;
      progenitor.scale.setScalar(pre * (1 + Math.sin(time * 10) * 0.035));
      glow(progenitorGlow, pre * 0.9);

      const flashPeak = peak(u, 0.10, 0.13);
      glow(flash, flashPeak);
      flash.scale.setScalar(300 + u * 3600);
      glow(core, clamp01(1 - u * 1.5) * 0.95);
      core.scale.setScalar(70 + u * 420);
      blast.advance(u);
      blastLight.intensity = flashPeak * 5200 + clamp01(1 - u) * 320;

      glow(shockA, u > 0 ? clamp01(u * 6) * clamp01((1 - u) * 1.9) * 0.9 : 0);
      shockA.scale.setScalar(170 + Math.pow(u, 0.68) * 3300);
      glow(shockB, u > 0.05 ? clamp01((u - 0.05) * 5) * clamp01((1 - u) * 1.6) * 0.5 : 0);
      shockB.scale.setScalar(90 + Math.pow(u, 0.8) * 2400);

      // The blast leaves the canvas: the front radius in pixels drives the forge gradient, so the
      // colour crossing a headline is the same front that is crossing the sky behind it.
      if (u > 0.001 && u < 0.999) {
        const s = toScreen(P_NOVA);
        const scale = pxPerUnit(P_NOVA);
        nova.current.report({ active: true, x: s.x, y: s.y, radius: Math.pow(u, 0.6) * 1150 * scale * 0.92 });
      } else {
        nova.current.report({ active: false });
      }

      // ── 04 · the remnant ──
      const rem = clamp01(band(t, 0.355, 0.415) - band(t, 0.50, 0.565));
      remnant.material.opacity = rem * 0.92;
      remnant.rotation.y = time * 0.014;
      remnant.scale.setScalar(0.8 + band(t, 0.355, 0.565) * 0.4);
      glow(remnantGlow, rem * 0.34);
      glow(neutronStar, rem * (0.65 + Math.sin(time * 12) * 0.35));

      // ── 05 · the merger ──
      const inspiral = band(t, 0.475, 0.575);
      const sep = lerp(130, 20, Math.pow(inspiral, 2));
      const orbit = time * (0.5 + inspiral * 7) + inspiral * 30;
      const merged = inspiral > 0.99;
      bhA.g.position.set(Math.cos(orbit) * sep * 0.45, 0, Math.sin(orbit) * sep * 0.45);
      bhB.g.position.set(-Math.cos(orbit) * sep * 0.55, 0, -Math.sin(orbit) * sep * 0.55);
      bhB.g.visible = !merged;
      const squeeze = lerp(1, 0.55, inspiral);
      bhA.disk.spin(0.02 * (1 + inspiral * 4), squeeze);
      bhB.disk.spin(0.02 * (1 + inspiral * 4), squeeze);
      bhA.g.scale.setScalar(merged ? 1.35 : 1);
      binary.rotation.y = 0.5 + time * 0.03;

      const kn = band(t, 0.578, 0.655);
      kilonova.advance(kn);
      const knFlash = peak(kn, 0.08, 0.12);
      glow(mergeFlash, knFlash);
      mergeFlash.scale.setScalar(200 + kn * 2200);
      mergerLight.intensity = knFlash * 3600;

      // Three wave fronts, launched in sequence as the holes come together.
      const waveDrive = clamp01(band(t, 0.50, 0.685));
      waves.forEach((w, i) => {
        const wu = clamp01(waveDrive * 3 - i * 0.55);
        glow(w, wu > 0 && wu < 1 ? Math.sin(wu * Math.PI) * 0.55 : 0);
        w.scale.setScalar(120 + Math.pow(wu, 0.7) * 2600);
      });

      // The merger leaves the canvas: the layout rings as the wave goes through it.
      if (waveDrive > 0.001 && waveDrive < 0.999) {
        const s = toScreen(P_MERGER);
        const envelope = Math.sin(clamp01(waveDrive) * Math.PI);
        ripple.current.report({
          active: true,
          x: s.x,
          y: s.y,
          amplitude: (SMALL ? 9 : 15) * envelope * (0.45 + inspiral * 0.55),
          wavelength: 130,
          phase: waveDrive * 26 + time * 3.4,
        });
      } else {
        ripple.current.report({ active: false });
      }

      // ── 06 · quasar ──
      qDisk.spin(0.022);
      quasar.rotation.y = time * 0.05;
      const jetPulse = 0.5 + Math.sin(time * 1.7) * 0.13;
      jetUp.material.opacity = jetPulse;
      jetDown.material.opacity = jetPulse;
      glow(qCore, 0.68 + Math.sin(time * 3.3) * 0.16);

      sky.rotation.y = time * 0.003;
      nearDust.position.z = camZ * 0.6;
      renderer.render(scene, camera);
    }

    // Reduced motion: one still frame of the launch, and nothing ever moves again.
    if (reduced) {
      st.t = 0;
      camera.position.set(0, 16, Z0);
      camera.lookAt(0, 6, Z0 - 320);
      probe.position.set(70, 6, Z0 - 110);
      probe.rotation.set(0.22, 0.75, 0.12);
      blast.advance(0);
      kilonova.advance(0);
      remnant.material.opacity = 0;
      renderer.render(scene, camera);
    } else {
      st.raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(st.raf);
      window.removeEventListener('scroll', readScroll);
      window.removeEventListener('theme:change', paintTheme);
      ro.disconnect();
      window.removeEventListener('resize', resize);
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); });
        }
      });
      renderer.dispose();
    };
  }, [reduced, isPhone, nova, ripple]);

  return (
    <>
      <canvas ref={canvasRef} className="voyage" aria-hidden="true" />
      <div className="voyage-scrim" aria-hidden="true" />
    </>
  );
}
