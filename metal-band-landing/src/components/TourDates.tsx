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
  const headerRef = useRef<HTMLDivElement>(null);
  const cursorFollowerRef = useRef<HTMLDivElement>(null);
  const [hoverImage, setHoverImage] = useState<string | null>(null);

  useEffect(() => {
    async function loadHoverImage() {
      const url = await fetchPexelsImage("concert crowd metal heavy dark", "landscape");
      setHoverImage(url);
    }
    loadHoverImage();
  }, []);

  useEffect(() => {
    // Custom cursor follower for the tour list
    const follower = cursorFollowerRef.current;
    if (!follower) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      currentX += (mouseX - currentX) * 0.1;
      currentY += (mouseY - currentY) * 0.1;
      if (follower) {
        follower.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
      }
      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove);
    requestAnimationFrame(animate);

    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(headerRef.current.children,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 75%"
            }
          }
        );
      }

      if (listRef.current) {
        gsap.fromTo(
          listRef.current.children,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 60%",
            },
          }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleMouseEnter = () => {
    if (cursorFollowerRef.current) {
      gsap.to(cursorFollowerRef.current, { scale: 1, opacity: 0.8, duration: 0.4, ease: "power3.out" });
    }
  };

  const handleMouseLeave = () => {
    if (cursorFollowerRef.current) {
      gsap.to(cursorFollowerRef.current, { scale: 0, opacity: 0, duration: 0.4, ease: "power3.in" });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-black flex flex-col items-center py-32 md:py-48 px-6 overflow-hidden"
    >
      {/* Dynamic Cursor Image Follower */}
      {hoverImage && (
        <div
          ref={cursorFollowerRef}
          className="fixed top-0 left-0 w-[400px] h-[250px] pointer-events-none z-0 scale-0 opacity-0 overflow-hidden mix-blend-screen"
        >
          <img src={hoverImage} alt="Crowd" className="w-full h-full object-cover grayscale contrast-150" />
          <div className="absolute inset-0 bg-red-900/40 mix-blend-multiply" />
        </div>
      )}

      {/* Header */}
      <div ref={headerRef} className="relative z-10 w-full max-w-7xl mb-24 text-center md:text-left overflow-hidden">
        <span className="text-red-600 font-roboto-mono tracking-[0.4em] uppercase text-sm mb-6 block font-bold">
          [ 03 // World Tour ]
        </span>
        <h2 className="font-oswald text-6xl md:text-[10rem] leading-[0.8] uppercase tracking-tighter text-white mix-blend-difference">
          The <span className="text-transparent text-stroke-red stroke-2 hover:text-red-600 transition-colors duration-500">World</span><br/> Wired
        </h2>
      </div>

      {/* Tour List */}
      <ul ref={listRef} className="relative z-10 w-full max-w-7xl flex flex-col group/list" onMouseLeave={handleMouseLeave}>
        <li className="hidden md:grid grid-cols-12 gap-4 pb-8 border-b-2 border-zinc-800 text-zinc-500 font-roboto-mono text-sm tracking-[0.2em] uppercase mb-4">
          <div className="col-span-3">Date</div>
          <div className="col-span-7">City / Venue</div>
          <div className="col-span-2 text-right">Action</div>
        </li>

        {TOUR_DATES.map((tour) => (
          <li
            key={tour.id}
            className="group relative border-b border-zinc-900 transition-all duration-500 hover:border-red-600 hover:pl-4"
            onMouseEnter={handleMouseEnter}
          >
            {/* Hover Fill Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-transparent origin-left scale-x-0 transition-transform duration-700 ease-out group-hover:scale-x-100 z-0" />

            <div className="relative z-10 flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 py-10 md:py-14">
              <div className="col-span-3 font-oswald text-5xl md:text-6xl text-red-600 group-hover:text-white transition-colors duration-500 mix-blend-difference">
                {tour.date}
              </div>

              <div className="col-span-7 flex flex-col justify-center">
                <span className="font-oswald text-4xl md:text-5xl text-zinc-300 uppercase tracking-tighter group-hover:text-white transition-colors duration-500">
                  {tour.city}
                </span>
                <span className="font-roboto-mono text-zinc-500 text-sm md:text-base tracking-[0.3em] uppercase mt-2 group-hover:text-zinc-300 transition-colors duration-500">
                  {tour.venue}
                </span>
              </div>

              <div className="col-span-2 mt-6 md:mt-0 flex md:justify-end">
                <button className="relative overflow-hidden px-8 py-4 border border-zinc-700 text-white font-roboto-mono text-sm tracking-[0.2em] uppercase transition-all duration-300 group-hover:border-red-600 w-full md:w-auto text-center group/btn">
                  <span className="relative z-10 transition-transform duration-300 group-hover/btn:-translate-y-10 block">Tickets</span>
                  <span className="absolute inset-0 flex items-center justify-center bg-red-600 z-10 translate-y-full transition-transform duration-300 group-hover/btn:translate-y-0 text-white font-bold block pt-4">Get 'Em</span>
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="relative z-10 mt-32">
         <button className="text-zinc-400 font-roboto-mono text-sm tracking-[0.4em] uppercase hover:text-white transition-colors flex flex-col items-center gap-4 group">
            <span className="w-px h-12 bg-zinc-800 group-hover:bg-red-600 transition-colors duration-500" />
            View All Dates
         </button>
      </div>
    </section>
  );
}
