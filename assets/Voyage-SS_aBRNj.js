import{r as G,j as z,v as ee,s as Ft}from"./index-BT664e_i.js";import{M as R,O as zt,B as Qe,F as ze,S as ie,U as $e,V as $,W as He,H as Ve,N as Ot,C as Lt,a as We,b as W,A as xe,c as Nt,R as kt,d as Ut,e as It,L as Bt,f as Dt,g as jt,h as Mt,i as Ht,j as Vt,G as he,k as Gt,T as et,l as Re,m as ct,n as Le,o as te,p as $t,q as pe,D as qe,P as Oe,r as ye,I as Wt,s as tt,t as ne,u as Tt,v as qt,w as St,x as Qt,y as Kt,z as Xt,E as Yt,J as ut,K as Zt,Q as Jt,X as ea,Y as ta,Z as aa,_ as oa,$ as ia}from"./three-Dkm7W32p.js";const Ct={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class be{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const sa=new zt(-1,1,1,-1,0,1);class ra extends Qe{constructor(){super(),this.setAttribute("position",new ze([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ze([0,2,0,0,2,0],2))}}const na=new ra;class st{constructor(e){this._mesh=new R(na,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,sa)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class _t extends be{constructor(e,i){super(),this.textureID=i!==void 0?i:"tDiffuse",e instanceof ie?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=$e.clone(e.uniforms),this.material=new ie({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new st(this.material)}render(e,i,a){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=a.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(i),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class ft extends be{constructor(e,i){super(),this.scene=e,this.camera=i,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,i,a){const l=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let c,d;this.inverse?(c=0,d=1):(c=1,d=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(l.REPLACE,l.REPLACE,l.REPLACE),r.buffers.stencil.setFunc(l.ALWAYS,c,4294967295),r.buffers.stencil.setClear(d),r.buffers.stencil.setLocked(!0),e.setRenderTarget(a),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(l.EQUAL,1,4294967295),r.buffers.stencil.setOp(l.KEEP,l.KEEP,l.KEEP),r.buffers.stencil.setLocked(!0)}}class la extends be{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class ca{constructor(e,i){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),i===void 0){const a=e.getSize(new $);this._width=a.width,this._height=a.height,i=new He(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Ve}),i.texture.name="EffectComposer.rt1"}else this._width=i.width,this._height=i.height;this.renderTarget1=i,this.renderTarget2=i.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new _t(Ct),this.copyPass.material.blending=Ot,this.clock=new Lt}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,i){this.passes.splice(i,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const i=this.passes.indexOf(e);i!==-1&&this.passes.splice(i,1)}isLastEnabledPass(e){for(let i=e+1;i<this.passes.length;i++)if(this.passes[i].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const i=this.renderer.getRenderTarget();let a=!1;for(let l=0,r=this.passes.length;l<r;l++){const c=this.passes[l];if(c.enabled!==!1){if(c.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(l),c.render(this.renderer,this.writeBuffer,this.readBuffer,e,a),c.needsSwap){if(a){const d=this.renderer.getContext(),m=this.renderer.state.buffers.stencil;m.setFunc(d.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),m.setFunc(d.EQUAL,1,4294967295)}this.swapBuffers()}ft!==void 0&&(c instanceof ft?a=!0:c instanceof la&&(a=!1))}}this.renderer.setRenderTarget(i)}reset(e){if(e===void 0){const i=this.renderer.getSize(new $);this._pixelRatio=this.renderer.getPixelRatio(),this._width=i.width,this._height=i.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,i){this._width=e,this._height=i;const a=this._width*this._pixelRatio,l=this._height*this._pixelRatio;this.renderTarget1.setSize(a,l),this.renderTarget2.setSize(a,l);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(a,l)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class ua extends be{constructor(e,i,a=null,l=null,r=null){super(),this.scene=e,this.camera=i,this.overrideMaterial=a,this.clearColor=l,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new We}render(e,i,a){const l=e.autoClear;e.autoClear=!1;let r,c;this.overrideMaterial!==null&&(c=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:a),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=c),e.autoClear=l}}const fa={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new We(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class we extends be{constructor(e,i,a,l){super(),this.strength=i!==void 0?i:1,this.radius=a,this.threshold=l,this.resolution=e!==void 0?new $(e.x,e.y):new $(256,256),this.clearColor=new We(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),c=Math.round(this.resolution.y/2);this.renderTargetBright=new He(r,c,{type:Ve}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let w=0;w<this.nMips;w++){const T=new He(r,c,{type:Ve});T.texture.name="UnrealBloomPass.h"+w,T.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(T);const S=new He(r,c,{type:Ve});S.texture.name="UnrealBloomPass.v"+w,S.texture.generateMipmaps=!1,this.renderTargetsVertical.push(S),r=Math.round(r/2),c=Math.round(c/2)}const d=fa;this.highPassUniforms=$e.clone(d.uniforms),this.highPassUniforms.luminosityThreshold.value=l,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new ie({uniforms:this.highPassUniforms,vertexShader:d.vertexShader,fragmentShader:d.fragmentShader}),this.separableBlurMaterials=[];const m=[3,5,7,9,11];r=Math.round(this.resolution.x/2),c=Math.round(this.resolution.y/2);for(let w=0;w<this.nMips;w++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(m[w])),this.separableBlurMaterials[w].uniforms.invSize.value=new $(1/r,1/c),r=Math.round(r/2),c=Math.round(c/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=i,this.compositeMaterial.uniforms.bloomRadius.value=.1;const O=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=O,this.bloomTintColors=[new W(1,1,1),new W(1,1,1),new W(1,1,1),new W(1,1,1),new W(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const N=Ct;this.copyUniforms=$e.clone(N.uniforms),this.blendMaterial=new ie({uniforms:this.copyUniforms,vertexShader:N.vertexShader,fragmentShader:N.fragmentShader,blending:xe,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new We,this.oldClearAlpha=1,this.basic=new Nt,this.fsQuad=new st(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,i){let a=Math.round(e/2),l=Math.round(i/2);this.renderTargetBright.setSize(a,l);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(a,l),this.renderTargetsVertical[r].setSize(a,l),this.separableBlurMaterials[r].uniforms.invSize.value=new $(1/a,1/l),a=Math.round(a/2),l=Math.round(l/2)}render(e,i,a,l,r){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const c=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=a.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=a.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let d=this.renderTargetBright;for(let m=0;m<this.nMips;m++)this.fsQuad.material=this.separableBlurMaterials[m],this.separableBlurMaterials[m].uniforms.colorTexture.value=d.texture,this.separableBlurMaterials[m].uniforms.direction.value=we.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[m]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[m].uniforms.colorTexture.value=this.renderTargetsHorizontal[m].texture,this.separableBlurMaterials[m].uniforms.direction.value=we.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[m]),e.clear(),this.fsQuad.render(e),d=this.renderTargetsVertical[m];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(a),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=c}getSeperableBlurMaterial(e){const i=[];for(let a=0;a<e;a++)i.push(.39894*Math.exp(-.5*a*a/(e*e))/e);return new ie({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new $(.5,.5)},direction:{value:new $(.5,.5)},gaussianCoefficients:{value:i}},vertexShader:`varying vec2 vUv;
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
				}`})}getCompositeMaterial(e){return new ie({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}we.BlurDirectionX=new $(1,0);we.BlurDirectionY=new $(0,1);const ha={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class pa extends be{constructor(){super();const e=ha;this.uniforms=$e.clone(e.uniforms),this.material=new kt({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new st(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,i,a){this.uniforms.tDiffuse.value=a.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Ut.getTransfer(this._outputColorSpace)===It&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Bt?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Dt?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===jt?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Mt?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Ht?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Vt&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(i),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const da={uniforms:{tDiffuse:{value:null},uCenter:{value:new $(.5,.5)},uAspect:{value:1},uRadius:{value:0},uEnergy:{value:0},uPhase:{value:0},uKind:{value:0}},vertexShader:`
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
  `};function Pt(o){let e=o>>>0;return function(){e=e+1831565813|0;let a=Math.imul(e^e>>>15,1|e);return a=a+Math.imul(a^a>>>7,61|a)^a,((a^a>>>14)>>>0)/4294967296}}const oe=()=>new pe({color:13225944,metalness:.94,roughness:.3}),ht=()=>new pe({color:15265010,metalness:.36,roughness:.52,side:qe}),pt=()=>new pe({color:14263375,metalness:1,roughness:.22}),dt=()=>new pe({color:11043887,metalness:.85,roughness:.58}),je=()=>new pe({color:1974824,metalness:.5,roughness:.66}),Ae=()=>new pe({color:10134189,metalness:.9,roughness:.38});function ma(){const o=new he,e=12,i=[];for(let f=0;f<=22;f++){const u=f/22*e;i.push(new $(u,u*u/44))}const a=new R(new Gt(i,72),ht());a.position.y=2.2,o.add(a);const l=new R(new et(e,.22,8,72),oe());l.rotation.x=Math.PI/2,l.position.y=2.2+e*e/44,o.add(l);for(let f=0;f<12;f++){const n=f/12*Math.PI*2,u=new R(new Re(.16,.5,e*.95),oe());u.position.set(Math.cos(n)*e*.5,1.6,Math.sin(n)*e*.5),u.rotation.y=-n,o.add(u)}const r=new R(new ct(.85,3.4,16),oe());r.position.y=9.6,r.rotation.x=Math.PI,o.add(r);const c=new R(new Le(1.5,24,16,0,Math.PI*2,0,Math.PI/2.2),ht());c.position.y=11.4,c.rotation.x=Math.PI,o.add(c);for(let f=0;f<3;f++){const n=f/3*Math.PI*2+.4,u=new R(new te(.12,.12,11.2,6),Ae());u.position.set(Math.cos(n)*e*.46,6.4,Math.sin(n)*e*.46),u.lookAt(new W(0,11.2,0)),u.rotateX(Math.PI/2),o.add(u)}const d=new he;d.position.y=-2.6;const m=new R(new te(4.3,4.3,2.4,10),je());d.add(m);for(let f=0;f<10;f++){const n=f/10*Math.PI*2+Math.PI/10,u=new R(new Re(2.5,2.1,.5),f%3===0?dt():oe());u.position.set(Math.cos(n)*4.35,0,Math.sin(n)*4.35),u.rotation.y=-n+Math.PI/2,d.add(u)}const O=new R(new te(4.4,4.4,.35,10),oe());O.position.y=1.35,d.add(O);const N=new R(new et(4.45,.22,8,10),pt());N.rotation.x=Math.PI/2,N.position.y=-1.2,d.add(N);const w=new R(new Le(2.1,24,20),dt());w.position.y=-3.2,d.add(w);const T=new R(new ct(.55,1.3,12),je());T.position.set(0,-5.2,0),d.add(T),o.add(d);const S=new R(new te(.26,.26,12,8),Ae());S.rotation.z=Math.PI/2,S.position.set(-9.5,-3.4,0),o.add(S);for(let f=0;f<3;f++){const n=-13.2-f*3.3,u=new R(new te(1.05,1.05,2.8,14),je());u.rotation.z=Math.PI/2,u.position.set(n,-3.4,0),o.add(u);for(let h=0;h<6;h++){const s=h/6*Math.PI*2,p=new R(new Re(2.6,.08,1.5),oe());p.position.set(n,-3.4+Math.cos(s)*1.4,Math.sin(s)*1.4),p.rotation.x=-s,o.add(p)}}const C=new R(new te(.22,.22,13,8),Ae());C.rotation.z=Math.PI/2,C.position.set(10,-3,0),o.add(C);const E=new R(new Re(2.6,2.2,2.4),je());E.position.set(16.6,-3,0),o.add(E),[[.75,.5],[-.75,-.4]].forEach(([f,n])=>{const u=new R(new te(.42,.5,3.1,14),oe());u.rotation.x=Math.PI/2,u.position.set(16.6+n,-3+f,-2.2),o.add(u);const h=new R(new $t(.42,16),new pe({color:724500,metalness:1,roughness:.1}));h.position.set(16.6+n,-3+f,-3.76),o.add(h)});const M=new he,_=new R(new te(.1,.13,58,6),Ae());_.position.y=29,M.add(_);for(let f=1;f<=3;f++){const n=new R(new Re(.7,.7,.7),oe());n.position.y=f*17,M.add(n)}M.position.set(-3.4,-1.5,3),M.rotation.set(.5,0,.72),o.add(M);const A=new R(new te(1.85,1.85,.16,48),pt());A.position.set(3.6,-2.6,4.2),A.rotation.set(Math.PI/2,0,.2),o.add(A);const g=new R(new et(1.85,.1,8,40),oe());return g.position.copy(A.position),g.rotation.copy(A.rotation),o.add(g),[-1,1].forEach(f=>{const n=new R(new te(.075,.075,40,6),Ae());n.position.set(f*2.2,-4.4,-2),n.rotation.set(-.85,0,f*.55),n.translateY(20),o.add(n)}),{group:o,dish:a,bus:d,magBoom:M}}const de=`
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
`,Me=`
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
`,mt=`
${de}
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
}`,vt=`
${de}
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
${Me}
}`,va=`
${de}
uniform float uTime;uniform float uRadius;
varying vec3 vDirection;varying vec3 vWorld;
void main(){
  vec3 d=normalize(position);vDirection=d;
  float ripple=fbm(d*7.+vec3(uTime*.1,0.,uTime*.035));
  vec3 p=d*uRadius*(.93+ripple*.16);vWorld=(modelMatrix*vec4(p,1.)).xyz;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
}`,ga=`
${de}
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
${Me}
}`,xa=`
varying vec2 vUv;
void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
`,ya=`
uniform float uFlash;uniform float uOpacity;uniform float uHeat;varying vec2 vUv;
void main(){
  vec2 p=(vUv-.5)*2.;float r=length(p);
  float glow=exp(-r*8.)*(1.-smoothstep(.7,1.,r));
  float bloom=exp(-r*r*35.);
  float ray=exp(-abs(p.y)*190.)*exp(-abs(p.x)*4.4);
  vec3 warm=mix(vec3(1.,.2,.018),vec3(.3,.62,1.),uHeat);
  vec3 color=warm*glow*1.1+vec3(.75,.9,1.)*(bloom*.7+ray*.5)*uFlash;
  gl_FragColor=vec4(color,uOpacity);
${Me}
}`,wa=`
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
}`,ba=`
${de}
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
${Me}
}`,Ma=`
attribute float aHeat;attribute float aAlong;
uniform float uRadius;uniform float uTime;
varying float vHeat;varying float vAlong;
void main(){
  vHeat=aHeat;vAlong=aAlong;
  vec3 p=position*uRadius;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
}`,Ta=`
${de}
uniform float uOpacity;uniform float uTime;varying float vHeat;varying float vAlong;
void main(){
  float threads=.55+.45*sin(vAlong*93.+vHeat*37.);
  float alpha=uOpacity*threads*smoothstep(0.,.12,vAlong)*(1.-smoothstep(.82,1.,vAlong));
  vec3 color=gasColor(vHeat)*1.8+vec3(.15,.085,.012);
  gl_FragColor=vec4(color,alpha);
${Me}
}`,Sa=`
attribute float aSize;attribute float aSeed;
uniform float uRadius;uniform float uOpacity;
varying float vAlpha;varying float vHeat;
void main(){
  vec3 p=position*uRadius;vec4 view=modelViewMatrix*vec4(p,1.);
  gl_Position=projectionMatrix*view;
  gl_PointSize=clamp(aSize*440./max(40.,-view.z),1.,5.);
  vAlpha=uOpacity;vHeat=aSeed;
}`,Ca=`
${de}
varying float vAlpha;varying float vHeat;
void main(){
  float r=length(gl_PointCoord-.5)*2.;float alpha=exp(-r*r*4.)*(1.-smoothstep(.5,1.,r));
  gl_FragColor=vec4(gasColor(vHeat)*2.,alpha*vAlpha);
${Me}
}`;function fe(o,e,i={}){return new ie({vertexShader:o,fragmentShader:e,uniforms:{uTime:{value:0},uOpacity:{value:1},...i},transparent:!0,forceSinglePass:!0,depthWrite:!1,blending:xe})}function ot(o){const e=o()*2-1,i=o()*Math.PI*2,a=Math.sqrt(1-e*e);return new W(a*Math.cos(i),e*.83,a*Math.sin(i))}function _a(o,e){const i=[],a=[],l=[],r=[],c=o?66:125,d=new W(0,1,0),m=new W,O=new W,N=new W,w=(S,C,E,M,_)=>{O.subVectors(C,S).normalize(),N.crossVectors(O,d).normalize().multiplyScalar(E);const A=new W().crossVectors(O,N).normalize().multiplyScalar(E);for(let g=0;g<3;g++){const f=g/3*Math.PI*2,n=(g+1)/3*Math.PI*2,u=N.clone().multiplyScalar(Math.cos(f)).addScaledVector(A,Math.sin(f)),h=N.clone().multiplyScalar(Math.cos(n)).addScaledVector(A,Math.sin(n));for(const[s,p,v]of[[S,u,_],[C,u,_+.065],[C,h,_+.065],[S,u,_],[C,h,_+.065],[S,h,_]])m.copy(s).add(p),i.push(m.x,m.y,m.z),a.push(M),l.push(v)}};for(let S=0;S<c;S++){const C=ot(e),E=ot(e),M=.25+e()*.4,_=.19+e()*.32,A=e()*Math.PI*2,g=e(),f=55e-5+e()*.0013;let n;for(let u=0;u<=14;u++){const h=u/14,s=M+h*_,p=C.clone().multiplyScalar(s);p.addScaledVector(E,Math.sin(h*3.6+A)*.052),p.y+=Math.sin(h*8.4+A)*.014,n&&w(n,p,f*(.95-h*.6),g,h*.88),n=p,u%3===0&&r.push({center:p.clone(),heat:g})}}const T=new Qe;return T.setAttribute("position",new ze(i,3)),T.setAttribute("aHeat",new ze(a,1)),T.setAttribute("aAlong",new ze(l,1)),{geometry:T,centers:r}}function Pa(o,e){const i=new Oe(1,1),a=new Wt;a.index=i.index,a.attributes.position=i.attributes.position,a.attributes.uv=i.attributes.uv;const l=new Float32Array(o.length*3),r=new Float32Array(o.length),c=new Float32Array(o.length);return o.forEach(({center:d},m)=>{l.set([d.x,d.y,d.z],m*3),r[m]=.07+e()*.17,c[m]=e()}),a.setAttribute("aCenter",new tt(l,3)),a.setAttribute("aSize",new tt(r,1)),a.setAttribute("aSeed",new tt(c,1)),a.instanceCount=o.length,a}const Fe=(o,e,i)=>ne.smoothstep(i,o,e),Et=o=>Math.pow(Math.max(0,(o-.36)/.64),.67);function gt(o){return 34+Et(ne.clamp(o,0,1))*720}function Ea(o=!1){const e=new he,i=Pt(19870223),a=new Le(1,o?64:104,o?40:64),l=[],r=(n,u,h=R)=>{const s=new h(n,u);return s.frustumCulled=!1,e.add(s),l.push(u),s},c=r(a,fe(va,ga,{uRadius:{value:52},uHeat:{value:0}})),d=r(new Oe(1,1),fe(xa,ya,{uFlash:{value:0},uHeat:{value:0}}));d.renderOrder=5;const m=[];for(let n=0;n<2;n++){const u=r(a,fe(mt,vt,{uRadius:{value:0},uLayer:{value:n*1.37},uShock:{value:0}}));u.material.side=qe,u.rotation.set(n*.8,n*1.1,n*.45),m.push(u)}const O=r(a,fe(mt,vt,{uRadius:{value:0},uLayer:{value:5.2},uShock:{value:1}}));O.material.side=qe;const{geometry:N,centers:w}=_a(o,i),T=r(N,fe(Ma,Ta,{uRadius:{value:0}})),S=r(Pa(w,i),fe(wa,ba,{uRadius:{value:0}})),C=o?1700:4800,E=new Float32Array(C*3),M=new Float32Array(C),_=new Float32Array(C);for(let n=0;n<C;n++){const u=ot(i).multiplyScalar(.28+Math.pow(i(),.6)*.83);E.set([u.x,u.y,u.z],n*3),M[n]=.6+Math.pow(i(),3)*2.6,_[n]=i()}const A=new Qe;A.setAttribute("position",new ye(E,3)),A.setAttribute("aSize",new ye(M,1)),A.setAttribute("aSeed",new ye(_,1));const g=r(A,fe(Sa,Ca,{uRadius:{value:0}}),Tt);function f(n,u,h){const s=ne.clamp(n,0,1),p=Fe(.21,.36,s),v=Et(s),I=Math.exp(-Math.pow((s-.377)/.026,2)),y=Fe(.36,.435,s),B=1-Fe(.88,1,s)*.25;for(const b of l)b.uniforms.uTime.value=u;c.material.uniforms.uRadius.value=s<.36?ne.lerp(54+Math.sin(u*1.1)*1.1,14,p):8+Math.exp(-v*13)*22,c.material.uniforms.uHeat.value=Math.max(p,y),c.material.uniforms.uOpacity.value=s<.36?1:.72,d.quaternion.copy(h.quaternion),d.scale.setScalar(s<.36?410-p*180:230+I*1350),d.material.uniforms.uHeat.value=p,d.material.uniforms.uFlash.value=I*3,d.material.uniforms.uOpacity.value=s<.36?.75:.35+I*1.8,m.forEach((b,t)=>{b.material.uniforms.uRadius.value=(30+v*595)*(1-t*.105),b.material.uniforms.uOpacity.value=y*B*(t===0?1:.55),b.visible=y>.001}),O.material.uniforms.uRadius.value=gt(s),O.material.uniforms.uOpacity.value=y*(1-Fe(.52,1,s)*.7),O.visible=y>.001,T.material.uniforms.uRadius.value=30+v*655,T.material.uniforms.uOpacity.value=y*B*.67,T.visible=y>.001,S.material.uniforms.uRadius.value=30+v*655,S.material.uniforms.uOpacity.value=y*B*.8,S.visible=y>.001,g.material.uniforms.uRadius.value=28+v*760,g.material.uniforms.uOpacity.value=y*(1-Fe(.55,1,s)*.55),g.visible=y>.001}return{group:e,update:f,screenRadius:gt}}const it=o=>o<0?0:o>1?1:o,Y=(o,e,i)=>it((o-e)/(i-e));function xt(o,e=256){const i=document.createElement("canvas");i.width=i.height=e;const a=i.getContext("2d"),l=a.createRadialGradient(e/2,e/2,0,e/2,e/2,e/2);o.forEach(([c,d])=>l.addColorStop(c,d)),a.fillStyle=l,a.fillRect(0,0,e,e);const r=new qt(i);return r.colorSpace=St,r}function at(o,e,i=1,a=!0){const l=new Qt(new Kt({map:o,blending:xe,depthWrite:!1,depthTest:!0,transparent:!0,opacity:i,fog:a}));return l.scale.set(e,e,1),l}const Ne=`
float hash(vec3 p) { p = fract(p * .3183099 + vec3(.1,.2,.3)); p *= 17.; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float noise3(vec3 p) {
  vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
    mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
}
float fbm(vec3 p) { float v=0., a=.5; for(int i=0;i<5;i++){ v+=a*noise3(p); p=p*2.03+vec3(17.1,9.2,13.7); a*=.48; } return v; }
`,Ra=`
varying vec3 vLocal; varying vec3 vWorld; varying vec3 vNormal; varying vec2 vUv;
void main(){ vUv=uv; vLocal=position; vWorld=(modelMatrix*vec4(position,1.)).xyz;
 vNormal=normalize(mat3(modelMatrix)*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }
`,Aa=`
${Ne}
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
`,Fa=`
${Ne}
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
`,za=`
${Ne}
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
`,Oa=`
${Ne}
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
`,yt=`
${Ne}
varying vec2 vUv; uniform float uTime; uniform float uKind; uniform float uOpacity;
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
   float spiral=angle*2.+log(max(r,.025))*5.5-uTime*.02;
   float lanes=pow(.5+.5*sin(spiral+turbulent*2.),3.);
   float envelope=exp(-r*4.2)*(1.-exp(-r*16.));
   float fine=fbm(vec3(p*47.,2.));
   float arms=lanes*envelope*(.2+fine*.8);
   float dustLane=smoothstep(.45,.72,fbm(vec3(p*18.,5.)));
   vec3 disk=vec3(.21,.36,.62)*arms*.8*(1.-dustLane*.7);
   float stars=pow(hash(vec3(floor(p*430.),3.)),70.)*lanes*envelope;
   col=disk+vec3(.75,.83,1.)*stars*.7+vec3(1.,.69,.35)*exp(-r*24.)*.65;
 }
 float alpha=(1.-smoothstep(.72,1.,r))*uOpacity;
 gl_FragColor=vec4(col,alpha);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}
`;function ge(o,e={},i={}){return new ie({vertexShader:Ra,fragmentShader:o,uniforms:{uTime:{value:0},...e},...i})}function La(o,e){const i=[],a=new R(new Le(6200,32,20),ge(Aa,{uTravel:{value:0}},{side:Zt,depthWrite:!1}));a.renderOrder=-10,o.add(a),i.push(a.material);const l=Pt(1977),r=e?2800:7200,c=new Float32Array(r*3),d=new Float32Array(r*3),m=new Float32Array(r);for(let b=0;b<r;b++){c.set([(l()-.5)*6500,(l()-.5)*4100,800-l()*8500],b*3);const t=l(),L=.25+Math.pow(l(),3)*1.6;d.set([L*(t>.7?1:.72),L*(t>.7?.77:.84),L*(t>.7?.51:1)],b*3),m[b]=.65+Math.pow(l(),7)*2.4}const O=new Qe;O.setAttribute("position",new ye(c,3)),O.setAttribute("color",new ye(d,3)),O.setAttribute("aSize",new ye(m,1));const N=new Tt(O,new ie({uniforms:{uPixelRatio:{value:1},uTime:{value:0}},vertexShader:`attribute float aSize; varying vec3 vColor; uniform float uPixelRatio; uniform float uTime;
    void main(){vec4 p=modelViewMatrix*vec4(position,1.); vColor=color;
    gl_PointSize=clamp(aSize*(600./max(300.,-p.z)),.65,3.5)*uPixelRatio;
    gl_Position=projectionMatrix*p;}`,fragmentShader:`varying vec3 vColor; void main(){float r=length(gl_PointCoord-.5)*2.;
    float a=exp(-r*r*4.)*(1.-smoothstep(.65,1.,r)); gl_FragColor=vec4(vColor,a);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    }`,vertexColors:!0,transparent:!0,depthWrite:!1,blending:xe}));o.add(N);const w=new he;w.position.set(190,25,-180),w.rotation.z=.3;const T=new R(new Le(170,96,64),ge(Fa,{uOpacity:{value:1}},{transparent:!0}));w.add(T),i.push(T.material),e&&w.position.set(80,150,-180);const S=new R(new Xt(207,390,256,1),ge(za,{uInner:{value:207},uOuter:{value:390},uOpacity:{value:1},uPlanetCenter:{value:w.position}},{side:qe,transparent:!0,depthWrite:!1}));S.rotation.x=-Math.PI/2+.17,w.add(S),o.add(w);const{group:C}=ma();C.scale.setScalar(.69),o.add(C),o.add(new Yt(11060713,4600095,1.8));const E=new ut(16770493,3.3);E.position.set(-350,260,400),o.add(E);const M=new ut(7780095,2.5);M.position.set(350,-100,-600),o.add(M);const _=xt([[0,"rgba(235,249,255,1)"],[.045,"rgba(151,208,255,.9)"],[.2,"rgba(72,139,255,.18)"],[1,"rgba(0,0,0,0)"]]),A=Ea(e),g=A.group;g.position.set(e?35:170,25,-1050),o.add(g);const f=new R(new Oe(1100,950),ge(yt,{uKind:{value:0},uOpacity:{value:1}},{transparent:!0,depthWrite:!1,blending:xe}));f.position.set(e?35:180,0,-1750),o.add(f),i.push(f.material);const n=at(_,170,.9,!1);n.position.copy(f.position),o.add(n);function u(b,t,L,F){const q=new R(new Oe(b,b),ge(Oa,{uOpacity:{value:1}},{transparent:!0,depthWrite:!1}));return q.position.set(e?t*.22:t,L,F),o.add(q),i.push(q.material),q}const h=u(720,165,30,-2410),s=u(300,360,90,-2440),p=u(390,130,30,-3050),v=new he;v.position.copy(p.position),v.rotation.z=-.3;const I=xt([[0,"rgba(215,239,255,.95)"],[.08,"rgba(110,173,255,.48)"],[.4,"rgba(42,104,255,.1)"],[1,"rgba(0,0,0,0)"]]);for(const b of[-1,1]){const t=at(I,1,.75,!1);t.scale.set(80,880,1),t.position.y=b*390,v.add(t);const L=at(_,160,.55,!1);L.position.y=b*760,v.add(L)}o.add(v);const y=new he;o.add(y);const B=[];return[[230,70,-4050,850,.32],[-370,190,-4470,540,-.5],[560,-180,-4490,650,.8],[-150,-80,-4940,1150,-.1]].forEach(([b,t,L,F,q])=>{const Q=new R(new Oe(F,F*.72),ge(yt,{uKind:{value:1},uOpacity:{value:.95}},{transparent:!0,depthWrite:!1,blending:xe}));Q.position.set(e?b*.55:b,t,L),Q.rotation.z=q,y.add(Q),i.push(Q.material),B.push(Q.material)}),{sky:a,stars:N,planet:w,body:T,rings:S,probe:C,nova:g,supernova:A,remnant:f,pulsar:n,blackHole:h,companion:s,quasar:p,jetGroup:v,galaxies:y,galaxyMaterials:B,updateTime(b){i.forEach(t=>{t.uniforms.uTime.value=b})},dispose(){const b=new Set,t=new Set,L=new Set([_,I]);o.traverse(F=>{F.geometry&&b.add(F.geometry),F.material&&(Array.isArray(F.material)?F.material:[F.material]).forEach(q=>{t.add(q),q.map&&L.add(q.map)})}),b.forEach(F=>F.dispose()),t.forEach(F=>F.dispose()),L.forEach(F=>F.dispose())}}}const Ge=o=>Math.max(0,Math.min(1,o)),wt=o=>{const e=Ge(o);return e*e*(3-2*e)},Na=["--forge-x","--forge-y","--forge-r","--forge-width","--forge-heat","--forge-cooling"],ka=["--nova-dx","--nova-dy","--nova-scale","--nova-blur","--nova-heat","--matter-origin-x","--matter-origin-y"];function Ua(o){let e=0,i=0;for(let a=o;a;a=a.offsetParent)e+=a.offsetLeft,i+=a.offsetTop,a!==o&&(e+=a.clientLeft,i+=a.clientTop);return{left:e,top:i,width:o.offsetWidth,height:o.offsetHeight}}function Ia(o,e,i=""){const a=G.useRef({report:()=>{}});return G.useEffect(()=>{if(!o||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const l=a.current,r=Array.from(document.querySelectorAll(e)),c=i?Array.from(document.querySelectorAll(i)):[],d=new Set(r),m=new Set(c),O=new Set,N=new Set,w=new Set,T=new Set,S=new Map,C=new Map;let E=!0,M=0;const _=s=>{s.removeAttribute("data-forge"),s.classList.remove("is-forging"),Na.forEach(p=>s.style.removeProperty(p)),w.delete(s)},A=s=>{s.removeAttribute("data-nova-surface"),s.classList.remove("is-nova-matter"),ka.forEach(p=>s.style.removeProperty(p)),T.delete(s)},g=()=>{w.forEach(_),T.forEach(A),C.clear(),M=0},f=new IntersectionObserver(s=>{s.forEach(({target:p,isIntersecting:v})=>{d.has(p)&&(v?O.add(p):(O.delete(p),_(p))),m.has(p)&&(v?N.add(p):(N.delete(p),A(p)))})},{rootMargin:"18% 0px"});new Set([...r,...c]).forEach(s=>f.observe(s));const n=()=>{E=!0},u=new ResizeObserver(n);u.observe(document.documentElement),c.forEach(s=>u.observe(s)),window.addEventListener("resize",n);let h=!1;return document.fonts?.ready.then(()=>{h||n()}),l.report=({active:s,x:p=0,y:v=0,radius:I=0,progress:y=.5,energy:B=1,time:b})=>{if(!s||!Number.isFinite(p+v+I)){g();return}const t=Number.isFinite(b)?b:performance.now()/1e3,L=Ge(B),F=1-wt((y-.7)/.3),q=innerWidth<600,Q=q?100:170,se=window.scrollX,ke=window.scrollY,Te=Array.from(O),Ue=Array.from(N);E&&(c.forEach(P=>S.set(P,Ua(P))),E=!1);const Se=Te.map(P=>P.getBoundingClientRect()),Ce=Ue.map(P=>{const j=S.get(P);if(!j)return null;const D=j.left-se,ae=j.top-ke,re=D+j.width/2-p,K=ae+j.height/2-v,le=Math.hypot(re,K)||1,ce=Math.hypot(Math.max(D-p,0,p-D-j.width),Math.max(ae-v,0,v-ae-j.height))*.65+le*.35;let X=C.get(P);I<M&&I<ce-Q*1.1&&(C.delete(P),X=void 0);const k=wt((I-ce+Q)/Q);!X&&k>0&&(X={prepTime:t,time:null},C.set(P,X)),X&&X.time===null&&(I>=ce||t-X.prepTime>.32)&&(X.time=t-Ge((I-ce)/(Q*3))*1.3);const U=X?.time!=null,V=U?Math.max(0,t-X.time):0,x=U?Ge(V/1.2):0,H=U?Math.pow(1-x,3):k,Ie=U?Math.sin(x*Math.PI)*Math.pow(1-x,2):0,Be=(-(q?62:94)*H+42*Ie)*L*F,Z=(U?Math.pow(1-x,1.5):k*.62)*L*F;return{el:P,dx:re/le*Be,dy:K/le*Be,scale:1-.13*H*L*F,blur:1.4*H*L*F,heat:Z,originX:p-D,originY:v-ae}});Te.forEach((P,j)=>{const D=Se[j],ae=Math.hypot(D.left+D.width/2-p,D.top+D.height/2-v),re=Math.exp(-Math.pow((I-ae)/Q,2))*L*F;P.setAttribute("data-forge",""),P.classList.add("is-forging");const K=P.style;K.setProperty("--forge-x",`${(p-D.left).toFixed(1)}px`),K.setProperty("--forge-y",`${(v-D.top).toFixed(1)}px`),K.setProperty("--forge-r",`${Math.max(0,I).toFixed(1)}px`),K.setProperty("--forge-width",`${Q}px`),K.setProperty("--forge-heat",re.toFixed(3)),K.setProperty("--forge-cooling",(L*F).toFixed(3)),w.add(P)}),Ce.forEach(P=>{if(!P)return;const{el:j}=P;if(P.heat<.001&&Math.abs(P.dx)+Math.abs(P.dy)<.01){T.has(j)&&A(j);return}j.setAttribute("data-nova-surface",""),j.classList.add("is-nova-matter");const D=j.style;D.setProperty("--nova-dx",`${P.dx.toFixed(2)}px`),D.setProperty("--nova-dy",`${P.dy.toFixed(2)}px`),D.setProperty("--nova-scale",P.scale.toFixed(4)),D.setProperty("--nova-blur",`${P.blur.toFixed(2)}px`),D.setProperty("--nova-heat",P.heat.toFixed(3)),D.setProperty("--matter-origin-x",`${P.originX.toFixed(1)}px`),D.setProperty("--matter-origin-y",`${P.originY.toFixed(1)}px`),T.add(j)}),M=I},()=>{h=!0,f.disconnect(),u.disconnect(),window.removeEventListener("resize",n),g(),l.report=()=>{}}},[o,e,i]),a}const Ba=["--gravity-x","--gravity-y","--gravity-sx","--gravity-sy","--gravity-angle","--gravity-heat"];function Da(o){let e=0,i=0;for(let a=o;a;a=a.offsetParent)e+=a.offsetLeft,i+=a.offsetTop,a!==o&&(e+=a.clientLeft,i+=a.clientTop);return{left:e,top:i,width:o.offsetWidth,height:o.offsetHeight}}function ja(o,e){const i=G.useRef({report:()=>{}});return G.useEffect(()=>{if(!o||matchMedia("(prefers-reduced-motion: reduce)").matches)return;const a=i.current,l=[...document.querySelectorAll(e)],r=new Set,c=new Set,d=new Map;let m=!0,O=!1;const N=E=>{E.removeAttribute("data-ripple"),Ba.forEach(M=>E.style.removeProperty(M)),c.delete(E)},w=()=>c.forEach(N),T=new IntersectionObserver(E=>{E.forEach(({target:M,isIntersecting:_})=>{_?r.add(M):(r.delete(M),N(M))})},{rootMargin:"15% 0px"});l.forEach(E=>T.observe(E));const S=()=>{m=!0},C=new ResizeObserver(S);return C.observe(document.documentElement),l.forEach(E=>C.observe(E)),window.addEventListener("resize",S),document.fonts?.ready.then(()=>{O||S()}),a.report=({active:E,x:M,y:_,amplitude:A=0,wavelength:g=120,phase:f=0,energy:n=1})=>{if(!E||!Number.isFinite(M+_+A)){w();return}m&&(l.forEach(s=>d.set(s,Da(s))),m=!1);const u=Math.max(0,Math.min(1,n));[...r].map(s=>{const p=d.get(s),v=p.left-scrollX+p.width/2-M,I=p.top-scrollY+p.height/2-_,y=Math.hypot(v,I)||1,B=1/(1+y/680),b=Math.sin(y/Math.max(1,g)-f),L=-u*B*(innerWidth<600?11:21)+A*B*b,F=.024*u*B*b;return{el:s,x:v/y*L,y:I/y*L,sx:1+F,sy:1-F,angle:Math.max(-1.05,Math.min(1.05,v/Math.max(180,y)*b*u*.8)),heat:Math.abs(b)*u*B}}).forEach(s=>{const{el:p}=s;p.setAttribute("data-ripple","");const v=p.style;v.setProperty("--gravity-x",`${s.x.toFixed(2)}px`),v.setProperty("--gravity-y",`${s.y.toFixed(2)}px`),v.setProperty("--gravity-sx",s.sx.toFixed(4)),v.setProperty("--gravity-sy",s.sy.toFixed(4)),v.setProperty("--gravity-angle",`${s.angle.toFixed(3)}deg`),v.setProperty("--gravity-heat",s.heat.toFixed(3)),c.add(p)})},()=>{O=!0,T.disconnect(),C.disconnect(),window.removeEventListener("resize",S),w(),a.report=()=>{}}},[o,e]),i}const Ha="#work h2, #work h3, #work p, #work li, #work .t-mono, #work .t-mono-label, #projects h2, #projects h3, #projects p, #projects .t-mono",Va="#work .entry, #projects .projects__intro, #projects .flagship, #projects .card",Ga="#research .readout, #research .research__title, #research .research__p, #research .pub, #stack .stack__group",bt=Array.from({length:28},(o,e)=>({angle:e*2.399963,reach:.72+e*17%29/42,depth:.85+e*11%23/21})),$a=[[0,35,550],[55,60,210],[-40,15,-470],[30,-25,-1170],[-35,45,-1800],[20,-20,-2440],[-35,65,-3130],[80,15,-3650]];function Qa({reduced:o,isPhone:e}){const i=G.useRef(null),a=G.useRef(null),l=G.useRef(null),r=G.useRef(null),[c,d]=G.useState(!1),[m,O]=G.useState(!1),[N,w]=G.useState(!0),[T,S]=G.useState(0),C=G.useRef({paused:!1,cinema:!1}),E=G.useRef({wake:()=>{}}),M=Ia(!o&&!m,Ha,Va),_=ja(!o&&!m,Ga);G.useEffect(()=>{C.current={paused:m,cinema:c},E.current.wake()},[m,c]),G.useEffect(()=>{document.documentElement.classList.toggle("voyage-cinema",c);const g=[...document.querySelectorAll("main, .nav, .footer-wrap, .skip")];g.forEach(n=>{n.inert=c});const f=n=>{n.key==="Escape"&&c&&(d(!1),l.current?.focus())};return window.addEventListener("keydown",f),()=>{document.documentElement.classList.remove("voyage-cinema"),g.forEach(n=>{n.inert=!1}),window.removeEventListener("keydown",f)}},[c]),G.useEffect(()=>{const g=i.current,f=E.current;let n;try{n=new Jt({canvas:g,antialias:!1,powerPreference:"high-performance"})}catch{const k=requestAnimationFrame(()=>w(!1));return()=>cancelAnimationFrame(k)}n.outputColorSpace=St,n.toneMapping=Mt,n.toneMappingExposure=1.18,n.setClearColor(198156);const u=new ea,h=new ta(e?62:48,1,.5,11e3),s=La(u,e),p=new aa($a.map(k=>new W(...k)),!1,"catmullrom",.32),v=new ca(n);v.addPass(new ua(u,h));const I=new we(new $(1,1),.24,.35,.9);v.addPass(I);const y=new _t(da);v.addPass(y),v.addPass(new pa);const B=r.current,b=[...B.querySelectorAll(".voyage-ejecta")],t={raf:0,last:0,time:0,t:0,target:0,anchors:[],width:1,height:1,chapter:-1,dirty:!0,lost:!1,gateOpen:document.documentElement.classList.contains("light-gate-open"),frames:0,totalMs:0,dpr:Math.min(devicePixelRatio||1,e?1.25:1.5)},L=new $,F=new $,q=new $,Q=new W,se=new W,ke=new W,Te=new ia,Ue=new oa,Se=()=>{const k=window.scrollY;let U=0;for(let H=0;H<t.anchors.length-1;H++)k>=t.anchors[H]&&(U=H);const V=t.anchors[U]||0,x=t.anchors[U+1]||1;t.target=it((U+it((k-V)/Math.max(1,x-V)))/7),t.dirty=!0,!t.raf&&!document.hidden&&!t.lost&&!t.gateOpen&&(t.raf=requestAnimationFrame(K))},Ce=()=>{const k=Math.max(1,document.documentElement.scrollHeight-innerHeight);t.anchors=ee.chapters.map((U,V)=>V===0?0:Math.min(k,Math.max(0,(document.getElementById(U.id)?.getBoundingClientRect().top||0)+scrollY-72)));for(let U=1;U<8;U++)t.anchors[U]=Math.max(t.anchors[U],t.anchors[U-1]+1);Se()},P=()=>{t.width=innerWidth,t.height=innerHeight,n.setPixelRatio(t.dpr),n.setSize(t.width,t.height),v.setPixelRatio(t.dpr),v.setSize(t.width,t.height),s.stars.material.uniforms.uPixelRatio.value=t.dpr,h.aspect=t.width/t.height,h.updateProjectionMatrix(),Ce()},j=k=>{L.set((k.clientX/t.width-.5)*2,(k.clientY/t.height-.5)*2)},D=()=>L.set(0,0),ae=new ResizeObserver(Ce);ae.observe(document.documentElement),window.addEventListener("resize",P),window.addEventListener("scroll",Se,{passive:!0}),window.addEventListener("pointermove",j,{passive:!0}),document.addEventListener("pointerleave",D);let re=!1;document.fonts?.ready.then(()=>{re||Ce()}),P(),t.t=t.target;function K(k){if(t.raf=0,re||document.hidden||t.lost||t.gateOpen)return;const U=Math.min((k-(t.last||k))/1e3,.05);t.last=k;const V=o||C.current.paused,x=V?t.target:t.t+(t.target-t.t)*(1-Math.exp(-U*8));t.t=x,V||(t.time+=U);const H=t.time;if(!V||t.dirty){t.dirty=!1,p.getPoint(x,h.position),F.lerp(V?q:L,1-Math.exp(-U*2.5)),h.position.x+=F.x*7,h.position.y-=F.y*5,Q.set(h.position.x+12+Math.sin(x*9)*16,h.position.y-13,h.position.z-600),h.lookAt(Q),h.rotateZ(Math.sin(x*10)*.025),h.fov=(e?62:48)+Math.sin(x*Math.PI)*3,h.updateProjectionMatrix(),s.sky.position.copy(h.position),s.sky.material.uniforms.uTravel.value=x,s.updateTime(H),s.body.rotation.y=H*.012,s.planet.visible=x<.245,s.body.material.uniforms.uOpacity.value=1-Y(x,.2,.245),s.rings.material.uniforms.uOpacity.value=1-Y(x,.2,.245);const Ie=140+Math.sin(x*14)**2*120+x*50,Xe=Ie*Math.tan(ne.degToRad(h.fov/2)),Be=e?.5:.65;ke.set(h.position.x+Xe*h.aspect*(Be+Math.sin(x*17)*.18),h.position.y-Xe*(.37+Math.sin(x*12)*.19),h.position.z-Ie),s.probe.position.copy(ke),s.probe.position.y+=Math.sin(H*.22)*1.5,Ue.set(.64+Math.sin(x*8)*.3,.3+x*1.5,-.55+Math.sin(x*12)*.25),Te.setFromEuler(Ue),s.probe.quaternion.copy(Te),s.probe.scale.setScalar((e?.38:.65)*(1-Y(x,.83,1)*.75)),s.probe.visible=x<.96;const Z=Y(x,.2,.44),ue=Y(Z,.34,.42)*(1-Y(Z,.82,1)),Rt=Math.exp(-Math.pow((Z-.377)/.027,2));s.nova.visible=x>.16&&x<.48,s.nova.visible&&s.supernova.update(Z,H,h),s.remnant.visible=x>.42&&x<.55,s.remnant.material.uniforms.uOpacity.value=Y(x,.42,.46)*(1-Y(x,.49,.55)),s.pulsar.visible=s.remnant.visible,s.remnant.quaternion.copy(h.quaternion),s.remnant.rotateZ(H*.006),s.pulsar.material.opacity=.7+Math.sin(H*1.4)*.12,s.blackHole.visible=x>.46&&x<.69,s.blackHole.material.uniforms.uOpacity.value=Y(x,.46,.51)*(1-Y(x,.64,.69)),s.blackHole.quaternion.copy(h.quaternion),s.blackHole.rotateZ(-.12);const me=Y(x,.49,.6);s.companion.visible=s.blackHole.visible&&me<.98,s.companion.position.set(s.blackHole.position.x+Math.cos(me*5)*180*(1-me),30+Math.sin(me*5)*90*(1-me),-2390),s.companion.quaternion.copy(h.quaternion),s.companion.scale.setScalar(.7*(1-me)),s.quasar.visible=x>.61&&x<.86,s.jetGroup.visible=s.quasar.visible,s.quasar.quaternion.copy(h.quaternion),s.quasar.rotateZ(-.3),s.galaxies.visible=x>.77,s.galaxyMaterials.forEach(J=>{J.uniforms.uOpacity.value=Y(x,.77,.82)*.95}),I.strength=.2+ue*.12+Rt*.18,y.enabled=!1,B.style.setProperty("--event-alpha","0"),B.dataset.event="none";const Ye=Y(x,.53,.675),De=Math.sin(Ye*Math.PI),rt=Ye*18-H*1.2;let _e=0,Pe=0,Ee=0;if(Z>0&&Z<1){se.copy(s.nova.position).project(h),_e=ne.clamp((se.x*.5+.5)*t.width,-t.width*.3,t.width*1.3),Pe=ne.clamp((-se.y*.5+.5)*t.height,-t.height*.3,t.height*1.3);const J=Math.max(240,Math.abs(h.position.z-s.nova.position.z)),ve=t.height/(2*Math.tan(ne.degToRad(h.fov/2))*J);Ee=s.supernova.screenRadius(Z)*ve,V||(B.dataset.event="supernova",B.style.setProperty("--event-x",`${_e.toFixed(1)}px`),B.style.setProperty("--event-y",`${Pe.toFixed(1)}px`),B.style.setProperty("--event-radius",`${Ee.toFixed(1)}px`),B.style.setProperty("--event-alpha",String(ue*.65)),y.enabled=ue>.01,y.uniforms.uKind.value=1,y.uniforms.uCenter.value.set(_e/t.width,1-Pe/t.height),y.uniforms.uRadius.value=Ee/t.height,y.uniforms.uEnergy.value=ue)}const At=!V&&ue>.01;if(b.forEach((J,ve)=>{if(!At){J.style.opacity="0";return}const Je=bt[ve],nt=Je.angle+H*.014,lt=Ee*Je.reach;J.style.transform=`translate3d(${(_e+Math.cos(nt)*lt).toFixed(1)}px,${(Pe+Math.sin(nt)*lt*.76).toFixed(1)}px,0) scale(${Je.depth})`,J.style.opacity=String(ue*.68)}),!V&&!C.current.cinema&&Z>0&&Z<1?M.current.report({active:!0,x:_e,y:Pe,radius:Ee,progress:Z,energy:ue,time:H}):M.current.report({active:!1}),!V&&De>.01){se.copy(s.blackHole.position).project(h);const J=(se.x*.5+.5)*t.width,ve=(-se.y*.5+.5)*t.height;y.enabled=!0,y.uniforms.uKind.value=2,y.uniforms.uCenter.value.set(J/t.width,1-ve/t.height),y.uniforms.uEnergy.value=De,y.uniforms.uPhase.value=rt,C.current.cinema?_.current.report({active:!1}):_.current.report({active:!0,x:J,y:ve,amplitude:De*(e?11:22),wavelength:t.height/29,phase:rt,progress:Ye,energy:De,time:H})}else _.current.report({active:!1});y.uniforms.uAspect.value=h.aspect,v.render(),a.current&&a.current.style.setProperty("--travel",x);const Ze=Math.min(7,Math.floor(x*7+.28));t.chapter!==Ze&&(t.chapter=Ze,S(Ze)),!V&&U>0&&(t.frames++,t.totalMs+=U*1e3,t.frames===120&&(t.totalMs/120>22&&t.dpr>.8&&(t.dpr=Math.max(.8,t.dpr-.25),P()),t.frames=0,t.totalMs=0))}!V&&!t.raf&&(t.raf=requestAnimationFrame(K))}f.wake=()=>{t.dirty=!0,t.last=0,!t.raf&&!document.hidden&&!t.gateOpen&&(t.raf=requestAnimationFrame(K))};const le=()=>{cancelAnimationFrame(t.raf),t.last=0,!document.hidden&&!t.gateOpen&&(t.dirty=!0,t.raf=requestAnimationFrame(K))},Ke=k=>{t.gateOpen=!!k.detail?.open,cancelAnimationFrame(t.raf),t.raf=0,t.last=0,t.gateOpen?(M.current.report({active:!1}),_.current.report({active:!1}),B.style.setProperty("--event-alpha","0")):f.wake()};window.addEventListener("lightgate:change",Ke);const ce=k=>{k.preventDefault(),t.lost=!0,cancelAnimationFrame(t.raf),t.raf=0,M.current.report({active:!1}),_.current.report({active:!1}),B.style.setProperty("--event-alpha","0"),b.forEach(U=>{U.style.opacity="0"}),d(!1),w(!1)},X=()=>{t.lost=!1,t.dirty=!0,w(!0),le()};return document.addEventListener("visibilitychange",le),g.addEventListener("webglcontextlost",ce),g.addEventListener("webglcontextrestored",X),t.raf||(t.raf=requestAnimationFrame(K)),()=>{re=!0,f.wake=()=>{},cancelAnimationFrame(t.raf),ae.disconnect(),window.removeEventListener("resize",P),window.removeEventListener("lightgate:change",Ke),window.removeEventListener("scroll",Se),window.removeEventListener("pointermove",j),document.removeEventListener("pointerleave",D),document.removeEventListener("visibilitychange",le),g.removeEventListener("webglcontextlost",ce),g.removeEventListener("webglcontextrestored",X),s.dispose(),I.dispose(),v.passes.forEach(k=>{k!==I&&k.dispose?.()}),v.dispose(),n.dispose()}},[o,e,M,_]);const A=ee.chapters[T];return z.jsxs(z.Fragment,{children:[z.jsx("canvas",{ref:i,className:"voyage","aria-hidden":"true"}),z.jsx("div",{className:"voyage-scrim","aria-hidden":"true"}),z.jsx("div",{className:"voyage-vignette","aria-hidden":"true"}),z.jsxs("div",{className:"voyage-effects",ref:r,"aria-hidden":"true",children:[z.jsx("div",{className:"voyage-front"}),bt.map((g,f)=>z.jsx("i",{className:"voyage-ejecta"},f))]}),N?z.jsxs("aside",{className:"voyage-hud","aria-label":"Voyager journey",ref:a,children:[z.jsxs("div",{className:"voyage-hud__location",children:[z.jsx("span",{className:"voyage-hud__signal"}),z.jsxs("span",{className:"voyage-hud__number",children:["0",T+1]}),z.jsxs("div",{children:[z.jsx("span",{className:"voyage-hud__eyebrow",children:ee.title}),z.jsxs("span",{className:"voyage-hud__name",children:[A.name,z.jsxs("span",{children:[" / ",A.place]})]})]})]}),z.jsx("nav",{className:"voyage-hud__route","aria-label":"Journey chapters",children:ee.chapters.map((g,f)=>z.jsx("a",{href:`#${g.id}`,title:g.name,"aria-label":`Chapter ${f+1}: ${g.name}`,"aria-current":T===f?"step":void 0,onClick:n=>{n.preventDefault(),Ft(`#${g.id}`)},children:z.jsx("span",{})},g.id))}),z.jsxs("div",{className:"voyage-hud__actions",children:[!o&&z.jsx("button",{className:"voyage-hud__pause","aria-label":m?ee.resume:ee.pause,"aria-pressed":m,onClick:()=>O(g=>!g),children:z.jsx("span",{"aria-hidden":"true",children:m?"▷":"Ⅱ"})}),z.jsxs("button",{ref:l,className:"voyage-hud__toggle","aria-pressed":c,onClick:()=>d(g=>!g),children:[z.jsx("span",{"aria-hidden":"true",children:c?"↙":"↗"}),c?ee.back:ee.view]})]}),c&&z.jsxs("div",{className:"voyage-caption",children:[z.jsxs("span",{children:["0",T+1," / 08"]}),z.jsx("h2",{children:A.name}),z.jsx("p",{children:A.note}),z.jsx("small",{children:ee.exitHint})]},T)]}):z.jsx("p",{className:"visually-hidden",role:"status",children:ee.fallback})]})}export{Qa as default};
