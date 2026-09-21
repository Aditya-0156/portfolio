import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { phenomenaShader } from '../../lib/voyage/phenomenaPass.js';
import { readingShader } from '../../lib/voyage/readingPass.js';
import { buildWorld } from '../../lib/voyage/world.js';
import { clamp01, band } from '../../lib/space.js';
import { voyage } from '../../content/voyage.js';
import { useNova } from '../../hooks/useNova.js';
import { useRipple } from '../../hooks/useRipple.js';

const FORGE =
  '#work h3, #work .entry__date, #work .entry__stack, #projects h3, #projects .flagship__labels, #projects .card__labels';
const MATTER = '#work .entry';
const RIPPLE =
  '#research .readout, #research .research__title, #research .research__p, #research .pub, #stack .stack__group';
const EJECTA = Array.from({ length: 28 }, (_, i) => ({
  angle: i * 2.399963,
  reach: 0.72 + ((i * 17) % 29) / 42,
  depth: 0.85 + ((i * 11) % 23) / 21,
}));
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
    effectsRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [available, setAvailable] = useState(true);
  const playback = useRef({ paused: false });
  const engine = useRef({ wake: () => {} });
  const nova = useNova(available && !reduced && !paused, FORGE, MATTER);
  const ripple = useRipple(!reduced && !paused, RIPPLE);

  useEffect(() => {
    playback.current = { paused };
    engine.current.wake();
  }, [paused]);

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
    const phenomena = new ShaderPass(phenomenaShader);
    composer.addPass(phenomena);
    const reading = new ShaderPass(readingShader);
    composer.addPass(reading);
    composer.addPass(new OutputPass());
    const effects = effectsRef.current;
    const ejecta = [...effects.querySelectorAll('.voyage-ejecta')];
    const state = {
      raf: 0,
      last: 0,
      time: 0,
      t: 0,
      target: 0,
      anchors: [],
      readingBoxes: [],
      width: 1,
      height: 1,
      dirty: true,
      lost: false,
      gateOpen: document.documentElement.classList.contains('light-gate-open'),
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
      if (!state.raf && !document.hidden && !state.lost && !state.gateOpen)
        state.raf = requestAnimationFrame(draw);
    };
    const readingElements = [
      ...document.querySelectorAll(
        '.section__content, .hero__role, .hero__statement',
      ),
    ];
    const measure = () => {
      state.readingBoxes = readingElements.map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          left: rect.left + scrollX,
          top: rect.top + scrollY,
          width: rect.width,
          height: rect.height,
        };
      });
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
      if (disposed || document.hidden || state.lost || state.gateOpen) return;
      const dt = Math.min((now - (state.last || now)) / 1000, 0.05);
      state.last = now;
      const still = reduced || playback.current.paused;
      const travel = still
        ? state.target
        : state.t + (state.target - state.t) * (1 - Math.exp(-dt * 14));
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

        const eruption = band(travel, 0.2, 0.44);
        const novaEnergy =
          band(eruption, 0.34, 0.42) * (1 - band(eruption, 0.82, 1));
        const flash = Math.exp(-Math.pow((eruption - 0.377) / 0.027, 2));
        world.nova.visible = travel > 0.16 && travel < 0.48;
        if (world.nova.visible) world.supernova.update(eruption, time, camera);
        world.remnant.visible = travel > 0.42 && travel < 0.55;
        world.remnant.material.uniforms.uOpacity.value =
          band(travel, 0.42, 0.46) * (1 - band(travel, 0.49, 0.55));
        world.pulsar.visible = world.remnant.visible;
        world.remnant.quaternion.copy(camera.quaternion);
        world.remnant.rotateZ(time * 0.006);
        world.pulsar.material.opacity = 0.7 + Math.sin(time * 1.4) * 0.12;
        world.blackHole.visible = travel > 0.46 && travel < 0.69;
        world.blackHole.material.uniforms.uOpacity.value =
          band(travel, 0.46, 0.51) * (1 - band(travel, 0.64, 0.69));
        world.blackHole.quaternion.copy(camera.quaternion);
        world.blackHole.rotateZ(-0.12);
        const quasarVisible = travel > 0.645 && travel < 0.875;
        const quasarState = world.quasarSystem.update(
          time,
          camera,
          quasarVisible ? band(travel, 0.645, 0.82) : -1,
          reduced,
          1 - band(travel, 0.8, 0.875),
        );
        world.quasar.visible = quasarVisible;
        document.documentElement.style.setProperty(
          '--quasar-light',
          still ? '0' : quasarState.light.toFixed(3),
        );
        world.galaxies.visible = travel > 0.755;
        world.galaxyMaterials.forEach((m) => {
          m.uniforms.uOpacity.value = band(travel, 0.755, 0.84) * 0.95;
        });
        bloom.strength =
          0.2 +
          novaEnergy * 0.12 +
          flash * 0.18 +
          (still ? 0 : quasarState.flash * 0.14);
        phenomena.enabled = false;
        effects.style.setProperty('--event-alpha', '0');
        effects.dataset.event = 'none';
        const mergerProgress = band(travel, 0.53, 0.675);
        const wave = Math.sin(mergerProgress * Math.PI);
        const phase = mergerProgress * 18 - time * 1.2;
        let sourceX = 0,
          sourceY = 0,
          frontRadius = 0;
        if (eruption > 0 && eruption < 1) {
          projected.copy(world.nova.position).project(camera);
          sourceX = THREE.MathUtils.clamp(
            (projected.x * 0.5 + 0.5) * state.width,
            -state.width * 0.3,
            state.width * 1.3,
          );
          sourceY = THREE.MathUtils.clamp(
            (-projected.y * 0.5 + 0.5) * state.height,
            -state.height * 0.3,
            state.height * 1.3,
          );
          const distance = Math.max(
            240,
            Math.abs(camera.position.z - world.nova.position.z),
          );
          const projectionScale =
            state.height /
            (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * distance);
          frontRadius =
            world.supernova.screenRadius(eruption) * projectionScale;
          if (!still) {
            effects.dataset.event = 'supernova';
            effects.style.setProperty('--event-x', `${sourceX.toFixed(1)}px`);
            effects.style.setProperty('--event-y', `${sourceY.toFixed(1)}px`);
            effects.style.setProperty(
              '--event-radius',
              `${frontRadius.toFixed(1)}px`,
            );
            effects.style.setProperty(
              '--event-alpha',
              String(novaEnergy * 0.65),
            );
            phenomena.enabled = novaEnergy > 0.01;
            phenomena.uniforms.uKind.value = 1;
            phenomena.uniforms.uCenter.value.set(
              sourceX / state.width,
              1 - sourceY / state.height,
            );
            phenomena.uniforms.uRadius.value = frontRadius / state.height;
            phenomena.uniforms.uEnergy.value = novaEnergy;
          }
        }
        const particlesActive = !still && novaEnergy > 0.01;
        ejecta.forEach((particle, i) => {
          if (!particlesActive) {
            particle.style.opacity = '0';
            return;
          }
          const seed = EJECTA[i];
          const a = seed.angle + time * 0.014;
          const radius = frontRadius * seed.reach;
          particle.style.transform = `translate3d(${(sourceX + Math.cos(a) * radius).toFixed(1)}px,${(sourceY + Math.sin(a) * radius * 0.76).toFixed(1)}px,0) scale(${seed.depth})`;
          particle.style.opacity = String(novaEnergy * 0.68);
        });
        if (!still && eruption > 0 && eruption < 1) {
          nova.current.report({
            active: true,
            x: sourceX,
            y: sourceY,
            radius: frontRadius,
            progress: eruption,
            energy: novaEnergy,
            time,
          });
        } else nova.current.report({ active: false });
        if (!still && wave > 0.01) {
          projected.copy(world.blackHole.position).project(camera);
          const x = (projected.x * 0.5 + 0.5) * state.width,
            y = (-projected.y * 0.5 + 0.5) * state.height;
          phenomena.enabled = true;
          phenomena.uniforms.uKind.value = 2;
          phenomena.uniforms.uCenter.value.set(
            x / state.width,
            1 - y / state.height,
          );
          phenomena.uniforms.uEnergy.value = wave;
          phenomena.uniforms.uPhase.value = phase;
          ripple.current.report({
              active: true,
              x,
              y,
              amplitude: wave * (isPhone ? 11 : 22),
              wavelength: state.height / 29,
              phase,
              progress: mergerProgress,
              energy: wave,
              time,
          });
        } else ripple.current.report({ active: false });
        phenomena.uniforms.uAspect.value = camera.aspect;
        reading.enabled = true;
        if (reading.enabled) {
          const boxes = state.readingBoxes
            .filter(
              (box) =>
                box.top + box.height > scrollY - 90 &&
                box.top < scrollY + state.height + 90,
            )
            .slice(0, 3);
          reading.uniforms.uFeather.value.set(
            85 / state.width,
            64 / state.height,
          );
          for (let i = 0; i < 3; i++) {
            const box = boxes[i],
              uniform = reading.uniforms[`uRect${i}`].value;
            if (box)
              uniform.set(
                (box.left - scrollX - 96) / state.width,
                1 - (box.top - scrollY + box.height + 80) / state.height,
                (box.left - scrollX + box.width + 96) / state.width,
                1 - (box.top - scrollY - 80) / state.height,
              );
            else uniform.set(-2, -2, -2, -2);
          }
        }
        composer.render();
        canvas.dataset.ready = 'true';
        // Reduce resolution on sustained slow frames, including later, heavier chapters.
        // Never oscillate quality or create a second animation loop during a resize.
        if (!still && dt > 0) {
          state.frames++;
          state.totalMs += dt * 1000;
          if (state.frames === 120) {
            if (state.totalMs / 120 > 22 && state.dpr > 0.8) {
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
      if (!state.raf && !document.hidden && !state.gateOpen)
        state.raf = requestAnimationFrame(draw);
    };
    const visibility = () => {
      cancelAnimationFrame(state.raf);
      state.last = 0;
      if (!document.hidden && !state.gateOpen) {
        state.dirty = true;
        state.raf = requestAnimationFrame(draw);
      }
    };
    const lightGate = (event) => {
      state.gateOpen = Boolean(event.detail?.open);
      cancelAnimationFrame(state.raf);
      state.raf = 0;
      state.last = 0;
      if (state.gateOpen) {
        nova.current.report({ active: false });
        ripple.current.report({ active: false });
        document.documentElement.style.setProperty('--quasar-light', '0');
        effects.style.setProperty('--event-alpha', '0');
      } else engineApi.wake();
    };
    window.addEventListener('lightgate:change', lightGate);
    const contextLost = (e) => {
      e.preventDefault();
      state.lost = true;
      document.documentElement.style.setProperty('--quasar-light', '0');
      cancelAnimationFrame(state.raf);
      state.raf = 0;
      nova.current.report({ active: false });
      ripple.current.report({ active: false });
      effects.style.setProperty('--event-alpha', '0');
      ejecta.forEach((particle) => {
        particle.style.opacity = '0';
      });
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
      document.documentElement.style.removeProperty('--quasar-light');
      engineApi.wake = () => {};
      cancelAnimationFrame(state.raf);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('lightgate:change', lightGate);
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

  const motionSlot = document.getElementById('motion-control');
  return (
    <>
      <canvas ref={canvasRef} className="voyage" aria-hidden="true" />
      <div className="voyage-scrim" aria-hidden="true" />
      <div className="voyage-vignette" aria-hidden="true" />
      <div className="voyage-effects" ref={effectsRef} aria-hidden="true">
        <div className="voyage-front" />
        {EJECTA.map((_, i) => (
          <i className="voyage-ejecta" key={i} />
        ))}
      </div>
      {available && !reduced && motionSlot && createPortal(
        <button
          className="voyage-motion"
          type="button"
          aria-label={paused ? voyage.resume : voyage.pause}
          aria-pressed={paused}
          onClick={() => setPaused(p => !p)}
        >
          <span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span>
        </button>,
        motionSlot,
      )}
      {!available && <p className="visually-hidden" role="status">{voyage.fallback}</p>}
    </>
  );
}
