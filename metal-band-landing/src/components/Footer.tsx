"use client";

import { useRef } from "react";
import { Facebook, Twitter, Instagram, Youtube, Music } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";

function MagneticButton({ children, className }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLButtonElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct * 20); // max displacement
    y.set(yPct * 20);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: mouseXSpring, y: mouseYSpring }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

function MagneticIcon({ children, className }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLLIElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLLIElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct * 15);
    y.set(yPct * 15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.li
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: mouseXSpring, y: mouseYSpring }}
      className={className}
    >
      {children}
    </motion.li>
  );
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  return (
    <footer ref={footerRef} className="relative w-full bg-black text-white py-24 px-6 md:px-16 overflow-hidden border-t border-zinc-900">

      {/* Background Graphic */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none select-none w-full flex justify-center overflow-hidden mix-blend-screen">
        <h1 className="font-oswald text-[25vw] leading-[0.8] tracking-tighter text-zinc-800 uppercase whitespace-nowrap">
          METALLICA
        </h1>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-16 md:gap-8">

        {/* Newsletter Signup */}
        <div className="w-full md:w-1/2 flex flex-col">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-red-600 font-roboto-mono tracking-[0.3em] uppercase text-xs md:text-sm mb-4"
          >
            Join The Fifth Member
          </motion.span>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-oswald text-4xl md:text-6xl uppercase tracking-tighter mb-8 text-white"
          >
            Subscribe <br/> For Updates
          </motion.h3>

          <motion.form
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative flex flex-col sm:flex-row w-full max-w-md gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="YOUR EMAIL ADDRESS"
              className="w-full bg-transparent border-b border-zinc-700 py-4 px-2 text-white font-roboto-mono text-sm tracking-widest uppercase focus:outline-none focus:border-red-600 transition-colors placeholder:text-zinc-600"
              required
            />
            <MagneticButton className="px-8 py-4 bg-white text-black font-oswald text-lg uppercase tracking-widest hover:bg-red-600 hover:text-white transition-colors duration-300 w-full sm:w-auto text-center cursor-pointer">
              Submit
            </MagneticButton>
          </motion.form>
        </div>

        {/* Social Links */}
        <div className="flex flex-col items-start md:items-end">
          <motion.ul
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
            className="flex flex-wrap gap-4 md:gap-6 mb-12"
          >
            {[
              { icon: Music, label: "Music" },
              { icon: Youtube, label: "YouTube" },
              { icon: Instagram, label: "Instagram" },
              { icon: Twitter, label: "Twitter" },
              { icon: Facebook, label: "Facebook" },
            ].map((social, idx) => (
              <MagneticIcon key={idx} className="border border-zinc-800 rounded-full p-4 cursor-pointer hover:border-red-600 hover:bg-red-600/10 transition-all duration-300 group">
                <social.icon className="w-6 h-6 text-zinc-400 group-hover:text-red-500 transition-colors pointer-events-none" />
              </MagneticIcon>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-zinc-600 font-roboto-mono text-xs tracking-widest uppercase text-left md:text-right"
          >
            <p>&copy; {new Date().getFullYear()} METALLICA. ALL RIGHTS RESERVED.</p>
            <p className="mt-2 text-zinc-800">Designed with Next.js, Framer Motion & GSAP</p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
