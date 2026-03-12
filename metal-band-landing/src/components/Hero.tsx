"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { fetchPexelsVideo } from "@/lib/pexels";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ensure ScrollTrigger is registered before use
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function ParticleSwarm(props: any) {
  const ref = useRef<any>(null);

  // Custom function to generate random points in a sphere to avoid 'maath' dependency
  const sphere = useMemo(() => {
    const numPoints = 2000;
    const positions = new Float32Array(numPoints * 3);
    const radius = 1.2;

    for (let i = 0; i < numPoints; i++) {
      // Basic spherical random distribution
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      // To spread evenly throughout volume (cbrt) vs surface
      const r = Math.cbrt(Math.random()) * radius;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);     // x
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta); // y
      positions[i * 3 + 2] = r * Math.cos(phi);                   // z
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial transparent color="#dc2626" size={0.005} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  );
}

export default function Hero() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    async function loadVideo() {
      // Query for heavy concert lighting
      const url = await fetchPexelsVideo("concert lights stage", "landscape");
      setVideoUrl(url);
    }
    loadVideo();
  }, []);

  useEffect(() => {
    if (titleRef.current && heroRef.current) {
      const ctx = gsap.context(() => {
        gsap.to(titleRef.current, {
          y: "30%",
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
      return () => ctx.revert();
    }
  }, []);

  return (
    <section ref={heroRef} className="relative w-full h-[100svh] overflow-hidden bg-black flex items-center justify-center">
      {/* Background Video Layer */}
      {videoUrl && (
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-30 grayscale contrast-150"
            style={{ mixBlendMode: 'screen' }}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          {/* Overlays to make the background gritty */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      {/* WebGL Particle Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-90">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <ParticleSwarm />
        </Canvas>
      </div>

      {/* Hero Typography */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 w-full">
        <h1
          ref={titleRef}
          className="font-oswald text-[12vw] sm:text-[15vw] leading-[0.8] tracking-tighter text-white uppercase drop-shadow-[0_0_40px_rgba(220,38,38,0.4)] select-none mix-blend-exclusion"
        >
          METALLICA
        </h1>
        <p className="mt-8 text-sm md:text-xl text-zinc-400 font-roboto-mono tracking-[0.2em] md:tracking-[0.5em] uppercase max-w-2xl">
          The World Wired Tour
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center opacity-50 animate-pulse">
        <span className="text-xs tracking-[0.2em] uppercase mb-4">Scroll Down</span>
        <div className="w-[1px] h-24 bg-gradient-to-b from-white via-zinc-500 to-transparent" />
      </div>
    </section>
  );
}
