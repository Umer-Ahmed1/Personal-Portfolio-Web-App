// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

// export default function Header() {
//   const [isOpen, setIsOpen] = useState(false);
//   const pathname = usePathname();
//   const router = useRouter();


//   return (
//     <header className="bg-[#222222] text-[#EEEEEE] fixed w-screen z-50 shadow-md">
//       <div className="max-w-425 mx-auto px-6 3xl:px-0 py-4 flex items-center justify-between">

//         {/* Left */}
//         <div className="text-xl font-bold cursor-pointer" onClick={() => handleScroll("home")}>
//           Umer Ahmed
//         </div>

//         {/* Desktop Nav */}
//         <nav className="hidden md:flex space-x-8 text-sm font-medium">

//           <button onClick={() => handleScroll("home")} className="hover:text-[#B42A2A] transition cursor-pointer">
//             Home
//           </button>

//           <button onClick={() => handleScroll("about")} className="hover:text-[#B42A2A] transition cursor-pointer">
//             About
//           </button>

//           <Link href="/explore" className="hover:text-[#B42A2A] transition cursor-pointer">
//             Explore My Portfolio
//           </Link>

//           <Link href="/status" className="hover:text-[#B42A2A] transition cursor-pointer">
//             Project Status
//           </Link>

//         </nav>

//         {/* Contact Button */}
//         <div className="hidden md:block">
//           <Link
//             href="/contact"
//             className="border border-[#B42A2A] px-4 py-2 rounded-2xl hover:bg-[#B42A2A] hover:text-[#EEEEEE] transition cursor-pointer"
//           >
//             Contact
//           </Link>
//         </div>

//         {/* Hamburger */}
//         <button
//           className="md:hidden flex flex-col justify-center items-center w-8 h-8"
//           onClick={() => setIsOpen(!isOpen)}
//         >
//           <span className={`block h-0.5 w-6 bg-[#EEEEEE] transition ${isOpen ? "rotate-45 translate-y-1.5" : ""}`} />
//           <span className={`block h-0.5 w-6 bg-[#EEEEEE] my-1 transition ${isOpen ? "opacity-0" : ""}`} />
//           <span className={`block h-0.5 w-6 bg-[#EEEEEE] transition ${isOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       <div className={`md:hidden bg-[#222222] overflow-hidden transition-all duration-500 ${isOpen ? "max-h-96 py-6" : "max-h-0"}`}>
//         <div className="flex flex-col items-center space-y-6 text-sm font-medium">

//           <button onClick={() => handleScroll("home")}>Home</button>
//           <button onClick={() => handleScroll("about")}>About</button>

//           <Link href="/explore" onClick={() => setIsOpen(false)}>
//             Explore My Portfolio
//           </Link>

//           <Link href="/status" onClick={() => setIsOpen(false)}>
//             Project Status
//           </Link>

//           <Link
//             href="/contact"
//             onClick={() => setIsOpen(false)}
//             className="border border-[#EEEEEE] px-4 py-2 rounded-full"
//           >
//             Contact
//           </Link>
// <div className="flex gap-6 pt-4">

//   <Link href="#" className="text-xl">
//     <FaFacebookF />
//   </Link>

//   <Link href="#" className="text-xl">
//     <FaInstagram />
//   </Link>

//   <Link href="#" className="text-xl">
//     <FaLinkedinIn />
//   </Link>

// </div>
//         </div>
//       </div>
//     </header>
//   );
// }
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
        // Scrolling down — hide
        header.style.transform = "translateY(-120%)";
        header.style.opacity = "0";
      } else if (diff < -5) {
        // Scrolling up — show
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
        {
          label: "About Me",
          ariaLabel: "About Me",
          href: "#about",
        },
      ],
    },
    {
      label: "Projects",
      bgColor: "#fff",
      textColor: "#B42A2A",
      links: [
        {
          label: "Portfolio",
          ariaLabel: "Explore My Portfolio",
          href: "/explore",
        },
        {
          label: "Status Update",
          ariaLabel: "Project Status",
          href: "/status",
        },
      ],
    },
    {
      label: "Contact",
      bgColor: "#fff",
      textColor: "#B42A2A",
      links: [
        {
          label: "Contact Us",
          ariaLabel: "Contact Us",
          href: "/contact",
        },
        {
          label: "Facebook",
          ariaLabel: "Facebook",
          href: "https://facebook.com",
          icon: FaFacebookF,
        },
        {
          label: "Instagram",
          ariaLabel: "Instagram",
          href: "https://instagram.com",
          icon: FaInstagram,
        },
        {
          label: "Twitter",
          ariaLabel: "Twitter / X",
          href: "https://twitter.com",
          icon: FaXTwitter,
        },
      ],
    },
  ];

  return (
    <div
      ref={headerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
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