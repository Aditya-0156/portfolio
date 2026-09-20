import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { buildWorld } from '../../lib/voyage/world.js';
import { clamp01, band } from '../../lib/space.js';
import { scrollToHash } from '../../lib/motion.js';
import { voyage } from '../../content/voyage.js';
import { useNova } from '../../hooks/useNova.js';
import { useRipple } from '../../hooks/useRipple.js';

const FORGE =
  'h1, h2, h3, h4, p, li, figcaption, .t-mono, .t-mono-label, .readout__value, .facts__value';
const RIPPLE =
  '.entry, .card, .pub, .readout, .flagship, .stack__group, .more__item, .facts__cell';
const CAMERA = [
  [0, 35, 550],
  [55, 60, 210],
  [-40, 15, -470],
  [30, -25, -1170],
  [-35, 45, -1800],
  [20, -20, -2440],
  [-35, 65, -3130],
  [80, 15, -3650],
];

export default function Voyage({ reduced, isPhone }) {
  const canvasRef = useRef(null),
    progressRef = useRef(null),
    toggleRef = useRef(null);
  const [cinema, setCinema] = useState(false);
  const [paused, setPaused] = useState(false);
  const [available, setAvailable] = useState(true);
  const [chapter, setChapter] = useState(0);
  const playback = useRef({ paused: false, cinema: false });
  const engine = useRef({ wake: () => {} });
  const nova = useNova(!reduced && !paused, FORGE);
  const ripple = useRipple(!reduced && !paused, RIPPLE);

  useEffect(() => {
    playback.current = { paused, cinema };
    engine.current.wake();
  }, [paused, cinema]);
  useEffect(() => {
    document.documentElement.classList.toggle('voyage-cinema', cinema);
    const regions = [
      ...document.querySelectorAll('main, .nav, .footer-wrap, .skip'),
    ];
    regions.forEach((el) => {
      el.inert = cinema;
    });
    const escape = (e) => {
      if (e.key === 'Escape' && cinema) {
        setCinema(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', escape);
    return () => {
      document.documentElement.classList.remove('voyage-cinema');
      regions.forEach((el) => {
        el.inert = false;
      });
      window.removeEventListener('keydown', escape);
    };
  }, [cinema]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const engineApi = engine.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        powerPreference: 'high-performance',
      });
    } catch {
      const id = requestAnimationFrame(() => setAvailable(false));
      return () => cancelAnimationFrame(id);
    }
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.setClearColor(0x03060c);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      isPhone ? 62 : 48,
      1,
      0.5,
      11000,
    );
    const world = buildWorld(scene, isPhone);
    const path = new THREE.CatmullRomCurve3(
      CAMERA.map((p) => new THREE.Vector3(...p)),
      false,
      'catmullrom',
      0.32,
    );
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.24, 0.35, 0.9);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
    const state = {
      raf: 0,
      last: 0,
      time: 0,
      t: 0,
      target: 0,
      anchors: [],
      width: 1,
      height: 1,
      chapter: -1,
      dirty: true,
      lost: false,
      frames: 0,
      totalMs: 0,
      dpr: Math.min(devicePixelRatio || 1, isPhone ? 1.25 : 1.5),
    };
    const pointer = new THREE.Vector2(),
      pointerNow = new THREE.Vector2(),
      zeroPointer = new THREE.Vector2();
    const look = new THREE.Vector3(),
      projected = new THREE.Vector3(),
      probeTarget = new THREE.Vector3();
    const probeQuaternion = new THREE.Quaternion(),
      probeEuler = new THREE.Euler();

    const readScroll = () => {
      const y = window.scrollY;
      let leg = 0;
      for (let i = 0; i < state.anchors.length - 1; i++)
        if (y >= state.anchors[i]) leg = i;
      const a = state.anchors[leg] || 0,
        b = state.anchors[leg + 1] || 1;
      state.target = clamp01((leg + clamp01((y - a) / Math.max(1, b - a))) / 7);
      state.dirty = true;
      if (!state.raf && !document.hidden && !state.lost)
        state.raf = requestAnimationFrame(draw);
    };
    const measure = () => {
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - innerHeight,
      );
      state.anchors = voyage.chapters.map((c, i) =>
        i === 0
          ? 0
          : Math.min(
              max,
              Math.max(
                0,
                (document.getElementById(c.id)?.getBoundingClientRect().top ||
                  0) +
                  scrollY -
                  72,
              ),
            ),
      );
      for (let i = 1; i < 8; i++)
        state.anchors[i] = Math.max(state.anchors[i], state.anchors[i - 1] + 1);
      readScroll();
    };
    const resize = () => {
      state.width = innerWidth;
      state.height = innerHeight;
      renderer.setPixelRatio(state.dpr);
      renderer.setSize(state.width, state.height);
      composer.setPixelRatio(state.dpr);
      composer.setSize(state.width, state.height);
      world.stars.material.uniforms.uPixelRatio.value = state.dpr;
      camera.aspect = state.width / state.height;
      camera.updateProjectionMatrix();
      measure();
    };
    const move = (e) => {
      pointer.set(
        (e.clientX / state.width - 0.5) * 2,
        (e.clientY / state.height - 0.5) * 2,
      );
    };
    const resetPointer = () => pointer.set(0, 0);
    const observer = new ResizeObserver(measure);
    observer.observe(document.documentElement);
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', readScroll, { passive: true });
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', resetPointer);
    let disposed = false;
    document.fonts?.ready.then(() => {
      if (!disposed) measure();
    });
    resize();
    state.t = state.target;

    function draw(now) {
      state.raf = 0;
      if (disposed || document.hidden || state.lost) return;
      const dt = Math.min((now - (state.last || now)) / 1000, 0.05);
      state.last = now;
      const still = reduced || playback.current.paused;
      const travel = still
        ? state.target
        : state.t + (state.target - state.t) * (1 - Math.exp(-dt * 8));
      state.t = travel;
      if (!still) state.time += dt;
      const time = state.time;
      if (!still || state.dirty) {
        state.dirty = false;
        path.getPoint(travel, camera.position);
        pointerNow.lerp(still ? zeroPointer : pointer, 1 - Math.exp(-dt * 2.5));
        camera.position.x += pointerNow.x * 7;
        camera.position.y -= pointerNow.y * 5;
        // A restrained dolly and bank. Orientation changes continuously along the entire route.
        look.set(
          camera.position.x + 12 + Math.sin(travel * 9) * 16,
          camera.position.y - 13,
          camera.position.z - 600,
        );
        camera.lookAt(look);
        camera.rotateZ(Math.sin(travel * 10) * 0.025);
        camera.fov = (isPhone ? 62 : 48) + Math.sin(travel * Math.PI) * 3;
        camera.updateProjectionMatrix();
        world.sky.position.copy(camera.position);
        world.sky.material.uniforms.uTravel.value = travel;
        world.updateTime(time);
        world.body.rotation.y = time * 0.012;
        world.planet.visible = travel < 0.245;
        world.body.material.uniforms.uOpacity.value =
          1 - band(travel, 0.2, 0.245);
        world.rings.material.uniforms.uOpacity.value =
          1 - band(travel, 0.2, 0.245);
        // The craft recedes, banks and crosses the viewing direction as the reader travels.
        const lead = 140 + Math.sin(travel * 14) ** 2 * 120 + travel * 50;
        const halfH = lead * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        const side = isPhone ? 0.5 : 0.65;
        probeTarget.set(
          camera.position.x +
            halfH * camera.aspect * (side + Math.sin(travel * 17) * 0.18),
          camera.position.y - halfH * (0.37 + Math.sin(travel * 12) * 0.19),
          camera.position.z - lead,
        );
        world.probe.position.copy(probeTarget);
        world.probe.position.y += Math.sin(time * 0.22) * 1.5;
        probeEuler.set(
          0.64 + Math.sin(travel * 8) * 0.3,
          0.3 + travel * 1.5,
          -0.55 + Math.sin(travel * 12) * 0.25,
        );
        probeQuaternion.setFromEuler(probeEuler);
        world.probe.quaternion.copy(probeQuaternion);
        world.probe.scale.setScalar(
          (isPhone ? 0.38 : 0.65) * (1 - band(travel, 0.83, 1) * 0.75),
        );
        world.probe.visible = travel < 0.96;

        const eruption = band(travel, 0.24, 0.4);
        world.nova.visible = travel > 0.15 && travel < 0.44;
        if (world.nova.visible) {
          world.blast.advance(eruption);
          world.star.scale.setScalar(360 + Math.sin(eruption * Math.PI) * 700);
          world.star.material.opacity = (1 - band(eruption, 0.25, 0.95)) * 0.95;
          world.novaCloud.material.uniforms.uOpacity.value =
            Math.sin(eruption * Math.PI) * 0.8;
          world.novaCloud.quaternion.copy(camera.quaternion);
        }
        world.remnant.visible = travel > 0.34 && travel < 0.55;
        world.remnant.material.uniforms.uOpacity.value =
          band(travel, 0.34, 0.4) * (1 - band(travel, 0.49, 0.55));
        world.pulsar.visible = world.remnant.visible;
        world.remnant.quaternion.copy(camera.quaternion);
        world.remnant.rotateZ(time * 0.006);
        world.pulsar.material.opacity = 0.7 + Math.sin(time * 1.4) * 0.12;
        world.blackHole.visible = travel > 0.46 && travel < 0.69;
        world.blackHole.material.uniforms.uOpacity.value =
          band(travel, 0.46, 0.51) * (1 - band(travel, 0.64, 0.69));
        world.blackHole.quaternion.copy(camera.quaternion);
        world.blackHole.rotateZ(-0.12);
        const merge = band(travel, 0.49, 0.6);
        world.companion.visible = world.blackHole.visible && merge < 0.98;
        world.companion.position.set(
          world.blackHole.position.x + Math.cos(merge * 5) * 180 * (1 - merge),
          30 + Math.sin(merge * 5) * 90 * (1 - merge),
          -2390,
        );
        world.companion.quaternion.copy(camera.quaternion);
        world.companion.scale.setScalar(0.7 * (1 - merge));
        world.quasar.visible = travel > 0.61 && travel < 0.86;
        world.jetGroup.visible = world.quasar.visible;
        world.quasar.quaternion.copy(camera.quaternion);
        world.quasar.rotateZ(-0.3);
        world.galaxies.visible = travel > 0.77;
        world.galaxyMaterials.forEach((m) => {
          m.uniforms.uOpacity.value = band(travel, 0.77, 0.82) * 0.95;
        });
        bloom.strength = 0.14 + Math.sin(eruption * Math.PI) * 0.14;

        if (
          !still &&
          !playback.current.cinema &&
          eruption > 0 &&
          eruption < 1
        ) {
          projected.copy(world.nova.position).project(camera);
          nova.current.report({
            active: true,
            x: (projected.x * 0.5 + 0.5) * state.width,
            y: (-projected.y * 0.5 + 0.5) * state.height,
            radius: Math.pow(eruption, 0.6) * state.height * 1.7,
          });
        } else nova.current.report({ active: false });
        const wave = Math.sin(band(travel, 0.53, 0.66) * Math.PI);
        if (!still && !playback.current.cinema && wave > 0.01) {
          projected.copy(world.blackHole.position).project(camera);
          ripple.current.report({
            active: true,
            x: (projected.x * 0.5 + 0.5) * state.width,
            y: (-projected.y * 0.5 + 0.5) * state.height,
            amplitude: wave * (isPhone ? 4 : 7),
            wavelength: 190,
            phase: travel * 90 - time * 1.4,
          });
        } else ripple.current.report({ active: false });
        composer.render();
        if (progressRef.current)
          progressRef.current.style.setProperty('--travel', travel);
        const chapterIndex = Math.min(7, Math.floor(travel * 7 + 0.28));
        if (state.chapter !== chapterIndex) {
          state.chapter = chapterIndex;
          setChapter(chapterIndex);
        }
        // Reduce resolution on sustained slow frames, including later, heavier chapters.
        // Never oscillate quality or create a second animation loop during a resize.
        if (!still && dt > 0) {
          state.frames++;
          state.totalMs += dt * 1000;
          if (state.frames === 120) {
            if (state.totalMs / 120 > 27 && state.dpr > 0.8) {
              state.dpr = Math.max(0.8, state.dpr - 0.25);
              resize();
            }
            state.frames = 0;
            state.totalMs = 0;
          }
        }
      }
      if (!still && !state.raf) state.raf = requestAnimationFrame(draw);
    }
    engineApi.wake = () => {
      state.dirty = true;
      state.last = 0;
      if (!state.raf && !document.hidden)
        state.raf = requestAnimationFrame(draw);
    };
    const visibility = () => {
      cancelAnimationFrame(state.raf);
      state.last = 0;
      if (!document.hidden) {
        state.dirty = true;
        state.raf = requestAnimationFrame(draw);
      }
    };
    const contextLost = (e) => {
      e.preventDefault();
      state.lost = true;
      cancelAnimationFrame(state.raf);
      setCinema(false);
      setAvailable(false);
    };
    const contextRestored = () => {
      state.lost = false;
      state.dirty = true;
      setAvailable(true);
      visibility();
    };
    document.addEventListener('visibilitychange', visibility);
    canvas.addEventListener('webglcontextlost', contextLost);
    canvas.addEventListener('webglcontextrestored', contextRestored);
    if (!state.raf) state.raf = requestAnimationFrame(draw);
    return () => {
      disposed = true;
      engineApi.wake = () => {};
      cancelAnimationFrame(state.raf);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', readScroll);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', resetPointer);
      document.removeEventListener('visibilitychange', visibility);
      canvas.removeEventListener('webglcontextlost', contextLost);
      canvas.removeEventListener('webglcontextrestored', contextRestored);
      world.dispose();
      bloom.dispose();
      composer.passes.forEach((p) => {
        if (p !== bloom) p.dispose?.();
      });
      composer.dispose();
      renderer.dispose();
    };
  }, [reduced, isPhone, nova, ripple]);

  const current = voyage.chapters[chapter];
  return (
    <>
      <canvas ref={canvasRef} className="voyage" aria-hidden="true" />
      <div className="voyage-scrim" aria-hidden="true" />
      <div className="voyage-vignette" aria-hidden="true" />
      {available ? (
        <aside
          className="voyage-hud"
          aria-label="Voyager journey"
          ref={progressRef}
        >
          <div className="voyage-hud__location">
            <span className="voyage-hud__signal" />
            <span className="voyage-hud__number">0{chapter + 1}</span>
            <div>
              <span className="voyage-hud__eyebrow">{voyage.title}</span>
              <span className="voyage-hud__name">
                {current.name}
                <span> / {current.place}</span>
              </span>
            </div>
          </div>
          <nav className="voyage-hud__route" aria-label="Journey chapters">
            {voyage.chapters.map((c, i) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                title={c.name}
                aria-label={`Chapter ${i + 1}: ${c.name}`}
                aria-current={chapter === i ? 'step' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHash(`#${c.id}`);
                }}
              >
                <span />
              </a>
            ))}
          </nav>
          <div className="voyage-hud__actions">
            {!reduced && (
              <button
                className="voyage-hud__pause"
                aria-label={paused ? voyage.resume : voyage.pause}
                aria-pressed={paused}
                onClick={() => setPaused((p) => !p)}
              >
                <span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span>
              </button>
            )}
            <button
              ref={toggleRef}
              className="voyage-hud__toggle"
              aria-pressed={cinema}
              onClick={() => setCinema((c) => !c)}
            >
              <span aria-hidden="true">{cinema ? '↙' : '↗'}</span>
              {cinema ? voyage.back : voyage.view}
            </button>
          </div>
          {cinema && (
            <div className="voyage-caption" key={chapter}>
              <span>0{chapter + 1} / 08</span>
              <h2>{current.name}</h2>
              <p>{current.note}</p>
              <small>{voyage.exitHint}</small>
            </div>
          )}
        </aside>
      ) : (
        <p className="visually-hidden" role="status">
          {voyage.fallback}
        </p>
      )}
    </>
  );
}
