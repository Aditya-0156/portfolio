import{r as V,j as z,s as Lt}from"./index-CmCwaV_7.js";import{M as P,O as Ut,B as ke,F as ze,S as J,U as qe,V as G,W as $e,H as Ge,N as kt,C as It,a as Le,b as W,A as le,c as St,R as Nt,d as Bt,e as Dt,L as jt,f as Ht,g as Vt,h as Ct,i as $t,j as Gt,G as ce,k as Wt,T as tt,l as Re,m as ht,n as we,o as X,p as qt,q as me,D as Ue,P as ye,r as ue,I as Qt,s as at,t as ne,u as rt,v as _t,w as Kt,x as Pt,y as Yt,z as Xt,E as Jt,J as pt,K as Zt,Q as ea,X as ta,Y as aa,Z as oa,_ as ia,$ as sa}from"./three-OwQSDULU.js";const Et={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Me{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const ra=new Ut(-1,1,1,-1,0,1);class na extends ke{constructor(){super(),this.setAttribute("position",new ze([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ze([0,2,0,0,2,0],2))}}const la=new na;class nt{constructor(e){this._mesh=new P(la,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,ra)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class At extends Me{constructor(e,o){super(),this.textureID=o!==void 0?o:"tDiffuse",e instanceof J?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=qe.clone(e.uniforms),this.material=new J({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new nt(this.material)}render(e,o,a){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=a.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(o),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class dt extends Me{constructor(e,o){super(),this.scene=e,this.camera=o,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,o,a){const l=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let c,p;this.inverse?(c=0,p=1):(c=1,p=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(l.REPLACE,l.REPLACE,l.REPLACE),r.buffers.stencil.setFunc(l.ALWAYS,c,4294967295),r.buffers.stencil.setClear(p),r.buffers.stencil.setLocked(!0),e.setRenderTarget(a),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(o),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(l.EQUAL,1,4294967295),r.buffers.stencil.setOp(l.KEEP,l.KEEP,l.KEEP),r.buffers.stencil.setLocked(!0)}}class ca extends Me{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class ua{constructor(e,o){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),o===void 0){const a=e.getSize(new G);this._width=a.width,this._height=a.height,o=new $e(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Ge}),o.texture.name="EffectComposer.rt1"}else this._width=o.width,this._height=o.height;this.renderTarget1=o,this.renderTarget2=o.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new At(Et),this.copyPass.material.blending=kt,this.clock=new It}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,o){this.passes.splice(o,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const o=this.passes.indexOf(e);o!==-1&&this.passes.splice(o,1)}isLastEnabledPass(e){for(let o=e+1;o<this.passes.length;o++)if(this.passes[o].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const o=this.renderer.getRenderTarget();let a=!1;for(let l=0,r=this.passes.length;l<r;l++){const c=this.passes[l];if(c.enabled!==!1){if(c.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(l),c.render(this.renderer,this.writeBuffer,this.readBuffer,e,a),c.needsSwap){if(a){const p=this.renderer.getContext(),v=this.renderer.state.buffers.stencil;v.setFunc(p.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),v.setFunc(p.EQUAL,1,4294967295)}this.swapBuffers()}dt!==void 0&&(c instanceof dt?a=!0:c instanceof ca&&(a=!1))}}this.renderer.setRenderTarget(o)}reset(e){if(e===void 0){const o=this.renderer.getSize(new G);this._pixelRatio=this.renderer.getPixelRatio(),this._width=o.width,this._height=o.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,o){this._width=e,this._height=o;const a=this._width*this._pixelRatio,l=this._height*this._pixelRatio;this.renderTarget1.setSize(a,l),this.renderTarget2.setSize(a,l);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(a,l)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class fa extends Me{constructor(e,o,a=null,l=null,r=null){super(),this.scene=e,this.camera=o,this.overrideMaterial=a,this.clearColor=l,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Le}render(e,o,a){const l=e.autoClear;e.autoClear=!1;let r,c;this.overrideMaterial!==null&&(c=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:a),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=c),e.autoClear=l}}const ha={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Le(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class be extends Me{constructor(e,o,a,l){super(),this.strength=o!==void 0?o:1,this.radius=a,this.threshold=l,this.resolution=e!==void 0?new G(e.x,e.y):new G(256,256),this.clearColor=new Le(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),c=Math.round(this.resolution.y/2);this.renderTargetBright=new $e(r,c,{type:Ge}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let T=0;T<this.nMips;T++){const C=new $e(r,c,{type:Ge});C.texture.name="UnrealBloomPass.h"+T,C.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(C);const S=new $e(r,c,{type:Ge});S.texture.name="UnrealBloomPass.v"+T,S.texture.generateMipmaps=!1,this.renderTargetsVertical.push(S),r=Math.round(r/2),c=Math.round(c/2)}const p=ha;this.highPassUniforms=qe.clone(p.uniforms),this.highPassUniforms.luminosityThreshold.value=l,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new J({uniforms:this.highPassUniforms,vertexShader:p.vertexShader,fragmentShader:p.fragmentShader}),this.separableBlurMaterials=[];const v=[3,5,7,9,11];r=Math.round(this.resolution.x/2),c=Math.round(this.resolution.y/2);for(let T=0;T<this.nMips;T++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(v[T])),this.separableBlurMaterials[T].uniforms.invSize.value=new G(1/r,1/c),r=Math.round(r/2),c=Math.round(c/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=o,this.compositeMaterial.uniforms.bloomRadius.value=.1;const F=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=F,this.bloomTintColors=[new W(1,1,1),new W(1,1,1),new W(1,1,1),new W(1,1,1),new W(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const O=Et;this.copyUniforms=qe.clone(O.uniforms),this.blendMaterial=new J({uniforms:this.copyUniforms,vertexShader:O.vertexShader,fragmentShader:O.fragmentShader,blending:le,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new Le,this.oldClearAlpha=1,this.basic=new St,this.fsQuad=new nt(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,o){let a=Math.round(e/2),l=Math.round(o/2);this.renderTargetBright.setSize(a,l);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(a,l),this.renderTargetsVertical[r].setSize(a,l),this.separableBlurMaterials[r].uniforms.invSize.value=new G(1/a,1/l),a=Math.round(a/2),l=Math.round(l/2)}render(e,o,a,l,r){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const c=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=a.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=a.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let p=this.renderTargetBright;for(let v=0;v<this.nMips;v++)this.fsQuad.material=this.separableBlurMaterials[v],this.separableBlurMaterials[v].uniforms.colorTexture.value=p.texture,this.separableBlurMaterials[v].uniforms.direction.value=be.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[v]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[v].uniforms.colorTexture.value=this.renderTargetsHorizontal[v].texture,this.separableBlurMaterials[v].uniforms.direction.value=be.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[v]),e.clear(),this.fsQuad.render(e),p=this.renderTargetsVertical[v];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(a),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=c}getSeperableBlurMaterial(e){const o=[];for(let a=0;a<e;a++)o.push(.39894*Math.exp(-.5*a*a/(e*e))/e);return new J({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new G(.5,.5)},direction:{value:new G(.5,.5)},gaussianCoefficients:{value:o}},vertexShader:`varying vec2 vUv;
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
				}`})}getCompositeMaterial(e){return new J({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}be.BlurDirectionX=new G(1,0);be.BlurDirectionY=new G(0,1);const pa={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class da extends Me{constructor(){super();const e=pa;this.uniforms=qe.clone(e.uniforms),this.material=new Nt({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new nt(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,o,a){this.uniforms.tDiffuse.value=a.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Bt.getTransfer(this._outputColorSpace)===Dt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===jt?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Ht?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Vt?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Ct?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===$t?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Gt&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(o),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const ma={uniforms:{tDiffuse:{value:null},uCenter:{value:new G(.5,.5)},uAspect:{value:1},uRadius:{value:0},uEnergy:{value:0},uPhase:{value:0},uKind:{value:0}},vertexShader:`
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
  `};function lt(i){let e=i>>>0;return function(){e=e+1831565813|0;let a=Math.imul(e^e>>>15,1|e);return a=a+Math.imul(a^a>>>7,61|a)^a,((a^a>>>14)>>>0)/4294967296}}const ie=()=>new me({color:13225944,metalness:.94,roughness:.3}),mt=()=>new me({color:15265010,metalness:.36,roughness:.52,side:Ue}),vt=()=>new me({color:14263375,metalness:1,roughness:.22}),gt=()=>new me({color:11043887,metalness:.85,roughness:.58}),Ve=()=>new me({color:1974824,metalness:.5,roughness:.66}),Fe=()=>new me({color:10134189,metalness:.9,roughness:.38});function va(){const i=new ce,e=12,o=[];for(let f=0;f<=22;f++){const u=f/22*e;o.push(new G(u,u*u/44))}const a=new P(new Wt(o,72),mt());a.position.y=2.2,i.add(a);const l=new P(new tt(e,.22,8,72),ie());l.rotation.x=Math.PI/2,l.position.y=2.2+e*e/44,i.add(l);for(let f=0;f<12;f++){const n=f/12*Math.PI*2,u=new P(new Re(.16,.5,e*.95),ie());u.position.set(Math.cos(n)*e*.5,1.6,Math.sin(n)*e*.5),u.rotation.y=-n,i.add(u)}const r=new P(new ht(.85,3.4,16),ie());r.position.y=9.6,r.rotation.x=Math.PI,i.add(r);const c=new P(new we(1.5,24,16,0,Math.PI*2,0,Math.PI/2.2),mt());c.position.y=11.4,c.rotation.x=Math.PI,i.add(c);for(let f=0;f<3;f++){const n=f/3*Math.PI*2+.4,u=new P(new X(.12,.12,11.2,6),Fe());u.position.set(Math.cos(n)*e*.46,6.4,Math.sin(n)*e*.46),u.lookAt(new W(0,11.2,0)),u.rotateX(Math.PI/2),i.add(u)}const p=new ce;p.position.y=-2.6;const v=new P(new X(4.3,4.3,2.4,10),Ve());p.add(v);for(let f=0;f<10;f++){const n=f/10*Math.PI*2+Math.PI/10,u=new P(new Re(2.5,2.1,.5),f%3===0?gt():ie());u.position.set(Math.cos(n)*4.35,0,Math.sin(n)*4.35),u.rotation.y=-n+Math.PI/2,p.add(u)}const F=new P(new X(4.4,4.4,.35,10),ie());F.position.y=1.35,p.add(F);const O=new P(new tt(4.45,.22,8,10),vt());O.rotation.x=Math.PI/2,O.position.y=-1.2,p.add(O);const T=new P(new we(2.1,24,20),gt());T.position.y=-3.2,p.add(T);const C=new P(new ht(.55,1.3,12),Ve());C.position.set(0,-5.2,0),p.add(C),i.add(p);const S=new P(new X(.26,.26,12,8),Fe());S.rotation.z=Math.PI/2,S.position.set(-9.5,-3.4,0),i.add(S);for(let f=0;f<3;f++){const n=-13.2-f*3.3,u=new P(new X(1.05,1.05,2.8,14),Ve());u.rotation.z=Math.PI/2,u.position.set(n,-3.4,0),i.add(u);for(let h=0;h<6;h++){const s=h/6*Math.PI*2,d=new P(new Re(2.6,.08,1.5),ie());d.position.set(n,-3.4+Math.cos(s)*1.4,Math.sin(s)*1.4),d.rotation.x=-s,i.add(d)}}const _=new P(new X(.22,.22,13,8),Fe());_.rotation.z=Math.PI/2,_.position.set(10,-3,0),i.add(_);const E=new P(new Re(2.6,2.2,2.4),Ve());E.position.set(16.6,-3,0),i.add(E),[[.75,.5],[-.75,-.4]].forEach(([f,n])=>{const u=new P(new X(.42,.5,3.1,14),ie());u.rotation.x=Math.PI/2,u.position.set(16.6+n,-3+f,-2.2),i.add(u);const h=new P(new qt(.42,16),new me({color:724500,metalness:1,roughness:.1}));h.position.set(16.6+n,-3+f,-3.76),i.add(h)});const x=new ce,M=new P(new X(.1,.13,58,6),Fe());M.position.y=29,x.add(M);for(let f=1;f<=3;f++){const n=new P(new Re(.7,.7,.7),ie());n.position.y=f*17,x.add(n)}x.position.set(-3.4,-1.5,3),x.rotation.set(.5,0,.72),i.add(x);const b=new P(new X(1.85,1.85,.16,48),vt());b.position.set(3.6,-2.6,4.2),b.rotation.set(Math.PI/2,0,.2),i.add(b);const g=new P(new tt(1.85,.1,8,40),ie());return g.position.copy(b.position),g.rotation.copy(b.rotation),i.add(g),[-1,1].forEach(f=>{const n=new P(new X(.075,.075,40,6),Fe());n.position.set(f*2.2,-4.4,-2),n.rotation.set(-.85,0,f*.55),n.translateY(20),i.add(n)}),{group:i,dish:a,bus:p,magBoom:x}}const ve=`
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
`,Te=`
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
`,xt=`
${ve}
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
}`,yt=`
${ve}
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
${Te}
}`,ga=`
${ve}
uniform float uTime;uniform float uRadius;
varying vec3 vDirection;varying vec3 vWorld;
void main(){
  vec3 d=normalize(position);vDirection=d;
  float ripple=fbm(d*7.+vec3(uTime*.1,0.,uTime*.035));
  vec3 p=d*uRadius*(.93+ripple*.16);vWorld=(modelMatrix*vec4(p,1.)).xyz;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
}`,xa=`
${ve}
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
${Te}
}`,ya=`
varying vec2 vUv;
void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
`,wa=`
uniform float uFlash;uniform float uOpacity;uniform float uHeat;varying vec2 vUv;
void main(){
  vec2 p=(vUv-.5)*2.;float r=length(p);
  float glow=exp(-r*8.)*(1.-smoothstep(.7,1.,r));
  float bloom=exp(-r*r*35.);
  float ray=exp(-abs(p.y)*190.)*exp(-abs(p.x)*4.4);
  vec3 warm=mix(vec3(1.,.2,.018),vec3(.3,.62,1.),uHeat);
  vec3 color=warm*glow*1.1+vec3(.75,.9,1.)*(bloom*.7+ray*.5)*uFlash;
  gl_FragColor=vec4(color,uOpacity);
${Te}
}`,ba=`
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
}`,Ma=`
${ve}
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
${Te}
}`,Ta=`
attribute float aHeat;attribute float aAlong;
uniform float uRadius;uniform float uTime;
varying float vHeat;varying float vAlong;
void main(){
  vHeat=aHeat;vAlong=aAlong;
  vec3 p=position*uRadius;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
}`,Sa=`
${ve}
uniform float uOpacity;uniform float uTime;varying float vHeat;varying float vAlong;
void main(){
  float threads=.55+.45*sin(vAlong*93.+vHeat*37.);
  float alpha=uOpacity*threads*smoothstep(0.,.12,vAlong)*(1.-smoothstep(.82,1.,vAlong));
  vec3 color=gasColor(vHeat)*1.8+vec3(.15,.085,.012);
  gl_FragColor=vec4(color,alpha);
${Te}
}`,Ca=`
attribute float aSize;attribute float aSeed;
uniform float uRadius;uniform float uOpacity;
varying float vAlpha;varying float vHeat;
void main(){
  vec3 p=position*uRadius;vec4 view=modelViewMatrix*vec4(p,1.);
  gl_Position=projectionMatrix*view;
  gl_PointSize=clamp(aSize*440./max(40.,-view.z),1.,5.);
  vAlpha=uOpacity;vHeat=aSeed;
}`,_a=`
${ve}
varying float vAlpha;varying float vHeat;
void main(){
  float r=length(gl_PointCoord-.5)*2.;float alpha=exp(-r*r*4.)*(1.-smoothstep(.5,1.,r));
  gl_FragColor=vec4(gasColor(vHeat)*2.,alpha*vAlpha);
${Te}
}`;function de(i,e,o={}){return new J({vertexShader:i,fragmentShader:e,uniforms:{uTime:{value:0},uOpacity:{value:1},...o},transparent:!0,forceSinglePass:!0,depthWrite:!1,blending:le})}function it(i){const e=i()*2-1,o=i()*Math.PI*2,a=Math.sqrt(1-e*e);return new W(a*Math.cos(o),e*.83,a*Math.sin(o))}function Pa(i,e){const o=[],a=[],l=[],r=[],c=i?66:125,p=new W(0,1,0),v=new W,F=new W,O=new W,T=(S,_,E,x,M)=>{F.subVectors(_,S).normalize(),O.crossVectors(F,p).normalize().multiplyScalar(E);const b=new W().crossVectors(F,O).normalize().multiplyScalar(E);for(let g=0;g<3;g++){const f=g/3*Math.PI*2,n=(g+1)/3*Math.PI*2,u=O.clone().multiplyScalar(Math.cos(f)).addScaledVector(b,Math.sin(f)),h=O.clone().multiplyScalar(Math.cos(n)).addScaledVector(b,Math.sin(n));for(const[s,d,y]of[[S,u,M],[_,u,M+.065],[_,h,M+.065],[S,u,M],[_,h,M+.065],[S,h,M]])v.copy(s).add(d),o.push(v.x,v.y,v.z),a.push(x),l.push(y)}};for(let S=0;S<c;S++){const _=it(e),E=it(e),x=.25+e()*.4,M=.19+e()*.32,b=e()*Math.PI*2,g=e(),f=55e-5+e()*.0013;let n;for(let u=0;u<=14;u++){const h=u/14,s=x+h*M,d=_.clone().multiplyScalar(s);d.addScaledVector(E,Math.sin(h*3.6+b)*.052),d.y+=Math.sin(h*8.4+b)*.014,n&&T(n,d,f*(.95-h*.6),g,h*.88),n=d,u%3===0&&r.push({center:d.clone(),heat:g})}}const C=new ke;return C.setAttribute("position",new ze(o,3)),C.setAttribute("aHeat",new ze(a,1)),C.setAttribute("aAlong",new ze(l,1)),{geometry:C,centers:r}}function Ea(i,e){const o=new ye(1,1),a=new Qt;a.index=o.index,a.attributes.position=o.attributes.position,a.attributes.uv=o.attributes.uv;const l=new Float32Array(i.length*3),r=new Float32Array(i.length),c=new Float32Array(i.length);return i.forEach(({center:p},v)=>{l.set([p.x,p.y,p.z],v*3),r[v]=.07+e()*.17,c[v]=e()}),a.setAttribute("aCenter",new at(l,3)),a.setAttribute("aSize",new at(r,1)),a.setAttribute("aSeed",new at(c,1)),a.instanceCount=i.length,a}const Oe=(i,e,o)=>ne.smoothstep(o,i,e),Rt=i=>Math.pow(Math.max(0,(i-.36)/.64),.67);function wt(i){return 34+Rt(ne.clamp(i,0,1))*720}function Aa(i=!1){const e=new ce,o=lt(19870223),a=new we(1,i?64:104,i?40:64),l=[],r=(n,u,h=P)=>{const s=new h(n,u);return s.frustumCulled=!1,e.add(s),l.push(u),s},c=r(a,de(ga,xa,{uRadius:{value:52},uHeat:{value:0}})),p=r(new ye(1,1),de(ya,wa,{uFlash:{value:0},uHeat:{value:0}}));p.renderOrder=5;const v=[];for(let n=0;n<2;n++){const u=r(a,de(xt,yt,{uRadius:{value:0},uLayer:{value:n*1.37},uShock:{value:0}}));u.material.side=Ue,u.rotation.set(n*.8,n*1.1,n*.45),v.push(u)}const F=r(a,de(xt,yt,{uRadius:{value:0},uLayer:{value:5.2},uShock:{value:1}}));F.material.side=Ue;const{geometry:O,centers:T}=Pa(i,o),C=r(O,de(Ta,Sa,{uRadius:{value:0}})),S=r(Ea(T,o),de(ba,Ma,{uRadius:{value:0}})),_=i?1700:4800,E=new Float32Array(_*3),x=new Float32Array(_),M=new Float32Array(_);for(let n=0;n<_;n++){const u=it(o).multiplyScalar(.28+Math.pow(o(),.6)*.83);E.set([u.x,u.y,u.z],n*3),x[n]=.6+Math.pow(o(),3)*2.6,M[n]=o()}const b=new ke;b.setAttribute("position",new ue(E,3)),b.setAttribute("aSize",new ue(x,1)),b.setAttribute("aSeed",new ue(M,1));const g=r(b,de(Ca,_a,{uRadius:{value:0}}),rt);function f(n,u,h){const s=ne.clamp(n,0,1),d=Oe(.21,.36,s),y=Rt(s),I=Math.exp(-Math.pow((s-.377)/.026,2)),m=Oe(.36,.435,s),A=1-Oe(.88,1,s)*.25;for(const L of l)L.uniforms.uTime.value=u;c.material.uniforms.uRadius.value=s<.36?ne.lerp(54+Math.sin(u*1.1)*1.1,14,d):8+Math.exp(-y*13)*22,c.material.uniforms.uHeat.value=Math.max(d,m),c.material.uniforms.uOpacity.value=s<.36?1:.72,p.quaternion.copy(h.quaternion),p.scale.setScalar(s<.36?410-d*180:230+I*1350),p.material.uniforms.uHeat.value=d,p.material.uniforms.uFlash.value=I*3,p.material.uniforms.uOpacity.value=s<.36?.75:.35+I*1.8,v.forEach((L,t)=>{L.material.uniforms.uRadius.value=(30+y*595)*(1-t*.105),L.material.uniforms.uOpacity.value=m*A*(t===0?1:.55),L.visible=m>.001}),F.material.uniforms.uRadius.value=wt(s),F.material.uniforms.uOpacity.value=m*(1-Oe(.52,1,s)*.7),F.visible=m>.001,C.material.uniforms.uRadius.value=30+y*655,C.material.uniforms.uOpacity.value=m*A*.67,C.visible=m>.001,S.material.uniforms.uRadius.value=30+y*655,S.material.uniforms.uOpacity.value=m*A*.8,S.visible=m>.001,g.material.uniforms.uRadius.value=28+y*760,g.material.uniforms.uOpacity.value=m*(1-Oe(.55,1,s)*.55),g.visible=m>.001}return{group:e,update:f,screenRadius:wt}}const Qe=`
#include <tonemapping_fragment>
#include <colorspace_fragment>
`,Ra=`
varying vec2 vUv; varying vec3 vPosition;
void main(){vUv=uv;vPosition=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
`,Fa=`
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
  ${Qe}
}`,Oa=`
uniform float uTime,uOpacity; varying vec2 vUv; varying vec3 vPosition;
void main(){
  float r=length(vPosition.xy)/115.;
  float a=atan(vPosition.y,vPosition.x);
  float lanes=.55+.45*sin(a*3.+log(max(.02,r))*12.-uTime*.7);
  float rings=.55+.45*sin(r*145.+sin(a*4.)*.8);
  float envelope=exp(-r*2.8)*(1.-smoothstep(.65,1.,r));
  vec3 color=mix(vec3(.35,.22,.8),vec3(1.9,.98,.45),exp(-r*3.));
  gl_FragColor=vec4(color,envelope*(.35+lanes*.6+rings*.2)*uOpacity);
  ${Qe}
}`,za=`
uniform float uOpacity,uTime; varying vec2 vUv; varying vec3 vPosition;
void main(){
  vec2 p=(vUv-.5)*2.;float r=length(p);
  float halo=exp(-r*8.5)*(1.-smoothstep(.7,1.,r));
  float core=exp(-r*r*650.);
  float flare=exp(-abs(p.y)*180.)*exp(-abs(p.x)*8.);
  vec3 color=vec3(.1,.25,.7)*halo+vec3(2.4,2.5,3.)*core+vec3(.3,.5,1.)*flare*.18;
  gl_FragColor=vec4(color,uOpacity);
  ${Qe}
}`;function ot(i){return new J({vertexShader:Ra,fragmentShader:i,uniforms:{uTime:{value:0},uOpacity:{value:0}},transparent:!0,depthWrite:!1,blending:le,side:Ue,forceSinglePass:!0})}function La(i){const e=new ce,o=new ce;o.rotation.set(.16,.12,-.52),e.add(o);const a=[],l=new P(new _t(2,115,i?96:160,8),ot(Oa));l.rotation.x=1.13,o.add(l),a.push(l.material);const r=new P(new we(7,24,16),new St({color:new Le(3.8,3.4,2.8),transparent:!0}));o.add(r);const c=new P(new ye(540,540),ot(za));e.add(c),a.push(c.material);const p=new X(50,2.5,690,i?20:32,64,!0),v=new X(5,.7,650,12,20,!0);for(const x of[-1,1])for(const M of[p,v]){const b=new P(M,ot(Fa));b.position.y=x*(M===p?345:325),x<0&&(b.rotation.z=Math.PI),o.add(b),a.push(b.material)}const F=lt(1963),O=i?350:850,T=new Float32Array(O*3),C=new Float32Array(O);for(let x=0;x<O;x++){const M=F()*Math.PI*2,b=Math.sqrt(F());T.set([Math.cos(M)*b,x%2?1:-1,Math.sin(M)*b],x*3),C[x]=F()}const S=new ke;S.setAttribute("position",new ue(T,3)),S.setAttribute("aSeed",new ue(C,1));const _=new J({uniforms:{uTime:{value:0},uOpacity:{value:0}},transparent:!0,depthWrite:!1,blending:le,vertexShader:`attribute float aSeed;uniform float uTime,uOpacity;varying float vAlpha;
    void main(){float t=fract(aSeed+uTime*.055);vec3 p=vec3(position.x*(2.+t*37.),position.y*t*690.,position.z*(2.+t*37.));
    vec4 view=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*view;gl_PointSize=clamp(900./max(100.,-view.z),1.,3.);
    vAlpha=sin(t*3.14159)*uOpacity;}`,fragmentShader:`varying float vAlpha;void main(){float r=length(gl_PointCoord-.5)*2.;gl_FragColor=vec4(.4,.78,1.4,exp(-r*r*5.)*vAlpha);${Qe}}`}),E=new rt(S,_);return E.frustumCulled=!1,o.add(E),a.push(_),{group:e,update(x,M,b){c.quaternion.copy(M.quaternion),r.material.opacity=b,a.forEach(g=>{g.uniforms.uTime.value=x,g.uniforms.uOpacity.value=b})}}}const st=i=>i<0?0:i>1?1:i,Q=(i,e,o)=>st((i-e)/(o-e));function Ua(i,e=256){const o=document.createElement("canvas");o.width=o.height=e;const a=o.getContext("2d"),l=a.createRadialGradient(e/2,e/2,0,e/2,e/2,e/2);i.forEach(([c,p])=>l.addColorStop(c,p)),a.fillStyle=l,a.fillRect(0,0,e,e);const r=new Kt(o);return r.colorSpace=Pt,r}function ka(i,e,o=1,a=!0){const l=new Yt(new Xt({map:i,blending:le,depthWrite:!1,depthTest:!0,transparent:!0,opacity:o,fog:a}));return l.scale.set(e,e,1),l}const Ie=`
float hash(vec3 p) { p = fract(p * .3183099 + vec3(.1,.2,.3)); p *= 17.; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float noise3(vec3 p) {
  vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
    mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
}
float fbm(vec3 p) { float v=0., a=.5; for(int i=0;i<5;i++){ v+=a*noise3(p); p=p*2.03+vec3(17.1,9.2,13.7); a*=.48; } return v; }
`,Ia=`
varying vec3 vLocal; varying vec3 vWorld; varying vec3 vNormal; varying vec2 vUv;
void main(){ vUv=uv; vLocal=position; vWorld=(modelMatrix*vec4(position,1.)).xyz;
 vNormal=normalize(mat3(modelMatrix)*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }
`,Na=`
${Ie}
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
`,Ba=`
${Ie}
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
`,Da=`
${Ie}
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
`,ja=`
${Ie}
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
`,bt=`
${Ie}
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
`;function xe(i,e={},o={}){return new J({vertexShader:Ia,fragmentShader:i,uniforms:{uTime:{value:0},...e},...o})}function Ha(i,e){const o=[],a=new P(new we(6200,32,20),xe(Na,{uTravel:{value:0}},{side:Zt,depthWrite:!1}));a.renderOrder=-10,i.add(a),o.push(a.material);const l=lt(1977),r=e?2800:7200,c=new Float32Array(r*3),p=new Float32Array(r*3),v=new Float32Array(r);for(let m=0;m<r;m++){c.set([(l()-.5)*6500,(l()-.5)*4100,800-l()*8500],m*3);const A=l(),L=.25+Math.pow(l(),3)*1.6;p.set([L*(A>.7?1:.72),L*(A>.7?.77:.84),L*(A>.7?.51:1)],m*3),v[m]=.65+Math.pow(l(),7)*2.4}const F=new ke;F.setAttribute("position",new ue(c,3)),F.setAttribute("color",new ue(p,3)),F.setAttribute("aSize",new ue(v,1));const O=new rt(F,new J({uniforms:{uPixelRatio:{value:1},uTime:{value:0}},vertexShader:`attribute float aSize; varying vec3 vColor; uniform float uPixelRatio; uniform float uTime;
    void main(){vec4 p=modelViewMatrix*vec4(position,1.); vColor=color;
    gl_PointSize=clamp(aSize*(600./max(300.,-p.z)),.65,3.5)*uPixelRatio;
    gl_Position=projectionMatrix*p;}`,fragmentShader:`varying vec3 vColor; void main(){float r=length(gl_PointCoord-.5)*2.;
    float a=exp(-r*r*4.)*(1.-smoothstep(.65,1.,r)); gl_FragColor=vec4(vColor,a);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    }`,vertexColors:!0,transparent:!0,depthWrite:!1,blending:le}));i.add(O);const T=new ce;T.position.set(190,25,-180),T.rotation.z=.3;const C=new P(new we(170,96,64),xe(Ba,{uOpacity:{value:1}},{transparent:!0}));T.add(C),o.push(C.material),e&&T.position.set(80,150,-180);const S=new P(new _t(207,390,256,1),xe(Da,{uInner:{value:207},uOuter:{value:390},uOpacity:{value:1},uPlanetCenter:{value:T.position}},{side:Ue,transparent:!0,depthWrite:!1}));S.rotation.x=-Math.PI/2+.17,T.add(S),i.add(T);const{group:_}=va();_.scale.setScalar(.69),i.add(_),i.add(new Jt(11060713,4600095,1.8));const E=new pt(16770493,3.3);E.position.set(-350,260,400),i.add(E);const x=new pt(7780095,2.5);x.position.set(350,-100,-600),i.add(x);const M=Ua([[0,"rgba(235,249,255,1)"],[.045,"rgba(151,208,255,.9)"],[.2,"rgba(72,139,255,.18)"],[1,"rgba(0,0,0,0)"]]),b=Aa(e),g=b.group;g.position.set(e?35:170,25,-1050),i.add(g);const f=new P(new ye(1100,950),xe(bt,{uKind:{value:0},uOpacity:{value:1},uVariant:{value:0}},{transparent:!0,depthWrite:!1,blending:le}));f.position.set(e?35:180,0,-1750),i.add(f),o.push(f.material);const n=ka(M,170,.9,!1);n.position.copy(f.position),i.add(n);function u(m,A,L,t){const N=new P(new ye(m,m),xe(ja,{uOpacity:{value:1}},{transparent:!0,depthWrite:!1}));return N.position.set(e?A*.22:A,L,t),i.add(N),o.push(N.material),N}const h=u(720,165,30,-2410),s=La(e),d=s.group;d.position.set(e?75:235,30,-3090),i.add(d);const y=new ce;i.add(y);const I=[];return[[230,70,-4050,850,.32],[-370,190,-4470,540,-.5],[560,-180,-4490,650,.8],[-150,-80,-4940,1150,-.1]].forEach(([m,A,L,t,N],$)=>{const Z=new P(new ye(t,t*[.72,.46,.95,.58][$]),xe(bt,{uKind:{value:1},uOpacity:{value:.95},uVariant:{value:$}},{transparent:!0,depthWrite:!1,blending:le}));Z.position.set(e?m*.55:m,A,L),Z.rotation.z=N,y.add(Z),o.push(Z.material),I.push(Z.material)}),{sky:a,stars:O,planet:T,body:C,rings:S,probe:_,nova:g,supernova:b,remnant:f,pulsar:n,blackHole:h,quasar:d,quasarSystem:s,galaxies:y,galaxyMaterials:I,updateTime(m){o.forEach(A=>{A.uniforms.uTime.value=m})},dispose(){const m=new Set,A=new Set,L=new Set([M]);i.traverse(t=>{t.geometry&&m.add(t.geometry),t.material&&(Array.isArray(t.material)?t.material:[t.material]).forEach(N=>{A.add(N),N.map&&L.add(N.map)})}),m.forEach(t=>t.dispose()),A.forEach(t=>t.dispose()),L.forEach(t=>t.dispose())}}}const te={title:"VOYAGER / A JOURNEY BEYOND",view:"View voyage",back:"Back to portfolio",pause:"Pause motion",resume:"Resume motion",exitHint:"Scroll to travel · Esc to return",fallback:"The voyage is unavailable on this device. All portfolio content is available below.",chapters:[{id:"top",name:"Departure",place:"The outer solar system",note:"Every journey begins with a little curiosity."},{id:"now",name:"Ring crossing",place:"Beyond the familiar",note:"A world of ice, dust, and impossible scale."},{id:"work",name:"Stellar forge",place:"The death of a star",note:"An ending that becomes the beginning of everything."},{id:"projects",name:"Afterglow",place:"Inside the remnant",note:"The quiet architecture left behind by light."},{id:"research",name:"Event horizon",place:"Where light bends",note:"At the edge of what we can know."},{id:"stack",name:"The lighthouse",place:"An active galactic nucleus",note:"A small point of origin. An extraordinary reach."},{id:"education",name:"Island universes",place:"The galactic frontier",note:"There is always a larger world."},{id:"contact",name:"Beyond",place:"The open universe",note:"The next chapter is still unwritten."}]},We=i=>Math.max(0,Math.min(1,i)),Mt=i=>{const e=We(i);return e*e*(3-2*e)},Va=["--forge-x","--forge-y","--forge-r","--forge-width","--forge-heat","--forge-cooling"],$a=["--nova-dx","--nova-dy","--nova-scale","--nova-blur","--nova-heat","--matter-origin-x","--matter-origin-y"];function Ga(i){let e=0,o=0;for(let a=i;a;a=a.offsetParent)e+=a.offsetLeft,o+=a.offsetTop,a!==i&&(e+=a.clientLeft,o+=a.clientTop);return{left:e,top:o,width:i.offsetWidth,height:i.offsetHeight}}function Wa(i,e,o=""){const a=V.useRef({report:()=>{}});return V.useEffect(()=>{if(!i||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const l=a.current,r=Array.from(document.querySelectorAll(e)),c=o?Array.from(document.querySelectorAll(o)):[],p=new Set(r),v=new Set(c),F=new Set,O=new Set,T=new Set,C=new Set,S=new Map,_=new Map;let E=!0,x=0;const M=s=>{s.removeAttribute("data-forge"),s.classList.remove("is-forging"),Va.forEach(d=>s.style.removeProperty(d)),T.delete(s)},b=s=>{s.removeAttribute("data-nova-surface"),s.classList.remove("is-nova-matter"),$a.forEach(d=>s.style.removeProperty(d)),C.delete(s)},g=()=>{T.forEach(M),C.forEach(b),_.clear(),x=0},f=new IntersectionObserver(s=>{s.forEach(({target:d,isIntersecting:y})=>{p.has(d)&&(y?F.add(d):(F.delete(d),M(d))),v.has(d)&&(y?O.add(d):(O.delete(d),b(d)))})},{rootMargin:"18% 0px"});new Set([...r,...c]).forEach(s=>f.observe(s));const n=()=>{E=!0},u=new ResizeObserver(n);u.observe(document.documentElement),c.forEach(s=>u.observe(s)),window.addEventListener("resize",n);let h=!1;return document.fonts?.ready.then(()=>{h||n()}),l.report=({active:s,x:d=0,y=0,radius:I=0,progress:m=.5,energy:A=1,time:L})=>{if(!s||!Number.isFinite(d+y+I)){g();return}const t=Number.isFinite(L)?L:performance.now()/1e3,N=We(A),$=1-Mt((m-.7)/.3),Z=innerWidth<600,ae=Z?100:170,se=window.scrollX,Ne=window.scrollY,Se=Array.from(F),Be=Array.from(O);E&&(c.forEach(R=>S.set(R,Ga(R))),E=!1);const Ce=Se.map(R=>R.getBoundingClientRect()),_e=Be.map(R=>{const j=S.get(R);if(!j)return null;const B=j.left-se,oe=j.top-Ne,re=B+j.width/2-d,q=oe+j.height/2-y,fe=Math.hypot(re,q)||1,he=Math.hypot(Math.max(B-d,0,d-B-j.width),Math.max(oe-y,0,y-oe-j.height))*.65+fe*.35;let K=_.get(R);I<x&&I<he-ae*1.1&&(_.delete(R),K=void 0);const U=Mt((I-he+ae)/ae);!K&&U>0&&(K={prepTime:t,time:null},_.set(R,K)),K&&K.time===null&&(I>=he||t-K.prepTime>.32)&&(K.time=t-We((I-he)/(ae*3))*1.3);const k=K?.time!=null,H=k?Math.max(0,t-K.time):0,w=k?We(H/1.2):0,D=k?Math.pow(1-w,3):U,De=k?Math.sin(w*Math.PI)*Math.pow(1-w,2):0,je=(-(Z?62:94)*D+42*De)*N*$,Y=(k?Math.pow(1-w,1.5):U*.62)*N*$;return{el:R,dx:re/fe*je,dy:q/fe*je,scale:1-.13*D*N*$,blur:1.4*D*N*$,heat:Y,originX:d-B,originY:y-oe}});Se.forEach((R,j)=>{const B=Ce[j],oe=Math.hypot(B.left+B.width/2-d,B.top+B.height/2-y),re=Math.exp(-Math.pow((I-oe)/ae,2))*N*$;R.setAttribute("data-forge",""),R.classList.add("is-forging");const q=R.style;q.setProperty("--forge-x",`${(d-B.left).toFixed(1)}px`),q.setProperty("--forge-y",`${(y-B.top).toFixed(1)}px`),q.setProperty("--forge-r",`${Math.max(0,I).toFixed(1)}px`),q.setProperty("--forge-width",`${ae}px`),q.setProperty("--forge-heat",re.toFixed(3)),q.setProperty("--forge-cooling",(N*$).toFixed(3)),T.add(R)}),_e.forEach(R=>{if(!R)return;const{el:j}=R;if(R.heat<.001&&Math.abs(R.dx)+Math.abs(R.dy)<.01){C.has(j)&&b(j);return}j.setAttribute("data-nova-surface",""),j.classList.add("is-nova-matter");const B=j.style;B.setProperty("--nova-dx",`${R.dx.toFixed(2)}px`),B.setProperty("--nova-dy",`${R.dy.toFixed(2)}px`),B.setProperty("--nova-scale",R.scale.toFixed(4)),B.setProperty("--nova-blur",`${R.blur.toFixed(2)}px`),B.setProperty("--nova-heat",R.heat.toFixed(3)),B.setProperty("--matter-origin-x",`${R.originX.toFixed(1)}px`),B.setProperty("--matter-origin-y",`${R.originY.toFixed(1)}px`),C.add(j)}),x=I},()=>{h=!0,f.disconnect(),u.disconnect(),window.removeEventListener("resize",n),g(),l.report=()=>{}}},[i,e,o]),a}const qa=["--gravity-x","--gravity-y","--gravity-sx","--gravity-sy","--gravity-angle","--gravity-heat"];function Qa(i){let e=0,o=0;for(let a=i;a;a=a.offsetParent)e+=a.offsetLeft,o+=a.offsetTop,a!==i&&(e+=a.clientLeft,o+=a.clientTop);return{left:e,top:o,width:i.offsetWidth,height:i.offsetHeight}}function Ka(i,e){const o=V.useRef({report:()=>{}});return V.useEffect(()=>{if(!i||matchMedia("(prefers-reduced-motion: reduce)").matches)return;const a=o.current,l=[...document.querySelectorAll(e)],r=new Set,c=new Set,p=new Map;let v=!0,F=!1;const O=E=>{E.removeAttribute("data-ripple"),qa.forEach(x=>E.style.removeProperty(x)),c.delete(E)},T=()=>c.forEach(O),C=new IntersectionObserver(E=>{E.forEach(({target:x,isIntersecting:M})=>{M?r.add(x):(r.delete(x),O(x))})},{rootMargin:"15% 0px"});l.forEach(E=>C.observe(E));const S=()=>{v=!0},_=new ResizeObserver(S);return _.observe(document.documentElement),l.forEach(E=>_.observe(E)),window.addEventListener("resize",S),document.fonts?.ready.then(()=>{F||S()}),a.report=({active:E,x,y:M,amplitude:b=0,wavelength:g=120,phase:f=0,energy:n=1})=>{if(!E||!Number.isFinite(x+M+b)){T();return}v&&(l.forEach(s=>p.set(s,Qa(s))),v=!1);const u=Math.max(0,Math.min(1,n));[...r].map(s=>{const d=p.get(s),y=d.left-scrollX+d.width/2-x,I=d.top-scrollY+d.height/2-M,m=Math.hypot(y,I)||1,A=1/(1+m/680),L=Math.sin(m/Math.max(1,g)-f),N=-u*A*(innerWidth<600?11:21)+b*A*L,$=.024*u*A*L;return{el:s,x:y/m*N,y:I/m*N,sx:1+$,sy:1-$,angle:Math.max(-1.05,Math.min(1.05,y/Math.max(180,m)*L*u*.8)),heat:Math.abs(L)*u*A}}).forEach(s=>{const{el:d}=s;d.setAttribute("data-ripple","");const y=d.style;y.setProperty("--gravity-x",`${s.x.toFixed(2)}px`),y.setProperty("--gravity-y",`${s.y.toFixed(2)}px`),y.setProperty("--gravity-sx",s.sx.toFixed(4)),y.setProperty("--gravity-sy",s.sy.toFixed(4)),y.setProperty("--gravity-angle",`${s.angle.toFixed(3)}deg`),y.setProperty("--gravity-heat",s.heat.toFixed(3)),c.add(d)})},()=>{F=!0,C.disconnect(),_.disconnect(),window.removeEventListener("resize",S),T(),a.report=()=>{}}},[i,e]),o}const Ya="#work h2, #work h3, #work p, #work li, #work .t-mono, #work .t-mono-label, #projects h2, #projects h3, #projects p, #projects .t-mono",Xa="#work .entry, #projects .projects__intro, #projects .flagship, #projects .card",Ja="#research .readout, #research .research__title, #research .research__p, #research .pub, #stack .stack__group",Tt=Array.from({length:28},(i,e)=>({angle:e*2.399963,reach:.72+e*17%29/42,depth:.85+e*11%23/21})),Za=[[0,35,550],[55,60,210],[-40,15,-470],[30,-25,-1170],[-35,45,-1800],[20,-20,-2440],[-35,65,-3130],[80,15,-3650]];function ao({reduced:i,isPhone:e}){const o=V.useRef(null),a=V.useRef(null),l=V.useRef(null),r=V.useRef(null),[c,p]=V.useState(!1),[v,F]=V.useState(!1),[O,T]=V.useState(!0),[C,S]=V.useState(0),_=V.useRef({paused:!1,cinema:!1}),E=V.useRef({wake:()=>{}}),x=Wa(!i&&!v,Ya,Xa),M=Ka(!i&&!v,Ja);V.useEffect(()=>{_.current={paused:v,cinema:c},E.current.wake()},[v,c]),V.useEffect(()=>{document.documentElement.classList.toggle("voyage-cinema",c);const g=[...document.querySelectorAll("main, .nav, .footer-wrap, .skip")];g.forEach(n=>{n.inert=c});const f=n=>{n.key==="Escape"&&c&&(p(!1),l.current?.focus())};return window.addEventListener("keydown",f),()=>{document.documentElement.classList.remove("voyage-cinema"),g.forEach(n=>{n.inert=!1}),window.removeEventListener("keydown",f)}},[c]),V.useEffect(()=>{const g=o.current,f=E.current;let n;try{n=new ea({canvas:g,antialias:!1,powerPreference:"high-performance"})}catch{const U=requestAnimationFrame(()=>T(!1));return()=>cancelAnimationFrame(U)}n.outputColorSpace=Pt,n.toneMapping=Ct,n.toneMappingExposure=1.18,n.setClearColor(198156);const u=new ta,h=new aa(e?62:48,1,.5,11e3),s=Ha(u,e),d=new oa(Za.map(U=>new W(...U)),!1,"catmullrom",.32),y=new ua(n);y.addPass(new fa(u,h));const I=new be(new G(1,1),.24,.35,.9);y.addPass(I);const m=new At(ma);y.addPass(m),y.addPass(new da);const A=r.current,L=[...A.querySelectorAll(".voyage-ejecta")],t={raf:0,last:0,time:0,t:0,target:0,anchors:[],width:1,height:1,chapter:-1,dirty:!0,lost:!1,gateOpen:document.documentElement.classList.contains("light-gate-open"),frames:0,totalMs:0,dpr:Math.min(devicePixelRatio||1,e?1.25:1.5)},N=new G,$=new G,Z=new G,ae=new W,se=new W,Ne=new W,Se=new sa,Be=new ia,Ce=()=>{const U=window.scrollY;let k=0;for(let D=0;D<t.anchors.length-1;D++)U>=t.anchors[D]&&(k=D);const H=t.anchors[k]||0,w=t.anchors[k+1]||1;t.target=st((k+st((U-H)/Math.max(1,w-H)))/7),t.dirty=!0,!t.raf&&!document.hidden&&!t.lost&&!t.gateOpen&&(t.raf=requestAnimationFrame(q))},_e=()=>{const U=Math.max(1,document.documentElement.scrollHeight-innerHeight);t.anchors=te.chapters.map((k,H)=>H===0?0:Math.min(U,Math.max(0,(document.getElementById(k.id)?.getBoundingClientRect().top||0)+scrollY-72)));for(let k=1;k<8;k++)t.anchors[k]=Math.max(t.anchors[k],t.anchors[k-1]+1);Ce()},R=()=>{t.width=innerWidth,t.height=innerHeight,n.setPixelRatio(t.dpr),n.setSize(t.width,t.height),y.setPixelRatio(t.dpr),y.setSize(t.width,t.height),s.stars.material.uniforms.uPixelRatio.value=t.dpr,h.aspect=t.width/t.height,h.updateProjectionMatrix(),_e()},j=U=>{N.set((U.clientX/t.width-.5)*2,(U.clientY/t.height-.5)*2)},B=()=>N.set(0,0),oe=new ResizeObserver(_e);oe.observe(document.documentElement),window.addEventListener("resize",R),window.addEventListener("scroll",Ce,{passive:!0}),window.addEventListener("pointermove",j,{passive:!0}),document.addEventListener("pointerleave",B);let re=!1;document.fonts?.ready.then(()=>{re||_e()}),R(),t.t=t.target;function q(U){if(t.raf=0,re||document.hidden||t.lost||t.gateOpen)return;const k=Math.min((U-(t.last||U))/1e3,.05);t.last=U;const H=i||_.current.paused,w=H?t.target:t.t+(t.target-t.t)*(1-Math.exp(-k*8));t.t=w,H||(t.time+=k);const D=t.time;if(!H||t.dirty){t.dirty=!1,d.getPoint(w,h.position),$.lerp(H?Z:N,1-Math.exp(-k*2.5)),h.position.x+=$.x*7,h.position.y-=$.y*5,ae.set(h.position.x+12+Math.sin(w*9)*16,h.position.y-13,h.position.z-600),h.lookAt(ae),h.rotateZ(Math.sin(w*10)*.025),h.fov=(e?62:48)+Math.sin(w*Math.PI)*3,h.updateProjectionMatrix(),s.sky.position.copy(h.position),s.sky.material.uniforms.uTravel.value=w,s.updateTime(D),s.body.rotation.y=D*.012,s.planet.visible=w<.245,s.body.material.uniforms.uOpacity.value=1-Q(w,.2,.245),s.rings.material.uniforms.uOpacity.value=1-Q(w,.2,.245);const De=140+Math.sin(w*14)**2*120+w*50,Ye=De*Math.tan(ne.degToRad(h.fov/2)),je=e?.5:.65;Ne.set(h.position.x+Ye*h.aspect*(je+Math.sin(w*17)*.18),h.position.y-Ye*(.37+Math.sin(w*12)*.19),h.position.z-De),s.probe.position.copy(Ne),s.probe.position.y+=Math.sin(D*.22)*1.5,Be.set(.64+Math.sin(w*8)*.3,.3+w*1.5,-.55+Math.sin(w*12)*.25),Se.setFromEuler(Be),s.probe.quaternion.copy(Se),s.probe.scale.setScalar((e?.38:.65)*(1-Q(w,.83,1)*.75)),s.probe.visible=w<.96;const Y=Q(w,.2,.44),pe=Q(Y,.34,.42)*(1-Q(Y,.82,1)),Ft=Math.exp(-Math.pow((Y-.377)/.027,2));s.nova.visible=w>.16&&w<.48,s.nova.visible&&s.supernova.update(Y,D,h),s.remnant.visible=w>.42&&w<.55,s.remnant.material.uniforms.uOpacity.value=Q(w,.42,.46)*(1-Q(w,.49,.55)),s.pulsar.visible=s.remnant.visible,s.remnant.quaternion.copy(h.quaternion),s.remnant.rotateZ(D*.006),s.pulsar.material.opacity=.7+Math.sin(D*1.4)*.12,s.blackHole.visible=w>.46&&w<.69,s.blackHole.material.uniforms.uOpacity.value=Q(w,.46,.51)*(1-Q(w,.64,.69)),s.blackHole.quaternion.copy(h.quaternion),s.blackHole.rotateZ(-.12);const Xe=Q(w,.645,.7)*(1-Q(w,.8,.875)),Ot=Xe*(.7+.3*Math.sin(D*1.5));s.quasar.visible=Xe>.001,s.quasar.visible&&s.quasarSystem.update(D,h,Xe),document.documentElement.style.setProperty("--quasar-light",H?"0":Ot.toFixed(3)),s.galaxies.visible=w>.755,s.galaxyMaterials.forEach(ee=>{ee.uniforms.uOpacity.value=Q(w,.755,.84)*.95}),I.strength=.2+pe*.12+Ft*.18,m.enabled=!1,A.style.setProperty("--event-alpha","0"),A.dataset.event="none";const Je=Q(w,.53,.675),He=Math.sin(Je*Math.PI),ct=Je*18-D*1.2;let Pe=0,Ee=0,Ae=0;if(Y>0&&Y<1){se.copy(s.nova.position).project(h),Pe=ne.clamp((se.x*.5+.5)*t.width,-t.width*.3,t.width*1.3),Ee=ne.clamp((-se.y*.5+.5)*t.height,-t.height*.3,t.height*1.3);const ee=Math.max(240,Math.abs(h.position.z-s.nova.position.z)),ge=t.height/(2*Math.tan(ne.degToRad(h.fov/2))*ee);Ae=s.supernova.screenRadius(Y)*ge,H||(A.dataset.event="supernova",A.style.setProperty("--event-x",`${Pe.toFixed(1)}px`),A.style.setProperty("--event-y",`${Ee.toFixed(1)}px`),A.style.setProperty("--event-radius",`${Ae.toFixed(1)}px`),A.style.setProperty("--event-alpha",String(pe*.65)),m.enabled=pe>.01,m.uniforms.uKind.value=1,m.uniforms.uCenter.value.set(Pe/t.width,1-Ee/t.height),m.uniforms.uRadius.value=Ae/t.height,m.uniforms.uEnergy.value=pe)}const zt=!H&&pe>.01;if(L.forEach((ee,ge)=>{if(!zt){ee.style.opacity="0";return}const et=Tt[ge],ut=et.angle+D*.014,ft=Ae*et.reach;ee.style.transform=`translate3d(${(Pe+Math.cos(ut)*ft).toFixed(1)}px,${(Ee+Math.sin(ut)*ft*.76).toFixed(1)}px,0) scale(${et.depth})`,ee.style.opacity=String(pe*.68)}),!H&&!_.current.cinema&&Y>0&&Y<1?x.current.report({active:!0,x:Pe,y:Ee,radius:Ae,progress:Y,energy:pe,time:D}):x.current.report({active:!1}),!H&&He>.01){se.copy(s.blackHole.position).project(h);const ee=(se.x*.5+.5)*t.width,ge=(-se.y*.5+.5)*t.height;m.enabled=!0,m.uniforms.uKind.value=2,m.uniforms.uCenter.value.set(ee/t.width,1-ge/t.height),m.uniforms.uEnergy.value=He,m.uniforms.uPhase.value=ct,_.current.cinema?M.current.report({active:!1}):M.current.report({active:!0,x:ee,y:ge,amplitude:He*(e?11:22),wavelength:t.height/29,phase:ct,progress:Je,energy:He,time:D})}else M.current.report({active:!1});m.uniforms.uAspect.value=h.aspect,y.render(),a.current&&a.current.style.setProperty("--travel",w);const Ze=Math.min(7,Math.floor(w*7+.28));t.chapter!==Ze&&(t.chapter=Ze,S(Ze)),!H&&k>0&&(t.frames++,t.totalMs+=k*1e3,t.frames===120&&(t.totalMs/120>22&&t.dpr>.8&&(t.dpr=Math.max(.8,t.dpr-.25),R()),t.frames=0,t.totalMs=0))}!H&&!t.raf&&(t.raf=requestAnimationFrame(q))}f.wake=()=>{t.dirty=!0,t.last=0,!t.raf&&!document.hidden&&!t.gateOpen&&(t.raf=requestAnimationFrame(q))};const fe=()=>{cancelAnimationFrame(t.raf),t.last=0,!document.hidden&&!t.gateOpen&&(t.dirty=!0,t.raf=requestAnimationFrame(q))},Ke=U=>{t.gateOpen=!!U.detail?.open,cancelAnimationFrame(t.raf),t.raf=0,t.last=0,t.gateOpen?(x.current.report({active:!1}),M.current.report({active:!1}),document.documentElement.style.setProperty("--quasar-light","0"),A.style.setProperty("--event-alpha","0")):f.wake()};window.addEventListener("lightgate:change",Ke);const he=U=>{U.preventDefault(),t.lost=!0,document.documentElement.style.setProperty("--quasar-light","0"),cancelAnimationFrame(t.raf),t.raf=0,x.current.report({active:!1}),M.current.report({active:!1}),A.style.setProperty("--event-alpha","0"),L.forEach(k=>{k.style.opacity="0"}),p(!1),T(!1)},K=()=>{t.lost=!1,t.dirty=!0,T(!0),fe()};return document.addEventListener("visibilitychange",fe),g.addEventListener("webglcontextlost",he),g.addEventListener("webglcontextrestored",K),t.raf||(t.raf=requestAnimationFrame(q)),()=>{re=!0,document.documentElement.style.removeProperty("--quasar-light"),f.wake=()=>{},cancelAnimationFrame(t.raf),oe.disconnect(),window.removeEventListener("resize",R),window.removeEventListener("lightgate:change",Ke),window.removeEventListener("scroll",Ce),window.removeEventListener("pointermove",j),document.removeEventListener("pointerleave",B),document.removeEventListener("visibilitychange",fe),g.removeEventListener("webglcontextlost",he),g.removeEventListener("webglcontextrestored",K),s.dispose(),I.dispose(),y.passes.forEach(U=>{U!==I&&U.dispose?.()}),y.dispose(),n.dispose()}},[i,e,x,M]);const b=te.chapters[C];return z.jsxs(z.Fragment,{children:[z.jsx("canvas",{ref:o,className:"voyage","aria-hidden":"true"}),z.jsx("div",{className:"voyage-scrim","aria-hidden":"true"}),z.jsx("div",{className:"voyage-vignette","aria-hidden":"true"}),z.jsxs("div",{className:"voyage-effects",ref:r,"aria-hidden":"true",children:[z.jsx("div",{className:"voyage-front"}),Tt.map((g,f)=>z.jsx("i",{className:"voyage-ejecta"},f))]}),O?z.jsxs("aside",{className:"voyage-hud","aria-label":"Voyager journey",ref:a,children:[z.jsxs("div",{className:"voyage-hud__location",children:[z.jsx("span",{className:"voyage-hud__signal"}),z.jsxs("span",{className:"voyage-hud__number",children:["0",C+1]}),z.jsxs("div",{children:[z.jsx("span",{className:"voyage-hud__eyebrow",children:te.title}),z.jsxs("span",{className:"voyage-hud__name",children:[b.name,z.jsxs("span",{children:[" / ",b.place]})]})]})]}),z.jsx("nav",{className:"voyage-hud__route","aria-label":"Journey chapters",children:te.chapters.map((g,f)=>z.jsx("a",{href:`#${g.id}`,title:g.name,"aria-label":`Chapter ${f+1}: ${g.name}`,"aria-current":C===f?"step":void 0,onClick:n=>{n.preventDefault(),Lt(`#${g.id}`)},children:z.jsx("span",{})},g.id))}),z.jsxs("div",{className:"voyage-hud__actions",children:[!i&&z.jsx("button",{className:"voyage-hud__pause","aria-label":v?te.resume:te.pause,"aria-pressed":v,onClick:()=>F(g=>!g),children:z.jsx("span",{"aria-hidden":"true",children:v?"▷":"Ⅱ"})}),z.jsxs("button",{ref:l,className:"voyage-hud__toggle","aria-pressed":c,onClick:()=>p(g=>!g),children:[z.jsx("span",{"aria-hidden":"true",children:c?"↙":"↗"}),c?te.back:te.view]})]}),c&&z.jsxs("div",{className:"voyage-caption",children:[z.jsxs("span",{children:["0",C+1," / 08"]}),z.jsx("h2",{children:b.name}),z.jsx("p",{children:b.note}),z.jsx("small",{children:te.exitHint})]},C)]}):z.jsx("p",{className:"visually-hidden",role:"status",children:te.fallback})]})}export{ao as default};
