"use client";

import Link from "next/link";
import MockUI from "@/app/components/MockUI";
import { useReveal } from "@/app/hooks/useReveal";
import Image from "next/image";

interface CaseStudy {
  type: string;
  title: string;
  description: string;
  outcome: string;
  featured?: boolean;
  mockBlocks?: { style?: React.CSSProperties }[];
  mockLayout?: "sidebar" | "full";
  mockAccentIndex?: number;
  image: string;
}

const caseStudies: CaseStudy[] = [
  {
    type: "UI/UX · Web Application",
    image: "/reelstacks.png",
    title: "Social Media Application & Website",
    description:
      "Built a social mobile and web application that leverages one-tap sharing and multi-platform compatibility to solve the problem of fragmented content saving.",
    outcome: "Optimised Curation",
    featured: true,
    mockLayout: "sidebar",
    mockAccentIndex: 0,
  },
  {
    type: "Development & Design",
    image: "/focusedcaretherapeuticmassage.png",
    title: "Website Redesign & Integrated Booking Solution",
    description:
      "A complete design and development project focused on brand identity and the implementation of a high-conversion online scheduling feature.",
    outcome: "Increased Conversions",
    mockLayout: "full",
    mockBlocks: [
      { style: { flex: "0.5", background: "#1a2a2a" } },
      {},
      {},
    ],
    mockAccentIndex: 1,
  },
  {
    type: "Full Stack Solution",
    image: "/turnbyturn.png",
    title: "Driving School Portal",
    description:
      "Designed and engineered a robust educational portal that integrates automated registration, secure sign-up logic, and a self-paced online classroom module.",
    outcome: "Operational Efficiency",
    mockLayout: "full",
    mockBlocks: [
      { style: { background: "#1e2820" } },
      { style: { background: "#e87d30", opacity: 0.4 } },
      {},
    ],
    mockAccentIndex: -1,
  },
];

function CaseCard({ cs }: { cs: CaseStudy }) {
  return (
    <div
      className={` overflow-hidden transition-all duration-200 cursor-pointer ${cs.featured ? "row-span-2 flex flex-col" : ""}`}
    >
      <div className="w-full aspect-video relative overflow-hidden">
 <div>
       <Image
  src={cs.image}
  alt={cs.title}
  fill
  className="object-cover transition-transform duration-300 hover:scale-105"
/>
</div>      </div>
      <div className="p-7 px-8 flex-1">
        <span className="text-[10px] font-semibold tracking-[2.5px] uppercase text-[#e63030] mb-2.5 block">
          {cs.type}
        </span>
        <h3 className="font-syne font-bold text-[18px] mb-2.5 leading-[1.3]">
          {cs.title}
        </h3>
        <p className="text-[13px] text-[#888] leading-[1.7] mb-4">{cs.description}</p>
        <div className="flex flex-col gap-1">
          <span className="text-[12px] text-[#555]">
            <strong className="text-[#888] font-medium">Outcome:</strong> {cs.outcome}
          </span>
          <Link
            href="#"
            className="text-[12px] text-[#e63030] font-semibold tracking-[0.5px] inline-flex items-center gap-1.5 mt-2 hover:gap-2.5 transition-all duration-200"
          >
            View Project →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CaseStudies() {
  const { ref, isVisible } = useReveal();

  return (
    <section
      id="portfolio"
      ref={ref}
      className={`px-[60px] py-[100px] border-t border-[#222] reveal ${isVisible ? "visible" : ""}`}
    >
      {/* Header */}
      <div className="mb-14 ">
       
        <h2 className="font-syne font-extrabold leading-[1.1] tracking-[-0.5px] mb-3 text-[clamp(32px,4vw,52px)]">
          Selected case
          <br />
          studies
        </h2>
        <p className="text-[14px] text-[#888] max-w-[500px] leading-[1.7]">
          A curated gallery of scalable digital products where I led the lifecycle
          from initial envisioning to final technical deployment.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-6">
        {caseStudies.map((cs) => (
          <CaseCard key={cs.title} cs={cs} />
        ))}
      </div>

      {/* Footer actions */}
      <div className="flex gap-4 mt-12 items-center">
        <Link
          href="#portfolio"
          className="bg-[#e63030] text-white text-[13px] font-semibold px-[26px] py-3 border-2 border-[#e63030] tracking-[0.3px] hover:bg-[#c72020] hover:border-[#c72020] hover:-translate-y-[1px] transition-all duration-200 inline-block"
        >
          Explore More
        </Link>
        <Link
          href="#contact"
          className="bg-transparent text-white text-[13px] font-semibold px-[26px] py-3 border-2 border-[#333] tracking-[0.3px] hover:border-[#666] hover:-translate-y-[1px] transition-all duration-200 inline-block"
        >
          Hire Me
        </Link>
      </div>
    </section>
  );
}