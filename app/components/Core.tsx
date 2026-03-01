"use client";

import { useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

const competencies = [
  {
    id: "01",
    title: "UX/UI Design",
    description:
      "Crafting intuitive, high-conversion interfaces that put the user first.",
  },
  {
    id: "02",
    title: "Full-Stack Development",
    description:
      "Building robust, scalable backends and pixel-perfect frontends.",
  },
  {
    id: "03",
    title: "Project Management",
    description:
      "Agile workflows and structured timelines to ensure zero-gap delivery.",
  },
  {
    id: "04",
    title: "Systems Architecture",
    description:
      "Designing the 'big picture' technical strategy to ensure long-term scalability.",
  },
  {
    id: "05",
    title: "Quality Assurance",
    description:
      "Ensuring code quality, security, and user experience through rigorous testing.",
  },
  {
    id: "06",
    title: "Collaboration and Communication",
    description:
      "Building strong relationships with clients, team members, and stakeholders.",
  },
  {
    id: "07",
    title: "Continuous Learning and Innovation",
    description:
      "Stay up-to-date with the latest industry trends and technologies.",
  },
];

export default function CoreCompetencies() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;

    const scrollAmount = sliderRef.current.offsetWidth * 0.8;

    sliderRef.current.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative bg-[#111111] text-[#EEEEEE] py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* ===== Header ===== */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-14">
          <h2 className="text-3xl md:text-5xl font-light">
            Core Competencies
          </h2>

          <p className="mt-4 md:mt-0 text-gray-400 max-w-xs text-right">
            I Bridge The Gap Between <br />
            Stakeholders And Technology
          </p>
        </div>

        {/* ===== Slider Wrapper ===== */}
        <div className="relative">

          {/* Slider */}
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar"
          >
            {competencies.map((item) => (
              <div
                key={item.id}
                className="min-w-[85%] sm:min-w-[60%] md:min-w-[32%]
                           bg-[#181818] border border-[#2A2A2A]
                           p-8 relative"
              >
                {/* Map Background */}
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                  <Image
                    src="/about-map.png"
                    alt="Map"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="relative z-10">
                  <span className="text-gray-500 text-lg">
                    {item.id}
                  </span>

                  <h3 className="mt-4 text-2xl md:text-3xl font-light">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ===== Arrows ===== */}
          <div className="flex items-center gap-4 mt-10">

            <button
              onClick={() => scroll("left")}
              className="w-12 h-12 border border-[#333] flex items-center justify-center
                         hover:bg-[#222] transition"
            >
              <FaArrowLeft />
            </button>

            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 bg-[#B42A2A] flex items-center justify-center
                         hover:bg-[#9e2424] transition"
            >
              <FaArrowRight />
            </button>

          </div>

        </div>

        {/* ===== Hire Me Button ===== */}
        <div className="flex justify-end mt-16">
          <Link
            href="/contact"
            className="px-8 py-4 bg-[#B42A2A] hover:bg-[#9e2424] transition"
          >
            Hire Me
          </Link>
        </div>

      </div>
    </section>
  );
}