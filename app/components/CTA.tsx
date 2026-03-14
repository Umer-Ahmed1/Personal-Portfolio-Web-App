'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import TrueFocus from './Focus';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemFromLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
} satisfies Variants;

export default function CallToAction() {
  return (
    <section
      className="
        relative min-h-[70vh] md:min-h-[80vh] w-full
        flex items-center justify-start
        bg-gray-950 text-white overflow-hidden
      "
    >
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/contact-bg.png')",
          }}
        />
      </div>


      <motion.div
        className="relative z-10 w-full max-w-425 mx-auto px-6 py-6 3xl:px-0 "
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className="max-w-4xl space-y-6 md:space-y-8 text-left">
          {/* Heading */}
          <motion.h1
            variants={itemFromLeft}
            className="
              text-4xl sm:text-5xl md:text-6xl lg:text-7xl
              font-extrabold tracking-tight leading-[1.1]
            "
          >
            Ready to Transform Your
            <br className="hidden sm:block" />
            
            Vision into Reality?
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemFromLeft}
            className="
              text-lg sm:text-xl md:text-2xl font-medium
              text-white/90 leading-relaxed max-w-2xl
            "
          >
            Let&apos;s combine high-end design, scalable development, and precision
            <br className="hidden md:block" />
            management to build your next digital success story.
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={itemFromLeft}
            className="pt-4 md:pt-10 flex flex-col sm:flex-row gap-4 md:gap-6"
          >
            <Link
              href="/appointment"
              className="
                inline-flex items-center justify-center
                px-8 md:px-10 py-4 md:py-5 text-base md:text-lg font-semibold
                bg-[#b42a2a] hover:bg-[#9a2323]
                text-white transition-all duration-300
                w-full sm:w-auto sm:min-w-[220px]
              "
            >
              Start A Project
            </Link>

            <Link
              href="/contact"
              className="
                inline-flex items-center justify-center
                px-8 md:px-10 py-4 md:py-5 text-base md:text-lg font-semibold
                border-2 border-white/40 hover:border-white/70
                text-white hover:bg-white/10
                transition-all duration-300
                w-full sm:w-auto sm:min-w-[220px]
              "
            >
              Book A Strategy Call
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}