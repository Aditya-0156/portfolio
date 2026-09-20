// All celestial surfaces are generated on the GPU. No image downloads or texture pop-in.
export const noise = /* glsl */ `
float hash(vec3 p) { p = fract(p * .3183099 + vec3(.1,.2,.3)); p *= 17.; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float noise3(vec3 p) {
  vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
    mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
}
float fbm(vec3 p) { float v=0., a=.5; for(int i=0;i<5;i++){ v+=a*noise3(p); p=p*2.03+vec3(17.1,9.2,13.7); a*=.48; } return v; }
`;

export const worldVertex = /* glsl */ `
varying vec3 vLocal; varying vec3 vWorld; varying vec3 vNormal; varying vec2 vUv;
void main(){ vUv=uv; vLocal=position; vWorld=(modelMatrix*vec4(position,1.)).xyz;
 vNormal=normalize(mat3(modelMatrix)*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }
`;

export const skyFragment = /* glsl */ `
${noise}
varying vec3 vLocal; uniform float uTime; uniform float uTravel;
void main(){
 vec3 d=normalize(vLocal); vec3 p=d*3.2+vec3(0.,0.,uTravel*.3);
 float warp=fbm(p*1.4); float cloud=fbm(p*2.1+warp*2.8);
 float band=exp(-pow((d.y+d.x*.38-.12)*2.8,2.));
 float filaments=pow(max(cloud-.28,0.)*2.0,2.6)*band;
 float dust=fbm(p*5.+vec3(warp*2.));
 vec3 cold=vec3(.095,.16,.24); vec3 warm=vec3(.27,.145,.075);
 vec3 col=mix(cold,warm,smoothstep(.28,.72,noise3(p*.8+4.)))*filaments;
 col*=1.-smoothstep(.48,.7,dust)*.88;
 col=col*.3+vec3(.0007,.0011,.002)+vec3(.002,.003,.005)*band;
 gl_FragColor=vec4(col,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}
`;

export const planetFragment = /* glsl */ `
${noise}
varying vec3 vLocal; varying vec3 vWorld; varying vec3 vNormal;
uniform float uTime; uniform float uOpacity;
void main(){
 vec3 p=normalize(vLocal); float lat=p.y;
 float turbulence=fbm(p*8.+vec3(uTime*.012,0.,0.));
 float belts=sin(lat*52.+turbulence*7.0)+sin(lat*137.+turbulence*14.)*.24;
 float grain=fbm(p*58.+turbulence);
 vec3 col=mix(vec3(.32,.21,.13),vec3(.76,.63,.42),smoothstep(-1.2,1.2,belts));
 col=mix(col,vec3(.83,.76,.60),smoothstep(.45,.77,turbulence)*.5);
 col*=.82+grain*.32;
 vec3 n=normalize(vNormal), light=normalize(vec3(-.92,.3,.22));
 float sun=max(dot(n,light),0.); float terminator=smoothstep(-.13,.25,dot(n,light));
 vec3 view=normalize(cameraPosition-vWorld);
 float rim=pow(1.-max(dot(n,view),0.),3.5);
 col*=.006+sun*1.35;
 col+=vec3(.36,.51,.68)*rim*terminator*.32;
 gl_FragColor=vec4(col,uOpacity);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}
`;

export const ringFragment = /* glsl */ `
${noise}
varying vec3 vLocal; varying vec3 vWorld;
uniform float uInner; uniform float uOuter; uniform float uOpacity; uniform vec3 uPlanetCenter;
void main(){
 float r=length(vLocal.xy); float t=(r-uInner)/(uOuter-uInner);
 float strands=noise3(vec3(r*2.8,0,0))*.5+noise3(vec3(r*.47,2,0))*.5;
 float gaps=(1.-smoothstep(.005,.016,abs(t-.64)))*.93+(1.-smoothstep(.001,.007,abs(t-.83)))*.75;
 float alpha=smoothstep(0.,.035,t)*(1.-smoothstep(.94,1.,t))*(.48+strands*.45)*(1.-gaps);
 vec3 light=normalize(vec3(-.92,.3,.22));
 // The planet casts a cylindrical shadow across the actual ring plane.
 vec3 pos=vWorld-uPlanetCenter; float along=dot(pos,light);
 float shade=1.-(1.-smoothstep(157.,172.,length(pos-light*along)))*(1.-step(0.,along))*.96;
 vec3 col=mix(vec3(.28,.23,.18),vec3(.69,.59,.43),strands)*shade;
 gl_FragColor=vec4(col,alpha*uOpacity);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}
`;

// A curved-ray integration, with disk crossings accumulated front to back. The adaptive
// step concentrates work near the photon sphere. This is an artistic relativistic lens,
// not a scientific simulation of a particular black hole.
export const blackHoleFragment = /* glsl */ `
${noise}
varying vec2 vUv; uniform float uTime; uniform float uOpacity;
void main(){
 vec2 uv=(vUv-.5)*2.;
 vec3 ro=vec3(0.,2.8,15.); vec3 rd=normalize(vec3(uv*10.,0.)-ro);
 vec3 p=ro; vec3 col=vec3(0.); float transmission=1.;
 vec3 angular=cross(ro,rd); float h2=dot(angular,angular); float captured=0.;
 for(int i=0;i<100;i++){
   float r=length(p); if(r<1.02){captured=1.;break;} if(r>26.)break;
   float stepSize=clamp(r*.09,.055,1.25);
   vec3 prev=p;
   vec3 gravity=-1.5*h2*p/pow(r,5.);
   rd+=gravity*stepSize; p+=rd*stepSize;
   if(prev.y*p.y<0.){
     vec3 hit=mix(prev,p,prev.y/(prev.y-p.y)); float radius=length(hit.xz);
     if(radius>2.65 && radius<10.){
       float a=atan(hit.z,hit.x); float heat=pow(2.65/radius,1.8);
       float flow=sin(radius*19.+a*2.-uTime*.7)+sin(radius*37.-a*3.+uTime*.4)*.35;
       float turbulence=noise3(vec3(hit.xz*2.2,uTime*.09));
       float structure=.52+.12*flow+.55*turbulence;
       float edge=smoothstep(2.65,3.15,radius)*(1.-smoothstep(7.,10.,radius));
       float doppler=pow(clamp(1.+hit.x/radius*.52,.45,1.5),2.2);
       vec3 hot=mix(vec3(1.,.20,.025),vec3(1.,.86,.55),pow(heat,.65));
       col+=transmission*hot*structure*edge*heat*doppler*2.4;
       transmission*=1.-edge*.78;
     }
   }
 }
 if(captured>.5 && length(col)<.09) col=vec3(0.);
 float edgeFade=1.-smoothstep(.82,1.,length(uv));
 float alpha=max(captured,clamp(length(col)*1.5,0.,1.))*edgeFade*uOpacity;
 gl_FragColor=vec4(col,alpha);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}
`;

export const nebulaFragment = /* glsl */ `
${noise}
varying vec2 vUv; uniform float uTime; uniform float uKind; uniform float uOpacity; uniform float uVariant;
void main(){
 vec2 p=(vUv-.5)*2.; float r=length(p); float angle=atan(p.y,p.x);
 float turbulent=fbm(vec3(p*4.,uTime*.016));
 float fold=fbm(vec3(p*9.+turbulent*2.,1.+uTime*.008));
 float shell=exp(-pow((r-.49-turbulent*.17)*6.5,2.));
 float filaments=pow(fold,2.8)*5.;
 float gas=shell*filaments;
 vec3 col=mix(vec3(.10,.34,.52),vec3(.8,.24,.075),smoothstep(.25,.68,turbulent));
 col=mix(col,vec3(.24,.55,.65),smoothstep(.55,.7,r)*.6);
 float core=exp(-r*32.);
 col=col*gas*1.7+core*vec3(.7,.86,1.)*2.;
 col*=.32;
 if(uKind>0.5){
   float armsCount=2.+mod(uVariant,2.)*2.;
   float spiral=angle*armsCount+log(max(r,.025))*(5.5+uVariant*.7)-uTime*.02;
   float lanes=pow(.5+.5*sin(spiral+turbulent*2.),3.);
   float envelope=exp(-r*4.2)*(1.-exp(-r*16.));
   float fine=fbm(vec3(p*47.,2.));
   float arms=lanes*envelope*(.2+fine*.8);
   float dustLane=smoothstep(.45,.72,fbm(vec3(p*18.,5.)));
   vec3 disk=vec3(.21,.36,.62)*arms*.8*(1.-dustLane*.7);
   float stars=pow(hash(vec3(floor(p*430.),3.)),70.)*lanes*envelope;
   vec3 tint=mix(vec3(.75,.83,1.),vec3(.9,.55,.86),uVariant/3.);
   col=disk+tint*stars*.95+vec3(1.,.69,.35)*exp(-r*24.);
   if(uVariant>1.5&&uVariant<2.5){
     col=vec3(.95,.68,.4)*exp(-r*7.)*.72+vec3(1.,.87,.65)*exp(-r*28.);
     col+=vec3(.8,.75,.6)*stars*.16;
   }
   if(uVariant>2.5)col+=vec3(.12,.28,.55)*exp(-abs(p.y)*18.-abs(p.x)*5.)*.2;
   col*=1.6;
 }
 float alpha=(1.-smoothstep(.72,1.,r))*uOpacity;
 gl_FragColor=vec4(col,alpha);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}
`;
