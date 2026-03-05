"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

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

const CARD_WIDTH = 400; // px
const GAP = 16;         // px
const TOTAL_TRACK = cards.length * CARD_WIDTH + (cards.length - 1) * GAP;

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ── variants ── */
const sectionVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const cardEntry = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

export default function Competencies() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  /* measure the shared content container to know the right boundary */
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    setContainerWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const [activeIdx, setActiveIdx] = useState(0);
  const maxIdx = cards.length - 1;

  const handlePrev = () => setActiveIdx((i) => Math.max(0, i - 1));
  const handleNext = () => setActiveIdx((i) => Math.min(maxIdx, i + 1));

  /*
   * Step size distributes the total overflow so that:
   *   activeIdx = 0       → trackX = 0
   *                            first card left-edge = container left-edge ✓
   *   activeIdx = maxIdx  → trackX = -(TOTAL_TRACK - containerWidth)
   *                            last card right-edge = container right-edge ✓
   */
  const maxOffset = Math.max(0, TOTAL_TRACK - containerWidth);
  const stepSize  = maxIdx > 0 ? maxOffset / maxIdx : 0;
  const trackX    = -(activeIdx * stepSize);

  return (
    <motion.section
      id="competencies"
      ref={sectionRef}
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      /* full-width bg; NO overflow-hidden so cards can bleed off screen */
      className="relative py-[80px] border-t border-[#222] bg-[#282828]"
    >

      {/* ══ HEADER — same max-w / padding as About ══ */}
      <div ref={containerRef} className="max-w-425 mx-auto px-6 3xl:px-0">
        <div className="flex items-start justify-between mb-12">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            className="font-syne font-extrabold tracking-[-0.5px] text-[clamp(28px,3.5vw,44px)] text-white"
          >
            Core Competencies
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
            className="max-w-[280px] text-right"
          >
            <p className="text-[13px] text-white leading-relaxed">
              I Bridge The Gap Between
              <br />
              Stakeholders And Technology
            </p>
          </motion.div>
        </div>
      </div>


      {/* ══ SLIDER
          Left edge is pinned to the content-container left edge via the same
          max-w + px-6 wrapper (overflow: visible, so cards bleed right).
          The section has no overflow-hidden → cards bleed off-screen too.
      ══ */}
      <div className="max-w-425 mx-auto px-6 3xl:px-0 overflow-visible">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{ width: "max-content" }}
        >
          <motion.div
            style={{ display: "flex", gap: `${GAP}px`, width: "max-content" }}
            animate={{ x: trackX }}
            transition={{ type: "spring", stiffness: 300, damping: 34, mass: 0.8 }}
          >
            {cards.map((card, i) => (
              <motion.div
                key={card.num}
                variants={cardEntry}
                className="relative flex-shrink-0 flex flex-col"
                style={{
                  width: `${CARD_WIDTH}px`,
                  aspectRatio: "1.2 / 1",
                  background: "#1c1c1c",
                  border: `1px solid ${i === activeIdx ? "rgba(230,48,48,0.6)" : "#2a2a2a"}`,
                  overflow: "hidden",
                  transition: "border-color 0.3s ease",
                }}
              >
                {/* Map bg */}
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

                {/* Card content */}
                <div className="relative z-10 flex flex-col h-full p-8">
                  {/* Icon top-left */}
                  <div className="w-10 h-10 relative mb-auto">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-contain"
                      sizes="40px"
                    />
                  </div>

                  {/* Text bottom */}
                  <div className="mt-8">
                    <span className="font-syne text-[11px] text-[#555] tracking-[2px] block mb-3">
                      {card.num}
                    </span>
                    <h3 className="font-syne font-bold text-[18px] text-white mb-3 leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-[13px] text-[#888] leading-[1.7]">
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Active bottom line */}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-[#e63030]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: i === activeIdx ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  style={{ width: "100%", transformOrigin: "left" }}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>


      {/* ══ CONTROLS — same max-w / padding as About ══ */}
      <div className="max-w-425 mx-auto px-6 3xl:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
          className="flex items-center gap-3 mt-10"
        >
         {/* Left arrow — outlined circle */}
        <motion.button
          onClick={handlePrev}
          disabled={activeIdx === 0}
          aria-label="Previous"
          whileHover={{ scale: 1.08, backgroundColor: "#e63030" }}
          whileTap={{ scale: 0.93 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="w-11 h-11 rounded-full border border-white/30 flex items-center justify-center transition-all duration-00 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ background: "transparent" }}
        >
         <img src="/left.png" alt="Previous" width={18} height={14} />
        </motion.button>

        {/* Right arrow — filled red circle */}
        <motion.button
          onClick={handleNext}
          disabled={activeIdx === maxIdx}
          aria-label="Next"
          whileHover={{ scale: 1.08, backgroundColor: "#e63030" }}
          whileTap={{ scale: 0.93 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="w-11 h-11 rounded-full border border-white/30 flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ background: "transparent" }}
        >
          <img src="/right.png" alt="Next" width={18} height={18} />
        </motion.button>

          <div className="ml-auto">
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Link
                href="#contact"
                className="bg-[#e63030] text-white text-[13px] font-semibold px-[26px] py-3 border-2 border-[#e63030] tracking-[0.3px] hover:bg-[#c72020] hover:border-[#c72020] transition-all duration-200 inline-block"
              >
                Hire Me
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

    </motion.section>
  );
}