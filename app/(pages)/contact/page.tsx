"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import FloatingLines from "@/components/FloatingLines";

// ── Types ─────────────────────────────────────────────────────────────────────
type Subject = "General Inquiry" | "On-going Project" | "New Project" | "Other";
type Status  = "idle" | "sending" | "sent" | "error";

// ── Stable FloatingLines props (module-level = no re-render flicker) ──────────
const FL_ENABLED_WAVES: Array<"top" | "middle" | "bottom"> = ["middle", "bottom"];
const FL_LINE_COUNT    = [14, 8];
const FL_LINE_DISTANCE = [38, 55];
const FL_GRADIENT      = ["#1a0000","#4a0a0a","#8b1010","#B42A2A","#e63030","#ff5a3c"];
const FL_MIDDLE_WAVE   = { x: 3.0,  y: 0.0,  rotate:  0.15 };
const FL_BOTTOM_WAVE   = { x: 1.5,  y: -0.5, rotate: -0.8  };

// ── Animated underline input ───────────────────────────────────────────────────
function Field({
  label, type = "text", value, onChange, placeholder,
}: {
  label: string; type?: string;
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-[2px] text-white/40">
        {label}
      </label>
      <div className="relative">
        <input
          type={type} value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full bg-transparent text-white text-[14px] pb-2 pt-1 outline-none placeholder:text-white/20 border-b border-white/15"
        />
        <motion.span
          className="absolute bottom-0 left-0 h-[2px] bg-[#e63030] rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: focused ? "100%" : "0%" }}
          transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] as [number,number,number,number] }}
        />
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Contact() {
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [phone,     setPhone]     = useState("");
  const [subject,   setSubject]   = useState<Subject>("General Inquiry");
  const [message,   setMessage]   = useState("");
  const [status,    setStatus]    = useState<Status>("idle");
  const [errorMsg,  setErrorMsg]  = useState("");
  const [msgFocus,  setMsgFocus]  = useState(false);

  const subjects: Subject[] = ["General Inquiry","On-going Project","New Project","Other"];

  const canSubmit =
    firstName.trim() && lastName.trim() &&
    email.trim() && message.trim() && status !== "sending";

  async function handleSubmit() {
    if (!canSubmit) return;
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, phone, subject, message }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Server error");
      }

      setStatus("sent");
      setFirstName(""); setLastName(""); setEmail(""); setPhone(""); setMessage("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section id="contact" className="relative py-20 bg-[#282828] overflow-hidden">

      {/* ── FloatingLines — full section background ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <FloatingLines
          enabledWaves={FL_ENABLED_WAVES}
          lineCount={FL_LINE_COUNT}
          lineDistance={FL_LINE_DISTANCE}
          bendRadius={20}
          bendStrength={1.2}
          interactive={false}
          parallax={false}
          animationSpeed={0.8}
          linesGradient={FL_GRADIENT}
          mixBlendMode="screen"
          middleWavePosition={FL_MIDDLE_WAVE}
          bottomWavePosition={FL_BOTTOM_WAVE}
        />
      </div>

      {/* vignette so card has contrast */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 30%, rgba(10,0,0,0.6) 100%)",
        }}
      />

      <div className="relative z-[2] max-w-[1400px] mx-auto px-6">

        {/* ── HEADING — centered ── */}
        <div className="text-center mb-12">
          <h2 className="font-syne font-extrabold text-[2rem] sm:text-[2.4rem] lg:text-[3rem] tracking-[-1px] text-white leading-tight">
            Contact Us
          </h2>
          <p className="text-[13px] text-white/40 mt-3 leading-relaxed">
            Have a project in mind or just want to say hello?
            Drop a message and I&apos;ll get back to you within 24 hours.
          </p>
        </div>

        {/* ── OUTER CARD — transparent glass wrapper ── */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden"
          style={{
            background: "rgba(20,20,20,0.75)",
            border: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(14px)",
          }}
        >

          {/* ── LEFT: Info panel — inset with #222222, margin inside the card ── */}
          <div className="p-5 flex">
            <div
              className="relative flex flex-col justify-between w-full overflow-hidden"
              style={{
                background: "#222222",
                padding: "2rem",
              }}
            >
              {/* decorative bottom-left glow inside info panel */}
              <div
                className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(230,48,48,0.28) 0%, transparent 70%)",
                }}
              />
              {/* dot overlay on info panel */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(230,48,48,0.6) 1px, transparent 1px)",
                  backgroundSize: "22px 22px",
                }}
              />

              <div className="relative z-10">
                <h3 className="font-syne font-bold text-[22px] text-white mb-2 leading-tight">
                  Contact Information
                </h3>
                <p className="text-[13px] text-white/40 leading-relaxed mb-10">
                  Say something to start a live chat!
                </p>

                <ul className="flex flex-col gap-5">
                  {[
                    {
                      icon: (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.61 5.61l.44-.87a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16z"/>
                        </svg>
                      ),
                      text: "+92-301 8242245",
                    },
                    {
                      icon: (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                      ),
                      text: "umerahmedwork4@gmail.com",
                    },
                    {
                      icon: (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                      ),
                      text: "Karachi, Pakistan",
                    },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-[13px] text-white/70">
                      <span className="w-8 h-8 rounded-full bg-[#e63030]/15 border border-[#e63030]/30 flex items-center justify-center text-[#e63030] shrink-0">
                        {item.icon}
                      </span>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social icons */}
              <div className="relative z-10 flex gap-3 mt-10">
                {[
                  { icon: <FaFacebookF size={13} />, href: "#" },
                  { icon: <FaInstagram size={14} />, href: "#" },
                  { icon: <FaLinkedinIn size={13} />, href: "#" },
                ].map((s, i) => (
                  <a
                    key={i} href={s.href}
                    className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:bg-[#e63030] hover:border-[#e63030] hover:text-white transition-all duration-200"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Form panel — same width as left via grid-cols-2 ── */}
          <div className="p-8 lg:p-10 flex flex-col gap-7">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Field label="First Name" value={firstName} onChange={setFirstName} placeholder="John" />
              <Field label="Last Name"  value={lastName}  onChange={setLastName}  placeholder="Doe"  />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Field label="Email"        type="email" value={email} onChange={setEmail} placeholder="john@example.com" />
              <Field label="Phone Number" type="tel"   value={phone} onChange={setPhone} placeholder="+1 234 567 890"   />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-semibold uppercase tracking-[2px] text-white/40">
                Select Subject
              </label>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {subjects.map(s => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer group">
                    <span
                      onClick={() => setSubject(s)}
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        subject === s
                          ? "border-[#e63030] bg-[#e63030]"
                          : "border-white/30 group-hover:border-white/60"
                      }`}
                    >
                      {subject === s && <span className="w-1.5 h-1.5 rounded-full bg-white block" />}
                    </span>
                    <span
                      onClick={() => setSubject(s)}
                      className={`text-[13px] transition-colors duration-200 ${
                        subject === s ? "text-white" : "text-white/50 group-hover:text-white/75"
                      }`}
                    >
                      {s}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-[2px] text-white/40">
                Message
              </label>
              <div className="relative">
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onFocus={() => setMsgFocus(true)}
                  onBlur={() => setMsgFocus(false)}
                  placeholder="Write your message..."
                  rows={3}
                  className="w-full bg-transparent text-white text-[14px] pb-2 pt-1 outline-none resize-none placeholder:text-white/20 border-b border-white/15"
                />
                <motion.span
                  className="absolute bottom-0 left-0 h-[2px] bg-[#e63030] rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: msgFocus ? "100%" : "0%" }}
                  transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] as [number,number,number,number] }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end mt-2">
              <AnimatePresence mode="wait">
                {status === "sent" ? (
                  <motion.div key="sent"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-[#4ade80] text-[13px] font-semibold">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Message sent! Check your inbox for a confirmation.
                  </motion.div>
                ) : status === "error" ? (
                  <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex items-center gap-3">
                    <span className="text-[#f87171] text-[13px]">{errorMsg || "Something went wrong."}</span>
                    <button onClick={() => setStatus("idle")} className="text-[12px] text-white/40 underline">
                      Retry
                    </button>
                  </motion.div>
                ) : (
                  <motion.button key="submit"
                    onClick={handleSubmit} disabled={!canSubmit}
                    whileHover={canSubmit ? { scale: 1.03 } : {}}
                    whileTap={canSubmit  ? { scale: 0.97 } : {}}
                    className={`px-8 py-3 text-[13px] font-bold tracking-[0.5px] transition-all duration-200 flex items-center gap-2 ${
                      canSubmit
                        ? "bg-[#e63030] text-white hover:bg-[#c72020] cursor-pointer"
                        : "bg-white/10 text-white/30 cursor-not-allowed"
                    }`}
                  >
                    {status === "sending" ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                          className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                      </>
                    )}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}