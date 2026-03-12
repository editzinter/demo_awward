"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fetchPexelsImage } from "@/lib/pexels";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TOUR_DATES = [
  { id: 1, date: "AUG 12", city: "LONDON, UK", venue: "WEMBLEY STADIUM" },
  { id: 2, date: "AUG 18", city: "BERLIN, DE", venue: "OLYMPIASTADION" },
  { id: 3, date: "AUG 25", city: "PARIS, FR", venue: "STADE DE FRANCE" },
  { id: 4, date: "SEP 02", city: "NEW YORK, US", venue: "METLIFE STADIUM" },
  { id: 5, date: "SEP 09", city: "LOS ANGELES, US", venue: "SOFI STADIUM" },
];

export default function TourDates() {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [hoverImage, setHoverImage] = useState<string | null>(null);

  useEffect(() => {
    async function loadHoverImage() {
      // Background crowd image
      const url = await fetchPexelsImage("concert crowd hands", "landscape");
      setHoverImage(url);
    }
    loadHoverImage();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (listRef.current) {
        gsap.fromTo(
          listRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 70%",
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
      className="relative w-full min-h-screen bg-black flex flex-col items-center py-24 md:py-32 px-6 overflow-hidden"
    >
      {/* Dynamic Hover Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-0 transition-opacity duration-700 ease-in-out pointer-events-none grayscale contrast-150"
        style={{ backgroundImage: hoverImage ? `url(${hoverImage})` : 'none' }}
        id="tour-bg"
      />
      <div className="absolute inset-0 bg-black/80 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-0 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 w-full max-w-6xl mb-16 text-center md:text-left">
        <span className="text-red-600 font-roboto-mono tracking-[0.3em] uppercase text-xs md:text-sm mb-4 block">
          03 // World Tour
        </span>
        <h2 className="font-oswald text-5xl md:text-8xl lg:text-9xl leading-[0.8] uppercase tracking-tighter text-white">
          The <span className="text-red-600/50">World</span><br/> Wired
        </h2>
      </div>

      {/* Tour List */}
      <ul ref={listRef} className="relative z-10 w-full max-w-6xl flex flex-col group/list">
        {/* Header Row */}
        <li className="hidden md:grid grid-cols-4 gap-4 pb-6 border-b border-zinc-800 text-zinc-500 font-roboto-mono text-xs tracking-widest uppercase mb-4">
          <div>Date</div>
          <div className="col-span-2">City / Venue</div>
          <div className="text-right">Action</div>
        </li>

        {TOUR_DATES.map((tour) => (
          <li
            key={tour.id}
            className="group relative border-b border-zinc-900 transition-colors duration-300 hover:border-red-600"
            onMouseEnter={() => {
              // Trigger background reveal
              const bg = document.getElementById('tour-bg');
              if (bg) bg.style.opacity = '0.4';
            }}
            onMouseLeave={() => {
              const bg = document.getElementById('tour-bg');
              if (bg) bg.style.opacity = '0';
            }}
          >
            {/* Hover Fill Effect */}
            <div className="absolute inset-0 bg-red-600/10 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 z-0" />

            <div className="relative z-10 flex flex-col md:grid md:grid-cols-4 md:items-center gap-4 py-8 md:py-10 px-4">
              <div className="font-oswald text-4xl md:text-5xl text-red-600 group-hover:text-red-500 transition-colors">
                {tour.date}
              </div>

              <div className="col-span-2 flex flex-col">
                <span className="font-oswald text-3xl md:text-4xl text-white uppercase tracking-tighter">
                  {tour.city}
                </span>
                <span className="font-roboto-mono text-zinc-400 text-sm tracking-widest uppercase mt-1">
                  {tour.venue}
                </span>
              </div>

              <div className="mt-4 md:mt-0 md:text-right">
                <button className="px-6 py-3 border border-zinc-700 text-white font-roboto-mono text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300">
                  Tickets
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="relative z-10 mt-20">
         <button className="text-zinc-500 font-roboto-mono text-sm tracking-[0.2em] uppercase hover:text-red-600 transition-colors border-b border-transparent hover:border-red-600 pb-1">
            View All Dates
         </button>
      </div>
    </section>
  );
}
