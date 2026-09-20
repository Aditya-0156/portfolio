# Portfolio

Personal site for Aditya Yadav, Forward Deployment Engineer at Cornerstone OnDemand. One page covering current work, experience, projects, research and contact details.

Live at https://aditya-0156.github.io/portfolio/

## Design

The background is the design. A flow field of drifting currents is generated from seeded noise and
painted on a canvas behind the whole page. Scrolling moves a camera through it: the field zooms out
across the middle of the document and part of the way back in, pans as you travel, and quietens
behind dense text so it never fights what you are reading. Each section's content arrives slightly
small, holds at full size for as long as you are reading it, then pulls back as it leaves.

Type does the rest: one grotesk, one mono, hairline rules, and a sticky mono rail that indexes every
section. One accent colour, used only where something needs to be singled out.

Both themes are first class. Dark is the default, light is a true light theme, and the choice is
stored. Every text pair clears WCAG AA in both, checked by a script that runs before each build.
Nothing fades on scroll, so contrast holds at every point of the animation.

## Stack

- React 19 and Vite 7
- Tailwind CSS v4, configured in CSS
- GSAP with ScrollTrigger for the intro, the scroll camera and reveals, Lenis for smooth scrolling
- A 2D canvas for the background field, generated from seeded value noise
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

Every effect respects `prefers-reduced-motion`: the field paints one still engraving of the same
currents and then nothing moves again, the scroll camera is never created, and reveals resolve to
their finished state. With the field running the page holds a steady 60 frames per second on both
desktop and phone.

## Notes

This site was designed and built with AI assistance using Claude Code.
