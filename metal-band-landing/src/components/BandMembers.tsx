"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fetchPexelsImage } from "@/lib/pexels";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MEMBERS = [
  { name: "JAMES", role: "Vocals / Guitar", query: "singer shouting stage dark metal", offset: 0 },
  { name: "LARS", role: "Drums", query: "drummer live concert dark heavy", offset: 10 },
  { name: "KIRK", role: "Lead Guitar", query: "guitarist solo metal dark stage", offset: -10 },
  { name: "ROBERT", role: "Bass", query: "bassist playing live concert dark", offset: 5 },
];

export default function BandMembers() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const membersRef = useRef<(HTMLDivElement | null)[]>([]);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    async function loadImages() {
      const fetchedImages = await Promise.all(
        MEMBERS.map(m => fetchPexelsImage(m.query, "portrait"))
      );
      setImages(fetchedImages.map(img => img || ""));
    }
    loadImages();
  }, []);

  useEffect(() => {
    if (!containerRef.current || !titleRef.current) return;

    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power4.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          }
        }
      );

      // Members stagger and parallax
      membersRef.current.forEach((el, index) => {
        if (!el) return;

        // Entry animation
        gsap.fromTo(el,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            delay: index * 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 50%",
            }
          }
        );

        // Slow scroll parallax based on individual offsets
        gsap.to(el, {
          yPercent: MEMBERS[index].offset * 2,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [images]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#030303] flex flex-col items-center py-32 px-6 overflow-hidden"
    >
      {/* Background noise/texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] mix-blend-screen pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-screen-2xl mb-24 text-center">
        <span className="text-zinc-500 font-roboto-mono tracking-[0.4em] uppercase text-sm mb-6 block font-bold">
          [ 04 // The Architects ]
        </span>
        <h2 ref={titleRef} className="font-oswald text-5xl md:text-8xl lg:text-9xl leading-[0.8] uppercase tracking-tighter text-zinc-200">
          The <span className="text-transparent text-stroke-zinc-500 stroke-1 hover:text-white transition-colors duration-500">Brotherhood</span>
        </h2>
      </div>

      <div className="relative z-10 w-full max-w-screen-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mt-10">
        {MEMBERS.map((member, idx) => (
          <div
            key={member.name}
            ref={(el) => { membersRef.current[idx] = el; }}
            className="magnetic-wrap group relative flex flex-col items-center"
            style={{ marginTop: `${idx % 2 === 0 ? '0' : '80px'}` }}
          >
            <div className="w-full aspect-[3/4] overflow-hidden relative grayscale contrast-125 mb-8 rounded-lg">
              <div className="absolute inset-0 bg-red-900/40 mix-blend-color-burn z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {images[idx] ? (
                 <Image
                  src={images[idx]}
                  alt={member.name}
                  fill
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:grayscale-0 pointer-events-none"
                />
              ) : (
                <div className="w-full h-full bg-zinc-900 animate-pulse" />
              )}

              {/* Image Frame Elements */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-zinc-600 z-20 transition-colors group-hover:border-red-600 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-zinc-600 z-20 transition-colors group-hover:border-red-600 pointer-events-none" />
            </div>

            <div className="text-center overflow-hidden w-full h-24 pointer-events-none">
               <h3 className="font-oswald text-4xl md:text-5xl text-zinc-100 uppercase tracking-tight mb-2 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                 {member.name}
               </h3>
               <p className="font-roboto-mono text-zinc-500 text-sm tracking-[0.3em] uppercase group-hover:text-red-600 transition-colors duration-500 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 delay-100">
                 {member.role}
               </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
