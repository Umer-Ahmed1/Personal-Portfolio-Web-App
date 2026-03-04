"use client";

import Link from "next/link";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative bg-[#222222] text-[#EEEEEE] overflow-hidden w-full min-h-screen"
    >
      {/* ===== MAP BACKGROUND (Top Right) ===== */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none ">
        <Image
          src="/about-map.png"
          alt="World Map"
          fill
          className="object-contain object-top-right"
          priority
        />
      </div>

      {/* ===== GRADIENT ELLIPSE (Bottom Right) ===== */}
      {/* <div className="absolute -bottom-75 -right-50 w-225 h-225 rounded-full pointer-events-none
                      bg-[radial-gradient(ellipse_at_center,#B42A2A_30%,#060606_90%)] 
                      opacity-10 blur-[100px]" /> */}

      {/* ===== CONTENT ===== */}
      <div className="relative z-10 max-w-425 mx-auto px-6 3xl:px-0 py-20 md:py-32">

        <span className="inline-block border border-[#333] px-4 py-1 text-sm text-gray-400 mb-8">
          About Me
        </span>

        <h2 className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight max-w-4xl">
          A Strategic Digital Architect
        </h2>

        <p className="mt-10 text-lg md:text-xl leading-relaxed max-w-3xl">
          I don't just build websites; I build solutions. With a unique
          background spanning Design, Development, and Project Management,
          I provide a holistic approach to every product. My goal is to
          eliminate the friction between a business idea and its technical
          reality through clean code and fluent, error-free communication.
        </p>

        <Link
          href="/about"
          className="inline-block mt-12 px-8 py-4 bg-[#B42A2A] hover:bg-[#9f2424] transition text-white"
        >
          Discover My Story
        </Link>
      </div>
    </section>
  );
}