"use client";

import Link from "next/link";
import { useReveal } from "@/app/hooks/useReveal";
import Image from "next/image";
import { useRef } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";

/* ─── types ─────────────────────────────────────────────── */
interface CaseStudy {
  type: string;
  title: string;
  description: string;
  outcome: string;
  featured?: boolean;
  image: string;
  website: string;
  websiteUrl: string;
}

const caseStudies: CaseStudy[] = [
  {
    type: "Corporate Website & Branding",
    image: "/plazaconstruction.png",
    title: "Construction & Infrastructure Website",
    description:
      "Developed a modern, enterprise-grade website focused on showcasing large-scale construction projects, company expertise, and strong brand credibility.",
    outcome: "Enhanced Brand Authority",
    featured: true,
    website: "plazaconstruction.com",
    websiteUrl: "https://www.plazaconstruction.com/",
  },
  {
    type: "E-commerce & Product Experience",
    image: "/pitayafoods.png",
    title: "Food Brand E-commerce Platform",
    description:
      "Designed and optimized a vibrant e-commerce experience for a health-focused food brand, emphasizing product storytelling, usability, and conversion-focused layouts.",
    outcome: "Improved User Engagement",
    website: "pitayafoods.com",
    websiteUrl: "https://www.pitayafoods.com/",
  },
  {
    type: "E-commerce & Performance",
    image: "/pursuefitness.png",
    title: "Fitness Apparel Online Store",
    description:
      "Built a high-performance e-commerce platform tailored for a global fitness brand, with a focus on seamless navigation, mobile responsiveness, and fast checkout flow.",
    outcome: "Increased Sales Conversion",
    website: "pursuefitness.com",
    websiteUrl: "https://www.pursuefitness.com/",
  },
];

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ─── single card ────────────────────────────────────────── */
function CaseCard({ cs, index }: { cs: CaseStudy; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const visible = useInView(cardRef, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 48 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE, delay: index * 0.1 }}
      className="overflow-hidden cursor-pointer group flex flex-col"
    >
      {/* ── image: pans full image top→bottom on hover ── */}
      <div className="w-full aspect-video relative overflow-hidden bg-[#222222]">
        <motion.div
          className="absolute inset-x-0 top-0 w-full"
          style={{ height: "700%" }}
          initial={{ y: "0%" }}
          whileHover={{ y: "-85%" }}
          transition={{
            duration: 8.5,
            ease: [0.5, 0.3, 0.25, 1],
            type: "tween",
          }}
        >
          <Image
            src={cs.image}
            alt={cs.title}
            fill
            className="object-cover object-top"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        </motion.div>

        {/* subtle overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500 pointer-events-none z-10" />
      </div>

      {/* ── body ── */}
      <div className="p-5 sm:p-7 sm:px-8 flex-1 border border-[#222] border-t-0">
        <span
          className="text-[12px] sm:text-[13px] font-semibold tracking-[2px] uppercase text-[#888] mb-2.5 block border border-[#333] px-3 py-1.5 w-max rounded-sm"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {cs.type}
        </span>

        <h3 className="font-syne font-bold text-[18px] sm:text-[20px] xl:text-[22px] mb-2.5 leading-[1.3] text-white">
          {cs.title}
        </h3>

        <p
          className="text-[14px] sm:text-[15px] font-light max-w-[600px] leading-[1.7] mb-4 text-white/90"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {cs.description}
        </p>

        <div className="flex flex-col gap-1">
          <span
            className="text-[14px] sm:text-[15px] text-white/70"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <strong className="font-medium">Outcome:</strong> {cs.outcome}
          </span>
          <Link
            href={cs.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] sm:text-[15px] font-medium tracking-[0.5px] inline-flex items-center gap-1.5 mt-2 transition-all duration-200 text-white/80"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Website:{" "}
            <span className="text-[#e63030] transition-colors duration-200 truncate max-w-[160px] sm:max-w-none">
              {cs.website}
            </span>
            <FiArrowUpRight
              className="w-4 h-4 shrink-0 group-hover:text-[#e63030] transition-all duration-200"
              aria-hidden="true"
              title="Visit Website"
            />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── section ────────────────────────────────────────────── */
export default function CaseStudies() {
  const { ref, isVisible } = useReveal();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.1, 0.95]);

  const headingInView = useInView(sectionRef as React.RefObject<Element>, {
    once: true,
    margin: "-80px",
  });

  const featured = caseStudies.filter((c) => c.featured);
  const secondary = caseStudies.filter((c) => !c.featured);

  return (
    <section
      id="portfolio"
      ref={(el) => {
        (ref as React.MutableRefObject<HTMLElement | null>).current = el;
        (sectionRef as React.MutableRefObject<HTMLElement | null>).current = el;
      }}
      className={`relative border-t border-[#222] overflow-hidden reveal ${
        isVisible ? "visible" : ""
      }`}
      style={{ background: "#222222" }}
    >
      <motion.div
        className="absolute -bottom-75 -left-50 w-225 h-225 rounded-full pointer-events-none
                   bg-[radial-gradient(ellipse_at_center,#B42A2A_60%,#060606_90%)]
                   opacity-10 blur-[100px]"
        style={{ scale: glowScale }}
        animate={isInView ? { opacity: [0.07, 0.14, 0.07] } : { opacity: 0 }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-425 mx-auto px-4 sm:px-6 3xl:px-0 py-[60px] sm:py-[80px] lg:py-[100px]">

        {/* ── Header ── */}
        <div className="mb-10 sm:mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 32 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE }}
            className="font-syne font-extrabold leading-[1.1] tracking-[-0.5px] mb-3 text-[clamp(28px,4vw,52px)] text-white"
          >
            Selected case
            <br />
            studies
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
            className="text-[13px] sm:text-[14px] text-[#888] max-w-[500px] leading-[1.7]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            A curated gallery of scalable digital products where I led the
            lifecycle from initial envisioning to final technical deployment.
          </motion.p>
        </div>

        {/* ── Mobile / sm: single column ── */}
        <div className="flex flex-col gap-6 sm:hidden">
          {caseStudies.map((cs, i) => (
            <CaseCard key={cs.title} cs={cs} index={i} />
          ))}
        </div>

        {/* ── Tablet (sm–xl): clean 2-col or 3-col grid, NO negative margins ── */}
        <div className="hidden sm:grid xl:hidden grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 items-start">
          {caseStudies.map((cs, i) => (
            <CaseCard key={cs.title} cs={cs} index={i} />
          ))}
        </div>

        {/* ── Desktop (≥xl / ~1280px+): original asymmetric layout, safe at this width ── */}
        <div className="hidden xl:grid grid-cols-2 gap-6 items-start">
          {/* Left — featured */}
          <div>
            {featured.map((cs, i) => (
              <CaseCard key={cs.title} cs={cs} index={i} />
            ))}
          </div>

          {/* Right — two secondary cards pulled up */}
          <div
            className="flex flex-col gap-6"
            style={{ marginTop: "-196px" }}
          >
            {secondary.map((cs, i) => (
              <CaseCard key={cs.title} cs={cs} index={i + 1} />
            ))}
          </div>
        </div>

        {/* ── Footer actions ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE, delay: 0.4 }}
          className="flex flex-wrap gap-4 mt-10 sm:mt-12 items-center"
        >
          <Link
            href="/explore"
             className="
                bg-[#B42A2A] text-[#eeeeee] font-medium
                transition duration-300 hover:opacity-80
                px-5 py-3
                sm:px-6 sm:py-3.5
                md:px-7 md:py-3.5
                lg:px-8 lg:py-4
                text-sm sm:text-sm md:text-sm lg:text-base
              "
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Explore More
          </Link>
          <Link
            href="/appointment"
           className="
                border border-[#EEEEEE] font-medium text-white
                transition duration-300 hover:bg-[#EEEEEE] hover:text-[#222222]
                px-5 py-3
                sm:px-6 sm:py-3.5
                md:px-7 md:py-3.5
                lg:px-8 lg:py-4
                text-sm sm:text-sm md:text-sm lg:text-base
              "
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Hire Me
          </Link>
        </motion.div>
      </div>
    </section>
  );
}