// components/CallToAction.tsx  or  components/HeroCTA.tsx
import Link from 'next/link';
import React from 'react';

export default function CallToAction() {
  return (
    <section
      className="
        relative min-h-[80vh] md:min-h-[90vh] lg:min-h-screen
        flex items-center justify-center
        bg-gray-950 text-white overflow-hidden
      "
    >
      {/* Background Image with overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="
            absolute inset-0 bg-cover bg-center bg-no-repeat
            brightness-[0.45] contrast-[1.15]
          "
          style={{
            backgroundImage: "url('/contact-bg.png')",
          }}
        />
        {/* Optional subtle gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/30 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 lg:px-12 text-center">
        <div className="space-y-6 md:space-y-8 lg:space-y-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            Ready to Transform Your
            <br className="hidden sm:block" />
            Vision into Reality?
          </h1>

          <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-white/90 max-w-4xl mx-auto leading-relaxed">
            Let’s combine high-end design, scalable development, and precision
            <br className="hidden md:block" />
            management to build your next digital success story.
          </p>

          <div className="pt-6 md:pt-10 flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link
              href="/start-project"
              className="
                inline-flex items-center justify-center
                px-10 py-5 text-lg font-semibold
                bg-red-600 hover:bg-red-700
                text-white rounded-lg
                transition-all duration-300 shadow-lg hover:shadow-red-900/30
                min-w-55
              "
            >
              Start A Project
            </Link>

            <Link
              href="/book-strategy-call"
              className="
                inline-flex items-center justify-center
                px-10 py-5 text-lg font-semibold
                border-2 border-white/40 hover:border-white/70
                text-white rounded-lg
                backdrop-blur-sm bg-white/5 hover:bg-white/10
                transition-all duration-300
                min-w-55
              "
            >
              Book A Strategy Call
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}