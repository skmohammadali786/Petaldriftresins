'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useEffect } from 'react';

gsap.registerPlugin(ScrollTrigger);

export function MotionOrnaments() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenis = prefersReducedMotion ? null : new Lenis({ lerp: 0.12, smoothWheel: true, wheelMultiplier: 0.9 });
    let frame = 0;
    if (lenis) {
      const raf = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(raf); };
      frame = requestAnimationFrame(raf);
    }
    if (!prefersReducedMotion) {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.fromTo(el, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
      });
    }
    let cursorFrame = 0;
    const move = (event: MouseEvent) => {
      if (cursorFrame) return;
      cursorFrame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--cursor-x', `${event.clientX}px`);
        document.documentElement.style.setProperty('--cursor-y', `${event.clientY}px`);
        cursorFrame = 0;
      });
    };
    if (!prefersReducedMotion) window.addEventListener('pointermove', move, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(cursorFrame);
      lenis?.destroy();
      window.removeEventListener('pointermove', move);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden" aria-hidden>{[...Array(14)].map((_, i) => <span key={i} className="petal absolute h-5 w-3 rounded-[80%_20%_70%_30%] bg-rose/40" style={{ left: `${(i * 13) % 100}%`, animationDuration: `${12 + (i % 7)}s`, animationDelay: `${i * 0.6}s` }} />)}{[...Array(12)].map((_, i) => <span key={`pollen-${i}`} className="pollen absolute h-1.5 w-1.5 rounded-full bg-gold/35" style={{ left: `${(i * 17) % 100}%`, top: `${(i * 29) % 100}%`, animationDelay: `${i * 0.28}s` }} />)}</div>;
}
