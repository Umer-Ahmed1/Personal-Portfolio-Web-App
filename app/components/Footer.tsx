// components/Footer.tsx
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
} as const;

export default function Footer() {
  return (
    <footer className="bg-[#222222] text-white w-screen">
      <div className="max-w-425 mx-auto px-6 md:px-8 lg:px-12">
        <motion.div
          className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 lg:gap-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {/* Column 1: Name + Socials */}
          <motion.div variants={fadeInUp} className="space-y-8 justify-around flex flex-col">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Umer Ahmed
            </h2>

            <div className="flex justify-around max-w-45 mx-0">
              <SocialIcon href="#" icon={<FaFacebookF size={20} />} label="Facebook" />
              <SocialIcon href="#" icon={<FaInstagram size={20} />} label="Instagram" />
              <SocialIcon href="#" icon={<FaLinkedinIn size={20} />} label="LinkedIn" />
            </div>
          </motion.div>

          {/* Column 2: About */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-xl font-semibold mb-6">About</h3>
            <ul className="space-y-3 text-gray-300">
              <li><FooterLink href="#">Home</FooterLink></li>
              <li><FooterLink href="#">About Me</FooterLink></li>
              <li><FooterLink href="#">Explore My Portfolio</FooterLink></li>
              <li><FooterLink href="#">Project Management Portal</FooterLink></li>
              <li><FooterLink href="#">Contact</FooterLink></li>
            </ul>
          </motion.div>

          {/* Column 3: Services */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-xl font-semibold mb-6">Services</h3>
            <ul className="space-y-3 text-gray-300">
              <li>UX/UI Design</li>
              <li>Full-Stack Development</li>
              <li>Project Management</li>
              <li>Systems Architecture</li>
            </ul>
          </motion.div>

          {/* Column 4: Contact */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-xl font-semibold mb-6">Contact</h3>
            <ul className="space-y-3 text-gray-300">
              <li>+92-301 824 2245</li>
              <li>
                <a
                  href="mailto:umerahmedwork4@gmail.com"
                  className="hover:text-[#b42a2a] transition-colors wrap-break-word"
                >
                  umerahmedwork4@gmail.com
                </a>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Divider – matches content width */}
        <div className="border-t border-gray-700" />

        {/* Bottom bar */}
        <div className="py-6 text-sm  flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            © {new Date().getFullYear()} Umer Ahmed. All Rights Reserved.
          </div>
          <div className="flex gap-6">
            <FooterLink href="#">Terms</FooterLink>
            <FooterLink href="#">Privacy</FooterLink>
            <FooterLink href="#">Cookies</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Reusable components
function SocialIcon({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="text-white border border-white rounded-full hover:bg-[#b42a2a] hover:border-[#b42a2a] transition-colors duration-200 p-2"
    >
      {icon}
    </a>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="hover:text-[#b42a2a] transition-colors">
      {children}
    </a>
  );
}