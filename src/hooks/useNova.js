import { useEffect, useRef } from 'react';

const clamp = (value) => Math.max(0, Math.min(1, value));
const smooth = (value) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};
const TEXT_PROPERTIES = [
  '--forge-x',
  '--forge-y',
  '--forge-r',
  '--forge-width',
  '--forge-heat',
  '--forge-cooling',
];
const SURFACE_PROPERTIES = [
  '--nova-dx',
  '--nova-dy',
  '--nova-scale',
  '--nova-blur',
  '--nova-heat',
  '--matter-origin-x',
  '--matter-origin-y',
];

/** Layout coordinates deliberately exclude our own translation and scale. Reading transformed
 * bounding boxes back into the force calculation makes a block chase its previous position. */
function layoutBox(el) {
  let left = 0;
  let top = 0;
  for (let node = el; node; node = node.offsetParent) {
    left += node.offsetLeft;
    top += node.offsetTop;
    if (node !== el) {
      left += node.clientLeft;
      top += node.clientTop;
    }
  }
  return { left, top, width: el.offsetWidth, height: el.offsetHeight };
}

/** The same physical front that crosses the scene forges the page. Glyphs take on the shell's
 * heat; selected blocks gather toward its origin, then fly outward and cool into readable work.
 * A hit has a finite lifetime, so stopping the scroll never leaves a paragraph blurred. */
export function useNova(enabled, textSelector, surfaceSelector = '') {
  const api = useRef({ report: () => {} });

  useEffect(() => {
    if (
      !enabled ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return undefined;
    const self = api.current;
    const textNodes = textSelector
      ? Array.from(document.querySelectorAll(textSelector))
      : [];
    const surfaces = surfaceSelector
      ? Array.from(document.querySelectorAll(surfaceSelector))
      : [];
    const textSet = new Set(textNodes);
    const surfaceSet = new Set(surfaces);
    const visibleText = new Set();
    const visibleSurfaces = new Set();
    const touchedText = new Set();
    const touchedSurfaces = new Set();
    const boxes = new Map();
    const arrivals = new Map();
    let geometryDirty = true;
    let lastRadius = 0;

    const resetText = (el) => {
      el.removeAttribute('data-forge');
      el.classList.remove('is-forging');
      TEXT_PROPERTIES.forEach((name) => el.style.removeProperty(name));
      touchedText.delete(el);
    };
    const resetSurface = (el) => {
      el.removeAttribute('data-nova-surface');
      el.classList.remove('is-nova-matter');
      SURFACE_PROPERTIES.forEach((name) => el.style.removeProperty(name));
      touchedSurfaces.delete(el);
    };
    const clear = () => {
      touchedText.forEach(resetText);
      touchedSurfaces.forEach(resetSurface);
      arrivals.clear();
      lastRadius = 0;
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (textSet.has(target)) {
            if (isIntersecting) visibleText.add(target);
            else {
              visibleText.delete(target);
              resetText(target);
            }
          }
          if (surfaceSet.has(target)) {
            if (isIntersecting) visibleSurfaces.add(target);
            else {
              visibleSurfaces.delete(target);
              resetSurface(target);
            }
          }
        });
      },
      { rootMargin: '18% 0px' },
    );
    new Set([...textNodes, ...surfaces]).forEach((el) => io.observe(el));
    const invalidate = () => {
      geometryDirty = true;
    };
    const sizes = new ResizeObserver(invalidate);
    sizes.observe(document.documentElement);
    surfaces.forEach((el) => sizes.observe(el));
    window.addEventListener('resize', invalidate);
    let disposed = false;
    document.fonts?.ready.then(() => {
      if (!disposed) invalidate();
    });

    self.report = ({
      active,
      x = 0,
      y = 0,
      radius = 0,
      progress = 0.5,
      energy = 1,
      time,
    }) => {
      if (!active || !Number.isFinite(x + y + radius)) {
        clear();
        return;
      }
      const now = Number.isFinite(time) ? time : performance.now() / 1000;
      const power = clamp(energy);
      const cooling = 1 - smooth((progress - 0.7) / 0.3);
      const phone = innerWidth < 600;
      const frontWidth = phone ? 100 : 170;
      const scrollLeft = window.scrollX;
      const scrollTop = window.scrollY;
      const liveText = Array.from(visibleText);
      const liveSurfaces = Array.from(visibleSurfaces);

      // All geometry is read before the first style write. Surface boxes are cached layout
      // measurements; only glyph coordinates use their actual, currently rendered rectangle.
      if (geometryDirty) {
        surfaces.forEach((el) => boxes.set(el, layoutBox(el)));
        geometryDirty = false;
      }
      const rects = liveText.map((el) => el.getBoundingClientRect());
      const surfaceFrames = liveSurfaces.map((el) => {
        const box = boxes.get(el);
        if (!box) return null;
        const left = box.left - scrollLeft;
        const top = box.top - scrollTop;
        const dx = left + box.width / 2 - x;
        const dy = top + box.height / 2 - y;
        const distance = Math.hypot(dx, dy) || 1;
        const near = Math.hypot(
          Math.max(left - x, 0, x - left - box.width),
          Math.max(top - y, 0, y - top - box.height),
        );
        const contact = near * 0.65 + distance * 0.35;
        let arrival = arrivals.get(el);
        // Re-arm on the return trip, with hysteresis so tiny camera movement cannot restart it.
        if (radius < lastRadius && radius < contact - frontWidth * 1.1) {
          arrivals.delete(el);
          arrival = undefined;
        }
        const prep = smooth((radius - contact + frontWidth) / frontWidth);
        if (!arrival && prep > 0) {
          arrival = { prepTime: now, time: null };
          arrivals.set(el, arrival);
        }
        // Even a block just ahead of the front must settle if the reader stops scrolling.
        if (
          arrival &&
          arrival.time === null &&
          (radius >= contact || now - arrival.prepTime > 0.32)
        ) {
          // Arriving well behind an already-passed front should reveal settled content.
          arrival.time =
            now - clamp((radius - contact) / (frontWidth * 3)) * 1.3;
        }
        const launched = arrival?.time != null;
        const elapsed = launched ? Math.max(0, now - arrival.time) : 0;
        const age = launched ? clamp(elapsed / 1.2) : 0;
        const remaining = launched ? Math.pow(1 - age, 3) : prep;
        const impulse = launched
          ? Math.sin(age * Math.PI) * Math.pow(1 - age, 2)
          : 0;
        const travel = phone ? 62 : 94;
        const shift = (-travel * remaining + 42 * impulse) * power * cooling;
        const heat =
          (launched ? Math.pow(1 - age, 1.5) : prep * 0.62) * power * cooling;
        return {
          el,
          dx: (dx / distance) * shift,
          dy: (dy / distance) * shift,
          scale: 1 - 0.13 * remaining * power * cooling,
          blur: 1.4 * remaining * power * cooling,
          heat,
          originX: x - left,
          originY: y - top,
        };
      });

      liveText.forEach((el, i) => {
        const rect = rects[i];
        const distance = Math.hypot(
          rect.left + rect.width / 2 - x,
          rect.top + rect.height / 2 - y,
        );
        const heat =
          Math.exp(-Math.pow((radius - distance) / frontWidth, 2)) *
          power *
          cooling;
        el.setAttribute('data-forge', '');
        // Mark each newly intersecting node, not just nodes present on the blast's first frame.
        el.classList.add('is-forging');
        const style = el.style;
        style.setProperty('--forge-x', `${(x - rect.left).toFixed(1)}px`);
        style.setProperty('--forge-y', `${(y - rect.top).toFixed(1)}px`);
        style.setProperty('--forge-r', `${Math.max(0, radius).toFixed(1)}px`);
        style.setProperty('--forge-width', `${frontWidth}px`);
        style.setProperty('--forge-heat', heat.toFixed(3));
        style.setProperty('--forge-cooling', (power * cooling).toFixed(3));
        touchedText.add(el);
      });
      surfaceFrames.forEach((frame) => {
        if (!frame) return;
        const { el } = frame;
        if (
          frame.heat < 0.001 &&
          Math.abs(frame.dx) + Math.abs(frame.dy) < 0.01
        ) {
          if (touchedSurfaces.has(el)) resetSurface(el);
          return;
        }
        el.setAttribute('data-nova-surface', '');
        el.classList.add('is-nova-matter');
        const style = el.style;
        style.setProperty('--nova-dx', `${frame.dx.toFixed(2)}px`);
        style.setProperty('--nova-dy', `${frame.dy.toFixed(2)}px`);
        style.setProperty('--nova-scale', frame.scale.toFixed(4));
        style.setProperty('--nova-blur', `${frame.blur.toFixed(2)}px`);
        style.setProperty('--nova-heat', frame.heat.toFixed(3));
        style.setProperty('--matter-origin-x', `${frame.originX.toFixed(1)}px`);
        style.setProperty('--matter-origin-y', `${frame.originY.toFixed(1)}px`);
        touchedSurfaces.add(el);
      });
      lastRadius = radius;
    };

    return () => {
      disposed = true;
      io.disconnect();
      sizes.disconnect();
      window.removeEventListener('resize', invalidate);
      clear();
      self.report = () => {};
    };
  }, [enabled, textSelector, surfaceSelector]);

  return api;
}
