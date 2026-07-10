'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useStore } from './StoreProvider';
import { HomeBannerCarousel } from './HomeBannerCarousel';

function ThreeHero() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mountNode = mount.current;
    if (!mountNode) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountNode.appendChild(renderer.domElement);

    const geometry = new THREE.TorusKnotGeometry(1.4, 0.18, 220, 18);
    const material = new THREE.MeshPhysicalMaterial({
      color: '#D8B36A',
      roughness: 0.22,
      metalness: 0.3,
      transparent: true,
      opacity: 0.32,
      transmission: 0.4
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    scene.add(new THREE.AmbientLight('#ffffff', 1.5));

    const key = new THREE.PointLight('#fff2d7', 2.4, 100);
    key.position.set(4, 3, 5);
    scene.add(key);

    const fill = new THREE.PointLight('#d7e7ff', 1.2, 100);
    fill.position.set(-3, -2, 4);
    scene.add(fill);

    const pointer = { x: 0, y: 0 };

    const resize = () => {
      const width = mountNode.clientWidth || window.innerWidth;
      const height = mountNode.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const move = (event: MouseEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 0.24;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 0.18;
    };

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      mesh.rotation.x += 0.0018 + pointer.y * 0.003;
      mesh.rotation.y += 0.0024 + pointer.x * 0.003;
      renderer.render(scene, camera);
    };

    resize();
    animate();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', move);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', move);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      mountNode.replaceChildren();
    };
  }, []);

  return <div ref={mount} className="h-full w-full" />;
}

export function Hero() {
  const { cms, activeBanners } = useStore();

  return (
    <section className="premium-gradient relative min-h-screen overflow-hidden pt-28">
      <div className="absolute inset-0 opacity-65">
        <ThreeHero />
      </div>
      <div className="relative mx-auto grid min-h-[86vh] max-w-7xl items-center gap-10 px-6 lg:grid-cols-[1.05fr_.95fr]">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="font-button text-xs uppercase tracking-[.45em] text-gold">{cms.hero.eyebrow}</p>
          <h1 className="mt-5 max-w-4xl font-heading text-7xl leading-[.9] text-balance md:text-8xl lg:text-9xl">{cms.hero.title}</h1>
          <p className="mt-8 max-w-xl text-xl leading-9 text-charcoal/70">{cms.hero.description}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link className="magnetic ripple rounded-full bg-charcoal px-8 py-4 font-button text-white" href={cms.hero.primaryCtaHref}>{cms.hero.primaryCtaLabel}</Link>
            <Link className="magnetic ripple rounded-full border border-gold/40 bg-white/70 px-8 py-4 font-button" href={cms.hero.secondaryCtaHref}>{cms.hero.secondaryCtaLabel}</Link>
          </div>
          <div className="mt-8 max-w-2xl">
            <HomeBannerCarousel banners={activeBanners} />
          </div>
        </motion.div>

        <motion.div
          className="glass relative min-h-[540px] overflow-hidden rounded-[3rem] p-6"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="h-full rounded-[2.4rem] bg-[radial-gradient(circle_at_35%_20%,#E8C8C1,transparent_24%),linear-gradient(145deg,#FAF8F5,#fff)] p-8 shadow-inner">
            <div className="float-right h-52 w-52 rounded-full bg-sage/30 blur-2xl" />
            <div className="mt-24 space-y-3 rounded-boutique bg-white/70 p-8 shadow-boutique">
              {cms.collections.map((collection) => (
                <div key={collection.id} className="rounded-2xl border border-charcoal/10 bg-white p-4">
                  <h3 className="font-heading text-3xl">{collection.name}</h3>
                  <p className="mt-1 text-sm text-charcoal/65">{collection.description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
