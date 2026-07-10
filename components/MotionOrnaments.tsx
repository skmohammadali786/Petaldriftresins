'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect } from 'react';

gsap.registerPlugin(ScrollTrigger);

export function MotionOrnaments() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

    if (!prefersReducedMotion) {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.fromTo(el, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
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

    if (!prefersReducedMotion && !isCoarsePointer) window.addEventListener('pointermove', move, { passive: true });

    return () => {
      cancelAnimationFrame(cursorFrame);
      window.removeEventListener('pointermove', move);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden max-md:hidden" aria-hidden>{[...Array(6)].map((_, i) => <span key={i} className="petal absolute h-5 w-3 rounded-[80%_20%_70%_30%] bg-rose/30" style={{ left: `${(i * 19) % 100}%`, animationDuration: `${16 + (i % 4)}s`, animationDelay: `${i * 0.9}s` }} />)}{[...Array(5)].map((_, i) => <span key={`pollen-${i}`} className="pollen absolute h-1.5 w-1.5 rounded-full bg-gold/25" style={{ left: `${(i * 23) % 100}%`, top: `${(i * 31) % 100}%`, animationDelay: `${i * 0.4}s` }} />)}</div>;
}
