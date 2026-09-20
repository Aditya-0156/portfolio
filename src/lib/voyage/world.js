import * as THREE from 'three';
import { mulberry32 } from '../prng.js';
import { buildProbe } from '../probe.js';
import { createSupernova } from './supernova.js';
import { glowTexture, sprite } from '../space.js';
import {
  worldVertex,
  skyFragment,
  planetFragment,
  ringFragment,
  blackHoleFragment,
  nebulaFragment,
} from './shaders.js';

function material(fragmentShader, uniforms = {}, options = {}) {
  return new THREE.ShaderMaterial({
    vertexShader: worldVertex,
    fragmentShader,
    uniforms: { uTime: { value: 0 }, ...uniforms },
    ...options,
  });
}

export function buildWorld(scene, phone) {
  const animated = [];
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(6200, 32, 20),
    material(
      skyFragment,
      { uTravel: { value: 0 } },
      { side: THREE.BackSide, depthWrite: false },
    ),
  );
  sky.renderOrder = -10;
  scene.add(sky);
  animated.push(sky.material);

  const random = mulberry32(1977);
  const count = phone ? 2800 : 7200;
  const positions = new Float32Array(count * 3),
    colors = new Float32Array(count * 3),
    sizes = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions.set(
      [(random() - 0.5) * 6500, (random() - 0.5) * 4100, 800 - random() * 8500],
      i * 3,
    );
    const tint = random(),
      brightness = 0.25 + Math.pow(random(), 3) * 1.6;
    colors.set(
      [
        brightness * (tint > 0.7 ? 1 : 0.72),
        brightness * (tint > 0.7 ? 0.77 : 0.84),
        brightness * (tint > 0.7 ? 0.51 : 1),
      ],
      i * 3,
    );
    sizes[i] = 0.65 + Math.pow(random(), 7) * 2.4;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  const stars = new THREE.Points(
    geometry,
    new THREE.ShaderMaterial({
      uniforms: { uPixelRatio: { value: 1 }, uTime: { value: 0 } },
      vertexShader: `attribute float aSize; varying vec3 vColor; uniform float uPixelRatio; uniform float uTime;
    void main(){vec4 p=modelViewMatrix*vec4(position,1.); vColor=color;
    gl_PointSize=clamp(aSize*(600./max(300.,-p.z)),.65,3.5)*uPixelRatio;
    gl_Position=projectionMatrix*p;}`,
      fragmentShader: `varying vec3 vColor; void main(){float r=length(gl_PointCoord-.5)*2.;
    float a=exp(-r*r*4.)*(1.-smoothstep(.65,1.,r)); gl_FragColor=vec4(vColor,a);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    }`,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  scene.add(stars);

  const planet = new THREE.Group();
  planet.position.set(190, 25, -180);
  planet.rotation.z = 0.3;
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(170, 96, 64),
    material(planetFragment, { uOpacity: { value: 1 } }, { transparent: true }),
  );
  planet.add(body);
  animated.push(body.material);
  if (phone) planet.position.set(80, 150, -180);
  const rings = new THREE.Mesh(
    new THREE.RingGeometry(207, 390, 256, 1),
    material(
      ringFragment,
      {
        uInner: { value: 207 },
        uOuter: { value: 390 },
        uOpacity: { value: 1 },
        uPlanetCenter: { value: planet.position },
      },
      { side: THREE.DoubleSide, transparent: true, depthWrite: false },
    ),
  );
  rings.rotation.x = -Math.PI / 2 + 0.17;
  planet.add(rings);
  scene.add(planet);

  const { group: probe } = buildProbe();
  probe.scale.setScalar(0.69);
  scene.add(probe);
  scene.add(new THREE.HemisphereLight(0xa8c5e9, 0x46311f, 1.8));
  const sun = new THREE.DirectionalLight(0xffe5bd, 3.3);
  sun.position.set(-350, 260, 400);
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0x76b6ff, 2.5);
  rim.position.set(350, -100, -600);
  scene.add(rim);

  const blue = glowTexture([
    [0, 'rgba(235,249,255,1)'],
    [0.045, 'rgba(151,208,255,.9)'],
    [0.2, 'rgba(72,139,255,.18)'],
    [1, 'rgba(0,0,0,0)'],
  ]);
  const supernova = createSupernova(phone);
  const nova = supernova.group;
  nova.position.set(phone ? 35 : 170, 25, -1050);
  scene.add(nova);

  const remnant = new THREE.Mesh(
    new THREE.PlaneGeometry(1100, 950),
    material(
      nebulaFragment,
      { uKind: { value: 0 }, uOpacity: { value: 1 } },
      {
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      },
    ),
  );
  remnant.position.set(phone ? 35 : 180, 0, -1750);
  scene.add(remnant);
  animated.push(remnant.material);
  const pulsar = sprite(blue, 170, 0.9, false);
  pulsar.position.copy(remnant.position);
  scene.add(pulsar);

  function hole(size, x, y, z) {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(size, size),
      material(
        blackHoleFragment,
        { uOpacity: { value: 1 } },
        { transparent: true, depthWrite: false },
      ),
    );
    mesh.position.set(phone ? x * 0.22 : x, y, z);
    scene.add(mesh);
    animated.push(mesh.material);
    return mesh;
  }
  const blackHole = hole(720, 165, 30, -2410);
  const companion = hole(300, 360, 90, -2440);
  const quasar = hole(390, 130, 30, -3050);
  const jetGroup = new THREE.Group();
  jetGroup.position.copy(quasar.position);
  jetGroup.rotation.z = -0.3;
  const jetTexture = glowTexture([
    [0, 'rgba(215,239,255,.95)'],
    [0.08, 'rgba(110,173,255,.48)'],
    [0.4, 'rgba(42,104,255,.1)'],
    [1, 'rgba(0,0,0,0)'],
  ]);
  for (const sign of [-1, 1]) {
    const beam = sprite(jetTexture, 1, 0.75, false);
    beam.scale.set(80, 880, 1);
    beam.position.y = sign * 390;
    jetGroup.add(beam);
    const tip = sprite(blue, 160, 0.55, false);
    tip.position.y = sign * 760;
    jetGroup.add(tip);
  }
  scene.add(jetGroup);

  const galaxies = new THREE.Group();
  scene.add(galaxies);
  const galaxyMaterials = [];
  [
    [230, 70, -4050, 850, 0.32],
    [-370, 190, -4470, 540, -0.5],
    [560, -180, -4490, 650, 0.8],
    [-150, -80, -4940, 1150, -0.1],
  ].forEach(([x, y, z, size, angle]) => {
    const gal = new THREE.Mesh(
      new THREE.PlaneGeometry(size, size * 0.72),
      material(
        nebulaFragment,
        { uKind: { value: 1 }, uOpacity: { value: 0.95 } },
        {
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        },
      ),
    );
    gal.position.set(phone ? x * 0.55 : x, y, z);
    gal.rotation.z = angle;
    galaxies.add(gal);
    animated.push(gal.material);
    galaxyMaterials.push(gal.material);
  });
  return {
    sky,
    stars,
    planet,
    body,
    rings,
    probe,
    nova,
    supernova,
    remnant,
    pulsar,
    blackHole,
    companion,
    quasar,
    jetGroup,
    galaxies,
    galaxyMaterials,
    updateTime(time) {
      animated.forEach((m) => {
        m.uniforms.uTime.value = time;
      });
    },
    dispose() {
      const geometries = new Set(),
        materials = new Set(),
        textures = new Set([blue, jetTexture]);
      scene.traverse((o) => {
        if (o.geometry) geometries.add(o.geometry);
        if (o.material)
          (Array.isArray(o.material) ? o.material : [o.material]).forEach(
            (m) => {
              materials.add(m);
              if (m.map) textures.add(m.map);
            },
          );
      });
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
    },
  };
}
