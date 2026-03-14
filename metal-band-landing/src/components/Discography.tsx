"use client";

import { useEffect, useState } from "react";
import { fetchPexelsImage } from "@/lib/pexels";
import { motion } from "framer-motion";
import Image from "next/image";

const ALBUMS = [
  { year: "1983", title: "Kill 'Em All", query: "red blood texture abstract dark" },
  { year: "1984", title: "Ride The Lightning", query: "lightning storm dark blue sky" },
  { year: "1986", title: "Master of Puppets", query: "crosses graveyard dark green" },
  { year: "1988", title: "...And Justice For All", query: "cracked stone statue dark texture" },
  { year: "1991", title: "The Black Album", query: "pure black snake texture scale" },
  { year: "2023", title: "72 Seasons", query: "yellow burn fire metal texture" },
];

export default function Discography() {
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

  return (
    <section className="relative w-full min-h-screen bg-[#020202] py-32 px-6 md:px-16 overflow-hidden border-t border-b border-zinc-900 flex flex-col items-center">

      {/* Header */}
      <div className="w-full max-w-7xl mb-24 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-red-600 font-roboto-mono tracking-[0.4em] uppercase text-sm mb-4 block font-bold"
        >
          [ 05 // History ]
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-oswald text-5xl md:text-7xl lg:text-9xl leading-[0.8] uppercase tracking-tighter text-white"
        >
          Discography
        </motion.h2>
      </div>

      {/* Grid */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-24">
        {ALBUMS.map((album, idx) => (
          <motion.div
            key={album.year}
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            whileInView={{ scale: 1, opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: (idx % 3) * 0.1 }}
            className="album-item relative flex flex-col items-center w-full group cursor-pointer"
          >
            {/* Year large background text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-oswald text-[25vw] md:text-[15vw] lg:text-[10vw] leading-none text-zinc-900/50 -z-10 select-none whitespace-nowrap opacity-50 transition-opacity duration-500 group-hover:opacity-100 mix-blend-screen pointer-events-none">
              {album.year}
            </div>

            {/* Album Art container */}
            <div className="w-full aspect-square relative overflow-hidden bg-zinc-900 shadow-2xl shadow-black/50 group-hover:shadow-red-900/20 transition-all duration-500 grayscale contrast-125 group-hover:grayscale-0">
              {images[idx] ? (
                <Image
                  src={images[idx]}
                  alt={album.title}
                  fill
                  className="w-full h-full object-cover mix-blend-screen transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full animate-pulse bg-zinc-800" />
              )}

              {/* Glitch Overlay Effect */}
              <div className="absolute inset-0 bg-red-600/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>

            {/* Text Info */}
            <div className="mt-8 text-center flex flex-col items-center gap-2">
              <span className="album-year text-red-600 font-roboto-mono text-sm md:text-lg tracking-[0.5em] font-bold transition-colors duration-300 group-hover:text-white">
                {album.year}
              </span>
              <h3 className="album-title font-oswald text-3xl md:text-4xl text-white uppercase tracking-tighter mix-blend-difference group-hover:text-red-600 transition-colors duration-300">
                {album.title}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
