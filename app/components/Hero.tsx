"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen bg-[#222222] text-[#EEEEEE] overflow-hidden"
    >
      <div className="grid md:grid-cols-2 min-h-screen">

        {/* ================= LEFT CONTENT ================= */}
        <div className="flex flex-col justify-center px-6 md:px-16 lg:px-24 py-20 md:py-0 order-2 md:order-1">
          
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

          <div className="flex flex-wrap gap-6 mt-10">
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
          </div>
        </div>

        {/* ================= RIGHT IMAGE SIDE ================= */}
        <div className="relative w-full h-[70vh] md:h-auto order-1 md:order-2">

          {/* Background Image */}
          <Image
            src="/dp-bg.png"
            alt="Background Visual"
            fill
            priority
            className="object-cover object-center"
          />

          {/* Foreground Image */}
          <Image
            src="/dp.png"
            alt="Umer Ahmed"
            fill
            priority
            className="object-contain object-bottom z-10"
          />

        </div>
      </div>
    </section>
  );
}