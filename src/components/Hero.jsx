import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import Button from './Button.jsx';
import Clock from './Clock.jsx';
import Mono from './Mono.jsx';
import SpectrumPanel from './Spectrum/SpectrumPanel.jsx';
import { useScrollProgress } from '../hooks/useScrollProgress.js';
import { useMotionPrefs } from '../hooks/useMotionPrefs.js';
import { gsap, hasJs, scrollToHash } from '../lib/motion.js';
import './hero.css';

/**
 * The hero: meta row, the name at display size, the role line, the statement, the CTA row, and
 * the live spectrum whose bottom hairline is the first rule of the page. The intro is one GSAP
 * timeline; the spectrum acquires channel by channel alongside it.
 */
export default function Hero({ content, spectrum, resumeHref }) {
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const canvasRef = useRef(null);
  const { reduced, isPhone } = useMotionPrefs();

  const roleLine = `${content.role} at ${content.company}, ${content.location}`;

  // Intro: a single timeline, once per session. Scrolling early jumps to the end state.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !hasJs()) return undefined;
    const html = document.documentElement;
    const state = html.dataset.intro;
    const finish = () => {
      html.dataset.intro = 'done';
      try {
        sessionStorage.setItem('intro', '1');
      } catch {
        /* ignore */
      }
    };
    if (state === 'skip' || reduced) {
      html.dataset.intro = 'done';
      canvasRef.current && canvasRef.current.finishIntro();
      return undefined;
    }
    let killed = false;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'power3.out' },
        onComplete: finish,
      });
      const navRule = document.querySelector('.nav__rule');
      if (navRule) tl.to(navRule, { scaleX: 1, duration: 0.7, ease: 'power2.out' }, 0);
      tl.to('.hero__meta .intro', { autoAlpha: 1, duration: 0.3, stagger: 0.06 }, 0.05)
        .to('.hero__name .mask__inner', { yPercent: 0, duration: 0.95, stagger: 0.07 }, 0.1)
        .to('.hero__role .mask__inner', { yPercent: 0, duration: 0.8 }, 0.32)
        .to('.hero__statement', { autoAlpha: 1, y: 0, duration: 0.7 }, 0.46)
        .to('.hero__ctas > *', { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.05 }, 0.58)
        .to('.hero__spectrum .rule--intro', { scaleX: 1, duration: 0.8, ease: 'power2.out' }, 0.55)
        .to('.hero__spectrum .spectrum__caption, .hero__spectrum .spectrum__axis', { autoAlpha: 1, duration: 0.35 }, 0.72);

      gsap.set('.hero__statement, .hero__ctas > *', { autoAlpha: 0, y: 12 });
      gsap.set('.hero__spectrum .spectrum__caption, .hero__spectrum .spectrum__axis', { autoAlpha: 0 });
      gsap.set('.hero__meta .intro', { autoAlpha: 0 });

      const start = () => {
        if (killed) return;
        html.dataset.intro = 'run';
        tl.play();
        canvasRef.current && canvasRef.current.startIntro(performance.now() + 450);
      };
      const ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
      Promise.race([ready, new Promise((r) => setTimeout(r, 600))]).then(start);

      const onEarlyScroll = () => {
        if (window.scrollY > 40) {
          tl.progress(1);
          canvasRef.current && canvasRef.current.finishIntro();
          finish();
          window.removeEventListener('scroll', onEarlyScroll);
        }
      };
      window.addEventListener('scroll', onEarlyScroll, { passive: true });
      tl.eventCallback('onComplete', () => {
        finish();
        window.removeEventListener('scroll', onEarlyScroll);
      });
    }, root);
    return () => {
      killed = true;
      ctx.revert();
      html.dataset.intro = 'done';
    };
  }, [reduced]);

  // Collapse: the spectrum flattens as the hero scrolls away.
  const onProgress = useCallback((p) => {
    const root = rootRef.current;
    if (root) root.style.setProperty('--collapse', String(p));
    if (canvasRef.current) canvasRef.current.setCollapse(p);
  }, []);
  useScrollProgress(panelRef, onProgress, !reduced);

  useEffect(() => {
    if (reduced && canvasRef.current) canvasRef.current.setCollapse(0);
  }, [reduced]);

  const nameWords = content.name.split(' ');

  return (
    <section id="top" ref={rootRef} className="hero" aria-labelledby="hero-name">
      <div className="wrap hero__inner">
        <div className="hero__meta">
          <Mono label className="intro intro--fade dim">
            01 / {content.eyebrow}
          </Mono>
          <Clock className="intro intro--fade" />
        </div>

        <div className="hero__identity">
          <h1 id="hero-name" className="t-display hero__name">
            {nameWords.map((w, i) => (
              <span key={w} className="mask mask--block">
                <span className="mask__inner">
                  {w}
                  {i < nameWords.length - 1 ? ' ' : ''}
                </span>
              </span>
            ))}
          </h1>
          <p className="t-lead hero__role">
            <span className="mask mask--block">
              <span className="mask__inner">{roleLine}</span>
            </span>
          </p>
          <p className="t-lead hero__statement prose">{content.statement}</p>

          <div className="hero__ctas">
            {content.ctas.map((cta) => {
              const href = cta.href === 'Aditya_Yadav_Resume.pdf' ? resumeHref : cta.href;
              const isAnchor = href.startsWith('#');
              return (
                <Button
                  key={cta.label}
                  href={href}
                  variant={cta.kind === 'primary' ? 'primary' : cta.kind === 'secondary' ? 'bordered' : 'text'}
                  glyph={isAnchor ? 'down' : cta.external ? 'external' : 'none'}
                  external={cta.external}
                  demoteOnPhone={cta.demoteOnPhone}
                  onClick={isAnchor ? (e) => { e.preventDefault(); scrollToHash(href); } : undefined}
                >
                  {cta.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="wrap hero__spectrum">
        <SpectrumPanel canvasRef={canvasRef} figureRef={panelRef} mode="live" content={spectrum} isPhone={isPhone} />
      </div>
    </section>
  );
}
