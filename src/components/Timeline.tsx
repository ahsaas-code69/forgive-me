"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Calendar, Heart, Star, ShieldCheck, Gift } from "lucide-react";

interface TimelineItem {
  id: number;
  date: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  imagePath?: string;
  side: "left" | "right";
}

const timelineData: TimelineItem[] = [
  {
    id: 1,
    date: "Where it all started",
    title: "The First Coffee Chat ☕",
    description: "Remember how we lost track of time talking and reading that book you love.",
    icon: <Calendar className="w-5 h-5 text-[#C97A7A]" />,
    imagePath: "/memory_coffee.png",
    side: "left",
  },
  {
    id: 2,
    date: "A beautiful milestone",
    title: "Our First Kiss 💋",
    description: "A quiet, nervous, yet absolutely perfect moment. It was the exact second I knew you were truly special to me.",
    icon: <Heart className="w-5 h-5 text-[#E09F9F] fill-[#E09F9F]/20" />,
    side: "right",
  },
  {
    id: 3,
    date: "February 14th",
    title: "Our First Valentine's Day 💝",
    description: "Surrounding ourselves with boht sara khana and alot of kisses and muah muah and some serious touching.",
    icon: <Gift className="w-5 h-5 text-[#E09F9F]" />,
    imagePath: "/memory_valentine.jpg",
    side: "left",
  },
  {
    id: 4,
    date: "A promise to keep",
    title: "Our Pinky-Promise Pact 🤝",
    description: "No matter how silly the argument or how hard the day, we promised to always talk it through, listen, and end it with a laugh. Let's make that promise real again.",
    icon: <ShieldCheck className="w-5 h-5 text-[#C97A7A]" />,
    side: "right",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
      duration: 0.8,
    },
  },
};

export default function Timeline() {
  return (
    <section className="py-24 px-4 max-w-5xl mx-auto relative overflow-hidden select-none">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-serif text-[#F4EAE6] font-medium">Our Digital Scrapbook</h2>
        <p className="text-xs uppercase tracking-widest text-[#C97A7A] mt-2 font-semibold">
          Little moments that make us 'Us'
        </p>
      </div>

      <div className="relative">
        {/* Center Timeline Line */}
        <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-4 bottom-4 w-[2px] bg-[#2E2824]" />

        <div className="space-y-12">
          {timelineData.map((item) => {
            const isLeft = item.side === "left";
            return (
              <div
                key={item.id}
                className={`flex flex-col md:flex-row items-stretch w-full ${isLeft ? "md:flex-row-reverse" : ""
                  }`}
              >
                {/* Spacer / Left side empty block */}
                <div className="hidden md:block w-1/2" />

                {/* Timeline Node Icon */}
                <div className="absolute left-4 md:left-1/2 transform -translate-x-[15px] md:-translate-x-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-[#0D0C0B] border-2 border-[#2E2824] shadow-sm">
                  {item.icon}
                </div>

                {/* Content Card container */}
                <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-8">
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    whileHover={{
                      y: -5,
                      rotateY: isLeft ? -2 : 2,
                      rotateX: 2,
                      boxShadow: "0 15px 30px rgba(0, 0, 0, 0.45)",
                    }}
                    className="bg-[#181615] border border-[#2E2824] rounded-xl p-6 shadow-xl shadow-black/30 transition-shadow duration-300 relative overflow-hidden preserve-3d cursor-pointer"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] uppercase tracking-wider text-[#E09F9F] font-semibold bg-[#2A1F1F] px-2 py-1 rounded">
                        {item.date}
                      </span>
                    </div>

                    <h3 className="text-lg font-serif font-medium text-[#F4EAE6] mb-2">
                      {item.title}
                    </h3>

                    <p className="text-[#C0B4AC] text-xs md:text-sm leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {/* Image if provided */}
                    {item.imagePath && (
                      <div className="relative w-full h-44 rounded-lg overflow-hidden border border-[#2E2824]/80 mt-2 bg-[#0D0C0B]">
                        <Image
                          src={item.imagePath}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-700 hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 400px"
                          priority
                        />
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
