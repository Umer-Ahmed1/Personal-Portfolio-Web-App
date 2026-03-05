"use client";

import Link from "next/link";
import { useReveal } from "@/app/hooks/useReveal";
import Image from "next/image";
import { useRef } from "react";
import { BsArrowRight } from "react-icons/bs";
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
    type: "UI/UX & Management",
    image: "/reelstacks.png",
    title: "Social Media Application & Website",
    description:
      "Built a social mobile and web application that leverages one-tap sharing and multi-platform compatibility to solve the problem of fragmented content saving.",
    outcome: "Optimised Curation",
    featured: true,
    website: "reelstacks.com",
    websiteUrl: "https://reelstacks.com",
  },
  {
    type: "Development & Design",
    image: "/focusedcaretherapeuticmassage.png",
    title: "Website Redesign & Integrated Booking Solution",
    description:
      "A complete design and development project focused on brand identity and the implementation of a high-conversion online scheduling feature.",
    outcome: "Increased Conversions",
    website: "focusedcaretherapeuticmassage.com",
    websiteUrl: "https://focusedcaretherapeuticmassage.com",
  },
  {
    type: "Full-Stack Solution",
    image: "/turnbyturn.png",
    title: "Driving School Portal",
    description:
      "Designed and engineered a robust educational portal that integrates automated registration, secure sign-up logic, and a self-paced online classroom module.",
    outcome: "Operational Efficiency",
    website: "turnbyturn.ca",
    websiteUrl: "https://turnbyturn.ca",
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
      className={`overflow-hidden cursor-pointer group
        ${cs.featured ? "row-span-2 flex flex-col" : ""}`}
    >
      {/* ── image: pans full image top→bottom on hover ── */}
      <div className="w-full aspect-video relative overflow-hidden bg-[#222222]">
<motion.div
  className="absolute inset-x-0 top-0 w-full"
  style={{ height: "700%" }}
  initial={{ y: "0%" }}
  whileHover={{ y: "-85%" }}
  transition={{
    duration: 8.5,                    // medium-slow for "pan up" feel
    ease: [0.5, 0.3, 0.25, 1],       // smooth cinematic acceleration
    type: "tween",
  }}
>
  <Image
    src={cs.image}
    alt={cs.title}
    fill
    className="object-cover object-top"
    sizes="(max-width: 768px) 100vw, 50vw"
  />
</motion.div>

        {/* subtle overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500 pointer-events-none z-10" />
      </div>

      {/* ── body ── */}
      <div
        className="p-7 px-8 flex-1  border border-[#222] border-t-0"
      >
        <span
          className="text-[14px] font-semibold tracking-[2.5px] uppercase text-[#888] mb-2.5 block border border-[#333] px-3 py-2 w-max rounded-sm"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {cs.type}
        </span>

        {/* title stays Syne */}
        <h3 className="font-syne font-bold text-[22px] mb-2.5 leading-[1.3] text-white">
          {cs.title}
        </h3>

        <p
          className="text-[16px] font-light max-w-[600px] leading-[1.7] mb-4"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {cs.description}
        </p>

        <div className="flex flex-col gap-1">
          <span
            className="text-[16px] "
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <strong className=" font-medium">Outcome:</strong>{" "}
            {cs.outcome}
          </span>
          <Link
            href={cs.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[16px] font-medium tracking-[0.5px] inline-flex items-center gap-1.5 mt-2 transition-all duration-200"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Website: <span className="text-[#e63030] hover:text-[#c72020] transition-colors duration-200">
              {cs.website}
              </span>
            <FiArrowUpRight className="w-4 h-4 group-[&:hover]:fill-[#e63030] group-hover:text-[#e63030] transition-all duration-200" aria-hidden="true" title="Visit Website" />
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

  /* parallax: map drifts upward as you scroll */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const mapY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.1, 0.95]);

  const headingInView = useInView(sectionRef as React.RefObject<Element>, {
    once: true,
    margin: "-80px",
  });

  const featured  = caseStudies.filter((c) => c.featured);
  const secondary = caseStudies.filter((c) => !c.featured);

  return (
    <section
      id="portfolio"
      ref={(el) => {
        (ref as React.MutableRefObject<HTMLElement | null>).current = el;
        (sectionRef as React.MutableRefObject<HTMLElement | null>).current = el;
      }}
      className={`relative border-t border-[#222] overflow-hidden reveal ${isVisible ? "visible" : ""}`}
      style={{ background: "#222222" }}
    >

      <motion.div
        className="absolute -bottom-75 -left-50 w-225 h-225 rounded-full pointer-events-none
                   bg-[radial-gradient(ellipse_at_center,#B42A2A_60%,#060606_90%)]
                   opacity-10 blur-[100px]"
        style={{ scale: glowScale }}
        animate={
          isInView
            ? { opacity: [0.07, 0.14, 0.07] }
            : { opacity: 0 }
        }
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── content container — matches About / Competencies ── */}
      <div className="max-w-425 mx-auto px-6 3xl:px-0 py-[100px]">

        {/* Header */}
        <div className="mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 32 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE }}
            className="font-syne font-extrabold leading-[1.1] tracking-[-0.5px] mb-3 text-[clamp(32px,4vw,52px)] text-white"
          >
            Selected case
            <br />
            studies
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
            className="text-[14px] text-[#888] max-w-[500px] leading-[1.7]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            A curated gallery of scalable digital products where I led the
            lifecycle from initial envisioning to final technical deployment.
          </motion.p>
        </div>

        {/* Grid
            Left col  → featured card (spans 2 rows, full height)
            Right col → two cards stacked, shifted UP so their top
                        aligns with the main heading top              */}
        <div className="grid grid-cols-2 gap-6 items-start">

          {/* Left — featured */}
          <div>
            {featured.map((cs, i) => (
              <CaseCard key={cs.title} cs={cs} index={i} />
            ))}
          </div>

          {/* Right — two cards, pulled up by the heading block height
              so the first right card's top aligns with the heading   */}
          <div
            className="flex flex-col gap-6"
            style={{ marginTop: "-196px" }}   /* ≈ heading block height */
          >
            {secondary.map((cs, i) => (
              <CaseCard key={cs.title} cs={cs} index={i + 1} />
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE, delay: 0.4 }}
          className="flex gap-4 mt-12 items-center"
        >
          <Link
            href="#portfolio"
            className="bg-[#e63030] text-white text-[13px] font-semibold px-[26px] py-3 border-2 border-[#e63030] tracking-[0.3px] hover:bg-[#c72020] hover:border-[#c72020] hover:-translate-y-[1px] transition-all duration-200 inline-block"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Explore More
          </Link>
          <Link
            href="#contact"
            className="bg-transparent text-white text-[13px] font-semibold px-[26px] py-3 border-2 border-[#333] tracking-[0.3px] hover:border-[#666] hover:-translate-y-[1px] transition-all duration-200 inline-block"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Hire Me
          </Link>
        </motion.div>
      </div>
    </section>
  );
}