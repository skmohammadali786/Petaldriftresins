'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useEffect } from 'react';

gsap.registerPlugin(ScrollTrigger);

export function MotionOrnaments() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    let frame = 0;
    const raf = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(raf); };
    frame = requestAnimationFrame(raf);
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
      gsap.fromTo(el, { autoAlpha: 0, y: 44 }, { autoAlpha: 1, y: 0, duration: 0.95, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 84%' } });
    });
    const move = (event: MouseEvent) => {
      document.documentElement.style.setProperty('--cursor-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${event.clientY}px`);
    };
    window.addEventListener('mousemove', move);
    return () => { cancelAnimationFrame(frame); lenis.destroy(); window.removeEventListener('mousemove', move); ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); };
  }, []);

  return <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden" aria-hidden>{[...Array(28)].map((_, i) => <span key={i} className="petal absolute h-5 w-3 rounded-[80%_20%_70%_30%] bg-rose/50" style={{ left: `${(i * 13) % 100}%`, animationDuration: `${9 + (i % 9)}s`, animationDelay: `${i * 0.45}s` }} />)}{[...Array(34)].map((_, i) => <span key={`pollen-${i}`} className="pollen absolute h-1.5 w-1.5 rounded-full bg-gold/40" style={{ left: `${(i * 17) % 100}%`, top: `${(i * 29) % 100}%`, animationDelay: `${i * 0.18}s` }} />)}</div>;
}
