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

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadImage() {
      const url = await fetchPexelsImage("guitarist stage smoke dark metal", "portrait");
      setImageUrl(url);
    }
    loadImage();
  }, []);

  useEffect(() => {
    if (!containerRef.current || !imageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(imageRef.current, {
        yPercent: 25,
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    });

    return () => ctx.revert();
  }, [imageUrl]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-black text-zinc-100 flex flex-col md:flex-row items-center py-24 md:py-32 px-6 md:px-16 overflow-hidden"
    >
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-10 pointer-events-none mix-blend-overlay" />

      <motion.div
        className="relative w-full md:w-5/12 h-[70vh] md:h-[90vh] overflow-hidden rounded-sm grayscale contrast-125 mb-16 md:mb-0 ml-0 md:ml-12 group"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-red-900/30 mix-blend-color-burn z-10 transition-opacity duration-700 group-hover:opacity-0" />
        {imageUrl ? (
          <Image
            ref={imageRef}
            src={imageUrl}
            alt="Band on stage"
            fill
            className="w-full h-[125%] object-cover object-top -mt-[12.5%] transition-transform duration-1000 group-hover:scale-105 group-hover:grayscale-0"
          />
        ) : (
          <div className="w-full h-full bg-zinc-900 animate-pulse" />
        )}

        <div className="absolute inset-0 border border-zinc-800/50 z-20 pointer-events-none mix-blend-overlay" />
        <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-red-600 z-20" />
        <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-red-600 z-20" />

        {/* Decorative elements */}
        <div className="absolute top-1/2 -left-4 -translate-y-1/2 text-xs font-roboto-mono text-zinc-500 rotate-90 tracking-[0.5em] z-20 mix-blend-difference">
          EST. 1981
        </div>
      </motion.div>

      <div
        className="relative z-10 w-full md:w-7/12 md:pl-20 lg:pl-32 flex flex-col justify-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-red-600 font-roboto-mono tracking-[0.4em] uppercase text-xs mb-8 border-l-2 border-red-600 pl-4"
        >
          01 // The Legacy
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-oswald text-6xl md:text-8xl lg:text-9xl leading-[0.85] uppercase tracking-tighter mb-12 text-zinc-100 mix-blend-difference"
        >
          Born in The Fire
        </motion.h2>

        <div className="space-y-8 relative">
          {/* Abstract background behind text */}
          <div className="absolute -left-10 top-0 w-1 h-full bg-zinc-900/50" />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-roboto-mono text-zinc-400 leading-relaxed max-w-xl text-sm md:text-lg"
          >
            For over four decades, we&apos;ve forged a path through blood, sweat, and heavy riffs. From underground thrash scenes to sold-out global arenas, the intensity has never wavered.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-roboto-mono text-zinc-400 leading-relaxed max-w-xl text-sm md:text-lg"
          >
            This isn&apos;t just music. It&apos;s an unrelenting force. An energy shared between the stage and the pit. The legacy continues, louder and faster than ever before.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="pt-8"
          >
            <button className="magnetic-wrap group relative inline-flex items-center justify-center px-10 py-5 font-roboto-mono font-bold text-white uppercase tracking-[0.3em] overflow-hidden border border-zinc-700 bg-black transition-colors hover:border-red-600 text-sm">
              <span className="relative z-10 transition-transform duration-500 group-hover:-translate-y-12">Read The Story</span>
              <span className="absolute inset-0 flex items-center justify-center bg-red-600 z-10 translate-y-full transition-transform duration-500 group-hover:translate-y-0 text-black">
                Enter The Pit
              </span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
