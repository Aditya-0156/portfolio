import{r as L,j as M,s as Je}from"./index-CwArihWB.js";import{M as x,O as et,B as Pe,F as Ue,S as Y,U as xe,V as z,W as ve,H as ge,N as tt,C as at,a as we,b as W,A as ee,c as st,R as it,d as ot,e as rt,L as nt,f as lt,g as ct,h as Qe,i as ut,j as ht,G as te,k as ft,T as Ce,l as ce,m as De,n as be,o as V,p as dt,q as ae,D as We,r as pt,s as qe,t as mt,u as vt,v as oe,P as $e,w as gt,x as xt,y as ke,z as de,E as wt,I as bt,J as yt,K as Mt,Q as Tt,X as Ct,Y as _t,Z as St}from"./three-DkhBjOw7.js";const Ke={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class ne{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Et=new et(-1,1,1,-1,0,1);class Pt extends Pe{constructor(){super(),this.setAttribute("position",new Ue([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Ue([0,2,0,0,2,0],2))}}const At=new Pt;class Ae{constructor(e){this._mesh=new x(At,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Et)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Rt extends ne{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof Y?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=xe.clone(e.uniforms),this.material=new Y({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new Ae(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class je extends ne{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){const n=e.getContext(),a=e.state;a.buffers.color.setMask(!1),a.buffers.depth.setMask(!1),a.buffers.color.setLocked(!0),a.buffers.depth.setLocked(!0);let h,u;this.inverse?(h=0,u=1):(h=1,u=0),a.buffers.stencil.setTest(!0),a.buffers.stencil.setOp(n.REPLACE,n.REPLACE,n.REPLACE),a.buffers.stencil.setFunc(n.ALWAYS,h,4294967295),a.buffers.stencil.setClear(u),a.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),a.buffers.color.setLocked(!1),a.buffers.depth.setLocked(!1),a.buffers.color.setMask(!0),a.buffers.depth.setMask(!0),a.buffers.stencil.setLocked(!1),a.buffers.stencil.setFunc(n.EQUAL,1,4294967295),a.buffers.stencil.setOp(n.KEEP,n.KEEP,n.KEEP),a.buffers.stencil.setLocked(!0)}}class Ft extends ne{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class It{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const i=e.getSize(new z);this._width=i.width,this._height=i.height,t=new ve(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:ge}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Rt(Ke),this.copyPass.material.blending=tt,this.clock=new at}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let i=!1;for(let n=0,a=this.passes.length;n<a;n++){const h=this.passes[n];if(h.enabled!==!1){if(h.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(n),h.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),h.needsSwap){if(i){const u=this.renderer.getContext(),f=this.renderer.state.buffers.stencil;f.setFunc(u.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),f.setFunc(u.EQUAL,1,4294967295)}this.swapBuffers()}je!==void 0&&(h instanceof je?i=!0:h instanceof Ft&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new z);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const i=this._width*this._pixelRatio,n=this._height*this._pixelRatio;this.renderTarget1.setSize(i,n),this.renderTarget2.setSize(i,n);for(let a=0;a<this.passes.length;a++)this.passes[a].setSize(i,n)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Bt extends ne{constructor(e,t,i=null,n=null,a=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=n,this.clearAlpha=a,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new we}render(e,t,i){const n=e.autoClear;e.autoClear=!1;let a,h;this.overrideMaterial!==null&&(h=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(a=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(a),this.overrideMaterial!==null&&(this.scene.overrideMaterial=h),e.autoClear=n}}const Nt={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new we(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class re extends ne{constructor(e,t,i,n){super(),this.strength=t!==void 0?t:1,this.radius=i,this.threshold=n,this.resolution=e!==void 0?new z(e.x,e.y):new z(256,256),this.clearColor=new we(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let a=Math.round(this.resolution.x/2),h=Math.round(this.resolution.y/2);this.renderTargetBright=new ve(a,h,{type:ge}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let m=0;m<this.nMips;m++){const R=new ve(a,h,{type:ge});R.texture.name="UnrealBloomPass.h"+m,R.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(R);const y=new ve(a,h,{type:ge});y.texture.name="UnrealBloomPass.v"+m,y.texture.generateMipmaps=!1,this.renderTargetsVertical.push(y),a=Math.round(a/2),h=Math.round(h/2)}const u=Nt;this.highPassUniforms=xe.clone(u.uniforms),this.highPassUniforms.luminosityThreshold.value=n,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Y({uniforms:this.highPassUniforms,vertexShader:u.vertexShader,fragmentShader:u.fragmentShader}),this.separableBlurMaterials=[];const f=[3,5,7,9,11];a=Math.round(this.resolution.x/2),h=Math.round(this.resolution.y/2);for(let m=0;m<this.nMips;m++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(f[m])),this.separableBlurMaterials[m].uniforms.invSize.value=new z(1/a,1/h),a=Math.round(a/2),h=Math.round(h/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const p=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=p,this.bloomTintColors=[new W(1,1,1),new W(1,1,1),new W(1,1,1),new W(1,1,1),new W(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const w=Ke;this.copyUniforms=xe.clone(w.uniforms),this.blendMaterial=new Y({uniforms:this.copyUniforms,vertexShader:w.vertexShader,fragmentShader:w.fragmentShader,blending:ee,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new we,this.oldClearAlpha=1,this.basic=new st,this.fsQuad=new Ae(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),n=Math.round(t/2);this.renderTargetBright.setSize(i,n);for(let a=0;a<this.nMips;a++)this.renderTargetsHorizontal[a].setSize(i,n),this.renderTargetsVertical[a].setSize(i,n),this.separableBlurMaterials[a].uniforms.invSize.value=new z(1/i,1/n),i=Math.round(i/2),n=Math.round(n/2)}render(e,t,i,n,a){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const h=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),a&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=i.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let u=this.renderTargetBright;for(let f=0;f<this.nMips;f++)this.fsQuad.material=this.separableBlurMaterials[f],this.separableBlurMaterials[f].uniforms.colorTexture.value=u.texture,this.separableBlurMaterials[f].uniforms.direction.value=re.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[f]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[f].uniforms.colorTexture.value=this.renderTargetsHorizontal[f].texture,this.separableBlurMaterials[f].uniforms.direction.value=re.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[f]),e.clear(),this.fsQuad.render(e),u=this.renderTargetsVertical[f];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(i),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=h}getSeperableBlurMaterial(e){const t=[];for(let i=0;i<e;i++)t.push(.39894*Math.exp(-.5*i*i/(e*e))/e);return new Y({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new z(.5,.5)},direction:{value:new z(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}getCompositeMaterial(e){return new Y({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}re.BlurDirectionX=new z(1,0);re.BlurDirectionY=new z(0,1);const Lt={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class zt extends ne{constructor(){super();const e=Lt;this.uniforms=xe.clone(e.uniforms),this.material=new it({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new Ae(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},ot.getTransfer(this._outputColorSpace)===rt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===nt?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===lt?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===ct?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Qe?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===ut?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===ht&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}function Ye(o){let e=o>>>0;return function(){e=e+1831565813|0;let i=Math.imul(e^e>>>15,1|e);return i=i+Math.imul(i^i>>>7,61|i)^i,((i^i>>>14)>>>0)/4294967296}}const K=()=>new ae({color:13225944,metalness:.94,roughness:.3}),Ge=()=>new ae({color:15265010,metalness:.36,roughness:.52,side:We}),He=()=>new ae({color:14263375,metalness:1,roughness:.22}),Ve=()=>new ae({color:11043887,metalness:.85,roughness:.58}),pe=()=>new ae({color:1974824,metalness:.5,roughness:.66}),ue=()=>new ae({color:10134189,metalness:.9,roughness:.38});function Ot(){const o=new te,e=12,t=[];for(let c=0;c<=22;c++){const l=c/22*e;t.push(new z(l,l*l/44))}const i=new x(new ft(t,72),Ge());i.position.y=2.2,o.add(i);const n=new x(new Ce(e,.22,8,72),K());n.rotation.x=Math.PI/2,n.position.y=2.2+e*e/44,o.add(n);for(let c=0;c<12;c++){const v=c/12*Math.PI*2,l=new x(new ce(.16,.5,e*.95),K());l.position.set(Math.cos(v)*e*.5,1.6,Math.sin(v)*e*.5),l.rotation.y=-v,o.add(l)}const a=new x(new De(.85,3.4,16),K());a.position.y=9.6,a.rotation.x=Math.PI,o.add(a);const h=new x(new be(1.5,24,16,0,Math.PI*2,0,Math.PI/2.2),Ge());h.position.y=11.4,h.rotation.x=Math.PI,o.add(h);for(let c=0;c<3;c++){const v=c/3*Math.PI*2+.4,l=new x(new V(.12,.12,11.2,6),ue());l.position.set(Math.cos(v)*e*.46,6.4,Math.sin(v)*e*.46),l.lookAt(new W(0,11.2,0)),l.rotateX(Math.PI/2),o.add(l)}const u=new te;u.position.y=-2.6;const f=new x(new V(4.3,4.3,2.4,10),pe());u.add(f);for(let c=0;c<10;c++){const v=c/10*Math.PI*2+Math.PI/10,l=new x(new ce(2.5,2.1,.5),c%3===0?Ve():K());l.position.set(Math.cos(v)*4.35,0,Math.sin(v)*4.35),l.rotation.y=-v+Math.PI/2,u.add(l)}const p=new x(new V(4.4,4.4,.35,10),K());p.position.y=1.35,u.add(p);const w=new x(new Ce(4.45,.22,8,10),He());w.rotation.x=Math.PI/2,w.position.y=-1.2,u.add(w);const m=new x(new be(2.1,24,20),Ve());m.position.y=-3.2,u.add(m);const R=new x(new De(.55,1.3,12),pe());R.position.set(0,-5.2,0),u.add(R),o.add(u);const y=new x(new V(.26,.26,12,8),ue());y.rotation.z=Math.PI/2,y.position.set(-9.5,-3.4,0),o.add(y);for(let c=0;c<3;c++){const v=-13.2-c*3.3,l=new x(new V(1.05,1.05,2.8,14),pe());l.rotation.z=Math.PI/2,l.position.set(v,-3.4,0),o.add(l);for(let r=0;r<6;r++){const D=r/6*Math.PI*2,A=new x(new ce(2.6,.08,1.5),K());A.position.set(v,-3.4+Math.cos(D)*1.4,Math.sin(D)*1.4),A.rotation.x=-D,o.add(A)}}const T=new x(new V(.22,.22,13,8),ue());T.rotation.z=Math.PI/2,T.position.set(10,-3,0),o.add(T);const F=new x(new ce(2.6,2.2,2.4),pe());F.position.set(16.6,-3,0),o.add(F),[[.75,.5],[-.75,-.4]].forEach(([c,v])=>{const l=new x(new V(.42,.5,3.1,14),K());l.rotation.x=Math.PI/2,l.position.set(16.6+v,-3+c,-2.2),o.add(l);const r=new x(new dt(.42,16),new ae({color:724500,metalness:1,roughness:.1}));r.position.set(16.6+v,-3+c,-3.76),o.add(r)});const b=new te,B=new x(new V(.1,.13,58,6),ue());B.position.y=29,b.add(B);for(let c=1;c<=3;c++){const v=new x(new ce(.7,.7,.7),K());v.position.y=c*17,b.add(v)}b.position.set(-3.4,-1.5,3),b.rotation.set(.5,0,.72),o.add(b);const g=new x(new V(1.85,1.85,.16,48),He());g.position.set(3.6,-2.6,4.2),g.rotation.set(Math.PI/2,0,.2),o.add(g);const _=new x(new Ce(1.85,.1,8,40),K());return _.position.copy(g.position),_.rotation.copy(g.rotation),o.add(_),[-1,1].forEach(c=>{const v=new x(new V(.075,.075,40,6),ue());v.position.set(c*2.2,-4.4,-2),v.rotation.set(-.85,0,c*.55),v.translateY(20),o.add(v)}),{group:o,dish:i,bus:u,magBoom:b}}const Ee=o=>o<0?0:o>1?1:o,k=(o,e,t)=>Ee((o-e)/(t-e));function _e(o,e=256){const t=document.createElement("canvas");t.width=t.height=e;const i=t.getContext("2d"),n=i.createRadialGradient(e/2,e/2,0,e/2,e/2,e/2);o.forEach(([h,u])=>n.addColorStop(h,u)),i.fillStyle=n,i.fillRect(0,0,e,e);const a=new pt(t);return a.colorSpace=qe,a}function me(o,e,t=1,i=!0){const n=new mt(new vt({map:o,blending:ee,depthWrite:!1,depthTest:!0,transparent:!0,opacity:t,fog:i}));return n.scale.set(e,e,1),n}const he=`
float hash(vec3 p) { p = fract(p * .3183099 + vec3(.1,.2,.3)); p *= 17.; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float noise3(vec3 p) {
  vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
    mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
}
float fbm(vec3 p) { float v=0., a=.5; for(int i=0;i<5;i++){ v+=a*noise3(p); p=p*2.03+vec3(17.1,9.2,13.7); a*=.48; } return v; }
`,Ut=`
varying vec3 vLocal; varying vec3 vWorld; varying vec3 vNormal; varying vec2 vUv;
void main(){ vUv=uv; vLocal=position; vWorld=(modelMatrix*vec4(position,1.)).xyz;
 vNormal=normalize(mat3(modelMatrix)*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }
`,Dt=`
${he}
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
`,kt=`
${he}
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
`,jt=`
${he}
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
`,Gt=`
${he}
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
`,Se=`
${he}
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
`;function J(o,e={},t={}){return new Y({vertexShader:Ut,fragmentShader:o,uniforms:{uTime:{value:0},...e},...t})}function Ht(o,e){const t=[],i=new x(new be(6200,32,20),J(Dt,{uTravel:{value:0}},{side:wt,depthWrite:!1}));i.renderOrder=-10,o.add(i),t.push(i.material);const n=Ye(1977),a=e?2800:7200,h=new Float32Array(a*3),u=new Float32Array(a*3),f=new Float32Array(a);for(let C=0;C<a;C++){h.set([(n()-.5)*6500,(n()-.5)*4100,800-n()*8500],C*3);const E=n(),N=.25+Math.pow(n(),3)*1.6;u.set([N*(E>.7?1:.72),N*(E>.7?.77:.84),N*(E>.7?.51:1)],C*3),f[C]=.65+Math.pow(n(),7)*2.4}const p=new Pe;p.setAttribute("position",new oe(h,3)),p.setAttribute("color",new oe(u,3)),p.setAttribute("aSize",new oe(f,1));const w=new $e(p,new Y({uniforms:{uPixelRatio:{value:1},uTime:{value:0}},vertexShader:`attribute float aSize; varying vec3 vColor; uniform float uPixelRatio; uniform float uTime;
    void main(){vec4 p=modelViewMatrix*vec4(position,1.); vColor=color;
    gl_PointSize=clamp(aSize*(600./max(300.,-p.z)),.65,3.5)*uPixelRatio;
    gl_Position=projectionMatrix*p;}`,fragmentShader:`varying vec3 vColor; void main(){float r=length(gl_PointCoord-.5)*2.;
    float a=exp(-r*r*4.)*(1.-smoothstep(.65,1.,r)); gl_FragColor=vec4(vColor,a);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    }`,vertexColors:!0,transparent:!0,depthWrite:!1,blending:ee}));o.add(w);const m=new te;m.position.set(190,25,-180),m.rotation.z=.3;const R=new x(new be(170,96,64),J(kt,{uOpacity:{value:1}},{transparent:!0}));m.add(R),t.push(R.material),e&&m.position.set(80,150,-180);const y=new x(new gt(207,390,256,1),J(jt,{uInner:{value:207},uOuter:{value:390},uOpacity:{value:1},uPlanetCenter:{value:m.position}},{side:We,transparent:!0,depthWrite:!1}));y.rotation.x=-Math.PI/2+.17,m.add(y),o.add(m);const{group:T}=Ot();T.scale.setScalar(.69),o.add(T),o.add(new xt(11060713,4600095,1.8));const F=new ke(16770493,3.3);F.position.set(-350,260,400),o.add(F);const b=new ke(7780095,2.5);b.position.set(350,-100,-600),o.add(b);const B=_e([[0,"rgba(255,250,229,1)"],[.06,"rgba(255,224,164,.95)"],[.19,"rgba(255,155,62,.35)"],[.5,"rgba(211,66,13,.09)"],[1,"rgba(0,0,0,0)"]]),g=_e([[0,"rgba(235,249,255,1)"],[.045,"rgba(151,208,255,.9)"],[.2,"rgba(72,139,255,.18)"],[1,"rgba(0,0,0,0)"]]),_=new te;_.position.set(e?35:170,25,-1050),o.add(_);const c=me(B,520,1,!1);_.add(c);const v=Vt(e?3500:1e4);_.add(v.mesh);const l=new x(new de(850,850),J(Se,{uKind:{value:0},uOpacity:{value:0}},{transparent:!0,depthWrite:!1,blending:ee}));_.add(l),t.push(l.material);const r=new x(new de(1100,950),J(Se,{uKind:{value:0},uOpacity:{value:1}},{transparent:!0,depthWrite:!1,blending:ee}));r.position.set(e?35:180,0,-1750),o.add(r),t.push(r.material);const D=me(g,170,.9,!1);D.position.copy(r.position),o.add(D);function A(C,E,N,S){const O=new x(new de(C,C),J(Gt,{uOpacity:{value:1}},{transparent:!0,depthWrite:!1}));return O.position.set(e?E*.22:E,N,S),o.add(O),t.push(O.material),O}const Z=A(720,165,30,-2410),s=A(300,360,90,-2440),q=A(390,130,30,-3050),G=new te;G.position.copy(q.position),G.rotation.z=-.3;const fe=_e([[0,"rgba(215,239,255,.95)"],[.08,"rgba(110,173,255,.48)"],[.4,"rgba(42,104,255,.1)"],[1,"rgba(0,0,0,0)"]]);for(const C of[-1,1]){const E=me(fe,1,.75,!1);E.scale.set(80,880,1),E.position.y=C*390,G.add(E);const N=me(g,160,.55,!1);N.position.y=C*760,G.add(N)}o.add(G);const se=new te;o.add(se);const $=[];return[[230,70,-4050,850,.32],[-370,190,-4470,540,-.5],[560,-180,-4490,650,.8],[-150,-80,-4940,1150,-.1]].forEach(([C,E,N,S,O])=>{const H=new x(new de(S,S*.72),J(Se,{uKind:{value:1},uOpacity:{value:.95}},{transparent:!0,depthWrite:!1,blending:ee}));H.position.set(e?C*.55:C,E,N),H.rotation.z=O,se.add(H),t.push(H.material),$.push(H.material)}),{sky:i,stars:w,planet:m,body:R,rings:y,probe:T,nova:_,star:c,blast:v,novaCloud:l,remnant:r,pulsar:D,blackHole:Z,companion:s,quasar:q,jetGroup:G,galaxies:se,galaxyMaterials:$,updateTime(C){t.forEach(E=>{E.uniforms.uTime.value=C})},dispose(){const C=new Set,E=new Set,N=new Set([B,g,fe]);o.traverse(S=>{S.geometry&&C.add(S.geometry),S.material&&(Array.isArray(S.material)?S.material:[S.material]).forEach(O=>{E.add(O),O.map&&N.add(O.map)})}),C.forEach(S=>S.dispose()),E.forEach(S=>S.dispose()),N.forEach(S=>S.dispose())}}}function Vt(o){const e=Ye(118),t=new Float32Array(o*3),i=new Float32Array(o),n=new Float32Array(o*3);for(let f=0;f<o;f++){const p=e()*Math.PI*2,w=e()*2-1,m=Math.sqrt(1-w*w),R=.35+e()*.85;t.set([m*Math.cos(p),w*.76,m*Math.sin(p)],f*3),i[f]=R;const y=e();n.set([1,.35+y*.55,.13+y*.62],f*3)}const a=new Pe;a.setAttribute("position",new oe(t,3)),a.setAttribute("aSpeed",new oe(i,1)),a.setAttribute("color",new oe(n,3));const h=new Y({uniforms:{uExpansion:{value:0}},vertexColors:!0,transparent:!0,depthWrite:!1,blending:ee,vertexShader:`attribute float aSpeed; uniform float uExpansion; varying vec3 vColor; varying float vAlpha;
      void main(){vec3 p=position*pow(uExpansion,.6)*650.*aSpeed;
      vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;
      gl_PointSize=clamp((1.+uExpansion*2.)*400./max(80.,-mv.z),.8,4.);
      vColor=color;vAlpha=min(1.,uExpansion*7.)*clamp((1.-uExpansion)*2.,0.,1.);}`,fragmentShader:`varying vec3 vColor; varying float vAlpha; void main(){float r=length(gl_PointCoord-.5)*2.;
      gl_FragColor=vec4(vColor,exp(-r*r*3.)*(1.-smoothstep(.6,1.,r))*vAlpha);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`}),u=new $e(a,h);return u.frustumCulled=!1,{mesh:u,advance(f){h.uniforms.uExpansion.value=f,u.visible=f>0&&f<1}}}const Q={title:"VOYAGER / A JOURNEY BEYOND",view:"View voyage",back:"Back to portfolio",pause:"Pause motion",resume:"Resume motion",exitHint:"Scroll to travel · Esc to return",fallback:"The voyage is unavailable on this device. All portfolio content is available below.",chapters:[{id:"top",name:"Departure",place:"The outer solar system",note:"Every journey begins with a little curiosity."},{id:"now",name:"Ring crossing",place:"Beyond the familiar",note:"A world of ice, dust, and impossible scale."},{id:"work",name:"Stellar forge",place:"The death of a star",note:"An ending that becomes the beginning of everything."},{id:"projects",name:"Afterglow",place:"Inside the remnant",note:"The quiet architecture left behind by light."},{id:"research",name:"Event horizon",place:"Where light bends",note:"At the edge of what we can know."},{id:"stack",name:"The lighthouse",place:"An active galactic nucleus",note:"A small point of origin. An extraordinary reach."},{id:"education",name:"Island universes",place:"The galactic frontier",note:"There is always a larger world."},{id:"contact",name:"Beyond",place:"The open universe",note:"The next chapter is still unwritten."}]};function Qt(o,e){const t=L.useRef({report:()=>{}});return L.useEffect(()=>{if(!o)return;const i=t.current,n=new Set,a=new IntersectionObserver(p=>p.forEach(w=>w.isIntersecting?n.add(w.target):n.delete(w.target)),{rootMargin:"10% 0px"}),h=Array.from(document.querySelectorAll(e));h.forEach(p=>{p.setAttribute("data-forge",""),a.observe(p)});let u=!1;const f=[];return i.report=({active:p,x:w,y:m,radius:R})=>{if(!p){u&&(h.forEach(T=>T.classList.remove("is-forging")),u=!1);return}const y=Array.from(n);if(y.length){f.length=0;for(let T=0;T<y.length;T++)f.push(y[T].getBoundingClientRect());for(let T=0;T<y.length;T++){const F=y[T],b=f[T],B=F.style;B.setProperty("--forge-x",`${(w-b.left).toFixed(1)}px`),B.setProperty("--forge-y",`${(m-b.top).toFixed(1)}px`),B.setProperty("--forge-r",`${R.toFixed(1)}px`),u||F.classList.add("is-forging")}u=!0}},()=>{a.disconnect(),h.forEach(p=>{p.removeAttribute("data-forge"),p.classList.remove("is-forging"),p.style.removeProperty("--forge-x"),p.style.removeProperty("--forge-y"),p.style.removeProperty("--forge-r")}),i.report=()=>{}}},[o,e]),t}function Wt(o,e){const t=L.useRef({report:()=>{}});return L.useEffect(()=>{if(!o)return;const i=t.current,n=new Set,a=new IntersectionObserver(p=>p.forEach(w=>w.isIntersecting?n.add(w.target):n.delete(w.target)),{rootMargin:"20% 0px"}),h=Array.from(document.querySelectorAll(e));h.forEach(p=>{p.setAttribute("data-ripple",""),a.observe(p)});let u=!1;const f=[];return i.report=({active:p,x:w,y:m,amplitude:R,wavelength:y,phase:T})=>{if(!p){u&&(h.forEach(b=>{b.style.transform="",b.style.willChange=""}),u=!1);return}const F=Array.from(n);if(F.length){f.length=0;for(let b=0;b<F.length;b++)f.push(F[b].getBoundingClientRect());for(let b=0;b<F.length;b++){const B=F[b],g=f[b],_=g.left+g.width/2,c=g.top+g.height/2,v=_-w,l=c-m,r=Math.hypot(v,l)||1,D=Math.sin(r/y-T),A=1/(1+r/520),s=R*A*D,q=.028*A*D;u||(B.style.willChange="transform"),B.style.transform=`translate3d(${(v/r*s).toFixed(2)}px, ${(l/r*s).toFixed(2)}px, 0) scale(${(1+q).toFixed(4)}, ${(1-q).toFixed(4)})`}u=!0}},()=>{a.disconnect(),h.forEach(p=>{p.removeAttribute("data-ripple"),p.style.transform="",p.style.willChange=""}),i.report=()=>{}}},[o,e]),t}const qt="h1, h2, h3, h4, p, li, figcaption, .t-mono, .t-mono-label, .readout__value, .facts__value",$t=".entry, .card, .pub, .readout, .flagship, .stack__group, .more__item, .facts__cell",Kt=[[0,35,550],[55,60,210],[-40,15,-470],[30,-25,-1170],[-35,45,-1800],[20,-20,-2440],[-35,65,-3130],[80,15,-3650]];function Zt({reduced:o,isPhone:e}){const t=L.useRef(null),i=L.useRef(null),n=L.useRef(null),[a,h]=L.useState(!1),[u,f]=L.useState(!1),[p,w]=L.useState(!0),[m,R]=L.useState(0),y=L.useRef({paused:!1,cinema:!1}),T=L.useRef({wake:()=>{}}),F=Qt(!o&&!u,qt),b=Wt(!o&&!u,$t);L.useEffect(()=>{y.current={paused:u,cinema:a},T.current.wake()},[u,a]),L.useEffect(()=>{document.documentElement.classList.toggle("voyage-cinema",a);const g=[...document.querySelectorAll("main, .nav, .footer-wrap, .skip")];g.forEach(c=>{c.inert=a});const _=c=>{c.key==="Escape"&&a&&(h(!1),n.current?.focus())};return window.addEventListener("keydown",_),()=>{document.documentElement.classList.remove("voyage-cinema"),g.forEach(c=>{c.inert=!1}),window.removeEventListener("keydown",_)}},[a]),L.useEffect(()=>{const g=t.current,_=T.current;let c;try{c=new bt({canvas:g,antialias:!1,powerPreference:"high-performance"})}catch{const P=requestAnimationFrame(()=>w(!1));return()=>cancelAnimationFrame(P)}c.outputColorSpace=qe,c.toneMapping=Qe,c.toneMappingExposure=1.18,c.setClearColor(198156);const v=new yt,l=new Mt(e?62:48,1,.5,11e3),r=Ht(v,e),D=new Tt(Kt.map(P=>new W(...P)),!1,"catmullrom",.32),A=new It(c);A.addPass(new Bt(v,l));const Z=new re(new z(1,1),.24,.35,.9);A.addPass(Z),A.addPass(new zt);const s={raf:0,last:0,time:0,t:0,target:0,anchors:[],width:1,height:1,chapter:-1,dirty:!0,lost:!1,frames:0,totalMs:0,dpr:Math.min(devicePixelRatio||1,e?1.25:1.5)},q=new z,G=new z,fe=new z,se=new W,$=new W,C=new W,E=new St,N=new _t,S=()=>{const P=window.scrollY;let I=0;for(let j=0;j<s.anchors.length-1;j++)P>=s.anchors[j]&&(I=j);const U=s.anchors[I]||0,d=s.anchors[I+1]||1;s.target=Ee((I+Ee((P-U)/Math.max(1,d-U)))/7),s.dirty=!0,!s.raf&&!document.hidden&&!s.lost&&(s.raf=requestAnimationFrame(le))},O=()=>{const P=Math.max(1,document.documentElement.scrollHeight-innerHeight);s.anchors=Q.chapters.map((I,U)=>U===0?0:Math.min(P,Math.max(0,(document.getElementById(I.id)?.getBoundingClientRect().top||0)+scrollY-72)));for(let I=1;I<8;I++)s.anchors[I]=Math.max(s.anchors[I],s.anchors[I-1]+1);S()},H=()=>{s.width=innerWidth,s.height=innerHeight,c.setPixelRatio(s.dpr),c.setSize(s.width,s.height),A.setPixelRatio(s.dpr),A.setSize(s.width,s.height),r.stars.material.uniforms.uPixelRatio.value=s.dpr,l.aspect=s.width/s.height,l.updateProjectionMatrix(),O()},Re=P=>{q.set((P.clientX/s.width-.5)*2,(P.clientY/s.height-.5)*2)},Fe=()=>q.set(0,0),Ie=new ResizeObserver(O);Ie.observe(document.documentElement),window.addEventListener("resize",H),window.addEventListener("scroll",S,{passive:!0}),window.addEventListener("pointermove",Re,{passive:!0}),document.addEventListener("pointerleave",Fe);let ye=!1;document.fonts?.ready.then(()=>{ye||O()}),H(),s.t=s.target;function le(P){if(s.raf=0,ye||document.hidden||s.lost)return;const I=Math.min((P-(s.last||P))/1e3,.05);s.last=P;const U=o||y.current.paused,d=U?s.target:s.t+(s.target-s.t)*(1-Math.exp(-I*8));s.t=d,U||(s.time+=I);const j=s.time;if(!U||s.dirty){s.dirty=!1,D.getPoint(d,l.position),G.lerp(U?fe:q,1-Math.exp(-I*2.5)),l.position.x+=G.x*7,l.position.y-=G.y*5,se.set(l.position.x+12+Math.sin(d*9)*16,l.position.y-13,l.position.z-600),l.lookAt(se),l.rotateZ(Math.sin(d*10)*.025),l.fov=(e?62:48)+Math.sin(d*Math.PI)*3,l.updateProjectionMatrix(),r.sky.position.copy(l.position),r.sky.material.uniforms.uTravel.value=d,r.updateTime(j),r.body.rotation.y=j*.012,r.planet.visible=d<.245,r.body.material.uniforms.uOpacity.value=1-k(d,.2,.245),r.rings.material.uniforms.uOpacity.value=1-k(d,.2,.245);const Le=140+Math.sin(d*14)**2*120+d*50,ze=Le*Math.tan(Ct.degToRad(l.fov/2)),Xe=e?.5:.65;C.set(l.position.x+ze*l.aspect*(Xe+Math.sin(d*17)*.18),l.position.y-ze*(.37+Math.sin(d*12)*.19),l.position.z-Le),r.probe.position.copy(C),r.probe.position.y+=Math.sin(j*.22)*1.5,N.set(.64+Math.sin(d*8)*.3,.3+d*1.5,-.55+Math.sin(d*12)*.25),E.setFromEuler(N),r.probe.quaternion.copy(E),r.probe.scale.setScalar((e?.38:.65)*(1-k(d,.83,1)*.75)),r.probe.visible=d<.96;const X=k(d,.24,.4);r.nova.visible=d>.15&&d<.44,r.nova.visible&&(r.blast.advance(X),r.star.scale.setScalar(360+Math.sin(X*Math.PI)*700),r.star.material.opacity=(1-k(X,.25,.95))*.95,r.novaCloud.material.uniforms.uOpacity.value=Math.sin(X*Math.PI)*.8,r.novaCloud.quaternion.copy(l.quaternion)),r.remnant.visible=d>.34&&d<.55,r.remnant.material.uniforms.uOpacity.value=k(d,.34,.4)*(1-k(d,.49,.55)),r.pulsar.visible=r.remnant.visible,r.remnant.quaternion.copy(l.quaternion),r.remnant.rotateZ(j*.006),r.pulsar.material.opacity=.7+Math.sin(j*1.4)*.12,r.blackHole.visible=d>.46&&d<.69,r.blackHole.material.uniforms.uOpacity.value=k(d,.46,.51)*(1-k(d,.64,.69)),r.blackHole.quaternion.copy(l.quaternion),r.blackHole.rotateZ(-.12);const ie=k(d,.49,.6);r.companion.visible=r.blackHole.visible&&ie<.98,r.companion.position.set(r.blackHole.position.x+Math.cos(ie*5)*180*(1-ie),30+Math.sin(ie*5)*90*(1-ie),-2390),r.companion.quaternion.copy(l.quaternion),r.companion.scale.setScalar(.7*(1-ie)),r.quasar.visible=d>.61&&d<.86,r.jetGroup.visible=r.quasar.visible,r.quasar.quaternion.copy(l.quaternion),r.quasar.rotateZ(-.3),r.galaxies.visible=d>.77,r.galaxyMaterials.forEach(Ze=>{Ze.uniforms.uOpacity.value=k(d,.77,.82)*.95}),Z.strength=.14+Math.sin(X*Math.PI)*.14,!U&&!y.current.cinema&&X>0&&X<1?($.copy(r.nova.position).project(l),F.current.report({active:!0,x:($.x*.5+.5)*s.width,y:(-$.y*.5+.5)*s.height,radius:Math.pow(X,.6)*s.height*1.7})):F.current.report({active:!1});const Oe=Math.sin(k(d,.53,.66)*Math.PI);!U&&!y.current.cinema&&Oe>.01?($.copy(r.blackHole.position).project(l),b.current.report({active:!0,x:($.x*.5+.5)*s.width,y:(-$.y*.5+.5)*s.height,amplitude:Oe*(e?4:7),wavelength:190,phase:d*90-j*1.4})):b.current.report({active:!1}),A.render(),i.current&&i.current.style.setProperty("--travel",d);const Te=Math.min(7,Math.floor(d*7+.28));s.chapter!==Te&&(s.chapter=Te,R(Te)),!U&&I>0&&(s.frames++,s.totalMs+=I*1e3,s.frames===120&&(s.totalMs/120>27&&s.dpr>.8&&(s.dpr=Math.max(.8,s.dpr-.25),H()),s.frames=0,s.totalMs=0))}!U&&!s.raf&&(s.raf=requestAnimationFrame(le))}_.wake=()=>{s.dirty=!0,s.last=0,!s.raf&&!document.hidden&&(s.raf=requestAnimationFrame(le))};const Me=()=>{cancelAnimationFrame(s.raf),s.last=0,document.hidden||(s.dirty=!0,s.raf=requestAnimationFrame(le))},Be=P=>{P.preventDefault(),s.lost=!0,cancelAnimationFrame(s.raf),h(!1),w(!1)},Ne=()=>{s.lost=!1,s.dirty=!0,w(!0),Me()};return document.addEventListener("visibilitychange",Me),g.addEventListener("webglcontextlost",Be),g.addEventListener("webglcontextrestored",Ne),s.raf||(s.raf=requestAnimationFrame(le)),()=>{ye=!0,_.wake=()=>{},cancelAnimationFrame(s.raf),Ie.disconnect(),window.removeEventListener("resize",H),window.removeEventListener("scroll",S),window.removeEventListener("pointermove",Re),document.removeEventListener("pointerleave",Fe),document.removeEventListener("visibilitychange",Me),g.removeEventListener("webglcontextlost",Be),g.removeEventListener("webglcontextrestored",Ne),r.dispose(),Z.dispose(),A.passes.forEach(P=>{P!==Z&&P.dispose?.()}),A.dispose(),c.dispose()}},[o,e,F,b]);const B=Q.chapters[m];return M.jsxs(M.Fragment,{children:[M.jsx("canvas",{ref:t,className:"voyage","aria-hidden":"true"}),M.jsx("div",{className:"voyage-scrim","aria-hidden":"true"}),M.jsx("div",{className:"voyage-vignette","aria-hidden":"true"}),p?M.jsxs("aside",{className:"voyage-hud","aria-label":"Voyager journey",ref:i,children:[M.jsxs("div",{className:"voyage-hud__location",children:[M.jsx("span",{className:"voyage-hud__signal"}),M.jsxs("span",{className:"voyage-hud__number",children:["0",m+1]}),M.jsxs("div",{children:[M.jsx("span",{className:"voyage-hud__eyebrow",children:Q.title}),M.jsxs("span",{className:"voyage-hud__name",children:[B.name,M.jsxs("span",{children:[" / ",B.place]})]})]})]}),M.jsx("nav",{className:"voyage-hud__route","aria-label":"Journey chapters",children:Q.chapters.map((g,_)=>M.jsx("a",{href:`#${g.id}`,title:g.name,"aria-label":`Chapter ${_+1}: ${g.name}`,"aria-current":m===_?"step":void 0,onClick:c=>{c.preventDefault(),Je(`#${g.id}`)},children:M.jsx("span",{})},g.id))}),M.jsxs("div",{className:"voyage-hud__actions",children:[!o&&M.jsx("button",{className:"voyage-hud__pause","aria-label":u?Q.resume:Q.pause,"aria-pressed":u,onClick:()=>f(g=>!g),children:M.jsx("span",{"aria-hidden":"true",children:u?"▷":"Ⅱ"})}),M.jsxs("button",{ref:n,className:"voyage-hud__toggle","aria-pressed":a,onClick:()=>h(g=>!g),children:[M.jsx("span",{"aria-hidden":"true",children:a?"↙":"↗"}),a?Q.back:Q.view]})]}),a&&M.jsxs("div",{className:"voyage-caption",children:[M.jsxs("span",{children:["0",m+1," / 08"]}),M.jsx("h2",{children:B.name}),M.jsx("p",{children:B.note}),M.jsx("small",{children:Q.exitHint})]},m)]}):M.jsx("p",{className:"visually-hidden",role:"status",children:Q.fallback})]})}export{Zt as default};
