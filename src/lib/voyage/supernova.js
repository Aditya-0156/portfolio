import * as THREE from 'three';
import { mulberry32 } from '../prng.js';

// A scroll-reversible stellar explosion. Every gas knot and filament retains its
// place in three dimensions; the camera can actually travel into the remnant.
const noise = /* glsl */ `
float hash31(vec3 p){p=fract(p*.3183099+vec3(.13,.27,.19));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise3(vec3 p){
  vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(mix(hash31(i),hash31(i+vec3(1,0,0)),f.x),mix(hash31(i+vec3(0,1,0)),hash31(i+vec3(1,1,0)),f.x),f.y),
    mix(mix(hash31(i+vec3(0,0,1)),hash31(i+vec3(1,0,1)),f.x),mix(hash31(i+vec3(0,1,1)),hash31(i+vec3(1,1,1)),f.x),f.y),f.z);
}
float fbm(vec3 p){float n=0.,a=.53;for(int i=0;i<4;i++){n+=noise3(p)*a;p=p*2.07+vec3(17.3,9.2,4.7);a*=.47;}return n;}
vec3 gasColor(float heat){
  vec3 oxygen=vec3(.025,.24,.65),silicon=vec3(.95,.048,.014),iron=vec3(1.,.46,.045);
  return mix(mix(oxygen,silicon,smoothstep(.15,.48,heat)),iron,smoothstep(.45,.85,heat));
}
`;

const output = /* glsl */ `
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
`;

const shellVertex = /* glsl */ `
${noise}
uniform float uRadius;uniform float uTime;uniform float uLayer;uniform float uShock;
varying vec3 vDirection;varying vec3 vWorld;varying float vRoughness;
void main(){
  vec3 d=normalize(position);vDirection=d;
  float broad=fbm(d*3.7+uLayer*2.4);
  float fine=noise3(d*19.+broad*3.);
  float shape=.72+broad*.43+fine*.065;
  if(uShock>.5)shape=.98+noise3(d*2.3)*.04;
  float radius=shape*uRadius;
  vec3 p=d*radius;
  p*=vec3(1.05,.83,1.);
  vRoughness=broad;vWorld=(modelMatrix*vec4(p,1.)).xyz;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
}`;

const shellFragment = /* glsl */ `
${noise}
uniform float uTime;uniform float uOpacity;uniform float uLayer;uniform float uShock;
varying vec3 vDirection;varying vec3 vWorld;varying float vRoughness;
void main(){
  vec3 d=normalize(vDirection);
  vec3 p=d*9.+uLayer*3.2;
  float curl=fbm(p+d*fbm(p*.64)*3.);
  float grain=fbm(p*3.8+curl*4.+vec3(0.,uTime*.018,0.));
  // Thin, folded emission fronts, interrupted by large dark cavities.
  float ridge=pow(1.-abs(grain*2.-1.),10.);
  float holes=smoothstep(.39,.60,fbm(d*5.7+uLayer*4.1));
  float lace=ridge*(.25+grain)*holes;
  float facing=abs(dot(d,normalize(cameraPosition-vWorld)));
  float limb=pow(1.-facing,2.8);
  float heat=clamp(noise3(d*2.1+uLayer)*1.5-.15,0.,1.);
  vec3 color=gasColor(heat);
  color=mix(color,vec3(.08,.49,.8),smoothstep(.55,.77,grain)*.7);
  float emission=lace*(.22+limb*1.7);
  float alpha=clamp(emission*.32,0.,.4)*uOpacity;
  color*=1.1+ridge*.95;
  if(uShock>.5){
    float broken=.22+.78*smoothstep(.26,.69,curl);
    alpha=pow(1.-facing,9.)*broken*uOpacity*.14;
    color=mix(vec3(.025,.2,.65),vec3(.26,.56,1.),grain)*1.4;
  }
  gl_FragColor=vec4(color,alpha);
${output}
}`;

const starVertex = /* glsl */ `
${noise}
uniform float uTime;uniform float uRadius;
varying vec3 vDirection;varying vec3 vWorld;
void main(){
  vec3 d=normalize(position);vDirection=d;
  float ripple=fbm(d*7.+vec3(uTime*.1,0.,uTime*.035));
  vec3 p=d*uRadius*(.93+ripple*.16);vWorld=(modelMatrix*vec4(p,1.)).xyz;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
}`;

const starFragment = /* glsl */ `
${noise}
uniform float uTime;uniform float uHeat;uniform float uOpacity;
varying vec3 vDirection;varying vec3 vWorld;
void main(){
  vec3 d=normalize(vDirection);
  vec3 flow=d*8.+vec3(uTime*.045,uTime*.012,0.);
  float cells=fbm(flow+fbm(flow*1.8)*2.4);
  float fissure=pow(1.-abs(noise3(d*46.+cells*5.)*2.-1.),6.);
  float limb=pow(max(dot(d,normalize(cameraPosition-vWorld)),0.),.4);
  vec3 color=mix(vec3(.57,.05,.008),vec3(1.9,.77,.15),cells);
  color+=fissure*vec3(.95,.3,.035);
  color=mix(color,vec3(2.7,3.,3.6),uHeat);
  gl_FragColor=vec4(color*(.46+limb*.9),uOpacity);
${output}
}`;

const haloVertex = /* glsl */ `
varying vec2 vUv;
void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
`;
const haloFragment = /* glsl */ `
uniform float uFlash;uniform float uOpacity;uniform float uHeat;varying vec2 vUv;
void main(){
  vec2 p=(vUv-.5)*2.;float r=length(p);
  float glow=exp(-r*8.)*(1.-smoothstep(.7,1.,r));
  float bloom=exp(-r*r*35.);
  float ray=exp(-abs(p.y)*190.)*exp(-abs(p.x)*4.4);
  vec3 warm=mix(vec3(1.,.2,.018),vec3(.3,.62,1.),uHeat);
  vec3 color=warm*glow*1.1+vec3(.75,.9,1.)*(bloom*.7+ray*.5)*uFlash;
  gl_FragColor=vec4(color,uOpacity);
${output}
}`;

const cloudVertex = /* glsl */ `
attribute vec3 aCenter;attribute float aSeed;attribute float aSize;
uniform float uRadius;uniform float uTime;
varying vec2 vUv;varying float vSeed;varying float vHeat;
void main(){
  vUv=uv;vSeed=aSeed;vHeat=.5+.5*sin(aSeed*19.);
  vec3 center=aCenter*uRadius;
  vec4 view=modelViewMatrix*vec4(center,1.);
  float angle=aSeed*6.283+uTime*.009;
  mat2 turn=mat2(cos(angle),-sin(angle),sin(angle),cos(angle));
  view.xy+=turn*position.xy*aSize*uRadius;
  gl_Position=projectionMatrix*view;
}`;
const cloudFragment = /* glsl */ `
${noise}
uniform float uTime;uniform float uOpacity;
varying vec2 vUv;varying float vSeed;varying float vHeat;
void main(){
  vec2 p=(vUv-.5)*2.;float r=dot(p,p);if(r>1.)discard;
  float n=fbm(vec3(p*3.8,vSeed*21.+uTime*.02));
  float fibers=pow(1.-abs(n*2.-1.),6.);
  float envelope=pow(max(0.,1.-r),2.);
  float alpha=envelope*fibers*uOpacity*.075;
  vec3 color=gasColor(vHeat)*(.6+n*1.7);
  gl_FragColor=vec4(color,alpha);
${output}
}`;

const filamentVertex = /* glsl */ `
attribute float aHeat;attribute float aAlong;
uniform float uRadius;uniform float uTime;
varying float vHeat;varying float vAlong;
void main(){
  vHeat=aHeat;vAlong=aAlong;
  vec3 p=position*uRadius;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
}`;
const filamentFragment = /* glsl */ `
${noise}
uniform float uOpacity;uniform float uTime;varying float vHeat;varying float vAlong;
void main(){
  float threads=.55+.45*sin(vAlong*93.+vHeat*37.);
  float alpha=uOpacity*threads*smoothstep(0.,.12,vAlong)*(1.-smoothstep(.82,1.,vAlong));
  vec3 color=gasColor(vHeat)*1.8+vec3(.15,.085,.012);
  gl_FragColor=vec4(color,alpha);
${output}
}`;

const dustVertex = /* glsl */ `
attribute float aSize;attribute float aSeed;
uniform float uRadius;uniform float uOpacity;
varying float vAlpha;varying float vHeat;
void main(){
  vec3 p=position*uRadius;vec4 view=modelViewMatrix*vec4(p,1.);
  gl_Position=projectionMatrix*view;
  gl_PointSize=clamp(aSize*440./max(40.,-view.z),1.,5.);
  vAlpha=uOpacity;vHeat=aSeed;
}`;
const dustFragment = /* glsl */ `
${noise}
varying float vAlpha;varying float vHeat;
void main(){
  float r=length(gl_PointCoord-.5)*2.;float alpha=exp(-r*r*4.)*(1.-smoothstep(.5,1.,r));
  gl_FragColor=vec4(gasColor(vHeat)*2.,alpha*vAlpha);
${output}
}`;

function makeMaterial(vertexShader, fragmentShader, uniforms = {}) {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: { uTime: { value: 0 }, uOpacity: { value: 1 }, ...uniforms },
    transparent: true,
    // Additive layers do not need separate back/front transparency sorting draws.
    forceSinglePass: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

function direction(random) {
  const y = random() * 2 - 1;
  const a = random() * Math.PI * 2;
  const r = Math.sqrt(1 - y * y);
  return new THREE.Vector3(r * Math.cos(a), y * 0.83, r * Math.sin(a));
}

function makeFilaments(phone, random) {
  const positions = [],
    heats = [],
    alongs = [];
  const centers = [];
  const branches = phone ? 66 : 125;
  const up = new THREE.Vector3(0, 1, 0);
  const point = new THREE.Vector3(),
    tangent = new THREE.Vector3(),
    side = new THREE.Vector3();

  const append = (a, b, radius, heat, along) => {
    tangent.subVectors(b, a).normalize();
    side.crossVectors(tangent, up).normalize().multiplyScalar(radius);
    const other = new THREE.Vector3()
      .crossVectors(tangent, side)
      .normalize()
      .multiplyScalar(radius);
    for (let face = 0; face < 3; face++) {
      const x = (face / 3) * Math.PI * 2,
        y = ((face + 1) / 3) * Math.PI * 2;
      const offsetA = side
        .clone()
        .multiplyScalar(Math.cos(x))
        .addScaledVector(other, Math.sin(x));
      const offsetB = side
        .clone()
        .multiplyScalar(Math.cos(y))
        .addScaledVector(other, Math.sin(y));
      for (const [v, offset, t] of [
        [a, offsetA, along],
        [b, offsetA, along + 0.065],
        [b, offsetB, along + 0.065],
        [a, offsetA, along],
        [b, offsetB, along + 0.065],
        [a, offsetB, along],
      ]) {
        point.copy(v).add(offset);
        positions.push(point.x, point.y, point.z);
        heats.push(heat);
        alongs.push(t);
      }
    }
  };

  for (let i = 0; i < branches; i++) {
    const axis = direction(random),
      bend = direction(random);
    const start = 0.25 + random() * 0.4;
    const extent = 0.19 + random() * 0.32;
    const phase = random() * Math.PI * 2;
    const heat = random();
    const width = 0.00055 + random() * 0.0013;
    let previous;
    for (let j = 0; j <= 14; j++) {
      const t = j / 14;
      const radial = start + t * extent;
      const curve = axis.clone().multiplyScalar(radial);
      curve.addScaledVector(bend, Math.sin(t * 3.6 + phase) * 0.052);
      curve.y += Math.sin(t * 8.4 + phase) * 0.014;
      if (previous)
        append(previous, curve, width * (0.95 - t * 0.6), heat, t * 0.88);
      previous = curve;
      if (j % 3 === 0) centers.push({ center: curve.clone(), heat });
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute('aHeat', new THREE.Float32BufferAttribute(heats, 1));
  geometry.setAttribute('aAlong', new THREE.Float32BufferAttribute(alongs, 1));
  return { geometry, centers };
}

function makeClouds(centers, random) {
  const quad = new THREE.PlaneGeometry(1, 1);
  const geometry = new THREE.InstancedBufferGeometry();
  geometry.index = quad.index;
  geometry.attributes.position = quad.attributes.position;
  geometry.attributes.uv = quad.attributes.uv;
  const positions = new Float32Array(centers.length * 3);
  const sizes = new Float32Array(centers.length);
  const seeds = new Float32Array(centers.length);
  centers.forEach(({ center }, i) => {
    positions.set([center.x, center.y, center.z], i * 3);
    sizes[i] = 0.07 + random() * 0.17;
    seeds[i] = random();
  });
  geometry.setAttribute(
    'aCenter',
    new THREE.InstancedBufferAttribute(positions, 3),
  );
  geometry.setAttribute('aSize', new THREE.InstancedBufferAttribute(sizes, 1));
  geometry.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 1));
  geometry.instanceCount = centers.length;
  return geometry;
}

const ease = (a, b, value) => THREE.MathUtils.smoothstep(value, a, b);
const expansion = (progress) =>
  Math.pow(Math.max(0, (progress - 0.36) / 0.64), 0.67);

/** Radius of the leading spherical shock, in world units. */
function shockRadius(progress) {
  return 34 + expansion(THREE.MathUtils.clamp(progress, 0, 1)) * 720;
}

export function createSupernova(phone = false) {
  const group = new THREE.Group();
  const random = mulberry32(19870223);
  const sphere = new THREE.SphereGeometry(1, phone ? 64 : 104, phone ? 40 : 64);
  const materials = [];
  const add = (geometry, material, kind = THREE.Mesh) => {
    const mesh = new kind(geometry, material);
    mesh.frustumCulled = false;
    group.add(mesh);
    materials.push(material);
    return mesh;
  };
  const star = add(
    sphere,
    makeMaterial(starVertex, starFragment, {
      uRadius: { value: 52 },
      uHeat: { value: 0 },
    }),
  );
  const corona = add(
    new THREE.PlaneGeometry(1, 1),
    makeMaterial(haloVertex, haloFragment, {
      uFlash: { value: 0 },
      uHeat: { value: 0 },
    }),
  );
  corona.renderOrder = 5;
  const shells = [];
  for (let i = 0; i < 2; i++) {
    const shell = add(
      sphere,
      makeMaterial(shellVertex, shellFragment, {
        uRadius: { value: 0 },
        uLayer: { value: i * 1.37 },
        uShock: { value: 0 },
      }),
    );
    shell.material.side = THREE.DoubleSide;
    shell.rotation.set(i * 0.8, i * 1.1, i * 0.45);
    shells.push(shell);
  }
  const shock = add(
    sphere,
    makeMaterial(shellVertex, shellFragment, {
      uRadius: { value: 0 },
      uLayer: { value: 5.2 },
      uShock: { value: 1 },
    }),
  );
  shock.material.side = THREE.DoubleSide;
  const { geometry: filamentGeometry, centers } = makeFilaments(phone, random);
  const filaments = add(
    filamentGeometry,
    makeMaterial(filamentVertex, filamentFragment, {
      uRadius: { value: 0 },
    }),
  );
  const clouds = add(
    makeClouds(centers, random),
    makeMaterial(cloudVertex, cloudFragment, {
      uRadius: { value: 0 },
    }),
  );
  const count = phone ? 1700 : 4800;
  const dustPositions = new Float32Array(count * 3),
    sizes = new Float32Array(count),
    seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const d = direction(random).multiplyScalar(
      0.28 + Math.pow(random(), 0.6) * 0.83,
    );
    dustPositions.set([d.x, d.y, d.z], i * 3);
    sizes[i] = 0.6 + Math.pow(random(), 3) * 2.6;
    seeds[i] = random();
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(dustPositions, 3),
  );
  dustGeometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  dustGeometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  const dust = add(
    dustGeometry,
    makeMaterial(dustVertex, dustFragment, {
      uRadius: { value: 0 },
    }),
    THREE.Points,
  );

  function update(progress, time, camera) {
    const p = THREE.MathUtils.clamp(progress, 0, 1);
    const collapse = ease(0.21, 0.36, p);
    const blast = expansion(p);
    const flash = Math.exp(-Math.pow((p - 0.377) / 0.026, 2));
    const gas = ease(0.36, 0.435, p);
    const surface = 1 - ease(0.36, 0.405, p);
    const tail = 1 - ease(0.88, 1, p) * 0.25;
    for (const material of materials) material.uniforms.uTime.value = time;
    // Heat builds inside a stable envelope. Shrinking the entire visible star before
    // ignition reads as a camera retreat; instead its surface expands and dissolves
    // into the ejecta from the same position and radius.
    star.material.uniforms.uRadius.value = 54 + blast * 120;
    star.material.uniforms.uHeat.value = Math.max(collapse, gas);
    star.material.uniforms.uOpacity.value = surface;
    star.visible = surface > 0;
    corona.quaternion.copy(camera.quaternion);
    corona.scale.setScalar(
      410 + flash * 1350,
    );
    corona.material.uniforms.uHeat.value = collapse;
    corona.material.uniforms.uFlash.value = flash * 3;
    corona.material.uniforms.uOpacity.value =
      0.75 - gas * 0.4 + flash * 1.8;
    shells.forEach((shell, i) => {
      shell.material.uniforms.uRadius.value =
        (30 + blast * 595) * (1 - i * 0.105);
      shell.material.uniforms.uOpacity.value =
        gas * tail * (i === 0 ? 1 : 0.55);
      shell.visible = gas > 0.001;
    });
    shock.material.uniforms.uRadius.value = shockRadius(p);
    shock.material.uniforms.uOpacity.value = gas * (1 - ease(0.52, 1, p) * 0.7);
    shock.visible = gas > 0.001;
    filaments.material.uniforms.uRadius.value = 30 + blast * 655;
    filaments.material.uniforms.uOpacity.value = gas * tail * 0.67;
    filaments.visible = gas > 0.001;
    clouds.material.uniforms.uRadius.value = 30 + blast * 655;
    clouds.material.uniforms.uOpacity.value = gas * tail * 0.8;
    clouds.visible = gas > 0.001;
    dust.material.uniforms.uRadius.value = 28 + blast * 760;
    dust.material.uniforms.uOpacity.value = gas * (1 - ease(0.55, 1, p) * 0.55);
    dust.visible = gas > 0.001;
  }

  return { group, update, screenRadius: shockRadius };
}
