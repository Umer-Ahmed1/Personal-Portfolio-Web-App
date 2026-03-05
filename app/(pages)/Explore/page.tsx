import React from 'react'
import CallToAction from '@/app/components/CTA'
import CaseStudies from '@/app/components/CaseStudies'

export default function page() {
  return (
        <div className="min-h-screen  text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center pt-20">Explore My Portfolio</h1>
              <p className="text-center text-gray-400 mt-4 max-w-2xl mx-auto px-4">
                Dive into a curated selection of my best work, showcasing my skills in UX/UI design, full-stack development, and project management. Each project highlights my ability to create innovative solutions that drive results.
              </p>
              <CaseStudies />
          <CallToAction />
        </div>
  )
}
