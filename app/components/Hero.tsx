"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import RotatingText from './Rotating';
import Threads from './Threads';

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen bg-[#222222] text-[#EEEEEE] overflow-hidden"
    >
      {/* ── Threads Background: rotated 45°, scaled up to bleed past all edges ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.5 }}
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          transform: 'rotate(45deg) scale(3)',
          transformOrigin: 'center center',
        }}
      >
        <Threads
          color={[0.706, 0.165, 0.165]}
          amplitude={1}
          distance={0}
          enableMouseInteraction={false}
        />
      </motion.div>

      {/* ── Main Grid ── */}
      {/*
        Mobile  (<768px):  single column, content on top / image below
        Desktop (≥768px):  two equal columns, both pinned to full viewport height
      */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 md:min-h-screen">

        {/* ── LEFT: Text Content ── */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="
            flex flex-col justify-center
            px-6 sm:px-10 md:px-12 lg:px-16 xl:px-24
            pt-24 pb-10
            md:pt-0 md:pb-0 md:h-screen
            order-1
          "
        >
          {/* Heading — shrinks at each breakpoint */}
          <h1 className="
            font-light leading-tight
            text-3xl
            sm:text-4xl
            md:text-[2.4rem]
            lg:text-5xl
            xl:text-6xl
            2xl:text-7xl
          ">
            I bridge the gap <br />
            between Vision <br />
            and Execution.
          </h1>

          {/* Sub-copy */}
          <p className="
            mt-6 md:mt-8 text-gray-300 max-w-xl
            text-sm
            sm:text-base
            md:text-[0.95rem]
            lg:text-lg
            xl:text-xl
          ">
            {/* Name + animated role badge */}
            <span className="flex items-center gap-2 flex-wrap">
              <span>I'm Umer Ahmed</span>
              <RotatingText
                texts={['A Designer', 'A Developer', 'A Project Manager!']}
                mainClassName="px-2 sm:px-3 bg-[#B42A2A] text-white overflow-hidden py-0.5 sm:py-1 md:py-1.5 justify-center rounded-2xl"
                staggerFrom="last"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 700 }}
                rotationInterval={3000}
              />
            </span>

            {/* Body sentence */}
            <span className="block mt-2">
              I build scalable digital systems where seamless user experience
              meets technical precision and crystal-clear communication.
            </span>
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-wrap gap-4 md:gap-5 mt-8 md:mt-10"
          >
            <Link
              href="/portfolio"
              className="
                bg-[#B42A2A] text-[#eeeeee] font-medium
                transition duration-300 hover:opacity-80
                px-5 py-3
                sm:px-6 sm:py-3.5
                md:px-7 md:py-3.5
                lg:px-8 lg:py-4
                text-sm sm:text-sm md:text-sm lg:text-base
              "
            >
              Explore my portfolio
            </Link>

            <Link
              href="/contact"
              className="
                border border-[#EEEEEE] font-medium
                transition duration-300 hover:bg-[#EEEEEE] hover:text-[#222222]
                px-5 py-3
                sm:px-6 sm:py-3.5
                md:px-7 md:py-3.5
                lg:px-8 lg:py-4
                text-sm sm:text-sm md:text-sm lg:text-base
              "
            >
              Hire Me
            </Link>
          </motion.div>
        </motion.div>

        {/* ── RIGHT: Portrait Image ── */}
        {/*
          Mobile:  fixed aspect-ratio height (55 vw feels natural for a portrait)
          Desktop: matches the left column exactly via md:h-screen
        */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          className="
            relative w-full
            h-[55vw] max-h-[70vh]
            md:h-screen md:max-h-none
            order-2
          "
        >
          <Image
            src="/dp.png"
            alt="Umer Ahmed"
            fill
            priority
            className="object-contain object-bottom z-10"
          />
        </motion.div>

      </div>
    </section>
  );
}