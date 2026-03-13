"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import Hero from "@/components/Hero";
import About from "@/components/About";
import LatestRelease from "@/components/LatestRelease";
import TourDates from "@/components/TourDates";
import BandMembers from "@/components/BandMembers";
import Discography from "@/components/Discography";
import InteractiveMerch from "@/components/InteractiveMerch";
import Footer from "@/components/Footer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <main ref={mainRef} className="w-full min-h-screen bg-black text-zinc-100 overflow-x-hidden">
      <div className="fixed inset-0 z-[10000] bg-black flex items-center justify-center animate-[fadeOut_2s_ease-in-out_forwards] pointer-events-none delay-1000">
        <h1 className="font-oswald text-4xl md:text-6xl text-red-600 tracking-[0.5em] uppercase animate-pulse mix-blend-difference drop-shadow-md">
          Initializing
        </h1>
      </div>

      <Hero />
      <About />
      <LatestRelease />
      <TourDates />
      <BandMembers />
      <Discography />
      <InteractiveMerch />
      <Footer />
    </main>
  );
}
