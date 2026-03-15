"use client";

import React, { useLayoutEffect, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { GoArrowUpRight } from "react-icons/go";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import type { IconType } from "react-icons";

interface CardNavLink {
  label: string;
  ariaLabel: string;
  href: string;
  icon?: IconType;
}

interface CardNavItem {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
}

export interface CardNavProps {
  logo: string;
  logoAlt?: string;
  items: CardNavItem[];
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

const CardNav: React.FC<CardNavProps> = ({
  logo,
  logoAlt = "Logo",
  items,
  className = "",
  ease = "power3.out",
  baseColor = "#fff",
  menuColor,
  buttonBgColor,
  buttonTextColor,
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Reset nav state on every route change (fixes: nav broken after client navigation)
  useEffect(() => {
    setIsHamburgerOpen(false);
    setIsExpanded(false);
    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }
    if (navRef.current) {
      gsap.set(navRef.current, { height: 60, overflow: "hidden" });
    }
    if (cardsRef.current.length) {
      gsap.set(cardsRef.current, { y: 50, opacity: 0 });
    }
    // Recreate timeline after reset
    setTimeout(() => {
      const tl = createTimeline();
      tlRef.current = tl;
    }, 50);
  }, [pathname]);

  const handleLinkClick = (href: string) => {
    // Close the nav first, then navigate
    setIsHamburgerOpen(false);

    const closeAndNavigate = () => {
      if (href.startsWith("#")) {
        const id = href.slice(1);
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else {
          router.push(`/${href}`);
        }
      } else if (href.startsWith("http") || href.startsWith("mailto")) {
        window.open(href, "_blank", "noopener noreferrer");
      } else {
        router.push(href);
      }
    };

    if (tlRef.current && isExpanded) {
      tlRef.current.eventCallback("onReverseComplete", () => {
        setIsExpanded(false);
        closeAndNavigate();
      });
      tlRef.current.reverse();
    } else {
      setIsExpanded(false);
      closeAndNavigate();
    }
  };

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      const contentEl = navEl.querySelector(".card-nav-content") as HTMLElement;
      if (contentEl) {
        // Temporarily make visible to measure
        const prev = {
          visibility: contentEl.style.visibility,
          pointerEvents: contentEl.style.pointerEvents,
          position: contentEl.style.position,
          height: contentEl.style.height,
        };

        contentEl.style.visibility = "visible";
        contentEl.style.pointerEvents = "auto";
        contentEl.style.position = "static";
        contentEl.style.height = "auto";

        // Force reflow
        contentEl.offsetHeight;

        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        // Restore
        Object.assign(contentEl.style, prev);

        return topBar + contentHeight + padding;
      }
    }
    // Desktop: fixed height
    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: "hidden" });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });
    tl.to(navEl, { height: calculateHeight, duration: 0.4, ease });
    tl.to(
      cardsRef.current,
      { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 },
      "-=0.1"
    );

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;
    return () => {
      tl?.kill();
      tlRef.current = null;
    };
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;
      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) tlRef.current = newTl;
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback("onReverseComplete", () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    /*
      KEY FIX: removed `absolute left-1/2 -translate-x-1/2`
      The wrapper is now a normal block inside the fixed Header.
      Width is controlled by the Header's own padding, so it never
      bleeds beyond the viewport edges on any screen size.
    */
    <div
      className={`card-nav-container w-full flex justify-center px-4 sm:px-6 md:px-8 ${className}`}
    >
      {/*
        w-full + max-w-[800px] + the parent's horizontal padding = pill always
        stays inside the viewport at every screen width, including sub-520px.
      */}
      <nav
        ref={navRef}
        className={`card-nav ${
          isExpanded ? "open" : ""
        } w-full max-w-[800px] block h-[60px] p-0 rounded-xl shadow-md relative overflow-hidden will-change-[height]`}
        style={{ backgroundColor: baseColor, maxWidth: 'min(800px, calc(100vw - 32px))' }}
      >
        {/* ── Top bar ── */}
        <div className="card-nav-top absolute inset-x-0 top-0 h-[60px] flex items-center justify-between px-3 sm:px-4 z-[2]">
          
          {/* Logo — always visible, centered on desktop via absolute positioning */}
          <div
            className="logo-container flex items-center md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 cursor-pointer font-bold tracking-wide text-xs sm:text-sm md:text-base truncate"
            style={{ color: menuColor || "#fff" }}
            onClick={() => handleLinkClick("#home")}
          >
            UMER AHMED
          </div>

          {/* Hamburger — right side on mobile, left side on desktop */}
          <div
            className={`hamburger-menu ${
              isHamburgerOpen ? "open" : ""
            } group h-full flex flex-col items-center justify-center cursor-pointer gap-[6px] order-last md:order-first`}
            onClick={toggleMenu}
            role="button"
            aria-label={isExpanded ? "Close menu" : "Open menu"}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && toggleMenu()}
            style={{ color: menuColor || "#000" }}
          >
            <div
              className={`hamburger-line w-[26px] h-[2px] bg-current transition-[transform,opacity] duration-300 ease-linear origin-center ${
                isHamburgerOpen ? "translate-y-[4px] rotate-45" : ""
              } group-hover:opacity-75`}
            />
            <div
              className={`hamburger-line w-[26px] h-[2px] bg-current transition-[transform,opacity] duration-300 ease-linear origin-center ${
                isHamburgerOpen ? "-translate-y-[4px] -rotate-45" : ""
              } group-hover:opacity-75`}
            />
          </div>

          {/* CTA — desktop only */}
          <button
            type="button"
            onClick={() => handleLinkClick("/contact")}
            className="hidden md:inline-flex items-center border-0 rounded-[calc(0.75rem-0.2rem)] px-4 h-[calc(100%-12px)] font-medium cursor-pointer transition-colors duration-300 text-sm"
            style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
          >
            Contact Us
          </button>
        </div>

        {/* ── Expanded card content ── */}
        <div
          className={`card-nav-content absolute left-0 right-0 top-[60px] bottom-0 p-2 flex flex-col items-stretch gap-2 z-[1]
            ${isExpanded ? "visible pointer-events-auto" : "invisible pointer-events-none"}
            md:flex-row md:items-end md:gap-3`}
          aria-hidden={!isExpanded}
        >
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              ref={setCardRef(idx)}
              className="nav-card select-none flex flex-col gap-2 p-3 rounded-[calc(0.75rem-0.2rem)] flex-1 min-h-[60px] md:h-full md:min-h-0"
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="nav-card-label font-normal tracking-[-0.5px] text-base md:text-[22px]">
                {item.label}
              </div>
              <div className="nav-card-links mt-auto flex flex-col gap-[2px]">
                {item.links?.map((lnk, i) => {
                  const IconComponent = lnk.icon;
                  return (
                    <button
                      key={`${lnk.label}-${i}`}
                      onClick={() => handleLinkClick(lnk.href)}
                      aria-label={lnk.ariaLabel}
                      className="nav-card-link inline-flex items-center gap-[6px] no-underline cursor-pointer transition-opacity duration-300 hover:opacity-75 text-sm md:text-[16px] text-left bg-transparent border-0 p-0"
                      style={{ color: item.textColor }}
                    >
                      {IconComponent ? (
                        <IconComponent
                          className="nav-card-link-icon shrink-0"
                          aria-hidden="true"
                        />
                      ) : (
                        <GoArrowUpRight
                          className="nav-card-link-icon shrink-0"
                          aria-hidden="true"
                        />
                      )}
                      {lnk.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;