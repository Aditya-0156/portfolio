import { Vector2 } from 'three';

// The same projected front drives this refraction pass and the DOM's matter response.
// It is disabled outside an event and under reduced motion.
export const phenomenaShader = {
  uniforms: {
    tDiffuse: { value: null },
    uCenter: { value: new Vector2(0.5, 0.5) },
    uAspect: { value: 1 },
    uRadius: { value: 0 },
    uEnergy: { value: 0 },
    uPhase: { value: 0 },
    uKind: { value: 0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 uCenter;
    uniform float uAspect,uRadius,uEnergy,uPhase,uKind;
    varying vec2 vUv;
    void main(){
      vec2 p=(vUv-uCenter)*vec2(uAspect,1.);
      float r=length(p); vec2 direction=p/max(r,.001);
      float edge=r-uRadius;
      float shell=exp(-abs(edge)*45.);
      float gravitational=sin(r*29.-uPhase)*exp(-r*1.4);
      float wave=mix(sin(edge*72.)*shell,gravitational,step(1.5,uKind));
      vec2 displacement=direction*vec2(1./uAspect,1.)*wave*uEnergy*.013;
      vec2 uv=clamp(vUv+displacement,vec2(.001),vec2(.999));
      vec3 col=texture2D(tDiffuse,uv).rgb;
      float fringe=shell*uEnergy*.0015;
      if(uKind<1.5){
        col.r=texture2D(tDiffuse,clamp(uv+direction*fringe,vec2(.001),vec2(.999))).r;
        col+=vec3(.17,.085,.028)*shell*uEnergy;
      }
      gl_FragColor=vec4(col,1.);
    }
  `,
};
