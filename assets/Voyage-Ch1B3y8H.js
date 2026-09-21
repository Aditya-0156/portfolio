import{r as j,j as q,a as Et}from"./index-JU2t8rWE.js";import{M as P,O as Ft,B as Se,F as Me,S as Q,U as Ue,V as k,W as Oe,H as ze,N as At,C as Ot,a as Le,b as I,A as te,c as zt,R as Ut,d as Lt,e as Bt,L as Dt,f as kt,g as Ht,h as wt,i as It,j as Nt,k as Ne,G as ae,l as Vt,T as Ve,m as we,n as ct,o as fe,p as W,q as jt,r as re,D as Te,P as ue,s as oe,I as Gt,t as je,u as X,v as Qe,w as bt,x as Wt,y as Mt,z as $t,E as qt,J as Qt,K as ut,Q as Kt,X as Yt,Y as Xt,Z as Zt,_ as Jt,$ as ea,a0 as ta}from"./three-B8NjZs_w.js";const Tt={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class pe{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const aa=new Ft(-1,1,1,-1,0,1);class oa extends Se{constructor(){super(),this.setAttribute("position",new Me([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Me([0,2,0,0,2,0],2))}}const ia=new oa;class Ke{constructor(e){this._mesh=new P(ia,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,aa)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Ge extends pe{constructor(e,o){super(),this.textureID=o!==void 0?o:"tDiffuse",e instanceof Q?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Ue.clone(e.uniforms),this.material=new Q({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new Ke(this.material)}render(e,o,s){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=s.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(o),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class ft extends pe{constructor(e,o){super(),this.scene=e,this.camera=o,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,o,s){const u=e.getContext(),n=e.state;n.buffers.color.setMask(!1),n.buffers.depth.setMask(!1),n.buffers.color.setLocked(!0),n.buffers.depth.setLocked(!0);let h,d;this.inverse?(h=0,d=1):(h=1,d=0),n.buffers.stencil.setTest(!0),n.buffers.stencil.setOp(u.REPLACE,u.REPLACE,u.REPLACE),n.buffers.stencil.setFunc(u.ALWAYS,h,4294967295),n.buffers.stencil.setClear(d),n.buffers.stencil.setLocked(!0),e.setRenderTarget(s),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(o),this.clear&&e.clear(),e.render(this.scene,this.camera),n.buffers.color.setLocked(!1),n.buffers.depth.setLocked(!1),n.buffers.color.setMask(!0),n.buffers.depth.setMask(!0),n.buffers.stencil.setLocked(!1),n.buffers.stencil.setFunc(u.EQUAL,1,4294967295),n.buffers.stencil.setOp(u.KEEP,u.KEEP,u.KEEP),n.buffers.stencil.setLocked(!0)}}class sa extends pe{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class ra{constructor(e,o){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),o===void 0){const s=e.getSize(new k);this._width=s.width,this._height=s.height,o=new Oe(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:ze}),o.texture.name="EffectComposer.rt1"}else this._width=o.width,this._height=o.height;this.renderTarget1=o,this.renderTarget2=o.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Ge(Tt),this.copyPass.material.blending=At,this.clock=new Ot}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,o){this.passes.splice(o,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const o=this.passes.indexOf(e);o!==-1&&this.passes.splice(o,1)}isLastEnabledPass(e){for(let o=e+1;o<this.passes.length;o++)if(this.passes[o].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const o=this.renderer.getRenderTarget();let s=!1;for(let u=0,n=this.passes.length;u<n;u++){const h=this.passes[u];if(h.enabled!==!1){if(h.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(u),h.render(this.renderer,this.writeBuffer,this.readBuffer,e,s),h.needsSwap){if(s){const d=this.renderer.getContext(),v=this.renderer.state.buffers.stencil;v.setFunc(d.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),v.setFunc(d.EQUAL,1,4294967295)}this.swapBuffers()}ft!==void 0&&(h instanceof ft?s=!0:h instanceof sa&&(s=!1))}}this.renderer.setRenderTarget(o)}reset(e){if(e===void 0){const o=this.renderer.getSize(new k);this._pixelRatio=this.renderer.getPixelRatio(),this._width=o.width,this._height=o.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,o){this._width=e,this._height=o;const s=this._width*this._pixelRatio,u=this._height*this._pixelRatio;this.renderTarget1.setSize(s,u),this.renderTarget2.setSize(s,u);for(let n=0;n<this.passes.length;n++)this.passes[n].setSize(s,u)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class na extends pe{constructor(e,o,s=null,u=null,n=null){super(),this.scene=e,this.camera=o,this.overrideMaterial=s,this.clearColor=u,this.clearAlpha=n,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Le}render(e,o,s){const u=e.autoClear;e.autoClear=!1;let n,h;this.overrideMaterial!==null&&(h=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(n=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:s),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(n),this.overrideMaterial!==null&&(this.scene.overrideMaterial=h),e.autoClear=u}}const la={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Le(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class he extends pe{constructor(e,o,s,u){super(),this.strength=o!==void 0?o:1,this.radius=s,this.threshold=u,this.resolution=e!==void 0?new k(e.x,e.y):new k(256,256),this.clearColor=new Le(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let n=Math.round(this.resolution.x/2),h=Math.round(this.resolution.y/2);this.renderTargetBright=new Oe(n,h,{type:ze}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let x=0;x<this.nMips;x++){const _=new Oe(n,h,{type:ze});_.texture.name="UnrealBloomPass.h"+x,_.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(_);const m=new Oe(n,h,{type:ze});m.texture.name="UnrealBloomPass.v"+x,m.texture.generateMipmaps=!1,this.renderTargetsVertical.push(m),n=Math.round(n/2),h=Math.round(h/2)}const d=la;this.highPassUniforms=Ue.clone(d.uniforms),this.highPassUniforms.luminosityThreshold.value=u,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Q({uniforms:this.highPassUniforms,vertexShader:d.vertexShader,fragmentShader:d.fragmentShader}),this.separableBlurMaterials=[];const v=[3,5,7,9,11];n=Math.round(this.resolution.x/2),h=Math.round(this.resolution.y/2);for(let x=0;x<this.nMips;x++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(v[x])),this.separableBlurMaterials[x].uniforms.invSize.value=new k(1/n,1/h),n=Math.round(n/2),h=Math.round(h/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=o,this.compositeMaterial.uniforms.bloomRadius.value=.1;const A=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=A,this.bloomTintColors=[new I(1,1,1),new I(1,1,1),new I(1,1,1),new I(1,1,1),new I(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const E=Tt;this.copyUniforms=Ue.clone(E.uniforms),this.blendMaterial=new Q({uniforms:this.copyUniforms,vertexShader:E.vertexShader,fragmentShader:E.fragmentShader,blending:te,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new Le,this.oldClearAlpha=1,this.basic=new zt,this.fsQuad=new Ke(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,o){let s=Math.round(e/2),u=Math.round(o/2);this.renderTargetBright.setSize(s,u);for(let n=0;n<this.nMips;n++)this.renderTargetsHorizontal[n].setSize(s,u),this.renderTargetsVertical[n].setSize(s,u),this.separableBlurMaterials[n].uniforms.invSize.value=new k(1/s,1/u),s=Math.round(s/2),u=Math.round(u/2)}render(e,o,s,u,n){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const h=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),n&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=s.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=s.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let d=this.renderTargetBright;for(let v=0;v<this.nMips;v++)this.fsQuad.material=this.separableBlurMaterials[v],this.separableBlurMaterials[v].uniforms.colorTexture.value=d.texture,this.separableBlurMaterials[v].uniforms.direction.value=he.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[v]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[v].uniforms.colorTexture.value=this.renderTargetsHorizontal[v].texture,this.separableBlurMaterials[v].uniforms.direction.value=he.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[v]),e.clear(),this.fsQuad.render(e),d=this.renderTargetsVertical[v];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,n&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(s),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=h}getSeperableBlurMaterial(e){const o=[];for(let s=0;s<e;s++)o.push(.39894*Math.exp(-.5*s*s/(e*e))/e);return new Q({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new k(.5,.5)},direction:{value:new k(.5,.5)},gaussianCoefficients:{value:o}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(e){return new Q({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}he.BlurDirectionX=new k(1,0);he.BlurDirectionY=new k(0,1);const ca={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
	
		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class ua extends pe{constructor(){super();const e=ca;this.uniforms=Ue.clone(e.uniforms),this.material=new Ut({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new Ke(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,o,s){this.uniforms.tDiffuse.value=s.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Lt.getTransfer(this._outputColorSpace)===Bt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Dt?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===kt?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Ht?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===wt?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===It?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Nt&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(o),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const fa={uniforms:{tDiffuse:{value:null},uCenter:{value:new k(.5,.5)},uAspect:{value:1},uRadius:{value:0},uEnergy:{value:0},uPhase:{value:0},uKind:{value:0}},vertexShader:`
    varying vec2 vUv;
    void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
  `,fragmentShader:`
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
  `},ha={uniforms:{tDiffuse:{value:null},uRect0:{value:new Ne(-2,-2,-2,-2)},uRect1:{value:new Ne(-2,-2,-2,-2)},uRect2:{value:new Ne(-2,-2,-2,-2)},uFeather:{value:new k(.06,.06)},uCeiling:{value:.075}},vertexShader:`varying vec2 vUv;
  void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`
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
  }`};function Ye(a){let e=a>>>0;return function(){e=e+1831565813|0;let s=Math.imul(e^e>>>15,1|e);return s=s+Math.imul(s^s>>>7,61|s)^s,((s^s>>>14)>>>0)/4294967296}}const Y=()=>new re({color:13225944,metalness:.94,roughness:.3}),ht=()=>new re({color:15265010,metalness:.36,roughness:.52,side:Te}),pt=()=>new re({color:14263375,metalness:1,roughness:.22}),dt=()=>new re({color:11043887,metalness:.85,roughness:.58}),Ee=()=>new re({color:1974824,metalness:.5,roughness:.66}),be=()=>new re({color:10134189,metalness:.9,roughness:.38});function pa(){const a=new ae,e=12,o=[];for(let i=0;i<=22;i++){const l=i/22*e;o.push(new k(l,l*l/44))}const s=new P(new Vt(o,72),ht());s.position.y=2.2,a.add(s);const u=new P(new Ve(e,.22,8,72),Y());u.rotation.x=Math.PI/2,u.position.y=2.2+e*e/44,a.add(u);for(let i=0;i<12;i++){const r=i/12*Math.PI*2,l=new P(new we(.16,.5,e*.95),Y());l.position.set(Math.cos(r)*e*.5,1.6,Math.sin(r)*e*.5),l.rotation.y=-r,a.add(l)}const n=new P(new ct(.85,3.4,16),Y());n.position.y=9.6,n.rotation.x=Math.PI,a.add(n);const h=new P(new fe(1.5,24,16,0,Math.PI*2,0,Math.PI/2.2),ht());h.position.y=11.4,h.rotation.x=Math.PI,a.add(h);for(let i=0;i<3;i++){const r=i/3*Math.PI*2+.4,l=new P(new W(.12,.12,11.2,6),be());l.position.set(Math.cos(r)*e*.46,6.4,Math.sin(r)*e*.46),l.lookAt(new I(0,11.2,0)),l.rotateX(Math.PI/2),a.add(l)}const d=new ae;d.position.y=-2.6;const v=new P(new W(4.3,4.3,2.4,10),Ee());d.add(v);for(let i=0;i<10;i++){const r=i/10*Math.PI*2+Math.PI/10,l=new P(new we(2.5,2.1,.5),i%3===0?dt():Y());l.position.set(Math.cos(r)*4.35,0,Math.sin(r)*4.35),l.rotation.y=-r+Math.PI/2,d.add(l)}const A=new P(new W(4.4,4.4,.35,10),Y());A.position.y=1.35,d.add(A);const E=new P(new Ve(4.45,.22,8,10),pt());E.rotation.x=Math.PI/2,E.position.y=-1.2,d.add(E);const x=new P(new fe(2.1,24,20),dt());x.position.y=-3.2,d.add(x);const _=new P(new ct(.55,1.3,12),Ee());_.position.set(0,-5.2,0),d.add(_),a.add(d);const m=new P(new W(.26,.26,12,8),be());m.rotation.z=Math.PI/2,m.position.set(-9.5,-3.4,0),a.add(m);for(let i=0;i<3;i++){const r=-13.2-i*3.3,l=new P(new W(1.05,1.05,2.8,14),Ee());l.rotation.z=Math.PI/2,l.position.set(r,-3.4,0),a.add(l);for(let M=0;M<6;M++){const f=M/6*Math.PI*2,w=new P(new we(2.6,.08,1.5),Y());w.position.set(r,-3.4+Math.cos(f)*1.4,Math.sin(f)*1.4),w.rotation.x=-f,a.add(w)}}const T=new P(new W(.22,.22,13,8),be());T.rotation.z=Math.PI/2,T.position.set(10,-3,0),a.add(T);const y=new P(new we(2.6,2.2,2.4),Ee());y.position.set(16.6,-3,0),a.add(y),[[.75,.5],[-.75,-.4]].forEach(([i,r])=>{const l=new P(new W(.42,.5,3.1,14),Y());l.rotation.x=Math.PI/2,l.position.set(16.6+r,-3+i,-2.2),a.add(l);const M=new P(new jt(.42,16),new re({color:724500,metalness:1,roughness:.1}));M.position.set(16.6+r,-3+i,-3.76),a.add(M)});const S=new ae,p=new P(new W(.1,.13,58,6),be());p.position.y=29,S.add(p);for(let i=1;i<=3;i++){const r=new P(new we(.7,.7,.7),Y());r.position.y=i*17,S.add(r)}S.position.set(-3.4,-1.5,3),S.rotation.set(.5,0,.72),a.add(S);const c=new P(new W(1.85,1.85,.16,48),pt());c.position.set(3.6,-2.6,4.2),c.rotation.set(Math.PI/2,0,.2),a.add(c);const F=new P(new Ve(1.85,.1,8,40),Y());return F.position.copy(c.position),F.rotation.copy(c.rotation),a.add(F),[-1,1].forEach(i=>{const r=new P(new W(.075,.075,40,6),be());r.position.set(i*2.2,-4.4,-2),r.rotation.set(-.85,0,i*.55),r.translateY(20),a.add(r)}),{group:a,dish:s,bus:d,magBoom:S}}const ne=`
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
`,de=`
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
`,vt=`
${ne}
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
}`,mt=`
${ne}
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
${de}
}`,da=`
${ne}
uniform float uTime;uniform float uRadius;
varying vec3 vDirection;varying vec3 vWorld;
void main(){
  vec3 d=normalize(position);vDirection=d;
  float ripple=fbm(d*7.+vec3(uTime*.1,0.,uTime*.035));
  vec3 p=d*uRadius*(.93+ripple*.16);vWorld=(modelMatrix*vec4(p,1.)).xyz;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
}`,va=`
${ne}
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
${de}
}`,ma=`
varying vec2 vUv;
void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
`,ga=`
uniform float uFlash;uniform float uOpacity;uniform float uHeat;varying vec2 vUv;
void main(){
  vec2 p=(vUv-.5)*2.;float r=length(p);
  float glow=exp(-r*8.)*(1.-smoothstep(.7,1.,r));
  float bloom=exp(-r*r*35.);
  float ray=exp(-abs(p.y)*190.)*exp(-abs(p.x)*4.4);
  vec3 warm=mix(vec3(1.,.2,.018),vec3(.3,.62,1.),uHeat);
  vec3 color=warm*glow*1.1+vec3(.75,.9,1.)*(bloom*.7+ray*.5)*uFlash;
  gl_FragColor=vec4(color,uOpacity);
${de}
}`,xa=`
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
}`,ya=`
${ne}
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
${de}
}`,wa=`
attribute float aHeat;attribute float aAlong;
uniform float uRadius;uniform float uTime;
varying float vHeat;varying float vAlong;
void main(){
  vHeat=aHeat;vAlong=aAlong;
  vec3 p=position*uRadius;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
}`,ba=`
${ne}
uniform float uOpacity;uniform float uTime;varying float vHeat;varying float vAlong;
void main(){
  float threads=.55+.45*sin(vAlong*93.+vHeat*37.);
  float alpha=uOpacity*threads*smoothstep(0.,.12,vAlong)*(1.-smoothstep(.82,1.,vAlong));
  vec3 color=gasColor(vHeat)*1.8+vec3(.15,.085,.012);
  gl_FragColor=vec4(color,alpha);
${de}
}`,Ma=`
attribute float aSize;attribute float aSeed;
uniform float uRadius;uniform float uOpacity;
varying float vAlpha;varying float vHeat;
void main(){
  vec3 p=position*uRadius;vec4 view=modelViewMatrix*vec4(p,1.);
  gl_Position=projectionMatrix*view;
  gl_PointSize=clamp(aSize*440./max(40.,-view.z),1.,5.);
  vAlpha=uOpacity;vHeat=aSeed;
}`,Ta=`
${ne}
varying float vAlpha;varying float vHeat;
void main(){
  float r=length(gl_PointCoord-.5)*2.;float alpha=exp(-r*r*4.)*(1.-smoothstep(.5,1.,r));
  gl_FragColor=vec4(gasColor(vHeat)*2.,alpha*vAlpha);
${de}
}`;function se(a,e,o={}){return new Q({vertexShader:a,fragmentShader:e,uniforms:{uTime:{value:0},uOpacity:{value:1},...o},transparent:!0,forceSinglePass:!0,depthWrite:!1,blending:te})}function We(a){const e=a()*2-1,o=a()*Math.PI*2,s=Math.sqrt(1-e*e);return new I(s*Math.cos(o),e*.83,s*Math.sin(o))}function Sa(a,e){const o=[],s=[],u=[],n=[],h=a?66:125,d=new I(0,1,0),v=new I,A=new I,E=new I,x=(m,T,y,S,p)=>{A.subVectors(T,m).normalize(),E.crossVectors(A,d).normalize().multiplyScalar(y);const c=new I().crossVectors(A,E).normalize().multiplyScalar(y);for(let F=0;F<3;F++){const i=F/3*Math.PI*2,r=(F+1)/3*Math.PI*2,l=E.clone().multiplyScalar(Math.cos(i)).addScaledVector(c,Math.sin(i)),M=E.clone().multiplyScalar(Math.cos(r)).addScaledVector(c,Math.sin(r));for(const[f,w,t]of[[m,l,p],[T,l,p+.065],[T,M,p+.065],[m,l,p],[T,M,p+.065],[m,M,p]])v.copy(f).add(w),o.push(v.x,v.y,v.z),s.push(S),u.push(t)}};for(let m=0;m<h;m++){const T=We(e),y=We(e),S=.25+e()*.4,p=.19+e()*.32,c=e()*Math.PI*2,F=e(),i=55e-5+e()*.0013;let r;for(let l=0;l<=14;l++){const M=l/14,f=S+M*p,w=T.clone().multiplyScalar(f);w.addScaledVector(y,Math.sin(M*3.6+c)*.052),w.y+=Math.sin(M*8.4+c)*.014,r&&x(r,w,i*(.95-M*.6),F,M*.88),r=w,l%3===0&&n.push({center:w.clone(),heat:F})}}const _=new Se;return _.setAttribute("position",new Me(o,3)),_.setAttribute("aHeat",new Me(s,1)),_.setAttribute("aAlong",new Me(u,1)),{geometry:_,centers:n}}function Ca(a,e){const o=new ue(1,1),s=new Gt;s.index=o.index,s.attributes.position=o.attributes.position,s.attributes.uv=o.attributes.uv;const u=new Float32Array(a.length*3),n=new Float32Array(a.length),h=new Float32Array(a.length);return a.forEach(({center:d},v)=>{u.set([d.x,d.y,d.z],v*3),n[v]=.07+e()*.17,h[v]=e()}),s.setAttribute("aCenter",new je(u,3)),s.setAttribute("aSize",new je(n,1)),s.setAttribute("aSeed",new je(h,1)),s.instanceCount=a.length,s}const le=(a,e,o)=>X.smoothstep(o,a,e),St=a=>Math.pow(Math.max(0,(a-.36)/.64),.67);function gt(a){return 34+St(X.clamp(a,0,1))*720}function _a(a=!1){const e=new ae,o=Ye(19870223),s=new fe(1,a?64:104,a?40:64),u=[],n=(r,l,M=P)=>{const f=new M(r,l);return f.frustumCulled=!1,e.add(f),u.push(l),f},h=n(s,se(da,va,{uRadius:{value:52},uHeat:{value:0}})),d=n(new ue(1,1),se(ma,ga,{uFlash:{value:0},uHeat:{value:0}}));d.renderOrder=5;const v=[];for(let r=0;r<2;r++){const l=n(s,se(vt,mt,{uRadius:{value:0},uLayer:{value:r*1.37},uShock:{value:0}}));l.material.side=Te,l.rotation.set(r*.8,r*1.1,r*.45),v.push(l)}const A=n(s,se(vt,mt,{uRadius:{value:0},uLayer:{value:5.2},uShock:{value:1}}));A.material.side=Te;const{geometry:E,centers:x}=Sa(a,o),_=n(E,se(wa,ba,{uRadius:{value:0}})),m=n(Ca(x,o),se(xa,ya,{uRadius:{value:0}})),T=a?1700:4800,y=new Float32Array(T*3),S=new Float32Array(T),p=new Float32Array(T);for(let r=0;r<T;r++){const l=We(o).multiplyScalar(.28+Math.pow(o(),.6)*.83);y.set([l.x,l.y,l.z],r*3),S[r]=.6+Math.pow(o(),3)*2.6,p[r]=o()}const c=new Se;c.setAttribute("position",new oe(y,3)),c.setAttribute("aSize",new oe(S,1)),c.setAttribute("aSeed",new oe(p,1));const F=n(c,se(Ma,Ta,{uRadius:{value:0}}),Qe);function i(r,l,M){const f=X.clamp(r,0,1),w=le(.21,.36,f),t=St(f),z=Math.exp(-Math.pow((f-.377)/.026,2)),g=le(.36,.435,f),R=1-le(.36,.405,f),O=1-le(.88,1,f)*.25;for(const b of u)b.uniforms.uTime.value=l;h.material.uniforms.uRadius.value=54+t*120,h.material.uniforms.uHeat.value=Math.max(w,g),h.material.uniforms.uOpacity.value=R,h.visible=R>0,d.quaternion.copy(M.quaternion),d.scale.setScalar(410+z*1350),d.material.uniforms.uHeat.value=w,d.material.uniforms.uFlash.value=z*3,d.material.uniforms.uOpacity.value=.75-g*.4+z*1.8,v.forEach((b,D)=>{b.material.uniforms.uRadius.value=(30+t*595)*(1-D*.105),b.material.uniforms.uOpacity.value=g*O*(D===0?1:.55),b.visible=g>.001}),A.material.uniforms.uRadius.value=gt(f),A.material.uniforms.uOpacity.value=g*(1-le(.52,1,f)*.7),A.visible=g>.001,_.material.uniforms.uRadius.value=30+t*655,_.material.uniforms.uOpacity.value=g*O*.67,_.visible=g>.001,m.material.uniforms.uRadius.value=30+t*655,m.material.uniforms.uOpacity.value=g*O*.8,m.visible=g>.001,F.material.uniforms.uRadius.value=28+t*760,F.material.uniforms.uOpacity.value=g*(1-le(.55,1,f)*.55),F.visible=g>.001}return{group:e,update:i,screenRadius:gt}}const Ce=`
#include <tonemapping_fragment>
#include <colorspace_fragment>
`,Pa=`
varying vec2 vUv; varying vec3 vPosition;
void main(){vUv=uv;vPosition=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
`,Ra=`
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
  ${Ce}
}`,Ea=`
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
  ${Ce}
}`,Fa=`
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
  ${Ce}
}`,Aa=`
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
  ${Ce}
}`;function Fe(a){return new Q({vertexShader:Pa,fragmentShader:a,uniforms:{uTime:{value:0},uOpacity:{value:0},uHeat:{value:0},uFlash:{value:0}},transparent:!0,depthWrite:!1,blending:te,side:Te,forceSinglePass:!0})}const ee=(a,e,o)=>X.smoothstep(a,e,o);function Oa(a){const e=new ae,o=new ae;o.rotation.set(.16,.12,-.52),e.add(o);const s=new P(new bt(2,115,a?96:160,8),Fe(Ea));s.rotation.x=1.13,o.add(s);const u=new P(new fe(7,24,16),Fe(Fa));o.add(u);const n=new P(new ue(540,540),Fe(Aa));e.add(n);const h=new W(50,2.5,690,a?20:32,64,!0);h.translate(0,345,0);const d=new W(5,.7,650,12,20,!0);d.translate(0,325,0);const v=[];for(const c of[-1,1])for(const F of[h,d]){const i=new P(F,Fe(Ra));c<0&&(i.rotation.z=Math.PI),o.add(i),v.push(i)}const A=Ye(1963),E=a?350:850,x=new Float32Array(E*3),_=new Float32Array(E);for(let c=0;c<E;c++){const F=A()*Math.PI*2,i=Math.sqrt(A());x.set([Math.cos(F)*i,c%2?1:-1,Math.sin(F)*i],c*3),_[c]=A()}const m=new Se;m.setAttribute("position",new oe(x,3)),m.setAttribute("aSeed",new oe(_,1));const T=new Q({uniforms:{uLaunch:{value:-1},uOpacity:{value:0},uFront:{value:0}},transparent:!0,depthWrite:!1,blending:te,vertexShader:`attribute float aSeed;uniform float uLaunch,uOpacity,uFront;varying float vAlpha;
    void main(){
      float age=uLaunch-aSeed*1.4;
      float t=mod(max(0.,age),4.2)/4.2;
      vec3 p=vec3(position.x*(2.+t*37.),position.y*t*690.,position.z*(2.+t*37.));
      vec4 view=modelViewMatrix*vec4(p,1.);
      gl_Position=projectionMatrix*view;
      gl_PointSize=clamp(900./max(100.,-view.z),1.,3.);
      vAlpha=sin(t*3.14159)*uOpacity*step(0.,age)*(1.-smoothstep(uFront-.025,uFront,t));
    }`,fragmentShader:`varying float vAlpha;void main(){float r=length(gl_PointCoord-.5)*2.;gl_FragColor=vec4(.4,.78,1.4,exp(-r*r*5.)*vAlpha);${Ce}}`}),y=new Qe(m,T);y.frustumCulled=!1,o.add(y);let S=null,p=0;return{group:e,update(c,F,i,r=!1,l=1){i<=0&&(S=null),c<p&&(S=null),i>0&&S===null&&(S=c),p=c;const M=i>0,f=r?8:S===null?0:c-S,w=M?ee(i,0,.07)*X.clamp(l,0,1):0,t=ee(f,.25,2.3),z=M&&!r?ee(f,1.9,2.12)*(1-ee(f,2.12,2.52)):0,g=M?ee(f,0,4.25):0,R=M?ee(f,2.08,4.25):0,O=w*ee(f,2.08,2.5);n.quaternion.copy(F.quaternion),u.scale.setScalar(.65+t*.35+z*.14),u.rotation.y=c*.12,s.scale.setScalar(1.32-ee(f,0,1.95)*.32),s.rotation.z=c*(.035+t*.065);for(const[b,D]of[[s,w*(.35+t*.65)],[u,w],[n,w*(.3+t*.7)]])b.material.uniforms.uTime.value=c,b.material.uniforms.uOpacity.value=D,b.material.uniforms.uHeat.value=t,b.material.uniforms.uFlash.value=z;for(const b of v)b.visible=R>1e-4,b.scale.set(.4+Math.sqrt(R)*.6,R,.4+Math.sqrt(R)*.6),b.material.uniforms.uTime.value=c,b.material.uniforms.uOpacity.value=O;return y.visible=R>.001,T.uniforms.uLaunch.value=r?8:f-2.08,T.uniforms.uOpacity.value=O,T.uniforms.uFront.value=R,{light:w*(.035+t*.65+z*.2),flash:z*w,ignition:g}}}}const $e=a=>a<0?0:a>1?1:a,V=(a,e,o)=>$e((a-e)/(o-e));function za(a,e=256){const o=document.createElement("canvas");o.width=o.height=e;const s=o.getContext("2d"),u=s.createRadialGradient(e/2,e/2,0,e/2,e/2,e/2);a.forEach(([h,d])=>u.addColorStop(h,d)),s.fillStyle=u,s.fillRect(0,0,e,e);const n=new Wt(o);return n.colorSpace=Mt,n}function Ua(a,e,o=1,s=!0){const u=new $t(new qt({map:a,blending:te,depthWrite:!1,depthTest:!0,transparent:!0,opacity:o,fog:s}));return u.scale.set(e,e,1),u}const _e=`
float hash(vec3 p) { p = fract(p * .3183099 + vec3(.1,.2,.3)); p *= 17.; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float noise3(vec3 p) {
  vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
    mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
}
float fbm(vec3 p) { float v=0., a=.5; for(int i=0;i<5;i++){ v+=a*noise3(p); p=p*2.03+vec3(17.1,9.2,13.7); a*=.48; } return v; }
`,La=`
varying vec3 vLocal; varying vec3 vWorld; varying vec3 vNormal; varying vec2 vUv;
void main(){ vUv=uv; vLocal=position; vWorld=(modelMatrix*vec4(position,1.)).xyz;
 vNormal=normalize(mat3(modelMatrix)*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }
`,Ba=`
${_e}
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
`,Da=`
${_e}
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
`,ka=`
${_e}
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
`,Ha=`
${_e}
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
`,xt=`
${_e}
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
`;function ce(a,e={},o={}){return new Q({vertexShader:La,fragmentShader:a,uniforms:{uTime:{value:0},...e},...o})}function Ia(a,e){const o=[],s=new P(new fe(6200,32,20),ce(Ba,{uTravel:{value:0}},{side:Kt,depthWrite:!1}));s.renderOrder=-10,a.add(s),o.push(s.material);const u=Ye(1977),n=e?2800:7200,h=new Float32Array(n*3),d=new Float32Array(n*3),v=new Float32Array(n);for(let g=0;g<n;g++){h.set([(u()-.5)*6500,(u()-.5)*4100,800-u()*8500],g*3);const R=u(),O=.25+Math.pow(u(),3)*1.6;d.set([O*(R>.7?1:.72),O*(R>.7?.77:.84),O*(R>.7?.51:1)],g*3),v[g]=.65+Math.pow(u(),7)*2.4}const A=new Se;A.setAttribute("position",new oe(h,3)),A.setAttribute("color",new oe(d,3)),A.setAttribute("aSize",new oe(v,1));const E=new Qe(A,new Q({uniforms:{uPixelRatio:{value:1},uTime:{value:0}},vertexShader:`attribute float aSize; varying vec3 vColor; uniform float uPixelRatio; uniform float uTime;
    void main(){vec4 p=modelViewMatrix*vec4(position,1.); vColor=color;
    gl_PointSize=clamp(aSize*(600./max(300.,-p.z)),.65,3.5)*uPixelRatio;
    gl_Position=projectionMatrix*p;}`,fragmentShader:`varying vec3 vColor; void main(){float r=length(gl_PointCoord-.5)*2.;
    float a=exp(-r*r*4.)*(1.-smoothstep(.65,1.,r)); gl_FragColor=vec4(vColor,a);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    }`,vertexColors:!0,transparent:!0,depthWrite:!1,blending:te}));a.add(E);const x=new ae;x.position.set(190,25,-180),x.rotation.z=.3;const _=new P(new fe(170,96,64),ce(Da,{uOpacity:{value:1}},{transparent:!0}));x.add(_),o.push(_.material),e&&x.position.set(80,150,-180);const m=new P(new bt(207,390,256,1),ce(ka,{uInner:{value:207},uOuter:{value:390},uOpacity:{value:1},uPlanetCenter:{value:x.position}},{side:Te,transparent:!0,depthWrite:!1}));m.rotation.x=-Math.PI/2+.17,x.add(m),a.add(x);const{group:T}=pa();T.scale.setScalar(.69),a.add(T),a.add(new Qt(11060713,4600095,1.8));const y=new ut(16770493,3.3);y.position.set(-350,260,400),a.add(y);const S=new ut(7780095,2.5);S.position.set(350,-100,-600),a.add(S);const p=za([[0,"rgba(235,249,255,1)"],[.045,"rgba(151,208,255,.9)"],[.2,"rgba(72,139,255,.18)"],[1,"rgba(0,0,0,0)"]]),c=_a(e),F=c.group;F.position.set(e?35:170,25,-1050),a.add(F);const i=new P(new ue(1100,950),ce(xt,{uKind:{value:0},uOpacity:{value:1},uVariant:{value:0}},{transparent:!0,depthWrite:!1,blending:te}));i.position.set(e?35:180,0,-1750),a.add(i),o.push(i.material);const r=Ua(p,170,.9,!1);r.position.copy(i.position),a.add(r);function l(g,R,O,b){const D=new P(new ue(g,g),ce(Ha,{uOpacity:{value:1}},{transparent:!0,depthWrite:!1}));return D.position.set(e?R*.22:R,O,b),a.add(D),o.push(D.material),D}const M=l(720,165,30,-2410),f=Oa(e),w=f.group;w.position.set(e?75:235,30,-3090),a.add(w);const t=new ae;a.add(t);const z=[];return[[230,70,-4050,850,.32],[-370,190,-4470,540,-.5],[560,-180,-4490,650,.8],[-150,-80,-4940,1150,-.1]].forEach(([g,R,O,b,D],Z)=>{const J=new P(new ue(b,b*[.72,.46,.95,.58][Z]),ce(xt,{uKind:{value:1},uOpacity:{value:.95},uVariant:{value:Z}},{transparent:!0,depthWrite:!1,blending:te}));J.position.set(e?g*.55:g,R,O),J.rotation.z=D,t.add(J),o.push(J.material),z.push(J.material)}),{sky:s,stars:E,planet:x,body:_,rings:m,probe:T,nova:F,supernova:c,remnant:i,pulsar:r,blackHole:M,quasar:w,quasarSystem:f,galaxies:t,galaxyMaterials:z,updateTime(g){o.forEach(R=>{R.uniforms.uTime.value=g})},dispose(){const g=new Set,R=new Set,O=new Set([p]);a.traverse(b=>{b.geometry&&g.add(b.geometry),b.material&&(Array.isArray(b.material)?b.material:[b.material]).forEach(D=>{R.add(D),D.map&&O.add(D.map)})}),g.forEach(b=>b.dispose()),R.forEach(b=>b.dispose()),O.forEach(b=>b.dispose())}}}const Ae={pause:"Pause motion",resume:"Resume motion",fallback:"The voyage is unavailable on this device. All portfolio content is available below.",chapters:["top","now","work","projects","research","stack","education","contact"].map(a=>({id:a}))},qe=a=>Math.max(0,Math.min(1,a)),Na=a=>{const e=qe(a);return e*e*(3-2*e)};function Va(a,e,o=""){const s=j.useRef({report:()=>{}}),u=j.useRef(new WeakSet);return j.useLayoutEffect(()=>{if(!a||matchMedia("(prefers-reduced-motion: reduce)").matches)return;const n=s.current,h=u.current,d=[...document.querySelectorAll(e)],v=[...document.querySelectorAll(o)],A=new Set,E=new Set,x=new Map,_=new Map;let m=null;const T=i=>{i.removeAttribute("data-forge"),i.classList.remove("is-forging"),i.style.removeProperty("--forge-heat"),i.style.removeProperty("--forge-cooling")},y=i=>{clearTimeout(_.get(i)),_.delete(i),x.get(i)?.cancel(),x.delete(i),i.removeAttribute("data-nova-pending"),i.removeAttribute("data-nova-surface"),i.style.removeProperty("--nova-heat"),h.add(i)},S=i=>{if(h.has(i)||x.has(i))return;clearTimeout(_.get(i)),_.delete(i);const r=i.getBoundingClientRect(),l=(m?.x??innerWidth*.8)-(r.left+r.width/2),M=(m?.y??innerHeight*.4)-(r.top+r.height/2),f=Math.hypot(l,M)||1,w=innerWidth<600?32:52;i.setAttribute("data-nova-surface",""),i.style.setProperty("--nova-heat",String(m?.energy??.5));const t=i.animate([{opacity:0,translate:`${l/f*w}px ${M/f*w}px`,scale:"0.975"},{opacity:1,translate:"0px 0px",scale:"1"}],{duration:850,easing:"cubic-bezier(0.16, 1, 0.3, 1)",fill:"both"});x.set(i,t),t.onfinish=()=>y(i)};v.forEach(i=>{h.has(i)||i.getBoundingClientRect().top<innerHeight?h.add(i):i.setAttribute("data-nova-pending","")});const p=new IntersectionObserver(i=>{i.forEach(({target:r,isIntersecting:l})=>{v.includes(r)?l?(E.add(r),!h.has(r)&&!x.has(r)&&_.set(r,setTimeout(()=>S(r),220))):(E.delete(r),clearTimeout(_.get(r)),_.delete(r),x.has(r)&&y(r)):l?A.add(r):(A.delete(r),T(r))})},{threshold:0,rootMargin:"0px 0px -4% 0px"});[...d,...v].forEach(i=>p.observe(i));const c=i=>{const r=i.target.closest(o);r&&y(r)};document.addEventListener("focusin",c);const F=i=>{i.detail?.open&&x.forEach((r,l)=>y(l))};return window.addEventListener("lightgate:change",F),n.report=({active:i,x:r=0,y:l=0,radius:M=0,progress:f=.5,energy:w=1})=>{if(!i||!Number.isFinite(r+l+M)){m=null,d.forEach(T);return}m={x:r,y:l,energy:w};const t=1-Na((f-.7)/.3),z=innerWidth<600?100:170;A.forEach(g=>{const R=g.getBoundingClientRect(),O=Math.hypot(R.left+R.width/2-r,R.top+R.height/2-l),b=Math.exp(-Math.pow((M-O)/z,2))*qe(w)*t;g.setAttribute("data-forge",""),g.classList.add("is-forging"),g.style.setProperty("--forge-heat",b.toFixed(3)),g.style.setProperty("--forge-cooling",(qe(w)*t).toFixed(3))}),E.forEach(S)},()=>{p.disconnect(),document.removeEventListener("focusin",c),window.removeEventListener("lightgate:change",F),_.forEach(clearTimeout),v.forEach(i=>{x.has(i)&&y(i),i.removeAttribute("data-nova-pending")}),d.forEach(T),n.report=()=>{}}},[a,e,o]),s}const ja=["--gravity-x","--gravity-y","--gravity-sx","--gravity-sy","--gravity-angle","--gravity-heat"];function Ga(a){let e=0,o=0;for(let s=a;s;s=s.offsetParent)e+=s.offsetLeft,o+=s.offsetTop,s!==a&&(e+=s.clientLeft,o+=s.clientTop);return{left:e,top:o,width:a.offsetWidth,height:a.offsetHeight}}function Wa(a,e){const o=j.useRef({report:()=>{}});return j.useEffect(()=>{if(!a||matchMedia("(prefers-reduced-motion: reduce)").matches)return;const s=o.current,u=[...document.querySelectorAll(e)],n=new Set,h=new Set,d=new Map;let v=!0,A=!1;const E=y=>{y.removeAttribute("data-ripple"),ja.forEach(S=>y.style.removeProperty(S)),h.delete(y)},x=()=>h.forEach(E),_=new IntersectionObserver(y=>{y.forEach(({target:S,isIntersecting:p})=>{p?n.add(S):(n.delete(S),E(S))})},{rootMargin:"15% 0px"});u.forEach(y=>_.observe(y));const m=()=>{v=!0},T=new ResizeObserver(m);return T.observe(document.documentElement),u.forEach(y=>T.observe(y)),window.addEventListener("resize",m),document.fonts?.ready.then(()=>{A||m()}),s.report=({active:y,x:S,y:p,amplitude:c=0,wavelength:F=120,phase:i=0,energy:r=1})=>{if(!y||!Number.isFinite(S+p+c)){x();return}v&&(u.forEach(f=>d.set(f,Ga(f))),v=!1);const l=Math.max(0,Math.min(1,r));[...n].map(f=>{const w=d.get(f),t=w.left-scrollX+w.width/2-S,z=w.top-scrollY+w.height/2-p,g=Math.hypot(t,z)||1,R=1/(1+g/680),O=Math.sin(g/Math.max(1,F)-i),D=-l*R*(innerWidth<600?11:21)+c*R*O,Z=.024*l*R*O;return{el:f,x:t/g*D,y:z/g*D,sx:1+Z,sy:1-Z,angle:Math.max(-1.05,Math.min(1.05,t/Math.max(180,g)*O*l*.8)),heat:Math.abs(O)*l*R}}).forEach(f=>{const{el:w}=f;w.setAttribute("data-ripple","");const t=w.style,z=w.matches(".research__p, .pub");t.setProperty("--gravity-x",`${z?Math.round(f.x*.4):f.x.toFixed(2)}px`),t.setProperty("--gravity-y",`${z?Math.round(f.y*.4):f.y.toFixed(2)}px`),t.setProperty("--gravity-sx",f.sx.toFixed(4)),t.setProperty("--gravity-sy",f.sy.toFixed(4)),t.setProperty("--gravity-angle",`${f.angle.toFixed(3)}deg`),t.setProperty("--gravity-heat",f.heat.toFixed(3)),h.add(w)})},()=>{A=!0,_.disconnect(),T.disconnect(),window.removeEventListener("resize",m),x(),s.report=()=>{}}},[a,e]),o}const $a="#work h3, #work .entry__date, #work .entry__stack, #projects h3, #projects .flagship__labels, #projects .card__labels",qa="#work .entry",Qa="#research .readout, #research .research__title, #research .research__p, #research .pub, #stack .stack__group",yt=Array.from({length:28},(a,e)=>({angle:e*2.399963,reach:.72+e*17%29/42,depth:.85+e*11%23/21})),Ka=[[0,35,550],[55,60,210],[-40,15,-470],[30,-25,-1170],[-35,45,-1800],[20,-20,-2440],[-35,65,-3130],[80,15,-3650]];function Za({reduced:a,isPhone:e}){const o=j.useRef(null),s=j.useRef(null),[u,n]=j.useState(!1),[h,d]=j.useState(!0),v=j.useRef({paused:!1}),A=j.useRef({wake:()=>{}}),E=Va(h&&!a&&!u,$a,qa),x=Wa(!a&&!u,Qa);j.useEffect(()=>{v.current={paused:u},A.current.wake()},[u]),j.useEffect(()=>{const m=o.current,T=A.current;let y;try{y=new Yt({canvas:m,antialias:!1,powerPreference:"high-performance"})}catch{const U=requestAnimationFrame(()=>d(!1));return()=>cancelAnimationFrame(U)}y.outputColorSpace=Mt,y.toneMapping=wt,y.toneMappingExposure=1.18,y.setClearColor(198156);const S=new Xt,p=new Zt(e?62:48,1,.5,11e3),c=Ia(S,e),F=new Jt(Ka.map(U=>new I(...U)),!1,"catmullrom",.32),i=new ra(y);i.addPass(new na(S,p));const r=new he(new k(1,1),.24,.35,.9);i.addPass(r);const l=new Ge(fa);i.addPass(l);const M=new Ge(ha);i.addPass(M),i.addPass(new ua);const f=s.current,w=[...f.querySelectorAll(".voyage-ejecta")],t={raf:0,last:0,time:0,t:0,target:0,anchors:[],readingBoxes:[],width:1,height:1,dirty:!0,lost:!1,gateOpen:document.documentElement.classList.contains("light-gate-open"),frames:0,totalMs:0,dpr:Math.min(devicePixelRatio||1,e?1.25:1.5)},z=new k,g=new k,R=new k,O=new I,b=new I,D=new I,Z=new ta,J=new ea,Be=()=>{const U=window.scrollY;let L=0;for(let H=0;H<t.anchors.length-1;H++)U>=t.anchors[H]&&(L=H);const B=t.anchors[L]||0,C=t.anchors[L+1]||1;t.target=$e((L+$e((U-B)/Math.max(1,C-B)))/7),t.dirty=!0,!t.raf&&!document.hidden&&!t.lost&&!t.gateOpen&&(t.raf=requestAnimationFrame(ve))},Ct=[...document.querySelectorAll(".section__content, .hero__role, .hero__statement")],De=()=>{t.readingBoxes=Ct.map(L=>{const B=L.getBoundingClientRect();return{left:B.left+scrollX,top:B.top+scrollY,width:B.width,height:B.height}});const U=Math.max(1,document.documentElement.scrollHeight-innerHeight);t.anchors=Ae.chapters.map((L,B)=>B===0?0:Math.min(U,Math.max(0,(document.getElementById(L.id)?.getBoundingClientRect().top||0)+scrollY-72)));for(let L=1;L<8;L++)t.anchors[L]=Math.max(t.anchors[L],t.anchors[L-1]+1);Be()},Pe=()=>{t.width=innerWidth,t.height=innerHeight,y.setPixelRatio(t.dpr),y.setSize(t.width,t.height),i.setPixelRatio(t.dpr),i.setSize(t.width,t.height),c.stars.material.uniforms.uPixelRatio.value=t.dpr,p.aspect=t.width/t.height,p.updateProjectionMatrix(),De()},Xe=U=>{z.set((U.clientX/t.width-.5)*2,(U.clientY/t.height-.5)*2)},Ze=()=>z.set(0,0),Je=new ResizeObserver(De);Je.observe(document.documentElement),window.addEventListener("resize",Pe),window.addEventListener("scroll",Be,{passive:!0}),window.addEventListener("pointermove",Xe,{passive:!0}),document.addEventListener("pointerleave",Ze);let ke=!1;document.fonts?.ready.then(()=>{ke||De()}),Pe(),t.t=t.target;function ve(U){if(t.raf=0,ke||document.hidden||t.lost||t.gateOpen)return;const L=Math.min((U-(t.last||U))/1e3,.05);t.last=U;const B=a||v.current.paused,C=B?t.target:t.t+(t.target-t.t)*(1-Math.exp(-L*14));t.t=C,B||(t.time+=L);const H=t.time;if(!B||t.dirty){t.dirty=!1,F.getPoint(C,p.position),g.lerp(B?R:z,1-Math.exp(-L*2.5)),p.position.x+=g.x*7,p.position.y-=g.y*5,O.set(p.position.x+12+Math.sin(C*9)*16,p.position.y-13,p.position.z-600),p.lookAt(O),p.rotateZ(Math.sin(C*10)*.025),p.fov=(e?62:48)+Math.sin(C*Math.PI)*3,p.updateProjectionMatrix(),c.sky.position.copy(p.position),c.sky.material.uniforms.uTravel.value=C,c.updateTime(H),c.body.rotation.y=H*.012,c.planet.visible=C<.245,c.body.material.uniforms.uOpacity.value=1-V(C,.2,.245),c.rings.material.uniforms.uOpacity.value=1-V(C,.2,.245);const ot=140+Math.sin(C*14)**2*120+C*50,it=ot*Math.tan(X.degToRad(p.fov/2)),_t=e?.5:.65;D.set(p.position.x+it*p.aspect*(_t+Math.sin(C*17)*.18),p.position.y-it*(.37+Math.sin(C*12)*.19),p.position.z-ot),c.probe.position.copy(D),c.probe.position.y+=Math.sin(H*.22)*1.5,J.set(.64+Math.sin(C*8)*.3,.3+C*1.5,-.55+Math.sin(C*12)*.25),Z.setFromEuler(J),c.probe.quaternion.copy(Z),c.probe.scale.setScalar((e?.38:.65)*(1-V(C,.83,1)*.75)),c.probe.visible=C<.96;const K=V(C,.2,.44),ie=V(K,.34,.42)*(1-V(K,.82,1)),Pt=Math.exp(-Math.pow((K-.377)/.027,2));c.nova.visible=C>.16&&C<.48,c.nova.visible&&c.supernova.update(K,H,p),c.remnant.visible=C>.42&&C<.55,c.remnant.material.uniforms.uOpacity.value=V(C,.42,.46)*(1-V(C,.49,.55)),c.pulsar.visible=c.remnant.visible,c.remnant.quaternion.copy(p.quaternion),c.remnant.rotateZ(H*.006),c.pulsar.material.opacity=.7+Math.sin(H*1.4)*.12,c.blackHole.visible=C>.46&&C<.69,c.blackHole.material.uniforms.uOpacity.value=V(C,.46,.51)*(1-V(C,.64,.69)),c.blackHole.quaternion.copy(p.quaternion),c.blackHole.rotateZ(-.12);const st=C>.645&&C<.875,rt=c.quasarSystem.update(H,p,st?V(C,.645,.82):-1,a,1-V(C,.8,.875));c.quasar.visible=st,document.documentElement.style.setProperty("--quasar-light",B?"0":rt.light.toFixed(3)),c.galaxies.visible=C>.755,c.galaxyMaterials.forEach(G=>{G.uniforms.uOpacity.value=V(C,.755,.84)*.95}),r.strength=.2+ie*.12+Pt*.18+(B?0:rt.flash*.14),l.enabled=!1,f.style.setProperty("--event-alpha","0"),f.dataset.event="none";const Ie=V(C,.53,.675),Re=Math.sin(Ie*Math.PI),nt=Ie*18-H*1.2;let me=0,ge=0,xe=0;if(K>0&&K<1){b.copy(c.nova.position).project(p),me=X.clamp((b.x*.5+.5)*t.width,-t.width*.3,t.width*1.3),ge=X.clamp((-b.y*.5+.5)*t.height,-t.height*.3,t.height*1.3);const G=Math.max(240,Math.abs(p.position.z-c.nova.position.z)),N=t.height/(2*Math.tan(X.degToRad(p.fov/2))*G);xe=c.supernova.screenRadius(K)*N,B||(f.dataset.event="supernova",f.style.setProperty("--event-x",`${me.toFixed(1)}px`),f.style.setProperty("--event-y",`${ge.toFixed(1)}px`),f.style.setProperty("--event-radius",`${xe.toFixed(1)}px`),f.style.setProperty("--event-alpha",String(ie*.65)),l.enabled=ie>.01,l.uniforms.uKind.value=1,l.uniforms.uCenter.value.set(me/t.width,1-ge/t.height),l.uniforms.uRadius.value=xe/t.height,l.uniforms.uEnergy.value=ie)}const Rt=!B&&ie>.01;if(w.forEach((G,N)=>{if(!Rt){G.style.opacity="0";return}const $=yt[N],ye=$.angle+H*.014,lt=xe*$.reach;G.style.transform=`translate3d(${(me+Math.cos(ye)*lt).toFixed(1)}px,${(ge+Math.sin(ye)*lt*.76).toFixed(1)}px,0) scale(${$.depth})`,G.style.opacity=String(ie*.68)}),!B&&K>0&&K<1?E.current.report({active:!0,x:me,y:ge,radius:xe,progress:K,energy:ie,time:H}):E.current.report({active:!1}),!B&&Re>.01){b.copy(c.blackHole.position).project(p);const G=(b.x*.5+.5)*t.width,N=(-b.y*.5+.5)*t.height;l.enabled=!0,l.uniforms.uKind.value=2,l.uniforms.uCenter.value.set(G/t.width,1-N/t.height),l.uniforms.uEnergy.value=Re,l.uniforms.uPhase.value=nt,x.current.report({active:!0,x:G,y:N,amplitude:Re*(e?11:22),wavelength:t.height/29,phase:nt,progress:Ie,energy:Re,time:H})}else x.current.report({active:!1});if(l.uniforms.uAspect.value=p.aspect,M.enabled=!0,M.enabled){const G=t.readingBoxes.filter(N=>N.top+N.height>scrollY-90&&N.top<scrollY+t.height+90).slice(0,3);M.uniforms.uFeather.value.set(85/t.width,64/t.height);for(let N=0;N<3;N++){const $=G[N],ye=M.uniforms[`uRect${N}`].value;$?ye.set(($.left-scrollX-96)/t.width,1-($.top-scrollY+$.height+80)/t.height,($.left-scrollX+$.width+96)/t.width,1-($.top-scrollY-80)/t.height):ye.set(-2,-2,-2,-2)}}i.render(),m.dataset.ready="true",!B&&L>0&&(t.frames++,t.totalMs+=L*1e3,t.frames===120&&(t.totalMs/120>22&&t.dpr>.8&&(t.dpr=Math.max(.8,t.dpr-.25),Pe()),t.frames=0,t.totalMs=0))}!B&&!t.raf&&(t.raf=requestAnimationFrame(ve))}T.wake=()=>{t.dirty=!0,t.last=0,!t.raf&&!document.hidden&&!t.gateOpen&&(t.raf=requestAnimationFrame(ve))};const He=()=>{cancelAnimationFrame(t.raf),t.last=0,!document.hidden&&!t.gateOpen&&(t.dirty=!0,t.raf=requestAnimationFrame(ve))},et=U=>{t.gateOpen=!!U.detail?.open,cancelAnimationFrame(t.raf),t.raf=0,t.last=0,t.gateOpen?(E.current.report({active:!1}),x.current.report({active:!1}),document.documentElement.style.setProperty("--quasar-light","0"),f.style.setProperty("--event-alpha","0")):T.wake()};window.addEventListener("lightgate:change",et);const tt=U=>{U.preventDefault(),t.lost=!0,document.documentElement.style.setProperty("--quasar-light","0"),cancelAnimationFrame(t.raf),t.raf=0,E.current.report({active:!1}),x.current.report({active:!1}),f.style.setProperty("--event-alpha","0"),w.forEach(L=>{L.style.opacity="0"}),d(!1)},at=()=>{t.lost=!1,t.dirty=!0,d(!0),He()};return document.addEventListener("visibilitychange",He),m.addEventListener("webglcontextlost",tt),m.addEventListener("webglcontextrestored",at),t.raf||(t.raf=requestAnimationFrame(ve)),()=>{ke=!0,document.documentElement.style.removeProperty("--quasar-light"),T.wake=()=>{},cancelAnimationFrame(t.raf),Je.disconnect(),window.removeEventListener("resize",Pe),window.removeEventListener("lightgate:change",et),window.removeEventListener("scroll",Be),window.removeEventListener("pointermove",Xe),document.removeEventListener("pointerleave",Ze),document.removeEventListener("visibilitychange",He),m.removeEventListener("webglcontextlost",tt),m.removeEventListener("webglcontextrestored",at),c.dispose(),r.dispose(),i.passes.forEach(U=>{U!==r&&U.dispose?.()}),i.dispose(),y.dispose()}},[a,e,E,x]);const _=document.getElementById("motion-control");return q.jsxs(q.Fragment,{children:[q.jsx("canvas",{ref:o,className:"voyage","aria-hidden":"true"}),q.jsx("div",{className:"voyage-scrim","aria-hidden":"true"}),q.jsx("div",{className:"voyage-vignette","aria-hidden":"true"}),q.jsxs("div",{className:"voyage-effects",ref:s,"aria-hidden":"true",children:[q.jsx("div",{className:"voyage-front"}),yt.map((m,T)=>q.jsx("i",{className:"voyage-ejecta"},T))]}),h&&!a&&_&&Et.createPortal(q.jsx("button",{className:"voyage-motion",type:"button","aria-label":u?Ae.resume:Ae.pause,"aria-pressed":u,onClick:()=>n(m=>!m),children:q.jsx("span",{"aria-hidden":"true",children:u?"▷":"Ⅱ"})}),_),!h&&q.jsx("p",{className:"visually-hidden",role:"status",children:Ae.fallback})]})}export{Za as default};
