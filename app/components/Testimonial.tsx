"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
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
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 2,
    rating: 5,
    review:
      "Umer is a rare find; he managed our entire product roadmap while simultaneously designing a world-class UI, delivering everything ahead of schedule.",
    name: "Sarah Chen",
    position: "CEO of NexaTech Solutions",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: 3,
    rating: 5,
    review:
      "His ability to translate complex business requirements into clean, scalable code is unmatched — Umer makes the most difficult technical hurdles look easy.",
    name: "James Miller",
    position: "CTO at Blue Horizon",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 4,
    rating: 4,
    review:
      "The systems architecture Umer designed for our platform has scaled flawlessly. He thinks ten steps ahead and documents everything impeccably.",
    name: "Priya Nair",
    position: "VP Engineering at Stackly",
    avatar: "https://randomuser.me/api/portraits/women/55.jpg",
  },
  {
    id: 5,
    rating: 5,
    review:
      "From wireframes to deployment, Umer owned the entire process. The final product exceeded every benchmark we set — truly exceptional work.",
    name: "Carlos Rivera",
    position: "Founder at LaunchPad Studio",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    id: 6,
    rating: 4,
    review:
      "Our redesign under Umer's direction saw a 40% increase in user retention within the first month. His UX instincts are sharp and data-driven.",
    name: "Mei Lin",
    position: "Head of Growth at Funnl",
    avatar: "https://randomuser.me/api/portraits/women/26.jpg",
  },
  {
    id: 7,
    rating: 5,
    review:
      "Umer brought clarity to a chaotic project. His project management skills, combined with deep technical expertise, turned our struggling product into a success story.",
    name: "Ahmed Al-Rashid",
    position: "COO at BridgeWorks",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
  },
];

const VISIBLE = 4;
const TOTAL = testimonials.length; // 7
const AUTO_MS = 5000;

/* ── Stars ───────────────────────────────────────────────── */
function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 20 20"
          fill={i < count ? "#FFD700" : "#333"} xmlns="http://www.w3.org/2000/svg">
          <path d="M10 1l2.39 5.26L18 7.27l-4 3.89.94 5.49L10 14.77l-4.94 1.88L6 11.16 2 7.27l5.61-.51z" />
        </svg>
      ))}
    </div>
  );
}

/* ── Horizontal slide variants ───────────────────────────── */
const variants: import("framer-motion").Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 50 : -50 }),
  center: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.38,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -50 : 50,
    transition: {
      duration: 0.25,
      ease: [0.55, 0, 1, 0.45] as [number, number, number, number],
    },
  }),
};

/* ── Component ───────────────────────────────────────────── */
export default function Testimonials() {
  const [startIdx, setStartIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Core step — always wraps via modulo, never stops
  const step = (dir: number) => {
    setDirection(dir);
    setStartIdx((prev) => (prev + dir + TOTAL) % TOTAL);
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => step(1), AUTO_MS);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePrev = () => { step(-1); startTimer(); };
  const handleNext = () => { step(1);  startTimer(); };
  const handleDot  = (i: number) => {
    setDirection(i !== startIdx ? (i > startIdx ? 1 : -1) : 1);
    setStartIdx(i);
    startTimer();
  };

  return (
    <section
      id="testimonials"
      className="relative py-[80px] border-t border-[#222] bg-[#282828] overflow-hidden"
    >
      {/* ── HEADER ── */}
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

      {/* ── CARDS — 4 fixed shells, only inner motion.div animates ── */}
      <div className="max-w-425 mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: VISIBLE }).map((_, slotIdx) => {
            // Modulo: wraps past end → loops back to beginning
            const item = testimonials[(startIdx + slotIdx) % TOTAL];

            return (
              /*
                Shell: h-[300px] fixed, overflow-hidden.
                Never moves or re-mounts — layout stays perfectly stable.
              */
              <div
                key={slotIdx}
                className="relative p-6 bg-[#1c1c1c] border border-[#2a2a2a] h-[300px] overflow-hidden"
              >
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={`${startIdx}-${slotIdx}`}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="flex flex-col h-full"
                  >
                    {/* TOP: stars + Google wordmark */}
                    <div className="flex items-center justify-between mb-3 shrink-0">
                      <Stars count={item.rating} />
                      <img
                        src="/google.png"
                        alt="Google"
                        className="object-contain  shrink-0"
                        style={{ width: 60, height: 20 }}
                      />
                    </div>

                    {/* REVIEW — 5-line clamp keeps card height stable */}
                    <p
                      className="text-[13px] text-[#bbb] leading-[1.75] flex-1 overflow-hidden"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 5,
                        WebkitBoxOrient: "vertical",
                      } as React.CSSProperties}
                    >
                      {item.review}
                    </p>

                    {/* BOTTOM: avatar + name | quote icon */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#2a2a2a] shrink-0">
                      <div className="flex items-center gap-3">
                        {/* Online avatar — rounded-full, red ring */}
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="rounded-full object-cover shrink-0 ring-2 ring-[#e63030] ring-offset-2 ring-offset-[#1c1c1c]"
                          style={{ width: 36, height: 36 }}
                        />
                        <div>
                          <p className="text-white text-[13px] font-semibold leading-tight">
                            {item.name}
                          </p>
                          <p className="text-[#555] text-[11px] leading-tight mt-0.5">
                            {item.position}
                          </p>
                        </div>
                      </div>

                      {/* Quote icon */}
                      <img
                        src="/quote.png"
                        alt=""
                        className="object-contain shrink-0"
                        style={{ width: 58, height: 58 }}
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CONTROLS ── */}
      <div className="max-w-425 mx-auto px-6 mt-10 flex flex-wrap items-center gap-3">
        {/* Arrows + dots — grouped so they stay on the same line */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={handlePrev}
            className="w-11 h-11 rounded-full border border-white/30 flex items-center justify-center transition hover:border-white/60 shrink-0"
          >
            <img src="/left.png" width={18} height={14} alt="prev" />
          </button>

          <button
            onClick={handleNext}
            className="w-11 h-11 rounded-full border border-white/30 flex items-center justify-center transition hover:border-white/60 shrink-0"
          >
            <img src="/right.png" width={18} height={14} alt="next" />
          </button>

          {/* 7 progress dots — active is red pill shape */}
          <div className="flex items-center gap-1.5 ml-1">
            {Array.from({ length: TOTAL }).map((_, i) => (
              <button
                key={i}
                onClick={() => handleDot(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width:  i === startIdx ? "20px" : "6px",
                  height: "6px",
                  backgroundColor: i === startIdx ? "#e63030" : "#444",
                }}
              />
            ))}
          </div>
        </div>

        {/* Hire Me — right-aligned on sm+, full-width centered on xs (iPhone SE) */}
        <div className="w-full sm:w-auto flex justify-center sm:justify-end sm:ml-auto">
          <Link
            href="/appointment"
            className="bg-[#e63030] text-white text-[13px] font-semibold px-[26px] py-3 border-2 border-[#e63030] hover:bg-[#c72020] transition"
          >
            Hire Me
          </Link>
        </div>
      </div>
    </section>
  );
}