"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import RotatingText from './Rotating';


export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen bg-[#222222] text-[#EEEEEE] overflow-hidden"
    >
      {/* ── Background Image ── */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <Image
          src="/dp-bg.png"
          alt="Background"
          fill
          priority
          className="object-cover opacity-40"
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen lg:grid lg:grid-cols-[60%_40%] lg:min-h-screen">

        {/* ── LEFT: Text Content ── */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="
            flex flex-col justify-center
            px-6 sm:px-10 lg:px-12 xl:px-24
            pt-24 pb-10
            lg:justify-start lg:pt-32 lg:pb-0 lg:h-screen
            order-1
          "
        >
          {/* Heading */}
          <h1 className="
            font-light leading-tight
            text-3xl
            sm:text-4xl
            md:text-5xl
            lg:text-[1.9rem]
            xl:text-6xl
            2xl:text-7xl
          ">
            I bridge the gap <br />
            between Vision <br />
            and Execution.
          </h1>

          {/* Sub-copy */}
          <p className="
            mt-6 text-gray-300 max-w-xl
            text-sm
            sm:text-base
            md:text-lg
            lg:text-[0.95rem]
            xl:text-xl
          ">
            <span className="flex items-center gap-2 flex-wrap">
              <span>I'm Umer Ahmed</span>
              <RotatingText
                texts={['A Designer', 'A Developer', 'A Project Manager!']}
                mainClassName="px-2 sm:px-3 bg-[#B42A2A] text-white overflow-hidden py-0.5 sm:py-1 lg:py-1.5 justify-center rounded-2xl"
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
            className="flex flex-wrap gap-4 mt-8"
          >
            <Link
              href="/explore"
              className="
                bg-[#B42A2A] text-[#eeeeee] font-medium
                transition duration-300 hover:opacity-80
                px-5 py-3
                sm:px-6 sm:py-3.5
                lg:px-7 lg:py-3.5
                xl:px-8 xl:py-4
                text-sm lg:text-sm xl:text-base
              "
            >
              Explore my portfolio
            </Link>

            <Link
              href="/appointment"
              className="
                border border-[#EEEEEE] font-medium
                transition duration-300 hover:bg-[#EEEEEE] hover:text-[#222222]
                px-5 py-3
                sm:px-6 sm:py-3.5
                lg:px-7 lg:py-3.5
                xl:px-8 xl:py-4
                text-sm lg:text-sm xl:text-base
              "
            >
              Hire Me
            </Link>
          </motion.div>
        </motion.div>

        {/* ── RIGHT: Portrait Image ── */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          className="
            relative w-full
            flex-1
            lg:flex-none lg:h-screen lg:max-h-none
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