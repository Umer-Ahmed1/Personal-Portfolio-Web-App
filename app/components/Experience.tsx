// components/StatsSection.tsx
'use client';

import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface StatItemProps {
  value: string;
  highlight?: string;
  label: string;
}

function AnimatedNumber({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    if (!isInView) return;

    // Extract numeric part (e.g. "05" → 5, "40" → 40)
    const target = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;

    const controls = animate(count, target, {
      duration: 2.2,
      ease: 'easeOut',
    });

    return controls.stop;
  }, [isInView, value, count]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-tight"
    >
      {rounded}
    </motion.span>
  );
}

const StatItem = ({ value, highlight, label }: StatItemProps) => {
  return (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      {/* NUMBER + HIGHLIGHT */}
      <div className="flex items-baseline gap-1.5">
        {value.includes('/') ? (
          // Special case for "24/7"
          <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-tight">
            {value}
          </span>
        ) : (
          <AnimatedNumber value={value} />
        )}

        {highlight && (
          <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-[#b42a2a]">
            {highlight}
          </span>
        )}
      </div>

      {/* LABEL */}
      <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-400 font-medium tracking-wide">
        {label}
      </p>
    </motion.div>
  );
};

export default function StatsSection() {
  const stats = [
    { value: "05", highlight: "+", label: "Years Experience" },
    { value: "40", highlight: "+", label: "Projects Delivered" },
    { value: "99", highlight: "%", label: "Client Satisfaction" },
    { value: "24/7", label: "Proactive Communication" },
  ];

  return (
    <section className="w-full bg-[#282828] border-t border-b border-[#333333] py-12">
      <div className=" max-w-425 mx-auto px-6 3xl:px-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 lg:gap-12 xl:gap-16">
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              value={stat.value}
              highlight={stat.highlight}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}