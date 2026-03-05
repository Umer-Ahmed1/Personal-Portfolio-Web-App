"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen bg-[#222222] text-[#EEEEEE] overflow-hidden pt-24 2xl:pt-0"
    >
      {/* Background Image */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
        <Image
          src="/dp-bg.png"
          alt="Background"
          fill
          priority
          className="object-contain object-top-right opacity-40"
        />
      </div>

      {/* ================= SOCIAL ICONS (DESKTOP) ================= */}
      <div className="hidden md:flex flex-col items-center gap-6 fixed right-6 top-1/2 -translate-y-1/2 z-40">
        <Link
          href="#"
          className="text-gray-300 hover:text-[#B42A2A] transition"
        >
          <FaFacebookF size={16} />
        </Link>

        <Link
          href="#"
          className="text-gray-300 hover:text-[#B42A2A] transition"
        >
          <FaInstagram size={18} />
        </Link>

        <Link
          href="#"
          className="text-gray-300 hover:text-[#B42A2A] transition"
        >
          <FaLinkedinIn size={16} />
        </Link>
      </div>

      <div className="grid md:grid-cols-2 min-h-screen">

        {/* ================= LEFT CONTENT ================= */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center px-6 md:px-16 lg:px-24 py-20 md:py-0 order-2 md:order-1"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl leading-tight font-light">
            I bridge the gap <br />
            between Vision <br />
            and Execution.
          </h1>

          <p className="mt-8 text-lg text-gray-300 max-w-xl">
            I’m Umer Ahmed—a Designer, Developer, and Project Manager.
            I build scalable digital systems where seamless user experience
            meets technical precision and crystal-clear communication.
          </p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-wrap gap-6 mt-10"
          >
            <Link
              href="/portfolio"
              className="px-8 py-4 bg-[#B42A2A] text-[#eeeeee] font-medium transition duration-300 hover:opacity-80"
            >
              Explore my portfolio
            </Link>

            <Link
              href="/contact"
              className="px-8 py-4 border border-[#EEEEEE] font-medium transition duration-300 hover:bg-[#EEEEEE] hover:text-[#222222]"
            >
              Hire Me
            </Link>
          </motion.div>
        </motion.div>

        {/* ================= RIGHT IMAGE SIDE ================= */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          className="relative w-full h-[70vh] md:h-auto order-1 md:order-2"
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