import Hero from "./components/Hero";
import Experience from "./components/Experience";
import AboutSection from "./components/About";
import CTASection from "./components/CTA";
import CoreCompetencies from "./components/Core";
import Testimonials from "./components/Testimonial";
import CaseStudies from "./components/CaseStudies";

export default function HomePage() {
  return (
    <>
    <Hero />
    <Experience />
    <AboutSection />
    {/* <CoreCompetencies /> */}
    <CaseStudies />
    {/* <Testimonials /> */}
    <CTASection />
    </>
  );
}