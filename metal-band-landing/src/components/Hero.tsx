"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { fetchPexelsVideo } from "@/lib/pexels";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function ParticleSwarm(props: any) {
  const ref = useRef<any>(null);

  const sphere = useMemo(() => {
    const numPoints = 3000;
    const positions = new Float32Array(numPoints * 3);
    const radius = 1.5;

    for (let i = 0; i < numPoints; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = Math.cbrt(Math.random()) * radius;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 8;
      ref.current.rotation.y -= delta / 12;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial transparent color="#dc2626" size={0.005} sizeAttenuation={true} depthWrite={false} opacity={0.8} />
      </Points>
    </group>
  );
}

export default function Hero() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadVideo() {
      const url = await fetchPexelsVideo("concert lights stage heavy metal dark", "landscape");
      setVideoUrl(url);
    }
    loadVideo();
  }, []);

  useEffect(() => {
    if (!titleRef.current || !heroRef.current || !subtitleRef.current || !lineRef.current) return;

    // Initial Reveal Animation
    const chars = titleRef.current.innerText.split('');
    titleRef.current.innerText = '';
    chars.forEach((char) => {
      const span = document.createElement('span');
      span.innerText = char;
      span.className = 'inline-block opacity-0 translate-y-full';
      titleRef.current!.appendChild(span);
    });

    const tl = gsap.timeline();

    tl.to(titleRef.current.children, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      stagger: 0.08,
      ease: "power4.out",
      delay: 0.2
    })
    .fromTo(subtitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=0.8")
    .fromTo(lineRef.current, { scaleY: 0 }, { scaleY: 1, duration: 1, ease: "power2.out" }, "-=0.5");

    // Scroll Parallax Animation
    const ctx = gsap.context(() => {
      gsap.to(titleRef.current, {
        y: "40%",
        opacity: 0,
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(subtitleRef.current, {
        y: "100%",
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

    return () => {
      tl.kill();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={heroRef} className="relative w-full h-[100svh] overflow-hidden bg-black flex items-center justify-center">
      {videoUrl && (
        <div className="absolute inset-0 z-0 scale-105">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-40 grayscale contrast-150"
            style={{ mixBlendMode: 'screen' }}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      <div className="absolute inset-0 z-10 pointer-events-none opacity-100">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <ParticleSwarm />
        </Canvas>
      </div>

      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 w-full">
        <h1
          ref={titleRef}
          className="font-oswald text-[14vw] sm:text-[16vw] leading-[0.8] tracking-tighter text-white uppercase drop-shadow-[0_0_60px_rgba(220,38,38,0.5)] select-none mix-blend-exclusion overflow-hidden"
        >
          METALLICA
        </h1>
        <p ref={subtitleRef} className="mt-8 text-sm md:text-xl text-zinc-400 font-roboto-mono tracking-[0.3em] md:tracking-[0.8em] uppercase max-w-2xl opacity-0">
          The World Wired Tour
        </p>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center opacity-70">
        <span className="text-xs tracking-[0.2em] uppercase mb-4 font-bold text-red-600">Scroll</span>
        <div ref={lineRef} className="w-[1px] h-32 bg-gradient-to-b from-red-600 via-zinc-500 to-transparent origin-top scale-y-0" />
      </div>
    </section>
  );
}
