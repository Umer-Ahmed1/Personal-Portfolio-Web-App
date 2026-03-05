"use client";

import Link from "next/link";
import { useReveal } from "@/app/hooks/useReveal";

interface Testimonial {
  text: string;
  name: string;
  role: string;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    text: '"Never felt like having a contractor. Umer kept communication consistent and confident at every stage of our project. He felt like a true team member."',
    name: "Garren Chen",
    role: "CEO of NewBorn Solutions",
    initials: "GC",
  },
  {
    text: '"Umer is a rare find: he managed our online product roadmap while simultaneously designing a world-class UI, delivering everything ahead of schedule."',
    name: "James Miller",
    role: "CTO at Blue Water",
    initials: "JM",
  },
  {
    text: '"Technical precision. His ability to translate complex business requirements into clean, scalable code is unmatched. Umer makes the most difficult technical hurdles look easy."',
    name: "Qarim T.",
    role: "Product Lead to Stellar",
    initials: "QT",
  },
  {
    text: '"Technical precision. His ability to translate complex business requirements into clean, scalable code is unmatched. Umer makes the most difficult technical hurdles look easy."',
    name: "Qarim T.",
    role: "Product Lead to Stellar",
    initials: "QT",
  },
  {
    text: '"Technical precision. His ability to translate complex business requirements into clean, scalable code is unmatched. Umer makes the most difficult technical hurdles look easy."',
    name: "Qarim T.",
    role: "Product Lead to Stellar",
    initials: "QT",
  },
];

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="relative bg-[#141414] border border-[#222] p-9 px-8 hover:bg-[#1a1a1a] transition-colors duration-200">
      {/* Source row */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className="font-syne font-extrabold text-[16px]"
          style={{
            background: "linear-gradient(135deg, #4285F4, #34A853, #FBBC05, #EA4335)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Google
        </span>
        <div className="flex gap-[2px] text-[#FBBC05] text-[12px] tracking-[1px]">
          {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
        </div>
      </div>

      <p className="text-[13px] text-[#888] leading-[1.8] mb-6">{t.text}</p>

      <div className="flex items-center gap-3">
        <div
          className="w-[38px] h-[38px] rounded-full flex items-center justify-center font-syne font-bold text-[13px] text-[#888] flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #333, #444)" }}
        >
          {t.initials}
        </div>
        <div>
          <span className="text-[13px] font-semibold block mb-0.5">{t.name}</span>
          <span className="text-[11px] text-[#555]">{t.role}</span>
        </div>
      </div>

      {/* Decorative quote mark */}
      <span className="absolute bottom-6 right-7 font-syne text-[64px] text-[#1a1a1a] leading-none pointer-events-none select-none">
        &quot;
      </span>
    </div>
  );
}

export default function Testimonials() {
  const { ref, isVisible } = useReveal();

  return (
    <section
      id="testimonials"
      ref={ref}
      className={`px-[60px] py-[100px] bg-[#282828] border-t border-[#222] reveal ${isVisible ? "visible" : ""}`}
    >
      {/* Header */}
      <div className="mb-[52px]">
        <span className="text-[11px] font-semibold tracking-[3px] uppercase text-[#888] block mb-5">
          Social Proof
        </span>
        <h2 className="font-syne font-extrabold tracking-[-0.5px] text-[clamp(32px,4vw,52px)]">
          Client Testimonial
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-[2px]">
        {testimonials.map((t) => (
          <TestimonialCard key={t.name} t={t} />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mt-10">
        <button
          aria-label="Previous"
          className="w-11 h-11 border border-[#222] flex items-center justify-center text-[#888] text-[16px] hover:border-[#e63030] hover:text-[#e63030] hover:bg-red-500/5 transition-all duration-200"
        >
          ←
        </button>
        <button
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
            Request A Free Estimate
          </Link>
        </div>
      </div>
    </section>
  );
}