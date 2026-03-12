"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Environment, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fetchPexelsImage } from "@/lib/pexels";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function MetalAbstractShape({ matCapUrl }: { matCapUrl: string | null }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (matCapUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(matCapUrl, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        setTexture(tex);
      });
    }
  }, [matCapUrl]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;

      const mouseX = state.pointer.x;
      const mouseY = state.pointer.y;

      gsap.to(meshRef.current.scale, {
        x: 1 + Math.abs(mouseX) * 0.2,
        y: 1 + Math.abs(mouseY) * 0.2,
        z: 1 + (Math.abs(mouseX) + Math.abs(mouseY)) * 0.1,
        duration: 0.5,
      });
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <torusKnotGeometry args={[1.5, 0.4, 128, 32]} />
        {texture ? (
          <MeshDistortMaterial
            color="#ffffff"
            map={texture}
            metalness={1}
            roughness={0.1}
            distort={0.4}
            speed={2}
          />
        ) : (
          <meshStandardMaterial color="#333" metalness={0.9} roughness={0.2} wireframe={true} />
        )}
      </mesh>
    </Float>
  );
}

export default function InteractiveMerch() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [textureUrl, setTextureUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadTexture() {
      const url = await fetchPexelsImage("dark liquid metal chrome texture", "square");
      setTextureUrl(url);
    }
    loadTexture();
  }, []);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      if (textRef.current) {
        gsap.fromTo(textRef.current.children,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 60%",
            }
          }
        );
      }

      gsap.to(".merch-bg", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [textureUrl]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-[#050505] flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-color-dodge">
        <div className="merch-bg w-full h-[150%] -top-[25%] absolute bg-gradient-to-br from-red-900/30 via-transparent to-zinc-900/50" />
      </div>

      <div className="absolute inset-0 z-10 cursor-crosshair">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }} shadows>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" castShadow />
          <directionalLight position={[-10, -10, -5]} intensity={1} color="#dc2626" />

          <Center>
            <MetalAbstractShape matCapUrl={textureUrl} />
          </Center>

          <Environment preset="studio" />
        </Canvas>
      </div>

      <div
        ref={textRef}
        className="relative z-20 flex flex-col items-center text-center px-6 pointer-events-none mix-blend-difference"
      >
        <span className="text-red-500 font-roboto-mono tracking-[0.5em] uppercase text-sm mb-6 font-bold block drop-shadow-md">
          [ 06 // The Vault ]
        </span>
        <h2 className="font-oswald text-6xl md:text-8xl lg:text-[10rem] leading-[0.8] uppercase tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          Merch
        </h2>
        <p className="font-roboto-mono text-zinc-300 max-w-lg mt-8 text-sm md:text-base tracking-[0.2em] uppercase leading-relaxed font-bold">
          Wear the legacy. Forged in fire and steel.
        </p>

        <div className="mt-12 pointer-events-auto">
          <button className="group relative px-12 py-6 bg-transparent border-2 border-white text-white font-oswald text-2xl uppercase tracking-[0.3em] overflow-hidden hover:text-black transition-colors duration-500">
            <span className="relative z-10 mix-blend-difference group-hover:mix-blend-normal text-white group-hover:text-black">Enter Store</span>
            <div className="absolute inset-0 bg-white translate-y-[100%] transition-transform duration-500 ease-out group-hover:translate-y-0" />
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-10 z-20 text-zinc-500 font-roboto-mono text-[10px] tracking-[0.4em] uppercase pointer-events-none mix-blend-difference font-bold">
        Interact with cursor
      </div>
    </section>
  );
}
