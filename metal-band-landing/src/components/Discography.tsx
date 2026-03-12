"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fetchPexelsImage } from "@/lib/pexels";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ALBUMS = [
  { year: "1983", title: "Kill 'Em All", query: "red blood texture abstract dark" },
  { year: "1984", title: "Ride The Lightning", query: "lightning storm dark blue sky" },
  { year: "1986", title: "Master of Puppets", query: "crosses graveyard dark green" },
  { year: "1988", title: "...And Justice For All", query: "cracked stone statue dark texture" },
  { year: "1991", title: "The Black Album", query: "pure black snake texture scale" },
  { year: "2023", title: "72 Seasons", query: "yellow burn fire metal texture" },
];

export default function Discography() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    async function loadImages() {
      const fetchedImages = await Promise.all(
        ALBUMS.map(a => fetchPexelsImage(a.query, "square"))
      );
      setImages(fetchedImages.map(img => img || ""));
    }
    loadImages();
  }, []);

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      // Calculate total width to scroll
      const trackWidth = trackRef.current?.scrollWidth || 0;
      const amountToScroll = trackWidth - window.innerWidth;

      // Horizontal Scroll
      gsap.to(trackRef.current, {
        x: -amountToScroll,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${amountToScroll}`, // Pin for duration of scroll width
          pin: true,
          scrub: 1,
        }
      });

      // Animate items as they come into view (even during horizontal scroll)
      const items = gsap.utils.toArray<HTMLElement>('.album-item');

      items.forEach((item) => {
        // Find the image inside the item
        const img = item.querySelector('img');
        const year = item.querySelector('.album-year');
        const title = item.querySelector('.album-title');

        if (!img || !year || !title) return;

        gsap.fromTo(img,
          { scale: 1.2, filter: "blur(10px) brightness(0.5)", rotation: 5 },
          {
            scale: 1,
            filter: "blur(0px) brightness(1)",
            rotation: 0,
            duration: 1,
            scrollTrigger: {
              trigger: item,
              start: "left center", // Trigger when item enters center of screen horizontally
              containerAnimation: gsap.getById("hScroll") || undefined, // Link to horizontal scroll
              toggleActions: "play none none reverse",
            }
          }
        );

        gsap.fromTo([year, title],
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "left 70%", // Trigger slightly before center
              containerAnimation: gsap.getById("hScroll") || undefined,
              toggleActions: "play none none reverse",
            }
          }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, [images]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-[#020202] overflow-hidden border-t border-b border-zinc-900"
    >
      {/* Absolute Header that stays fixed during horizontal scroll */}
      <div className="absolute top-12 md:top-24 left-6 md:left-16 z-20 mix-blend-difference pointer-events-none">
        <span className="text-red-600 font-roboto-mono tracking-[0.4em] uppercase text-sm mb-4 block font-bold">
          [ 05 // History ]
        </span>
        <h2 className="font-oswald text-4xl md:text-7xl leading-[0.8] uppercase tracking-tighter text-white">
          Discography
        </h2>
      </div>

      {/* The scrolling track */}
      <div
        ref={trackRef}
        className="flex items-center h-full px-6 md:px-[20vw] pt-32"
        id="hScroll" // ID to reference in containerAnimation
      >
        <div className="flex gap-20 md:gap-40 pr-32">
          {ALBUMS.map((album, idx) => (
            <div
              key={album.year}
              className="album-item relative flex flex-col items-center justify-center w-[60vw] md:w-[35vw] shrink-0 group cursor-none"
            >
              {/* Year large background text */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-oswald text-[15vw] leading-none text-zinc-900/50 -z-10 select-none whitespace-nowrap opacity-50 transition-opacity duration-500 group-hover:opacity-100 mix-blend-screen">
                {album.year}
              </div>

              {/* Album Art container */}
              <div className="w-full aspect-square relative overflow-hidden bg-zinc-900 shadow-2xl shadow-black/50 group-hover:shadow-red-900/20 transition-shadow duration-500 grayscale contrast-125 group-hover:grayscale-0">
                {images[idx] ? (
                  <Image
                    src={images[idx]}
                    alt={album.title}
                    fill
                    className="w-full h-full object-cover mix-blend-screen"
                  />
                ) : (
                  <div className="w-full h-full animate-pulse bg-zinc-800" />
                )}

                {/* Glitch Overlay Effect */}
                <div className="absolute inset-0 bg-red-600/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Text Info */}
              <div className="mt-8 text-center flex flex-col items-center gap-2">
                <span className="album-year text-red-600 font-roboto-mono text-sm md:text-lg tracking-[0.5em] font-bold">
                  {album.year}
                </span>
                <h3 className="album-title font-oswald text-3xl md:text-5xl text-white uppercase tracking-tighter mix-blend-difference group-hover:text-transparent group-hover:text-stroke-white group-hover:stroke-1 transition-all duration-300">
                  {album.title}
                </h3>
              </div>
            </div>
          ))}

          {/* End cap spacing */}
          <div className="w-[10vw] shrink-0" />
        </div>
      </div>

      {/* Scroll Hint */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 text-zinc-500 font-roboto-mono text-xs tracking-[0.3em] uppercase mix-blend-difference opacity-50 animate-pulse">
        Scroll To Explore
        <div className="w-12 h-px bg-zinc-500" />
      </div>
    </section>
  );
}
