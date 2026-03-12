"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fetchPexelsImage } from "@/lib/pexels";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadImage() {
      // Query for heavy metal band / guitar / stage presence
      const url = await fetchPexelsImage("guitarist stage smoke dark", "portrait");
      setImageUrl(url);
    }
    loadImage();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image Parallax Effect
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Text Stagger Reveal
      if (textRef.current) {
        const textElements = textRef.current.children;
        gsap.fromTo(
          textElements,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 60%", // Start animating when top of container hits 60% of viewport
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [imageUrl]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-black text-zinc-100 flex flex-col md:flex-row items-center py-24 md:py-32 px-6 md:px-16 overflow-hidden"
    >
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-10 pointer-events-none" />

      {/* Image Column */}
      <div className="relative w-full md:w-1/2 h-[60vh] md:h-[80vh] overflow-hidden rounded-sm grayscale contrast-125 mb-16 md:mb-0">
        <div className="absolute inset-0 bg-red-600/20 mix-blend-overlay z-10" />
        {imageUrl ? (
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Band on stage"
            className="w-full h-[120%] object-cover object-top -mt-[10%]"
            /* Notice -mt-[10%] and h-[120%] to give space for parallax movement */
          />
        ) : (
          <div className="w-full h-full bg-zinc-900 animate-pulse" />
        )}

        {/* Gritty Borders / Frame */}
        <div className="absolute inset-0 border-[1px] border-zinc-800 z-20 pointer-events-none" />
        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-red-600 z-20" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-red-600 z-20" />
      </div>

      {/* Text Content Column */}
      <div
        ref={textRef}
        className="relative z-10 w-full md:w-1/2 md:pl-16 lg:pl-24 flex flex-col justify-center"
      >
        <span className="text-red-600 font-roboto-mono tracking-widest uppercase text-sm mb-4">
          01 // The Legacy
        </span>
        <h2 className="font-oswald text-5xl md:text-7xl lg:text-8xl leading-[0.9] uppercase tracking-tighter mb-8">
          Born in <br/>
          <span className="text-zinc-500">The Fire</span>
        </h2>
        <p className="font-roboto-mono text-zinc-400 leading-relaxed max-w-lg mb-6 text-sm md:text-base">
          For over four decades, we've forged a path through blood, sweat, and heavy riffs. From underground thrash scenes to sold-out global arenas, the intensity has never wavered.
        </p>
        <p className="font-roboto-mono text-zinc-400 leading-relaxed max-w-lg text-sm md:text-base">
          This isn't just music. It's an unrelenting force. An energy shared between the stage and the pit. The legacy continues, louder and faster than ever before.
        </p>

        <div className="mt-12">
          <button className="group relative inline-flex items-center justify-center px-8 py-4 font-roboto-mono font-bold text-white uppercase tracking-widest overflow-hidden border border-zinc-800 bg-zinc-950 transition-colors hover:border-red-600">
            <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-10">Read The Story</span>
            <span className="absolute inset-0 flex items-center justify-center bg-red-600 z-10 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
              Enter
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
