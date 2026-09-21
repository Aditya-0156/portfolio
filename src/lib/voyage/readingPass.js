import { Vector2, Vector4 } from 'three';

// Compress bright scenery only beneath the current reading areas. This preserves
// the nebula's color and structure without placing a dark rectangle over the scene.
export const readingShader = {
  uniforms: {
    tDiffuse: { value: null },
    uRect0: { value: new Vector4(-2, -2, -2, -2) },
    uRect1: { value: new Vector4(-2, -2, -2, -2) },
    uRect2: { value: new Vector4(-2, -2, -2, -2) },
    uFeather: { value: new Vector2(0.06, 0.06) },
    uCeiling: { value: 0.075 },
  },
  vertexShader: `varying vec2 vUv;
  void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader: `
  uniform sampler2D tDiffuse;
  uniform vec4 uRect0,uRect1,uRect2;
  uniform vec2 uFeather;
  uniform float uCeiling;
  varying vec2 vUv;
  float region(vec4 bounds){
    vec2 inset=min(vUv-bounds.xy,bounds.zw-vUv);
    vec2 fade=smoothstep(vec2(0.),uFeather,inset);
    return fade.x*fade.y;
  }
  void main(){
    vec3 color=texture2D(tDiffuse,vUv).rgb;
    float mask=max(region(uRect0),max(region(uRect1),region(uRect2)));
    float luminance=dot(color,vec3(.2126,.7152,.0722));
    float excess=max(0.,luminance-.015);
    float compressed=min(luminance,.015)+excess/(1.+excess/(uCeiling-.015));
    color*=mix(1.,compressed/max(luminance,.00001),mask);
    gl_FragColor=vec4(color,1.);
  }`,
};
