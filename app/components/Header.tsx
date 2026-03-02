"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleScroll = (id: string) => {
    if (pathname === "/") {
      const section = document.getElementById(id);
      section?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${id}`);
    }
    setIsOpen(false);
  };
  return (
    <header className="bg-[#222222] text-[#EEEEEE] fixed w-full z-50 shadow-md">
      <div className="max-w-425 mx-auto px-6 py-4 flex items-center justify-between">

        {/* Left */}
        <div className="text-xl font-bold cursor-pointer" onClick={() => handleScroll("home")}>
          Umer Ahmed
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 text-sm font-medium">

          <button onClick={() => handleScroll("home")} className="hover:text-[#B42A2A] transition cursor-pointer">
            Home
          </button>

          <button onClick={() => handleScroll("about")} className="hover:text-[#B42A2A] transition cursor-pointer">
            About
          </button>

          <Link href="/portfolio" className="hover:text-[#B42A2A] transition cursor-pointer">
            Explore My Portfolio
          </Link>

          <Link href="/status" className="hover:text-[#B42A2A] transition cursor-pointer">
            Project Status
          </Link>

        </nav>

        {/* Contact Button */}
        <div className="hidden md:block">
          <Link
            href="/contact"
            className="border border-[#B42A2A] px-4 py-2 rounded-2xl hover:bg-[#B42A2A] hover:text-[#EEEEEE] transition cursor-pointer"
          >
            Contact
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={`block h-0.5 w-6 bg-[#EEEEEE] transition ${isOpen ? "rotate-45 translate-y-1.5" : ""}`} />
          <span className={`block h-0.5 w-6 bg-[#EEEEEE] my-1 transition ${isOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-[#EEEEEE] transition ${isOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-[#222222] overflow-hidden transition-all duration-500 ${isOpen ? "max-h-96 py-6" : "max-h-0"}`}>
        <div className="flex flex-col items-center space-y-6 text-sm font-medium">

          <button onClick={() => handleScroll("home")}>Home</button>
          <button onClick={() => handleScroll("about")}>About</button>

          <Link href="/portfolio" onClick={() => setIsOpen(false)}>
            Explore My Portfolio
          </Link>

          <Link href="/status" onClick={() => setIsOpen(false)}>
            Project Status
          </Link>

          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="border border-[#EEEEEE] px-4 py-2 rounded-full"
          >
            Contact
          </Link>

        </div>
      </div>
    </header>
  );
}