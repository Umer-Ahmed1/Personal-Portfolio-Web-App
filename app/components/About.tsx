"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import ScrollReveal from './Reveal';

/* ── ease curves typed as tuples to satisfy Framer Motion's Easing type ── */
const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as [number, number, number, number];
const EASE_SPRING_OVERSHOOT = [0.34, 1.56, 0.64, 1] as [number, number, number, number];

/* ── animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_OUT_EXPO, delay },
  }),
};

const badgePop = {
  hidden: { opacity: 0, scale: 0.75, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_SPRING_OVERSHOOT },
  },
};

const letterStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const letterVariant = {
  hidden: { opacity: 0, y: 60, rotateX: -40 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.6, ease: EASE_OUT_EXPO },
  },
};

/* ── word-by-word text ── */
function AnimatedHeading({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <motion.h2
      variants={letterStagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight max-w-4xl"
      style={{ perspective: 800 }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            variants={letterVariant}
            custom={delay + i * 0.04}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.h2>
  );
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  /* parallax: map drifts upward as you scroll */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const mapY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.1, 0.95]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative bg-[#222222] text-[#EEEEEE] overflow-hidden w-full about"
    >
      {/* ── MAP — parallax drift ── */}
      <motion.div
        className="absolute top-0 right-0 w-full h-full pointer-events-none"
        style={{ y: mapY }}
        initial={{ opacity: 0, scale: 1.06 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.4, ease: "easeOut" }}
      >
        <Image
          src="/about-map.png"
          alt="World Map"
          fill
          className="object-contain object-top-right"
          priority
        />
      </motion.div>

      {/* ── GLOW ELLIPSE — breathes ── */}
      <motion.div
        className="absolute -bottom-75 -right-50 w-225 h-225 rounded-full pointer-events-none
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

      {/* ── CONTENT ── */}
      <div className="relative z-10 max-w-425 mx-auto px-6 3xl:px-0 py-20">

        {/* Badge */}
        <motion.span
          variants={badgePop}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="inline-block border border-[#333] px-4 py-1 text-sm text-gray-400 mb-8"
        >
          About Me
        </motion.span>

        {/* Heading — word reveal */}
        <AnimatedHeading text="A Strategic Digital Architect" delay={0.1} />

        {/* Body copy — fade + slide */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          custom={0.35}
          className="mt-10 text-lg md:text-xl leading-relaxed max-w-3xl text-[#CCCCCC]"
        >
<ScrollReveal
  baseOpacity={0.2}
  enableBlur
  baseRotation={2.5}
  blurStrength={5}
  wordAnimationEnd = 'center center'
rotationEnd = 'center center'
>
  I don&apos;t just build websites; I build solutions. With a unique
  background spanning Design, Development, and Project Management,
  I provide a holistic approach to every product. My goal is to
  eliminate the friction between a business idea and its technical
  reality through clean code and fluent, error-free communication.
</ScrollReveal>
        </motion.p>

        {/* CTA Button — fade up + magnetic hover */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          custom={0.5}
          className="mt-12 inline-block"
        >
          <motion.div
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Link
              href="/about"
              className="inline-block px-8 py-4 bg-[#B42A2A] hover:bg-[#9f2424] transition-colors text-white relative overflow-hidden group"
            >
              {/* shimmer sweep */}
              <motion.span
                className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ["−100%", "200%"] }}
                transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
              />
              <span className="relative z-10">Discover My Story</span>
            </Link>
          </motion.div>
        </motion.div>

      </div>     
    </section>
  );
}