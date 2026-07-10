'use client';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

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
    const geometry = new THREE.TorusKnotGeometry(1.4, 0.18, 180, 16);
    const material = new THREE.MeshStandardMaterial({ color: '#D8B36A', roughness: 0.38, metalness: 0.28, transparent: true, opacity: 0.22 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    scene.add(new THREE.AmbientLight('#ffffff', 1.8));
    const light = new THREE.PointLight('#fff4dc', 2);
    light.position.set(3, 2, 4);
    scene.add(light);
    const resize = () => { const width = mountNode.clientWidth || window.innerWidth; const height = mountNode.clientHeight || window.innerHeight; camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height); };
    const pointer = { x: 0, y: 0 };
    const move = (event: MouseEvent) => { pointer.x = (event.clientX / window.innerWidth - 0.5) * 0.36; pointer.y = (event.clientY / window.innerHeight - 0.5) * 0.24; };
    let frame = 0;
    const animate = () => { frame = requestAnimationFrame(animate); mesh.rotation.x += 0.002 + pointer.y * 0.004; mesh.rotation.y += 0.003 + pointer.x * 0.004; renderer.render(scene, camera); };
    resize(); animate(); window.addEventListener('resize', resize); window.addEventListener('mousemove', move);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', move); renderer.dispose(); geometry.dispose(); material.dispose(); mountNode.replaceChildren(); };
  }, []);
  return <div ref={mount} className="h-full w-full" />;
}

export function Hero() {
  return <section className="premium-gradient relative min-h-screen overflow-hidden pt-28"><div className="absolute inset-0 opacity-70"><ThreeHero /></div><div className="relative mx-auto grid min-h-[86vh] max-w-7xl items-center gap-10 px-6 lg:grid-cols-[1.05fr_.95fr]"><motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}><p className="font-button text-xs uppercase tracking-[.5em] text-gold">Luxury handmade resin art</p><h1 className="mt-5 max-w-4xl font-heading text-7xl leading-[.9] md:text-8xl lg:text-9xl text-balance">Where Nature Lives Forever</h1><p className="mt-8 max-w-xl text-xl leading-9 text-charcoal/70">Handcrafted resin art inspired by flowers, oceans, and timeless memories.</p><div className="mt-10 flex flex-wrap gap-4"><Link className="magnetic ripple rounded-full bg-charcoal px-8 py-4 font-button text-white" href="/shop">Explore Collection</Link><Link className="magnetic ripple rounded-full border border-gold/40 bg-white/70 px-8 py-4 font-button" href="/custom-orders">Create Custom Order</Link></div></motion.div><motion.div className="glass relative min-h-[540px] overflow-hidden rounded-[3rem] p-6" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, delay: 0.25 }}><div className="h-full rounded-[2.4rem] bg-[radial-gradient(circle_at_35%_20%,#E8C8C1,transparent_24%),linear-gradient(145deg,#FAF8F5,#fff)] p-8 shadow-inner"><div className="float-right h-52 w-52 rounded-full bg-sage/30 blur-2xl" /><div className="mt-48 rounded-boutique bg-white/70 p-8 shadow-boutique"><Sparkles className="text-gold" /><h3 className="mt-4 font-heading text-4xl">Preserved flowers, ocean lace, gold leaf, and memory keepsakes.</h3></div></div></motion.div></div></section>;
}
