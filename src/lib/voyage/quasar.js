import * as THREE from 'three';
import { mulberry32 } from '../prng.js';

const output = `
#include <tonemapping_fragment>
#include <colorspace_fragment>
`;
const vertex = `
varying vec2 vUv; varying vec3 vPosition;
void main(){vUv=uv;vPosition=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
`;
const jetFragment = `
uniform float uTime,uOpacity; varying vec2 vUv; varying vec3 vPosition;
void main(){
  float along=vUv.y;
  float twist=vUv.x*6.283-along*18.+uTime*.35;
  float strands=pow(.5+.5*sin(twist*3.7+sin(along*31.-uTime)*1.7+sin(vUv.x*17.+along*11.)*1.1),9.);
  float knots=pow(.5+.5*sin(along*48.-uTime*3.7),12.);
  float envelope=smoothstep(0.,.025,along)*(1.-smoothstep(.68,1.,along));
  vec3 color=mix(vec3(.09,.22,.8),vec3(.3,.75,1.25),strands);
  color+=vec3(.42,.65,1.1)*knots*.65;
  gl_FragColor=vec4(color,(.016+strands*.21+knots*.12)*envelope*uOpacity);
  ${output}
}`;
const diskFragment = `
uniform float uTime,uOpacity,uHeat,uFlash; varying vec2 vUv; varying vec3 vPosition;
void main(){
  float r=length(vPosition.xy)/115.;
  float a=atan(vPosition.y,vPosition.x);
  float lanes=.5+.5*sin(a*4.+log(max(.018,r))*15.-uTime*(.4+uHeat));
  float narrow=pow(lanes,5.);
  float rings=.5+.5*sin(r*155.+sin(a*5.)*1.1+uTime*(.9+uHeat*1.9));
  float gathering=pow(.5+.5*sin(r*29.+a*2.+uTime*2.7),10.);
  float envelope=exp(-r*2.8)*(1.-smoothstep(.66,1.,r));
  vec3 copper=vec3(.68,.11,.015);
  vec3 gold=vec3(1.7,.72,.16);
  vec3 color=mix(copper,gold,uHeat*(.35+.65*exp(-r*2.)));
  color=mix(color,vec3(2.,1.75,1.25),uHeat*pow(1.-r,7.));
  color+=vec3(.16,.06,.28)*r*uHeat;
  float fuel=.12+narrow*.67+rings*.15+gathering*(1.-uHeat)*.5;
  gl_FragColor=vec4(color,envelope*fuel*uOpacity);
  ${output}
}`;
const coreFragment = `
uniform float uTime,uOpacity,uHeat,uFlash; varying vec2 vUv; varying vec3 vPosition;
void main(){
  vec3 p=normalize(vPosition);
  float eddies=sin(p.x*15.+uTime*.8)*sin(p.y*21.-uTime*.6)*sin(p.z*18.+uTime*.9);
  float fissures=pow(.5+.5*sin(p.y*32.+p.x*17.+eddies*4.),5.);
  vec3 ember=mix(vec3(.045,.006,.001),vec3(.8,.13,.018),fissures);
  vec3 molten=mix(vec3(1.1,.31,.035),vec3(2.8,1.72,.66),.45+fissures*.55);
  vec3 color=mix(ember,molten,uHeat);
  color=mix(color,vec3(3.2,3.05,2.7),uFlash*.72);
  gl_FragColor=vec4(color,uOpacity);
  ${output}
}`;
const haloFragment = `
uniform float uOpacity,uTime,uHeat,uFlash; varying vec2 vUv; varying vec3 vPosition;
void main(){
  vec2 p=(vUv-.5)*2.;float r=length(p);
  float halo=exp(-r*(10.-uHeat*2.))*(1.-smoothstep(.7,1.,r));
  float core=exp(-r*r*650.);
  float flare=exp(-abs(p.y)*180.)*exp(-abs(p.x)*8.);
  vec3 ember=vec3(.32,.06,.005);
  vec3 running=mix(vec3(.72,.24,.035),vec3(.09,.21,.49),smoothstep(.86,1.,uHeat));
  vec3 color=mix(ember,running,uHeat)*halo;
  color+=mix(vec3(.22,.018,.001),vec3(1.8,1.55,1.2),uHeat)*core;
  color+=vec3(1.3,1.16,.9)*(halo*.65+flare*.6)*uFlash;
  gl_FragColor=vec4(color,uOpacity);
  ${output}
}`;
function shader(fragmentShader) {
  return new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uHeat: { value: 0 },
      uFlash: { value: 0 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    forceSinglePass: true,
  });
}
const smooth = (value, from, to) => THREE.MathUtils.smoothstep(value, from, to);

/** The engine lights once on entry. Scene travel locates the chapter; elapsed
 * scene time lets the furnace finish lighting even when the visitor stops scrolling. */
export function createQuasar(phone) {
  const group = new THREE.Group();
  const axis = new THREE.Group();
  axis.rotation.set(0.16, 0.12, -0.52);
  group.add(axis);
  const disk = new THREE.Mesh(
    new THREE.RingGeometry(2, 115, phone ? 96 : 160, 8),
    shader(diskFragment),
  );
  disk.rotation.x = 1.13;
  axis.add(disk);
  const nucleus = new THREE.Mesh(
    new THREE.SphereGeometry(7, 24, 16),
    shader(coreFragment),
  );
  axis.add(nucleus);
  const halo = new THREE.Mesh(
    new THREE.PlaneGeometry(540, 540),
    shader(haloFragment),
  );
  group.add(halo);

  // Geometry starts at y=0, so scaling extends each outflow from the core.
  // The old centered cylinders exposed their complete length on the first frame.
  const jetGeometry = new THREE.CylinderGeometry(
    50,
    2.5,
    690,
    phone ? 20 : 32,
    64,
    true,
  );
  jetGeometry.translate(0, 345, 0);
  const spineGeometry = new THREE.CylinderGeometry(5, 0.7, 650, 12, 20, true);
  spineGeometry.translate(0, 325, 0);
  const jets = [];
  for (const sign of [-1, 1]) {
    for (const geometry of [jetGeometry, spineGeometry]) {
      const jet = new THREE.Mesh(geometry, shader(jetFragment));
      if (sign < 0) jet.rotation.z = Math.PI;
      axis.add(jet);
      jets.push(jet);
    }
  }
  const random = mulberry32(1963),
    count = phone ? 350 : 850;
  const positions = new Float32Array(count * 3),
    seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const a = random() * Math.PI * 2,
      r = Math.sqrt(random());
    positions.set([Math.cos(a) * r, i % 2 ? 1 : -1, Math.sin(a) * r], i * 3);
    seeds[i] = random();
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  const particlesMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uLaunch: { value: -1 },
      uOpacity: { value: 0 },
      uFront: { value: 0 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `attribute float aSeed;uniform float uLaunch,uOpacity,uFront;varying float vAlpha;
    void main(){
      float age=uLaunch-aSeed*1.4;
      float t=mod(max(0.,age),4.2)/4.2;
      vec3 p=vec3(position.x*(2.+t*37.),position.y*t*690.,position.z*(2.+t*37.));
      vec4 view=modelViewMatrix*vec4(p,1.);
      gl_Position=projectionMatrix*view;
      gl_PointSize=clamp(900./max(100.,-view.z),1.,3.);
      vAlpha=sin(t*3.14159)*uOpacity*step(0.,age)*(1.-smoothstep(uFront-.025,uFront,t));
    }`,
    fragmentShader: `varying float vAlpha;void main(){float r=length(gl_PointCoord-.5)*2.;gl_FragColor=vec4(.4,.78,1.4,exp(-r*r*5.)*vAlpha);${output}}`,
  });
  const particles = new THREE.Points(geometry, particlesMaterial);
  particles.frustumCulled = false;
  axis.add(particles);

  let ignitionAt = null;
  let lastTime = 0;
  return {
    group,
    /** progress is 0..1 within the approach; send -1 outside the chapter to rearm.
     * time must use the voyage clock (frozen while the scene is paused). */
    update(time, camera, progress, reduced = false, opacity = 1) {
      if (progress <= 0) ignitionAt = null;
      if (time < lastTime) ignitionAt = null;
      if (progress > 0 && ignitionAt === null) ignitionAt = time;
      lastTime = time;
      const active = progress > 0;
      const age = reduced ? 8 : ignitionAt === null ? 0 : time - ignitionAt;
      const entry = active
        ? smooth(progress, 0, 0.07) * THREE.MathUtils.clamp(opacity, 0, 1)
        : 0;
      const heat = smooth(age, 0.25, 2.3);
      // A single, soft-edged ignition pulse, never a periodic strobe.
      const flash =
        active && !reduced
          ? smooth(age, 1.9, 2.12) * (1 - smooth(age, 2.12, 2.52))
          : 0;
      const ignition = active ? smooth(age, 0, 4.25) : 0;
      const growth = active ? smooth(age, 2.08, 4.25) : 0;
      const jetOpacity = entry * smooth(age, 2.08, 2.5);
      halo.quaternion.copy(camera.quaternion);
      nucleus.scale.setScalar(0.65 + heat * 0.35 + flash * 0.14);
      nucleus.rotation.y = time * 0.12;
      disk.scale.setScalar(1.32 - smooth(age, 0, 1.95) * 0.32);
      disk.rotation.z = time * (0.035 + heat * 0.065);
      for (const [mesh, opacity] of [
        [disk, entry * (0.35 + heat * 0.65)],
        [nucleus, entry],
        [halo, entry * (0.3 + heat * 0.7)],
      ]) {
        mesh.material.uniforms.uTime.value = time;
        mesh.material.uniforms.uOpacity.value = opacity;
        mesh.material.uniforms.uHeat.value = heat;
        mesh.material.uniforms.uFlash.value = flash;
      }
      for (const jet of jets) {
        jet.visible = growth > 0.0001;
        jet.scale.set(
          0.4 + Math.sqrt(growth) * 0.6,
          growth,
          0.4 + Math.sqrt(growth) * 0.6,
        );
        jet.material.uniforms.uTime.value = time;
        jet.material.uniforms.uOpacity.value = jetOpacity;
      }
      particles.visible = growth > 0.001;
      particlesMaterial.uniforms.uLaunch.value = reduced ? 8 : age - 2.08;
      particlesMaterial.uniforms.uOpacity.value = jetOpacity;
      particlesMaterial.uniforms.uFront.value = growth;
      return {
        light: entry * (0.035 + heat * 0.65 + flash * 0.2),
        flash: flash * entry,
        ignition,
      };
    },
  };
}
