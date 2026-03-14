"use client";

import { useRef, useEffect, useState } from "react";
import { fetchPexelsImage } from "@/lib/pexels";
import { motion } from "framer-motion";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function InteractiveMerch() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [textureUrl, setTextureUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadTexture() {
      const url = await fetchPexelsImage("dark liquid metal chrome texture", "square");
      setTextureUrl(url);
    }
    loadTexture();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(".merch-bg", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [textureUrl]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-[#050505] flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-color-dodge">
        <div className="merch-bg w-full h-[150%] -top-[25%] absolute bg-gradient-to-br from-red-900/30 via-transparent to-zinc-900/50" />
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center cursor-crosshair group/bg">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
          className="relative w-full h-full md:w-[80%] md:h-[80%] overflow-hidden rounded-full md:rounded-lg blur-[2px] hover:blur-none transition-all duration-700"
        >
          {textureUrl ? (
            <Image
              src={textureUrl}
              alt="Merch Background"
              fill
              className="w-full h-full object-cover grayscale contrast-150 hover:grayscale-0 transition-all duration-700 opacity-30 hover:opacity-50"
            />
          ) : (
            <div className="w-full h-full bg-zinc-900 animate-pulse opacity-30" />
          )}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] pointer-events-none" />
        </motion.div>
      </div>

      <div
        className="relative z-20 flex flex-col items-center text-center px-6 pointer-events-none mix-blend-difference"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-red-500 font-roboto-mono tracking-[0.5em] uppercase text-sm mb-6 font-bold block drop-shadow-md"
        >
          [ 06 // The Vault ]
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-oswald text-6xl md:text-8xl lg:text-[10rem] leading-[0.8] uppercase tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          Merch
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-roboto-mono text-zinc-300 max-w-lg mt-8 text-sm md:text-base tracking-[0.2em] uppercase leading-relaxed font-bold"
        >
          Wear the legacy. Forged in fire and steel.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 pointer-events-auto"
        >
          <button className="group relative px-12 py-6 bg-transparent border-2 border-white text-white font-oswald text-2xl uppercase tracking-[0.3em] overflow-hidden hover:text-black transition-colors duration-500">
            <span className="relative z-10 mix-blend-difference group-hover:mix-blend-normal text-white group-hover:text-black">Enter Store</span>
            <div className="absolute inset-0 bg-white translate-y-[100%] transition-transform duration-500 ease-out group-hover:translate-y-0" />
          </button>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-10 z-20 text-zinc-500 font-roboto-mono text-[10px] tracking-[0.4em] uppercase pointer-events-none mix-blend-difference font-bold hidden md:block">
        Explore The Vault
      </div>
    </section>
  );
}
