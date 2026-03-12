"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PresentationControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fetchPexelsImage } from "@/lib/pexels";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// 3D Vinyl Record Component without `useTexture` hook to avoid suspense issues inside PresentationControls when loading async
function VinylRecord({ textureUrl }: { textureUrl: string | null }) {
  const meshRef = useRef<THREE.Group>(null);

  // Use a state for the loaded texture to safely handle async loading without suspense
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
      // Rotate vinyl slowly over time
      meshRef.current.rotation.y += delta * 0.8;

      // Add slight floating effect
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group ref={meshRef} rotation={[Math.PI / 8, 0, 0]}>
      {/* Vinyl Disc Body */}
      <mesh>
        <cylinderGeometry args={[2.5, 2.5, 0.05, 64]} />
        <meshStandardMaterial
          color="#111"
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Vinyl Grooves (Subtle Ridges) using multiple rings for detail */}
      <mesh position={[0, 0.026, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <ringGeometry args={[0.8, 2.4, 64]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.4} />
      </mesh>

      {/* Center Label */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[0.8, 32]} />
        {texture ? (
           <meshBasicMaterial map={texture} />
        ) : (
           <meshStandardMaterial color="#dc2626" roughness={0.5} />
        )}
      </mesh>

      {/* Center Hole */}
      <mesh position={[0, 0.035, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[0.05, 16]} />
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
      // Query for abstract dark art / metal album cover style
      const url = await fetchPexelsImage("dark abstract skull fire", "square");
      setCoverUrl(url);
    }
    loadCover();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (textRef.current) {
        gsap.fromTo(
          textRef.current,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 1.2,
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

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[90vh] bg-[#0a0a0a] flex flex-col md:flex-row items-center py-24 px-6 md:px-16 overflow-hidden border-t border-zinc-900"
    >
      {/* Text Content */}
      <div
        ref={textRef}
        className="relative z-10 w-full md:w-1/2 flex flex-col justify-center mb-16 md:mb-0"
      >
        <span className="text-red-600 font-roboto-mono tracking-[0.3em] uppercase text-xs md:text-sm mb-6">
          02 // Latest Release
        </span>
        <h2 className="font-oswald text-6xl md:text-8xl lg:text-9xl leading-[0.8] uppercase tracking-tighter mb-4 text-white">
          72 <br/>
          <span className="text-zinc-700">Seasons</span>
        </h2>

        <div className="h-px w-full max-w-sm bg-zinc-800 my-8" />

        <p className="font-roboto-mono text-zinc-400 leading-relaxed max-w-md mb-10 text-sm md:text-base">
          The new album is out now. A searing reflection on the first 18 years of life—the 72 seasons that define who we are. Heavy, unrelenting, and pure venom.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button className="px-8 py-4 bg-red-600 text-white font-oswald text-lg uppercase tracking-widest hover:bg-red-700 transition-colors w-full sm:w-auto text-center">
            Stream Now
          </button>
          <button className="px-8 py-4 bg-transparent border border-zinc-700 text-white font-oswald text-lg uppercase tracking-widest hover:border-white transition-colors w-full sm:w-auto text-center">
            Buy Vinyl
          </button>
        </div>
      </div>

      {/* 3D Vinyl Canvas */}
      <div className="relative z-10 w-full md:w-1/2 h-[50vh] md:h-[80vh] flex justify-center items-center cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#ffffff" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#dc2626" />

          <PresentationControls
            global

            snap
            rotation={[0, 0.3, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 2]}
          >
            <VinylRecord textureUrl={coverUrl} />
          </PresentationControls>
          <Environment preset="city" />
        </Canvas>

        {/* Interaction Hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-zinc-600 font-roboto-mono text-[10px] tracking-widest uppercase pointer-events-none">
          [ Drag to Rotate ]
        </div>
      </div>
    </section>
  );
}
