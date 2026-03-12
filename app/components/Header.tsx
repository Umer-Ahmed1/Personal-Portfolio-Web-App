"use client";

import { useEffect, useRef } from "react";
import CardNav from "./Nav";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Header = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY.current;

      if (diff > 5 && currentY > 80) {
        header.style.transform = "translateY(-120%)";
        header.style.opacity = "0";
      } else if (diff < -5) {
        header.style.transform = "translateY(0)";
        header.style.opacity = "1";
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const items = [
    {
      label: "About",
      bgColor: "#fff",
      textColor: "#B42A2A",
      links: [
        { label: "About Me", ariaLabel: "About Me", href: "#about" },
        { label: "Hire Me", ariaLabel: "Book an Appointment", href: "/appointment" },
      ],
    },
    {
      label: "Projects",
      bgColor: "#fff",
      textColor: "#B42A2A",
      links: [
        { label: "Portfolio", ariaLabel: "Explore My Portfolio", href: "/explore" },
        { label: "Status Update", ariaLabel: "Project Status", href: "/status" },
      ],
    },
    {
      label: "Contact",
      bgColor: "#fff",
      textColor: "#B42A2A",
      links: [
        { label: "Contact Us", ariaLabel: "Contact Us", href: "/contact" },
        { label: "Facebook", ariaLabel: "Facebook", href: "https://facebook.com", icon: FaFacebookF },
        { label: "Instagram", ariaLabel: "Instagram", href: "https://instagram.com", icon: FaInstagram },
        { label: "Twitter", ariaLabel: "Twitter / X", href: "https://twitter.com", icon: FaXTwitter },
      ],
    },
  ];

  return (
    /*
      KEY FIXES:
      1. `fixed inset-x-0 top-0` — properly pins to viewport width, no overflow
      2. `w-full` — never wider than the viewport
      3. Removed any max-width constraint here; CardNav handles its own internal centering
      4. `overflow-hidden` removed — was masking the expanded dropdown on mobile
    */
    <div
      ref={headerRef}
      className="fixed top-0 left-0 right-0 w-full z-[100] pt-4 md:pt-8 box-border"
      style={{
        transition: "transform 0.4s ease, opacity 0.4s ease",
      }}
    >
      <CardNav
        logo="/cursor.png"
        items={items}
        baseColor="#000"
        menuColor="#fff"
        buttonBgColor="#B42A2A"
        buttonTextColor="#fff"
        ease="elastic.out(1, 0.8)"
      />
    </div>
  );
};

export default Header;