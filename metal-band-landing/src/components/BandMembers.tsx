"use client";

import { useEffect, useState } from "react";
import { fetchPexelsImage } from "@/lib/pexels";
import { motion } from "framer-motion";
import Image from "next/image";

const MEMBERS = [
  { name: "JAMES", role: "Vocals / Guitar", query: "singer shouting stage dark metal" },
  { name: "LARS", role: "Drums", query: "drummer live concert dark heavy" },
  { name: "KIRK", role: "Lead Guitar", query: "guitarist solo metal dark stage" },
  { name: "ROBERT", role: "Bass", query: "bassist playing live concert dark" },
];

export default function BandMembers() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    async function loadImages() {
      const fetchedImages = await Promise.all(
        MEMBERS.map(m => fetchPexelsImage(m.query, "portrait"))
      );
      setImages(fetchedImages.map(img => img || ""));
    }
    loadImages();
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-[#030303] flex flex-col items-center py-32 px-6 overflow-hidden">
      {/* Background noise/texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] mix-blend-screen pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-screen-2xl mb-24 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-zinc-500 font-roboto-mono tracking-[0.4em] uppercase text-sm mb-6 block font-bold"
        >
          [ 04 // The Architects ]
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-oswald text-5xl md:text-8xl lg:text-9xl leading-[0.8] uppercase tracking-tighter text-zinc-200"
        >
          The <span className="text-transparent text-stroke-zinc-500 stroke-1 hover:text-white transition-colors duration-500">Brotherhood</span>
        </motion.h2>
      </div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col mt-10">
        {MEMBERS.map((member, idx) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full flex flex-col md:flex-row items-center md:items-start justify-between border-b border-zinc-900 py-12 md:py-24 group"
          >
            <div className="flex flex-col text-center md:text-left mb-8 md:mb-0">
               <h3 className="font-oswald text-5xl md:text-7xl lg:text-8xl text-zinc-100 uppercase tracking-tight group-hover:text-red-600 transition-colors duration-500">
                 {member.name}
               </h3>
               <p className="font-roboto-mono text-zinc-500 text-sm md:text-lg tracking-[0.3em] uppercase mt-2 group-hover:text-zinc-300 transition-colors duration-500">
                 {member.role}
               </p>
            </div>

            <div className="w-full md:w-1/3 aspect-[3/4] overflow-hidden relative grayscale contrast-125 rounded-sm">
              <div className="absolute inset-0 bg-red-900/40 mix-blend-color-burn z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {images[idx] ? (
                 <Image
                  src={images[idx]}
                  alt={member.name}
                  fill
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:grayscale-0 pointer-events-none"
                />
              ) : (
                <div className="w-full h-full bg-zinc-900 animate-pulse" />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
