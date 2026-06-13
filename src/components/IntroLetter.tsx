"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, ChevronDown } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number], // Custom cubic bezier for a luxurious entrance
      staggerChildren: 0.25,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: "easeOut" as const,
    },
  },
};

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

export default function IntroLetter() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden select-none">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-2xl w-full bg-[#181615] border border-[#2E2824] rounded-2xl shadow-2xl shadow-black/60 p-8 md:p-12 relative"
      >
        {/* Envelope Stamp/Wax Seal Aesthetic */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#181615] border border-[#2E2824] rounded-full p-3 shadow-md">
          <motion.div
            variants={pulseVariants}
            animate="animate"
            className="bg-[#C97A7A]/10 p-3 rounded-full text-[#C97A7A]"
          >
            <Heart className="w-6 h-6 fill-[#C97A7A]" />
          </motion.div>
        </div>

        <div className="space-y-8 mt-4">
          <motion.div variants={itemVariants} className="text-center">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C97A7A] font-semibold">
              A Sincere Message
            </span>
            <h1 className="text-3xl md:text-4xl font-serif text-[#F4EAE6] mt-2 font-medium">
              Dear You,
            </h1>
          </motion.div>

          <div className="space-y-6 text-[#D5C9C0] leading-relaxed font-sans text-sm md:text-base">
            <motion.p variants={itemVariants}>
              I wanted to write this because sometimes words said in fights don't convey the depth of how I truly feel. I am so incredibly sorry for letting things get off track and for the misunderstanding.
            </motion.p>

            <motion.p variants={itemVariants}>
              You mean the world to me, and seeing a distance between us weighs heavily on my heart. I value what we share more than anything, and I want to make sure I am doing everything I can to set things right.
            </motion.p>

            <motion.p variants={itemVariants}>
              I put together this small scrapbook of our highlights to remind us of the laughs, the silly inside jokes, and the memories we have built together. I hope it brings a soft smile to your face. Im really sorry bacha
            </motion.p>
          </div>

          <motion.div variants={itemVariants} className="pt-6 border-t border-[#2E2824] flex flex-col items-center">
            <p className="font-serif italic text-[#F4EAE6] font-medium">With all my love,</p>
            <p className="text-[#C97A7A] mt-1 font-semibold tracking-wide">Me 👉👈</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Elegant Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-[#C97A7A]/60 text-xs tracking-wider uppercase font-semibold whitespace-nowrap"
      >
        <span className="mb-2">Scroll to Open Scrapbook</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
