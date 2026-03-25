'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import Link from 'next/link';

// ── Cross-page anchor navigation ───────────────────────────────────────────────
// If already on "/", smooth-scroll to the section.
// If on another page, navigate to "/#section" and scroll after hydration.
function useAnchorNav() {
  const router   = useRouter();
  const pathname = usePathname();

  return useCallback(
    (hash: string) => {
      if (pathname === '/') {
        if (hash === 'home') {
          // "home" means top of page
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const el = document.getElementById(hash);
          el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        // Store target, scroll to top immediately, then push home
        sessionStorage.setItem('scrollTo', hash);
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        router.push('/');
      }
    },
    [pathname, router]
  );
}

// On the home page, pick up the stored hash and scroll to it once
export function useScrollOnArival() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname !== '/') return;
    const hash = sessionStorage.getItem('scrollTo');
    if (!hash) return;
    sessionStorage.removeItem('scrollTo');
    // slight delay so the page has rendered
    const t = setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 400);
    return () => clearTimeout(t);
  }, [pathname]);
}

// ── Modal content ──────────────────────────────────────────────────────────────
const MODAL_CONTENT: Record<string, { title: string; body: React.ReactNode }> = {
  terms: {
    title: 'Terms of Use',
    body: (
      <div className="space-y-4 text-white/60 text-[14px] leading-relaxed" data-lenis-prevent >
        <p>By accessing this portfolio website you agree to the following terms. This site is provided for informational and demonstration purposes only.</p>
        <h4 className="text-white font-semibold text-[15px]">Intellectual Property</h4>
        <p>All content, designs, code samples and project descriptions are the intellectual property of Umer Ahmed unless otherwise credited. Reproduction without written permission is prohibited.</p>
        <h4 className="text-white font-semibold text-[15px]">Use of Information</h4>
        <p>Information presented here reflects completed or ongoing projects. Details may be generalised to respect client confidentiality. No warranties are made regarding accuracy or completeness.</p>
        <h4 className="text-white font-semibold text-[15px]">External Links</h4>
        <p>This site may link to third-party websites. Umer Ahmed is not responsible for the content or practices of those external sites.</p>
        <h4 className="text-white font-semibold text-[15px]">Changes</h4>
        <p>These terms may be updated at any time without notice. Continued use of the site constitutes acceptance of the revised terms.</p>
        <p className="text-white/30 text-[12px] pt-2">Last updated: January 2025</p>
      </div>
    ),
  },
  privacy: {
    title: 'Privacy Policy',
    body: (
      <div className="space-y-4 text-white/60 text-[14px] leading-relaxed" data-lenis-prevent>
        <p>Your privacy matters. This policy explains what information is collected when you visit this portfolio and how it is used.</p>
        <h4 className="text-white font-semibold text-[15px]">Information Collected</h4>
        <p>This site does not collect personally identifiable information unless you voluntarily submit it via the contact form. No accounts, logins or tracking profiles are created.</p>
        <h4 className="text-white font-semibold text-[15px]">Contact Form Data</h4>
        <p>If you send a message, your name, email and message content are used solely to respond to your enquiry. This data is never sold or shared with third parties.</p>
        <h4 className="text-white font-semibold text-[15px]">Analytics</h4>
        <p>Basic, anonymised analytics may be used to understand traffic patterns. No personal identifiers are stored or processed.</p>
        <h4 className="text-white font-semibold text-[15px]">Your Rights</h4>
        <p>You may request deletion of any data submitted through the contact form at any time by emailing umerahmedwork4@gmail.com.</p>
        <p className="text-white/30 text-[12px] pt-2">Last updated: January 2025</p>
      </div>
    ),
  },
  cookies: {
    title: 'Cookie Policy',
    body: (
      <div className="space-y-4 text-white/60 text-[14px] leading-relaxed" data-lenis-prevent>
        <p>This website uses a minimal number of cookies to ensure basic functionality and an optimal browsing experience.</p>
        <h4 className="text-white font-semibold text-[15px]">Essential Cookies</h4>
        <p>Strictly necessary cookies may be set to remember session preferences such as scroll position or navigation state. These cannot be disabled as the site would not function correctly without them.</p>
        <h4 className="text-white font-semibold text-[15px]">Analytics Cookies</h4>
        <p>If analytics are enabled, anonymous cookies may be used to understand how visitors interact with the site. No personal data is stored in these cookies.</p>
        <h4 className="text-white font-semibold text-[15px]">Third-Party Cookies</h4>
        <p>Embedded content such as project demos or external links may set their own cookies. Umer Ahmed has no control over third-party cookie behaviour.</p>
        <h4 className="text-white font-semibold text-[15px]">Managing Cookies</h4>
        <p>You can control or delete cookies through your browser settings at any time. Note that disabling cookies may affect certain site features.</p>
        <p className="text-white/30 text-[12px] pt-2">Last updated: January 2025</p>
      </div>
    ),
  },
};

// ── Modal ─────────────────────────────────────────────────────────────────────
function LegalModal({
  id,
  onClose,
}: {
  id: keyof typeof MODAL_CONTENT;
  onClose: () => void;
}) {
  const { title, body } = MODAL_CONTENT[id];

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Card — slides up from bottom on mobile, scales in on desktop */}
      <motion.div
        className="relative w-full max-w-[540px] max-h-[80vh] flex flex-col z-10 overflow-hidden"
        style={{
          background: 'rgba(22,22,22,0.97)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
        }}
        initial={{ y: 80, scale: 0.94, opacity: 0 }}
        animate={{ y: 0,  scale: 1,    opacity: 1 }}
        exit={{   y: 60, scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Red accent top bar */}
        <motion.div
          className="h-[3px] bg-[#e63030] w-full shrink-0"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'left' }}
        />

        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-4 shrink-0 border-b border-white/[0.06]">
          <motion.h2
            className="font-syne font-bold text-[20px] text-white tracking-[-0.3px]"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            {title}
          </motion.h2>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.2 }}
            className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-[#e63030] transition-colors duration-200"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="1" y1="1" x2="11" y2="11" /><line x1="11" y1="1" x2="1" y2="11" />
            </svg>
          </motion.button>
        </div>

        {/* Scrollable body */}
        <motion.div
          className="overflow-y-auto px-7 py-6 flex-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(230,48,48,0.3) transparent',
          }}
        >
          {body}
        </motion.div>

        {/* Footer */}
        <div className="px-7 py-4 shrink-0 border-t border-white/[0.06] flex justify-end">
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-2 bg-[#e63030] text-white text-[13px] font-bold tracking-[0.4px] hover:bg-[#c72020] transition-colors duration-200"
          >
            Got it
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Animations ─────────────────────────────────────────────────────────────────
const fadeInUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
} as const;

// ── Footer ─────────────────────────────────────────────────────────────────────
export default function Footer() {
  const goTo   = useAnchorNav();
  const [modal, setModal] = useState<keyof typeof MODAL_CONTENT | null>(null);

  return (
    <>
      <footer className="bg-[#222222] text-white w-screen">
        <div className="max-w-425 mx-auto px-6 md:px-8 lg:px-12">
          <motion.div
            className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 lg:gap-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={{
              hidden:   {},
              visible:  { transition: { staggerChildren: 0.15 } },
            }}
          >
            {/* Col 1: Name + Socials */}
            <motion.div variants={fadeInUp} className="space-y-8 justify-around flex flex-col">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Umer Ahmed</h2>
              <div className="flex justify-around max-w-45 mx-0">
                <SocialIcon href="#" icon={<FaFacebookF size={20} />} label="Facebook" />
                <SocialIcon href="#" icon={<FaInstagram size={20} />} label="Instagram" />
                <SocialIcon href="#" icon={<FaLinkedinIn size={20} />} label="LinkedIn" />
              </div>
            </motion.div>

            {/* Col 2: About */}
            <motion.div variants={fadeInUp}>
              <h3 className="text-xl font-semibold mb-6">About</h3>
              <ul className="space-y-3 text-gray-300">
                <li><AnchorLink onClick={() => goTo('home')}>Home</AnchorLink></li>
                <li><AnchorLink onClick={() => goTo('about')}>About Me</AnchorLink></li>
                <li><Link className="hover:text-[#b42a2a] transition-colors duration-200" href="/explore">Explore My Portfolio</Link></li>
                <li><Link className="hover:text-[#b42a2a] transition-colors duration-200" href="/status">Project Management Portal</Link></li>
                <li><Link className="hover:text-[#b42a2a] transition-colors duration-200" href="/contact">Contact</Link></li>
              </ul>
            </motion.div>

            {/* Col 3: Services */}
            <motion.div variants={fadeInUp}>
              <h3 className="text-xl font-semibold mb-6">Services</h3>
              <ul className="space-y-3 text-gray-300 text-[15px]">
                <li>UX/UI Design</li>
                <li>Full-Stack Development</li>
                <li>Project Management</li>
                <li>Systems Architecture</li>
              </ul>
            </motion.div>

            {/* Col 4: Contact */}
            <motion.div variants={fadeInUp}>
              <h3 className="text-xl font-semibold mb-6">Contact</h3>
              <ul className="space-y-3 text-gray-300 text-[15px]">
                <li>727-219-1172</li>
                <li>
                  4705 ALT 19 STE A, 34683, Palm Harbor, United States

                </li>
              </ul>
            </motion.div>
          </motion.div>

          <div className="border-t border-gray-700" />

          {/* Bottom bar */}
          <div className="py-6 text-sm flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>© {new Date().getFullYear()} Umer Ahmed. All Rights Reserved.</div>
            <div className="flex gap-6">
              {(['terms', 'privacy', 'cookies'] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setModal(key)}
                  className="capitalize hover:text-[#b42a2a] transition-colors duration-200 cursor-pointer"
                >
                  {key === 'terms' ? 'Terms' : key === 'privacy' ? 'Privacy' : 'Cookies'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {modal && (
          <LegalModal key={modal} id={modal} onClose={() => setModal(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

// ── Small reusable link components ────────────────────────────────────────────
function AnchorLink({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="hover:text-[#b42a2a] transition-colors duration-200 text-left cursor-pointer"
    >
      {children}
    </button>
  );
}

function SocialIcon({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
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