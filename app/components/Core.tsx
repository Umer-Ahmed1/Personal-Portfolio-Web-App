"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import TrueFocus from "./Focus";

interface CompetencyCard {
  num: string;
  image: string;
  title: string;
  description: string;
}

const cards: CompetencyCard[] = [
  {
    num: "01",
    image: "/uxui.png",
    title: "UX/UI Design",
    description:
      "Crafting intuitive, high-conversion interfaces that put the user first.",
  },
  {
    num: "02",
    image: "/full-stack.png",
    title: "Full-Stack Development",
    description:
      "Building robust, scalable backends and pixel-perfect frontends.",
  },
  {
    num: "03",
    image: "/pm.png",
    title: "Project Management",
    description:
      "Agile workflows and structured timelines to ensure zero-gap delivery.",
  },
  {
    num: "04",
    image: "/sys.png",
    title: "Systems Architecture",
    description:
      "Designing the big picture logic to ensure long-term scalability.",
  },
];

export default function Competencies() {
  const [activeIdx, setActiveIdx] = useState(0);
  const maxIdx = cards.length - 1;

  const handlePrev = () => setActiveIdx((i) => Math.max(0, i - 1));
  const handleNext = () => setActiveIdx((i) => Math.min(maxIdx, i + 1));

  return (
    <section
      id="competencies"
      className="relative py-[80px] border-t border-[#222] bg-[#282828]"
    >
      {/* HEADER */}
      <div className="max-w-425 mx-auto px-6">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between mb-14">
          
          <h2 className="font-syne font-extrabold tracking-[-0.5px] text-white leading-tight">
            <TrueFocus
              sentence="Core Competencies"
              blurAmount={4.5}
              borderColor="#e63030"
              animationDuration={0.5}
              pauseBetweenAnimations={2}
            />
          </h2>

          <div className="max-w-[280px] md:text-right">
            <p className="text-[13px] text-white leading-relaxed">
              I Bridge The Gap Between
              <br />
              Stakeholders And Technology
            </p>
          </div>

        </div>
      </div>

      {/* CARDS */}
      <div className="max-w-425 mx-auto  px-6">
        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-4
          gap-6
        "
        >
          {cards.map((card, i) => (
            <div
              key={card.num}
              className={`relative flex flex-col p-8 bg-[#1c1c1c] border transition-all
              ${
                i === activeIdx
                  ? "border-[#e63030]"
                  : "border-[#2a2a2a]"
              }`}
            >
              {/* background map */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: "url('/about-map.png')",
                  backgroundSize: "250px",
                  backgroundPosition: "right 20px top 0px",
                  backgroundRepeat: "no-repeat",
                  opacity: 0.9,
                  filter: "grayscale(1)",
                }}
              />

              <div className="relative z-10 flex flex-col h-full">
                {/* icon */}
                <div className="w-10 h-10 relative mb-auto">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="mt-8">
                  <span className="font-syne text-[11px] text-[#555] tracking-[2px] block mb-3">
                    {card.num}
                  </span>

                  <h3 className="font-syne font-bold text-[18px] text-white mb-3">
                    {card.title}
                  </h3>

                  <p className="text-[13px] text-[#888] leading-[1.7]">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      
      </div>

      {/* CONTROLS */}
      <div className="max-w-425 mx-auto px-6 mt-10 flex items-center gap-3">
        <button
          onClick={handlePrev}
          disabled={activeIdx === 0}
          className="w-11 h-11 rounded-full border border-white/30 flex items-center justify-center disabled:opacity-30"
        >
          <img src="/left.png" width={18} height={14} />
        </button>

        <button
          onClick={handleNext}
          disabled={activeIdx === maxIdx}
          className="w-11 h-11 rounded-full border border-white/30 flex items-center justify-center disabled:opacity-30"
        >
          <img src="/right.png" width={18} height={14} />
        </button>

        <div className="ml-auto">
          <Link
            href="#contact"
            className="bg-[#e63030] text-white text-[13px] font-semibold px-[26px] py-3 border-2 border-[#e63030] hover:bg-[#c72020] transition"
          >
            Hire Me
          </Link>
        </div>
      </div>
    </section>
  );
}