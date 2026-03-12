"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import FloatingLines from "@/components/FloatingLines";
import projectsData from "./projects.json";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Project {
  id: number;
  type: string;
  image: string;
  title: string;
  description: string;
  outcome: string;
  website: string;
  websiteUrl: string;
}

// ── Stable FloatingLines constants ────────────────────────────────────────────
const FL_ENABLED_WAVES: Array<"top" | "middle" | "bottom"> = ["middle", "bottom"];
const FL_LINE_COUNT    = [14, 8];
const FL_LINE_DISTANCE = [38, 55];
const FL_GRADIENT      = ["#1a0000","#4a0a0a","#8b1010","#B42A2A","#e63030","#ff5a3c"];
const FL_MIDDLE_WAVE   = { x: 3.0, y: 0.0,  rotate:  0.15 };
const FL_BOTTOM_WAVE   = { x: 1.5, y: -0.5, rotate: -0.8  };

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const PER_PAGE = 6;

// ── Single project card ───────────────────────────────────────────────────────
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref  = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.07 }}
      className="group overflow-hidden cursor-pointer flex flex-col"
      style={{
        background: "rgba(22,22,22,0.82)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Image — pans full screenshot top→bottom on hover */}
      <div className="w-full aspect-video relative overflow-hidden bg-[#1a1a1a] shrink-0">
        <motion.div
          className="absolute inset-x-0 top-0 w-full"
          style={{ height: "600%" }}
          initial={{ y: "0%" }}
          whileHover={{ y: "-84%" }}
          transition={{ duration: 8, ease: [0.5, 0.3, 0.25, 1], type: "tween" }}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>
        {/* hover overlay */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/0 transition-colors duration-500 pointer-events-none z-10" />
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1 border-t border-white/[0.05]">
        {/* type badge */}
        <span
          className="text-[11px] font-semibold tracking-[2px] uppercase text-[#888] mb-3 block border border-[#2a2a2a] px-3 py-1.5 w-max"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {project.type}
        </span>

        <h3 className="font-syne font-bold text-[18px] mb-2 leading-[1.35] text-white">
          {project.title}
        </h3>

        <p
          className="text-[13px] font-light leading-[1.75] mb-4 text-white/60 flex-1"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {project.description}
        </p>

        {/* outcome + website */}
        <div className="flex flex-col gap-1.5 mt-auto pt-4 border-t border-white/[0.05]">
          <span
            className="text-[13px] text-white/50"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <span className="font-medium text-white/70">Outcome:</span>{" "}
            {project.outcome}
          </span>
          <Link
            href={project.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-medium inline-flex items-center gap-1 text-white/50 hover:text-white transition-colors duration-200 w-fit"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <span className="text-[#e63030] group-hover:text-[#ff6b6b] transition-colors">
              {project.website}
            </span>
            <FiArrowUpRight className="w-3.5 h-3.5 text-[#e63030]" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PortfolioPage() {
  const projects = projectsData as Project[];
  const totalPages = Math.ceil(projects.length / PER_PAGE);

  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  const startIdx = (page - 1) * PER_PAGE;
  const visible  = projects.slice(startIdx, startIdx + PER_PAGE);

  function goTo(p: number) {
    setPage(p);
    // smooth scroll to top of grid
    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }

  // build page numbers with ellipsis
  function pageNumbers(): (number | "…")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const nums: (number | "…")[] = [1];
    if (page > 3) nums.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      nums.push(i);
    }
    if (page < totalPages - 2) nums.push("…");
    nums.push(totalPages);
    return nums;
  }

  return (
    <div className="relative isolate min-h-screen bg-[#1e1e1e] overflow-x-hidden">

      {/* ── FloatingLines — absolute within this container only, never bleeds into footer ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <FloatingLines
          enabledWaves={FL_ENABLED_WAVES}
          lineCount={FL_LINE_COUNT}
          lineDistance={FL_LINE_DISTANCE}
          bendRadius={20}
          bendStrength={1.2}
          interactive={false}
          parallax={false}
          animationSpeed={0.7}
          linesGradient={FL_GRADIENT}
          mixBlendMode="screen"
          middleWavePosition={FL_MIDDLE_WAVE}
          bottomWavePosition={FL_BOTTOM_WAVE}
        />
      </div>

      {/* vignette overlay — also scoped to this container */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 100% 80% at 50% 40%, transparent 20%, rgba(8,0,0,0.7) 100%)",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-[2] max-w-[1400px] mx-auto px-6 py-20" ref={topRef}>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="m-14 text-center"
        >
          <h2 className="font-syne font-extrabold text-[2rem] sm:text-[2.4rem] lg:text-[3rem] tracking-[-1px] text-white leading-tight">
            Selected case
            <br />
            <span className="text-[#e63030]">studies</span>
          </h2>
          <p
            className="text-[14px] text-white/40 max-w-[480px] leading-[1.75] text-center mx-auto mt-4"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            A curated gallery of scalable digital products where I led the
            lifecycle from initial envisioning to final technical deployment.
          </p>

          {/* page indicator */}
          <p className="text-[12px] text-white/25 mt-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Showing {startIdx + 1}–{Math.min(startIdx + PER_PAGE, projects.length)} of{" "}
            {projects.length} projects
          </p>
        </motion.div>

        {/* ── Grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {visible.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── Pagination ── */}
        <div className="flex items-center justify-between mt-14 flex-wrap gap-4">

          {/* Prev arrow */}
          <motion.button
            onClick={() => goTo(Math.max(1, page - 1))}
            disabled={page === 1}
            whileHover={page > 1 ? { scale: 1.08 } : {}}
            whileTap={page > 1   ? { scale: 0.94 } : {}}
            className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200 ${
              page === 1
                ? "border-white/10 text-white/20 cursor-not-allowed"
                : "border-white/30 text-white/70 hover:border-[#e63030] hover:text-[#e63030]"
            }`}
          >
            <img src="/left.png" width={16} height={12} alt="prev" className={page === 1 ? "opacity-20" : "opacity-70"} />
          </motion.button>

          {/* Page numbers */}
          <div className="flex items-center gap-1.5">
            {pageNumbers().map((p, i) =>
              p === "…" ? (
                <span key={`ellipsis-${i}`} className="w-8 text-center text-white/30 text-[13px]">
                  …
                </span>
              ) : (
                <motion.button
                  key={p}
                  onClick={() => goTo(p as number)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.94 }}
                  className={`transition-all duration-200 text-[13px] font-medium rounded-sm ${
                    p === page
                      ? "w-9 h-9 bg-[#e63030] text-white"
                      : "w-9 h-9 border border-white/15 text-white/50 hover:border-white/40 hover:text-white"
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {p}
                </motion.button>
              )
            )}
          </div>

          {/* Next arrow */}
          <motion.button
            onClick={() => goTo(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            whileHover={page < totalPages ? { scale: 1.08 } : {}}
            whileTap={page < totalPages   ? { scale: 0.94 } : {}}
            className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200 ${
              page === totalPages
                ? "border-white/10 text-white/20 cursor-not-allowed"
                : "border-white/30 text-white/70 hover:border-[#e63030] hover:text-[#e63030]"
            }`}
          >
            <img src="/right.png" width={16} height={12} alt="next" className={page === totalPages ? "opacity-20" : "opacity-70"} />
          </motion.button>

        </div>
      </div>
    </div>
  );
}