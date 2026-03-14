"use client";

import { motion } from "framer-motion";

const TOUR_DATES = [
  { id: 1, date: "AUG 12", city: "LONDON, UK", venue: "WEMBLEY STADIUM" },
  { id: 2, date: "AUG 18", city: "BERLIN, DE", venue: "OLYMPIASTADION" },
  { id: 3, date: "AUG 25", city: "PARIS, FR", venue: "STADE DE FRANCE" },
  { id: 4, date: "SEP 02", city: "NEW YORK, US", venue: "METLIFE STADIUM" },
  { id: 5, date: "SEP 09", city: "LOS ANGELES, US", venue: "SOFI STADIUM" },
];

export default function TourDates() {
  return (
    <section className="relative w-full min-h-screen bg-black flex flex-col items-center py-32 md:py-48 px-6 overflow-hidden">
      {/* Header */}
      <div className="relative z-10 w-full max-w-7xl mb-24 text-center md:text-left overflow-hidden">
        <motion.span
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-red-600 font-roboto-mono tracking-[0.4em] uppercase text-sm mb-6 block font-bold"
        >
          [ 03 // World Tour ]
        </motion.span>
        <motion.h2
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-oswald text-6xl md:text-[10rem] leading-[0.8] uppercase tracking-tighter text-white mix-blend-difference"
        >
          The <span className="text-transparent text-stroke-red stroke-2 hover:text-red-600 transition-colors duration-500">World</span><br/> Wired
        </motion.h2>
      </div>

      {/* Tour List */}
      <ul className="relative z-10 w-full max-w-7xl flex flex-col group/list">
        <li className="hidden md:grid grid-cols-12 gap-4 pb-8 border-b-2 border-zinc-800 text-zinc-500 font-roboto-mono text-sm tracking-[0.2em] uppercase mb-4">
          <div className="col-span-3">Date</div>
          <div className="col-span-7">City / Venue</div>
          <div className="col-span-2 text-right">Action</div>
        </li>

        {TOUR_DATES.map((tour, index) => (
          <motion.li
            key={tour.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ x: 20, backgroundColor: "rgba(220, 38, 38, 0.05)" }}
            className="group relative border-b border-zinc-900 transition-colors duration-300 hover:border-red-600 rounded-sm cursor-pointer"
          >
            <div className="relative z-10 flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 py-10 md:py-14 px-4 md:px-0">
              <div className="col-span-3 font-oswald text-5xl md:text-6xl text-red-600 group-hover:text-white transition-colors duration-500 mix-blend-difference">
                {tour.date}
              </div>

              <div className="col-span-7 flex flex-col justify-center">
                <span className="font-oswald text-4xl md:text-5xl text-zinc-300 uppercase tracking-tighter group-hover:text-white transition-colors duration-500">
                  {tour.city}
                </span>
                <span className="font-roboto-mono text-zinc-500 text-sm md:text-base tracking-[0.3em] uppercase mt-2 group-hover:text-zinc-300 transition-colors duration-500">
                  {tour.venue}
                </span>
              </div>

              <div className="col-span-2 mt-6 md:mt-0 flex md:justify-end pr-4">
                <button className="relative overflow-hidden px-8 py-4 border border-zinc-700 text-white font-roboto-mono text-sm tracking-[0.2em] uppercase transition-all duration-300 group-hover:border-red-600 group-hover:bg-red-600 w-full md:w-auto text-center group/btn">
                  <span className="relative z-10 transition-transform duration-300 block">Tickets</span>
                </button>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative z-10 mt-32"
      >
         <button className="text-zinc-400 font-roboto-mono text-sm tracking-[0.4em] uppercase hover:text-white transition-colors flex flex-col items-center gap-4 group">
            <span className="w-px h-12 bg-zinc-800 group-hover:bg-red-600 transition-colors duration-500" />
            View All Dates
         </button>
      </motion.div>
    </section>
  );
}
