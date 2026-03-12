"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PresentationControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fetchPexelsImage } from "@/lib/pexels";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function VinylRecord({ textureUrl }: { textureUrl: string | null }) {
  const meshRef = useRef<THREE.Group>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (textureUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(textureUrl, (loadedTexture) => {
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        setTexture(loadedTexture);
      });
    }
  }, [textureUrl]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 1.2;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
    }
  });

  return (
    <group ref={meshRef} rotation={[Math.PI / 6, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[2.8, 2.8, 0.05, 64]} />
        <meshStandardMaterial color="#050505" roughness={0.1} metalness={0.9} />
      </mesh>

      <mesh position={[0, 0.026, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <ringGeometry args={[0.9, 2.7, 64]} />
        <meshStandardMaterial color="#020202" roughness={0.3} />
      </mesh>

      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[0.9, 64]} />
        {texture ? (
           <meshBasicMaterial map={texture} />
        ) : (
           <meshStandardMaterial color="#991b1b" roughness={0.6} />
        )}
      </mesh>

      <mesh position={[0, 0.035, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[0.06, 32]} />
        <meshBasicMaterial color="#000" />
      </mesh>
    </group>
  );
}

export default function LatestRelease() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadCover() {
      const url = await fetchPexelsImage("dark abstract fire metal", "square");
      setCoverUrl(url);
    }
    loadCover();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (textRef.current) {
        gsap.fromTo(
          textRef.current.children,
          { opacity: 0, x: -30, filter: "blur(5px)" },
          {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 65%",
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
      className="relative w-full min-h-screen bg-[#050505] flex flex-col md:flex-row items-center py-24 px-6 md:px-16 overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-900 to-transparent opacity-50" />

      <div
        ref={textRef}
        className="relative z-10 w-full md:w-5/12 flex flex-col justify-center mb-16 md:mb-0 md:pr-12"
      >
        <span className="text-red-600 font-roboto-mono tracking-[0.5em] uppercase text-xs mb-8">
          [ 02 // Latest Release ]
        </span>
        <h2 className="font-oswald text-7xl md:text-8xl lg:text-[10rem] leading-[0.75] uppercase tracking-tighter mb-6 text-white mix-blend-difference drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          72 <br/>
          <span className="text-zinc-800 text-stroke-white stroke-1">Seasons</span>
        </h2>

        <div className="h-px w-24 bg-red-800 my-8" />

        <p className="font-roboto-mono text-zinc-400 leading-relaxed max-w-sm mb-12 text-sm md:text-base tracking-wide">
          The new album is out now. A searing reflection on the first 18 years of life—the 72 seasons that define who we are. Heavy, unrelenting, and pure venom.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <button className="relative group px-10 py-5 bg-red-700 text-white font-oswald text-xl uppercase tracking-[0.2em] overflow-hidden w-full sm:w-auto text-center">
            <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-12">Stream Now</span>
            <span className="absolute inset-0 flex items-center justify-center bg-white z-10 translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-black">
              Listen
            </span>
          </button>
          <button className="group px-10 py-5 bg-transparent border border-zinc-700 text-zinc-400 font-oswald text-xl uppercase tracking-[0.2em] hover:text-white hover:border-white transition-all duration-300 w-full sm:w-auto text-center relative overflow-hidden">
             <span className="relative z-10">Buy Vinyl</span>
             <div className="absolute inset-0 bg-white/5 translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
          </button>
        </div>
      </div>

      <div className="relative z-10 w-full md:w-7/12 h-[60vh] md:h-[90vh] flex justify-center items-center cursor-none">
        <div className="absolute w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1)_0%,transparent_50%)] pointer-events-none" />

        <Canvas camera={{ position: [0, 2, 9], fov: 45 }}>
          <ambientLight intensity={0.2} />
          <spotLight position={[10, 15, 10]} angle={0.2} penumbra={1} intensity={2.5} color="#ffffff" />
          <pointLight position={[-10, -5, -10]} intensity={1.5} color="#dc2626" />
          <pointLight position={[0, 0, 5]} intensity={0.5} color="#444" />

          <PresentationControls
            global
            snap={false} // Disable snap for smoother manual rotation
            rotation={[0, 0.5, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Infinity, Infinity]} // Allow infinite rotation

          >
            <VinylRecord textureUrl={coverUrl} />
          </PresentationControls>
          <Environment preset="night" />
        </Canvas>

        <div className="absolute bottom-10 right-10 flex items-center gap-4 text-zinc-500 font-roboto-mono text-[10px] tracking-[0.3em] uppercase pointer-events-none mix-blend-difference">
          <div className="w-8 h-px bg-zinc-500" />
          Drag to Rotate
        </div>
      </div>
    </section>
  );
}
