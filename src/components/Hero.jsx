import { useLayoutEffect, useRef } from 'react';
import Button from './Button.jsx';
import Clock from './Clock.jsx';
import Mono from './Mono.jsx';
import { useMotionPrefs } from '../hooks/useMotionPrefs.js';
import { gsap, ScrollTrigger, hasJs, scrollToHash } from '../lib/motion.js';
import './hero.css';

/**
 * The hero. The background field is the visual, so this holds nothing but type: the meta row, the
 * name at display size, the role line, what Aditya works on, and the calls to action. On scroll
 * the whole block drifts back and fades while the field opens out behind it.
 */
export default function Hero({ content, resumeHref }) {
  const rootRef = useRef(null);
  const { reduced } = useMotionPrefs();

  const roleLine = `${content.role} at ${content.company}, ${content.location}`;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !hasJs()) return undefined;
    const html = document.documentElement;
    const finish = () => {
      html.dataset.intro = 'done';
      try {
        sessionStorage.setItem('intro', '1');
      } catch {
        /* ignore */
      }
    };
    if (html.dataset.intro === 'skip' || reduced) {
      html.dataset.intro = 'done';
      return undefined;
    }
    let killed = false;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' }, onComplete: finish });
      const navRule = document.querySelector('.nav__rule');
      if (navRule) tl.to(navRule, { scaleX: 1, duration: 0.8, ease: 'power2.out' }, 0);
      tl.to('.hero__meta .intro', { autoAlpha: 1, duration: 0.4, stagger: 0.08 }, 0.05)
        .to('.hero__name .mask__inner', { yPercent: 0, duration: 1.05, stagger: 0.08 }, 0.1)
        .to('.hero__role .mask__inner', { yPercent: 0, duration: 0.85 }, 0.34)
        .to('.hero__statement', { autoAlpha: 1, y: 0, duration: 0.75 }, 0.48)
        .to('.hero__ctas > *', { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06 }, 0.6);

      gsap.set('.hero__statement, .hero__ctas > *', { autoAlpha: 0, y: 14 });
      gsap.set('.hero__meta .intro', { autoAlpha: 0 });

      const start = () => {
        if (killed) return;
        html.dataset.intro = 'run';
        tl.play();
      };
      const ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
      Promise.race([ready, new Promise((r) => setTimeout(r, 600))]).then(start);

      const onEarlyScroll = () => {
        if (window.scrollY > 40) {
          tl.progress(1);
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

  // The camera pulls back from the hero as it leaves.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !hasJs() || reduced) return undefined;
    const ctx = gsap.context(() => {
      gsap.to('.hero__inner', {
        scale: 0.9,
        y: -40,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.6 },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, []);

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
    </section>
  );
}
