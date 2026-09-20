# Portfolio

Personal site for Aditya Yadav, Forward Deployment Engineer at Cornerstone OnDemand. One page covering current work, experience, projects, research and contact details.

Live at https://aditya-0156.github.io/portfolio/

## Design

The site is built as a bench instrument rather than a brochure: one grotesk, one mono, one accent colour, hairline rules, and a sticky mono rail that indexes every section. The masthead is a 2D canvas rendering of a 96-channel C+L band optical comb with one channel marked as a localized soft failure, drawn from the same subject as the research it sits above. It is procedurally generated from a fixed seed and captioned as illustrative. Scrolling collapses it into the first rule of the page.

Both themes are first class. Dark is the default, light is a true light theme, and the choice is stored. Every text pair clears WCAG AA in both, checked by a script that runs before each build.

## Stack

- React 19 and Vite 7
- Tailwind CSS v4, configured in CSS
- GSAP with ScrollTrigger for the intro and scroll reveals, Lenis for smooth scrolling
- No UI framework, no icon library, no 3D library

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
node scripts/spectrum.test.mjs
```

## Content

Every string on the page lives in `src/content`. Components hold no prose. `src/content/limits.js` records the length each slot can hold, and `src/lib/copyFit.js` warns in development when a slot runs past it. The resume PDF lives in `public`.

## Motion

Motion reports state and never decorates. Nothing translates more than 12 px, text never fades in on scroll, and every effect respects `prefers-reduced-motion`. The canvas stops drawing 12 seconds after the last interaction, so an idle page issues no frames.

## Notes

This site was designed and built with AI assistance using Claude Code.
