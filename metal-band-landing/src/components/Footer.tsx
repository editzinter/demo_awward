"use client";

import { useEffect, useRef, useState } from "react";
import { Facebook, Twitter, Instagram, Youtube, Music } from "lucide-react";
import gsap from "gsap";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  // Magnetic Button Effect setup
  useEffect(() => {
    const magneticElements = document.querySelectorAll('.magnetic');

    magneticElements.forEach((el) => {
      const element = el as HTMLElement;

      const mouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = element.getBoundingClientRect();
        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);

        gsap.to(element, {
          x: x * 0.4,
          y: y * 0.4,
          duration: 0.5,
          ease: "power3.out",
        });
      };

      const mouseLeave = () => {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.3)",
        });
      };

      element.addEventListener("mousemove", mouseMove);
      element.addEventListener("mouseleave", mouseLeave);

      return () => {
        element.removeEventListener("mousemove", mouseMove);
        element.removeEventListener("mouseleave", mouseLeave);
      };
    });
  }, []);

  return (
    <footer ref={footerRef} className="relative w-full bg-black text-white py-24 px-6 md:px-16 overflow-hidden border-t border-zinc-900">

      {/* Background Graphic */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none w-full flex justify-center overflow-hidden">
        <h1 className="font-oswald text-[25vw] leading-[0.8] tracking-tighter text-white uppercase whitespace-nowrap">
          METALLICA
        </h1>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-16 md:gap-8">

        {/* Newsletter Signup */}
        <div className="w-full md:w-1/2 flex flex-col">
          <span className="text-red-600 font-roboto-mono tracking-[0.3em] uppercase text-xs md:text-sm mb-4">
            Join The Fifth Member
          </span>
          <h3 className="font-oswald text-4xl md:text-6xl uppercase tracking-tighter mb-8 text-white">
            Subscribe <br/> For Updates
          </h3>

          <form className="relative flex flex-col sm:flex-row w-full max-w-md gap-4" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="YOUR EMAIL ADDRESS"
              className="w-full bg-transparent border-b border-zinc-700 py-4 px-2 text-white font-roboto-mono text-sm tracking-widest uppercase focus:outline-none focus:border-red-600 transition-colors placeholder:text-zinc-600"
              required
            />
            <button
              type="submit"
              className="magnetic px-8 py-4 bg-white text-black font-oswald text-lg uppercase tracking-widest hover:bg-red-600 hover:text-white transition-colors duration-300 w-full sm:w-auto text-center cursor-pointer"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Social Links */}
        <div className="flex flex-col items-start md:items-end">
          <ul className="flex flex-wrap gap-4 md:gap-6 mb-12">
            {[
              { icon: Music, label: "Music" },
              { icon: Youtube, label: "YouTube" },
              { icon: Instagram, label: "Instagram" },
              { icon: Twitter, label: "Twitter" },
              { icon: Facebook, label: "Facebook" },
            ].map((social, idx) => (
              <li key={idx} className="magnetic border border-zinc-800 rounded-full p-4 cursor-pointer hover:border-red-600 hover:bg-red-600/10 transition-all duration-300 group">
                <social.icon className="w-6 h-6 text-zinc-400 group-hover:text-red-500 transition-colors" />
              </li>
            ))}
          </ul>

          <div className="text-zinc-600 font-roboto-mono text-xs tracking-widest uppercase text-left md:text-right">
            <p>&copy; {new Date().getFullYear()} METALLICA. ALL RIGHTS RESERVED.</p>
            <p className="mt-2 text-zinc-800">Designed with Next.js, GSAP & Three.js</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
