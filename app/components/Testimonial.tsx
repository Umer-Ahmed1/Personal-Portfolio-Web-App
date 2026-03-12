"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import TrueFocus from "./Focus";

interface Testimonial {
  id: number;
  rating: number;
  review: string;
  name: string;
  position: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    rating: 5,
    review:
      "Working with Umer felt like having a true partner, not just a contractor. His fluent, error-free communication kept our team aligned and confident at every stage.",
    name: "Sarah T",
    position: "Product Lead at Orbit",
    avatar: "/avatar1.png",
  },
  {
    id: 2,
    rating: 5,
    review:
      "Umer is a rare find; he managed our entire product roadmap while simultaneously designing a world-class UI, delivering everything ahead of schedule.",
    name: "Sarah Chen",
    position: "CEO of NexaTech Solutions",
    avatar: "/sarah.png",
  },
  {
    id: 3,
    rating: 5,
    review:
      "His ability to translate complex business requirements into clean, scalable code is unmatched — Umer makes the most difficult technical hurdles look easy.",
    name: "James Miller",
    position: "CTO at Blue Horizon",
    avatar: "/avatar3.png",
  },
  {
    id: 4,
    rating: 4,
    review:
      "The systems architecture Umer designed for our platform has scaled flawlessly. He thinks ten steps ahead and documents everything impeccably.",
    name: "Priya Nair",
    position: "VP Engineering at Stackly",
    avatar: "/avatar4.png",
  },
  {
    id: 5,
    rating: 5,
    review:
      "From wireframes to deployment, Umer owned the entire process. The final product exceeded every benchmark we set — truly exceptional work.",
    name: "Carlos Rivera",
    position: "Founder at LaunchPad Studio",
    avatar: "/avatar5.png",
  },
  {
    id: 6,
    rating: 4,
    review:
      "Our redesign under Umer's direction saw a 40% increase in user retention within the first month. His UX instincts are sharp and data-driven.",
    name: "Mei Lin",
    position: "Head of Growth at Funnl",
    avatar: "/avatar6.png",
  },
  {
    id: 7,
    rating: 5,
    review:
      "Umer brought clarity to a chaotic project. His project management skills, combined with deep technical expertise, turned our struggling product into a success story.",
    name: "Ahmed Al-Rashid",
    position: "COO at BridgeWorks",
    avatar: "/avatar7.png",
  },
];

const VISIBLE = 4;

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill={i < count ? "#FFD700" : "#333"}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 1l2.39 5.26L18 7.27l-4 3.89.94 5.49L10 14.77l-4.94 1.88L6 11.16 2 7.27l5.61-.51z" />
        </svg>
      ))}
    </div>
  );
}

// Animation variants — content fades + slides up, cards stay fixed
const contentVariants: import("framer-motion").Variants = {
  enter: (dir: number) => ({
    opacity: 0,
    y: dir > 0 ? 18 : -18,
  }),
  center: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
  exit: (dir: number) => ({
    opacity: 0,
    y: dir > 0 ? -18 : 18,
    transition: { duration: 0.28, ease: [0.55, 0, 1, 0.45] as [number, number, number, number] },
  }),
};

export default function Testimonials() {
  const [startIdx, setStartIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const maxStart = testimonials.length - VISIBLE;

  const handlePrev = () => {
    if (startIdx === 0) return;
    setDirection(-1);
    setStartIdx((i) => Math.max(0, i - 1));
  };

  const handleNext = () => {
    if (startIdx >= maxStart) return;
    setDirection(1);
    setStartIdx((i) => Math.min(maxStart, i + 1));
  };

  const visible = testimonials.slice(startIdx, startIdx + VISIBLE);


  return (
    <section
      id="testimonials"
      className="relative py-[80px] border-t border-[#222] bg-[#282828] overflow-hidden"
    >
      {/* HEADER */}
      <div className="max-w-425 mx-auto px-6">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between mb-14">
          <h2 className="font-syne font-extrabold tracking-[-0.5px] text-white leading-tight">
            <TrueFocus
              sentence="Client Testimonials"
              blurAmount={4.5}
              borderColor="#e63030"
              animationDuration={0.5}
              pauseBetweenAnimations={2}
            />
          </h2>
          <div className="max-w-[280px] md:text-right">
            <p className="text-[13px] text-white leading-relaxed">
              Trusted by founders, CTOs
              <br />
              and product leaders worldwide
            </p>
          </div>
        </div>
      </div>

      {/* CARDS GRID — fixed layout, only content animates */}
      <div className="max-w-425 mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: VISIBLE }).map((_, slotIdx) => {
            const item = visible[slotIdx];

            return (
              /*
                Outer card shell — never moves, never re-renders.
                Only the AnimatePresence content inside animates.
              */
              <div
                key={slotIdx}
                className="relative flex flex-col justify-between p-6 bg-[#1c1c1c] border border-[#2a2a2a] min-h-[280px] overflow-hidden"
              >
                <AnimatePresence mode="wait" custom={direction}>
                  {item && (
                    <motion.div
                      key={item.id}
                      custom={direction}
                      variants={contentVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="flex flex-col h-full gap-4"
                    >
                      {/* TOP: Stars left, Google logo right */}
                      <div className="flex items-center justify-between">
                        <Stars count={item.rating} />
                        {/* Google wordmark built from spans — no external image needed */}
                        <div className="w-20 h-6 relative">
                          <Image
                            src="/google.png"
                            alt="Google"
                            width={80}
                            height={30}
                          />
                        </div>
                      </div>

                      {/* REVIEW TEXT */}
                      <p className="text-[16px] text-white leading-[1.75] flex-1">
                        {item.review}
                      </p>

                      {/* BOTTOM: Avatar + name left, quote icon right */}
                      <div className="flex items-end justify-between mt-auto">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full overflow-hidden relative bg-[#333] shrink-0">
                            <Image
                              src={item.avatar}
                              alt={item.name}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                // Fallback: show initials if image missing
                                const t = e.currentTarget as HTMLImageElement;
                                t.style.display = "none";
                              }}
                            />
                          </div>
                          <div>
                            <p className="text-white text-[13px] font-semibold leading-tight">
                              {item.name}
                            </p>
                            <p className="text-[#555] text-[11px] leading-tight mt-0.5">
                              {item.position}
                            </p>
                          </div>
                        </div>

                        {/* Quote image */}
                        <div className="w-18 h-18 relative opacity-60 shrink-0">
                          <Image
                            src="/quote.png"
                            alt="quote"
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* CONTROLS */}
      <div className="max-w-425 mx-auto px-6 mt-10 flex items-center gap-3">
        <button
          onClick={handlePrev}
          disabled={startIdx === 0}
          className="w-11 h-11 rounded-full border border-white/30 flex items-center justify-center disabled:opacity-30 transition hover:border-white/60"
        >
          <img src="/left.png" width={18} height={14} alt="prev" />
        </button>

        <button
          onClick={handleNext}
          disabled={startIdx >= maxStart}
          className="w-11 h-11 rounded-full border border-white/30 flex items-center justify-center disabled:opacity-30 transition hover:border-white/60"
        >
          <img src="/right.png" width={18} height={14} alt="next" />
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