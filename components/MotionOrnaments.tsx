'use client';
import { useEffect } from 'react';

export function MotionOrnaments() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });

    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden max-md:hidden" aria-hidden>{[...Array(6)].map((_, i) => <span key={i} className="petal absolute h-5 w-3 rounded-[80%_20%_70%_30%] bg-rose/30" style={{ left: `${(i * 19) % 100}%`, animationDuration: `${16 + (i % 4)}s`, animationDelay: `${i * 0.9}s` }} />)}{[...Array(5)].map((_, i) => <span key={`pollen-${i}`} className="pollen absolute h-1.5 w-1.5 rounded-full bg-gold/25" style={{ left: `${(i * 23) % 100}%`, top: `${(i * 31) % 100}%`, animationDelay: `${i * 0.4}s` }} />)}</div>;
}
