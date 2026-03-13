"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fetchPexelsImage } from "@/lib/pexels";
import { motion } from "framer-motion";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LatestRelease() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadCover() {
      const url = await fetchPexelsImage("dark abstract fire metal", "square");
      setCoverUrl(url);
    }
    loadCover();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (textRef.current) {
        gsap.fromTo(
          textRef.current.children,
          { opacity: 0, x: -30, filter: "blur(5px)" },
          {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 65%",
            },
          }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#050505] flex flex-col md:flex-row items-center py-24 px-6 md:px-16 overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-900 to-transparent opacity-50" />

      <div
        ref={textRef}
        className="relative z-10 w-full md:w-5/12 flex flex-col justify-center mb-16 md:mb-0 md:pr-12"
      >
        <span className="text-red-600 font-roboto-mono tracking-[0.5em] uppercase text-xs mb-8">
          [ 02 // Latest Release ]
        </span>
        <h2 className="font-oswald text-7xl md:text-8xl lg:text-[10rem] leading-[0.75] uppercase tracking-tighter mb-6 text-white mix-blend-difference drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          72 <br/>
          <span className="text-zinc-800 text-stroke-white stroke-1">Seasons</span>
        </h2>

        <div className="h-px w-24 bg-red-800 my-8" />

        <p className="font-roboto-mono text-zinc-400 leading-relaxed max-w-sm mb-12 text-sm md:text-base tracking-wide">
          The new album is out now. A searing reflection on the first 18 years of life—the 72 seasons that define who we are. Heavy, unrelenting, and pure venom.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <button className="relative group px-10 py-5 bg-red-700 text-white font-oswald text-xl uppercase tracking-[0.2em] overflow-hidden w-full sm:w-auto text-center">
            <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-12">Stream Now</span>
            <span className="absolute inset-0 flex items-center justify-center bg-white z-10 translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-black">
              Listen
            </span>
          </button>
          <button className="group px-10 py-5 bg-transparent border border-zinc-700 text-zinc-400 font-oswald text-xl uppercase tracking-[0.2em] hover:text-white hover:border-white transition-all duration-300 w-full sm:w-auto text-center relative overflow-hidden">
             <span className="relative z-10">Buy Vinyl</span>
             <div className="absolute inset-0 bg-white/5 translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
          </button>
        </div>
      </div>

      <div className="relative z-10 w-full md:w-7/12 h-[60vh] md:h-[90vh] flex justify-center items-center">
        <div className="absolute w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1)_0%,transparent_50%)] pointer-events-none" />

        <motion.div
          className="relative w-full max-w-lg aspect-square overflow-hidden bg-zinc-900 shadow-2xl shadow-red-900/20"
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          whileInView={{ clipPath: "inset(0 0 0 0)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
        >
          {coverUrl ? (
            <motion.div
              initial={{ scale: 1.2 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-full h-full"
            >
              <Image
                src={coverUrl}
                alt="72 Seasons Album Cover"
                fill
                className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>
          ) : (
             <div className="w-full h-full animate-pulse bg-zinc-800" />
          )}

          {/* Decorative frame */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-red-600/50 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-red-600/50 pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
