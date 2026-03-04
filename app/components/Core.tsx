"use client";

import Link from "next/link";
import { useState } from "react";
import { useReveal } from "@/app/hooks/useReveal";

interface CompetencyCard {
  num: string;
  icon: string;
  title: string;
  description: string;
}

const cards: CompetencyCard[] = [
  {
    num: "01",
    icon: "🎨",
    title: "UX/UI Design",
    description:
      "Creating intuitive, high-conversion interfaces that put the user first and drive measurable outcomes.",
  },
  {
    num: "02",
    icon: "⚙️",
    title: "Full-Stack Development",
    description:
      "Building robust, scalable backends and pixel-perfect frontends that perform at every layer.",
  },
  {
    num: "03",
    icon: "📋",
    title: "Project Management",
    description:
      "Agile workflows and structured timelines to ensure zero-gap delivery, every single time.",
  },
  {
    num: "04",
    icon: "🏗️",
    title: "Systems Architecture",
    description:
      "Designing the foundations that ensure long-term scale, performance, and technical clarity.",
  },
];

export default function Competencies() {
  const { ref, isVisible } = useReveal();
  const [activeIdx, setActiveIdx] = useState(0);

  const handlePrev = () => setActiveIdx((i) => (i - 1 + cards.length) % cards.length);
  const handleNext = () => setActiveIdx((i) => (i + 1) % cards.length);

  return (
    <section
      id="competencies"
      ref={ref}
      className={`px-[60px] py-[80px] border-t border-[#222] overflow-hidden bg-[#282828] reveal ${isVisible ? "visible" : ""}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-12">
        <h2 className="font-syne font-extrabold tracking-[-0.5px] text-[clamp(28px,3.5vw,44px)]">
          Core Competencies
        </h2>
        <div className="max-w-[280px] text-right">
          <p className="text-[13px] text-white ">
            I Bridge The Gap Between Stakeholders And Technology 
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-4 gap-[2px]">
        {cards.map((card, i) => (
          <div
            key={card.num}
            className="relative overflow-hidden p-9 px-8 group transition-all duration-200 cursor-default"
            style={{
              background: i === activeIdx ? "#1a1a1a" : "#141414",
              border: `1px solid ${i === activeIdx ? "#e63030" : "#222"}`,
            }}
          >
            {/* Bottom red line */}
            <div
              className="absolute bottom-0 left-0 h-[2px] bg-[#e63030] transition-transform duration-300 origin-left"
              style={{ width: "100%", transform: i === activeIdx ? "scaleX(1)" : "scaleX(0)" }}
            />

            <div className="w-11 h-11 flex items-center justify-center mb-5 text-[18px] border border-red-500/20 bg-red-500/10">
              {card.icon}
            </div>
            <span className="font-syne text-[11px] text-[#555] tracking-[2px] mb-3 block">
              {card.num}
            </span>
            <h3 className="font-syne font-bold text-[17px] mb-3">{card.title}</h3>
            <p className="text-[13px] text-[#888] leading-[1.7]">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mt-9">
        <button
          onClick={handlePrev}
          aria-label="Previous"
          className="w-11 h-11 border border-[#222] flex items-center justify-center text-[#888] text-[16px] hover:border-[#e63030] hover:text-[#e63030] hover:bg-red-500/5 transition-all duration-200"
        >
          ←
        </button>
        <button
          onClick={handleNext}
          aria-label="Next"
          className="w-11 h-11 border border-[#222] flex items-center justify-center text-[#888] text-[16px] hover:border-[#e63030] hover:text-[#e63030] hover:bg-red-500/5 transition-all duration-200"
        >
          →
        </button>
        <div className="ml-auto">
          <Link
            href="#contact"
            className="bg-[#e63030] text-white text-[13px] font-semibold px-[26px] py-3 border-2 border-[#e63030] tracking-[0.3px] hover:bg-[#c72020] hover:border-[#c72020] hover:-translate-y-[1px] transition-all duration-200 inline-block"
          >
            Hire Me
          </Link>
        </div>
      </div>
    </section>
  );
}