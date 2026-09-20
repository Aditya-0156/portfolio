# Portfolio

Personal site for Aditya Yadav, Forward Deployment Engineer at Cornerstone OnDemand. One page covering current work, experience, projects, research and contact details.

Live at https://aditya-0156.github.io/portfolio/

## The Voyager journey

A scroll driven journey through eight chapters: departure, a ring crossing, a supernova, its remnant, a black hole, a quasar, a galaxy cluster, and the open universe. The camera follows a continuous spline measured against the actual page sections. Voyager changes position, distance and attitude along the route.

The scene is generated at runtime without downloaded models or image textures:

- A gas giant with turbulent cloud bands, directional lighting, fine ring structure and a planetary shadow across the rings.
- Layered stellar depth and a procedural sky with cool dust and warm gas.
- A collapsing star, a white-hot eruption, expanding three-dimensional gas shells, branching filaments, clumps and thousands of GPU driven ejecta particles.
- Curved ray integration around the black hole, with an accretion disk, lensed secondary images and asymmetric disk brightness. This is an artistic approximation, not a scientific simulation.
- A luminous quasar nucleus with a tilted disk, three-dimensional bipolar jets and outward-moving plasma. Its blue pulse reaches the Stack content before giving way to spiral, barred and elliptical galaxies.
- Filmic tone mapping and restrained bloom.

The supernova's projected shock front also drives the page: work gathers toward the explosion, emerges through its shell, and cools through gold and copper. Each content block settles even if scrolling stops. The black hole shares its wave phase with the document, pulling, stretching and releasing nearby research. Sections use one left-aligned reading column with transparent project surfaces. The repeated sidebar labels, metadata columns and scene title cards are removed; the navigation and accessible document headings identify the sections. Local text shadows retain the scene behind the copy.

**View voyage** hides the portfolio and reveals full scene compositions with chapter captions. Scroll or use the chapter rail to travel. **Back to portfolio** or Escape restores the page and keyboard access. The pause control stops continuous canvas rendering while leaving scrolling available.

The site intentionally stays dark. The light mode button opens three increasingly persistent, physics-inspired questions from mission control. Continuing through the final question opens a related Google search in the same tab. Its opaque dialog hides all luminous layers, suspends the renderer, and supports keyboard focus, Escape and cancellation.

## Stack

- React 19 and Vite 7
- Tailwind CSS v4
- Three.js, custom GLSL materials, and postprocessing
- GSAP with ScrollTrigger for intro and content motion
- Lenis for smooth scrolling
- Playwright for browser verification

The portfolio renders independently of the lazy loaded voyage. Three.js has its own cacheable bundle.

## Run locally

```sh
npm install
npm run dev
```

## Build and deploy

```sh
npm run build
npm run deploy
```

The build runs the contrast check first. Deployment publishes `dist` to the existing `gh-pages` branch. Vite uses `/portfolio/` as the base path.

## Checks

```sh
npm run lint
npm run lint:contrast
npm run test:e2e
```

The browser suite uses locally installed Google Chrome. It checks every chapter for runtime and shader errors, pause and resume using actual WebGL draw counts, reduced motion, mobile overflow and navigation, the resume link, missing WebGL, and GPU context loss. It also verifies the content's launch and settling, actual gravity transforms, and the light dialog's questions, focus, navigation, opaque backdrop and rendering suspension.

To exercise a production preview or the deployed site:

```sh
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4173/portfolio/ npm run test:e2e
```

Screenshots, browser traces and local visual experiments are ignored by Git.

## Motion and performance

Animation uses elapsed time rather than a fixed per-frame interpolation factor. Phone rendering starts with fewer stars and explosion particles and a lower pixel ratio. Sustained slow frames reduce rendering resolution further. The explosion expands in a vertex shader instead of rewriting particle positions on the CPU.

The animation loop stops when the tab is hidden or the light dialog is open. Pause and reduced motion render only when scrolling, resizing or changing a relevant control. Reduced motion also disables the text forge, layout ripple, smooth scroll and animated reveals. Without WebGL, portfolio content and links remain available. Losing a graphics context clears the content effects and exits voyage mode so content cannot remain hidden.

Performance depends on the device, viewport and GPU. Phone viewport emulation does not replace testing on physical phones.

## Content and implementation

Portfolio copy lives in `src/content`. Journey labels and captions live in `src/content/voyage.js`. Career facts and the resume were preserved during the visual rebuild.

- `src/components/Voyage/Voyage.jsx`: scene lifecycle, camera path, chapter mapping, controls and motion preferences.
- `src/lib/voyage/world.js`: scene construction.
- `src/lib/voyage/supernova.js`: three-dimensional star, explosion geometry and emission shaders.
- `src/lib/voyage/quasar.js`: luminous nucleus, accretion disk, plasma jets and particle outflow.
- `src/lib/voyage/phenomenaPass.js`: refraction synchronized with the shock front and gravity wave.
- `src/lib/voyage/shaders.js`: procedural sky, planet, rings, black hole, nebulae and galaxies.
- `src/lib/probe.js`: Voyager geometry.
- `src/hooks/useNova.js` and `src/hooks/useRipple.js`: effects that reach into the document.
- `src/content/lightgate.js`: the light dialog's questions and destination.

The site was built with AI assistance using Claude Code and Codex.
