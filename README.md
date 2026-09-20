# Portfolio

Personal site for Aditya Yadav, Forward Deployment Engineer at Cornerstone OnDemand. One page covering current work, experience, projects, research and contact details.

Live at https://aditya-0156.github.io/portfolio/

## Design

The background is not a background. It is a voyage, and the page travels through it.

A Voyager probe leaves at the top of the page and the reader goes with it. Each section of the
site is a place on the road: an outer planet with its ring system, a supernova, the remnant that
blast leaves behind, two black holes spiralling into each other, a quasar running its jets, and a
cluster of galaxies at the end. Camera stations are measured from where the sections actually sit
on the page, not from an even split of the scroll, so every set piece fires exactly as its section
arrives. Nothing is a model or a texture: the probe, the planet, the disks and every particle are
built from primitives and seeded noise at runtime.

Two of those set pieces do not stay inside the canvas.

**The forge.** A star makes the heavy elements in the shell it throws off. When the blast front
crosses the page it does the same to the document: the type it has already passed is painted from
the inside out, white hot at the centre and cooling through gold and ember back to its own colour
at the front. The wavefront is a radial gradient clipped to the glyphs, so the colour crosses a
word mid-letter rather than switching a block at once. Every colour in the palette clears WCAG AA
on its own ground, so the text stays readable at every moment of the sweep.

**The ripple.** A passing gravitational wave stretches space along one axis and squeezes the
other, then alternates. When the two black holes merge, that is applied to the blocks of the
layout: each one is displaced and distorted by a travelling wave radiating from the merger,
strongest near it and falling off with distance, so the page itself rings as the wave goes through.

Both themes are first class and get different worlds. Dark is a cosmos of light on black. Light is
the same voyage drawn as ink on paper: the particle clouds stop adding light and start laying down
pigment, and the glows, which only exist to brighten a dark sky, stand down.

Type does the rest: one grotesk, one mono, hairline rules, and a sticky mono rail that indexes
every section.

## Stack

- React 19 and Vite 7
- Tailwind CSS v4, configured in CSS
- three.js for the voyage, with everything in it generated at runtime
- GSAP with ScrollTrigger for the intro, the scroll camera and reveals, Lenis for smooth scrolling
- No UI framework, no icon library, no 3D library, no images

## Run locally

```
npm install
npm run dev
```

## Build and deploy

```
npm run build
npm run deploy
```

`npm run build` runs the contrast check first. `npm run deploy` publishes `dist` to GitHub Pages.

## Checks

```
npm run lint            # eslint
npm run lint:contrast   # WCAG AA contrast of every token pair, both themes
```

## Content

Every string on the page lives in `src/content`. Components hold no prose. `src/content/limits.js` records the length each slot can hold, and `src/lib/copyFit.js` warns in development when a slot runs past it. The resume PDF lives in `public`.

## Motion

Every effect respects `prefers-reduced-motion`: the voyage paints one still frame of the launch
and then nothing moves again, the forge and the ripple are never created, the scroll camera is
never created, and reveals resolve to their finished state. Phones get fewer particles and a lower
pixel ratio, a missing WebGL context falls back to the flat background with the page fully intact,
and the loop stops entirely while the tab is hidden. Scrolling through the blast, which is the
heaviest moment on the page, holds a steady 60 frames per second on both desktop and phone.

## Notes

This site was designed and built with AI assistance using Claude Code.
