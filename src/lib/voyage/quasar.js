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
  float envelope=smoothstep(0.,.025,along)*(1.-smoothstep(.62,1.,along));
  vec3 color=mix(vec3(.13,.32,1.),vec3(.36,.84,1.3),strands);
  color+=vec3(.5,.8,1.2)*knots*.7;
  gl_FragColor=vec4(color,(.018+strands*.24+knots*.14)*envelope*uOpacity);
  ${output}
}`;
const diskFragment = `
uniform float uTime,uOpacity; varying vec2 vUv; varying vec3 vPosition;
void main(){
  float r=length(vPosition.xy)/115.;
  float a=atan(vPosition.y,vPosition.x);
  float lanes=.55+.45*sin(a*3.+log(max(.02,r))*12.-uTime*.7);
  float rings=.55+.45*sin(r*145.+sin(a*4.)*.8);
  float envelope=exp(-r*2.8)*(1.-smoothstep(.65,1.,r));
  vec3 color=mix(vec3(.35,.22,.8),vec3(1.9,.98,.45),exp(-r*3.));
  gl_FragColor=vec4(color,envelope*(.35+lanes*.6+rings*.2)*uOpacity);
  ${output}
}`;
const haloFragment = `
uniform float uOpacity,uTime; varying vec2 vUv; varying vec3 vPosition;
void main(){
  vec2 p=(vUv-.5)*2.;float r=length(p);
  float halo=exp(-r*8.5)*(1.-smoothstep(.7,1.,r));
  float core=exp(-r*r*650.);
  float flare=exp(-abs(p.y)*180.)*exp(-abs(p.x)*8.);
  vec3 color=vec3(.1,.25,.7)*halo+vec3(2.4,2.5,3.)*core+vec3(.3,.5,1.)*flare*.18;
  gl_FragColor=vec4(color,uOpacity);
  ${output}
}`;
function shader(fragmentShader) {
  return new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader,
    uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    forceSinglePass: true,
  });
}

/** A luminous nucleus with a tilted disk and two genuine three-dimensional outflows.
 * No black-hole silhouette: the white core and moving blue plasma define this chapter. */
export function createQuasar(phone) {
  const group = new THREE.Group();
  const axis = new THREE.Group();
  axis.rotation.set(0.16, 0.12, -0.52);
  group.add(axis);
  const materials = [];
  const disk = new THREE.Mesh(
    new THREE.RingGeometry(2, 115, phone ? 96 : 160, 8),
    shader(diskFragment),
  );
  disk.rotation.x = 1.13;
  axis.add(disk);
  materials.push(disk.material);
  const nucleus = new THREE.Mesh(
    new THREE.SphereGeometry(7, 24, 16),
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(3.8, 3.4, 2.8),
      transparent: true,
    }),
  );
  axis.add(nucleus);
  const halo = new THREE.Mesh(
    new THREE.PlaneGeometry(540, 540),
    shader(haloFragment),
  );
  group.add(halo);
  materials.push(halo.material);
  const jetGeometry = new THREE.CylinderGeometry(
    50,
    2.5,
    690,
    phone ? 20 : 32,
    64,
    true,
  );
  const spineGeometry = new THREE.CylinderGeometry(5, 0.7, 650, 12, 20, true);
  for (const sign of [-1, 1]) {
    for (const geometry of [jetGeometry, spineGeometry]) {
      const jet = new THREE.Mesh(geometry, shader(jetFragment));
      jet.position.y = sign * (geometry === jetGeometry ? 345 : 325);
      if (sign < 0) jet.rotation.z = Math.PI;
      axis.add(jet);
      materials.push(jet.material);
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
    uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `attribute float aSeed;uniform float uTime,uOpacity;varying float vAlpha;
    void main(){float t=fract(aSeed+uTime*.055);vec3 p=vec3(position.x*(2.+t*37.),position.y*t*690.,position.z*(2.+t*37.));
    vec4 view=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*view;gl_PointSize=clamp(900./max(100.,-view.z),1.,3.);
    vAlpha=sin(t*3.14159)*uOpacity;}`,
    fragmentShader: `varying float vAlpha;void main(){float r=length(gl_PointCoord-.5)*2.;gl_FragColor=vec4(.4,.78,1.4,exp(-r*r*5.)*vAlpha);${output}}`,
  });
  const particles = new THREE.Points(geometry, particlesMaterial);
  particles.frustumCulled = false;
  axis.add(particles);
  materials.push(particlesMaterial);
  return {
    group,
    update(time, camera, opacity) {
      halo.quaternion.copy(camera.quaternion);
      nucleus.material.opacity = opacity;
      materials.forEach((material) => {
        material.uniforms.uTime.value = time;
        material.uniforms.uOpacity.value = opacity;
      });
    },
  };
}
