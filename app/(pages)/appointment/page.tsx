"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface BookingProps {
  modal?: boolean;
  toEmail?: string;
}

const DAYS_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const TIME_SLOTS = [
  "9:00 AM",  "9:30 AM",  "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "1:00 PM",  "1:30 PM",  "2:00 PM",  "2:30 PM",
  "3:00 PM",  "3:30 PM",  "4:00 PM",  "4:30 PM",
  "5:00 PM",
];

const TIMEZONES = [
  "Pacific/Honolulu", "America/Anchorage", "America/Los_Angeles",
  "America/Denver", "America/Chicago", "America/New_York",
  "America/Sao_Paulo", "Europe/London", "Europe/Paris",
  "Europe/Istanbul", "Asia/Dubai", "Asia/Karachi",
  "Asia/Kolkata", "Asia/Dhaka", "Asia/Bangkok",
  "Asia/Shanghai", "Asia/Tokyo", "Australia/Sydney",
];

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function DemoCallBooking({
  modal = false,
  toEmail = "umerahmedwork4@gmail.com",
}: BookingProps) {
  const today = new Date();

  const [isOpen, setIsOpen] = useState(!modal);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(today.getDate());
  const [selectedTime, setSelectedTime] = useState<string | null>("10:00 AM");
  const [timezone, setTimezone] = useState("Asia/Karachi");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [hoveredTime, setHoveredTime] = useState<string | null>(null);

  const calendarCells = useMemo(() => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [viewYear, viewMonth]);

  const yearRange = useMemo(() => {
    const years: number[] = [];
    for (let y = today.getFullYear() - 2; y <= today.getFullYear() + 5; y++) years.push(y);
    return years;
  }, []);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }
  function isToday(day: number) {
    return day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
  }
  function isPast(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d < t;
  }

  async function handleConfirm() {
    if (!selectedDate || !selectedTime || !name.trim() || !email.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          date: `${MONTH_NAMES[viewMonth]} ${selectedDate}, ${viewYear}`,
          time: selectedTime,
          timezone,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Server error");
      }
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  useEffect(() => {
    if (!showYearPicker) return;
    const handler = () => setShowYearPicker(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [showYearPicker]);

  const isConfirmDisabled =
    !selectedDate || !selectedTime || !name.trim() || !email.trim() || status === "sending";

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.97 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-[1080px] overflow-hidden"
      style={{ background: "rgba(28,28,28,0.85)", backdropFilter: "blur(12px)", border: "1px solid rgba(230,48,48,0.15)" }}
    >
      <div className="relative z-10 flex flex-col lg:flex-row gap-0">

        {/* ── LEFT PANEL ── */}
        <div className="lg:w-[280px] flex-shrink-0 p-8 flex flex-col gap-6 border-r border-white/[0.07]">
          <div>
            <h2 className="font-syne font-bold text-[26px] text-white mb-1 leading-tight">
              Demo Call
            </h2>
            <p className="text-[13px] text-white/50 leading-relaxed">
              Feel free to discuss your project with us
            </p>
          </div>
          <div className="flex items-center gap-2 text-white/60 text-[13px]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <span>30 min</span>
          </div>
          <p className="text-[13px] text-white/40 leading-[1.8]">
            Ready to see it in action? Pick a time that works for you, and let&apos;s
            chat about how I can help you reach your goals.
          </p>
          <div className="h-px bg-white/[0.07] my-1" />
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-white/50 uppercase tracking-[1.5px]">Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Joe Doe"
              className="bg-transparent border-b border-white/20 text-white text-[14px] py-2 outline-none placeholder:text-white/25 focus:border-[#e63030] transition-colors duration-200" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-white/50 uppercase tracking-[1.5px]">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Joe@example.com"
              className="bg-transparent border-b border-white/20 text-white text-[14px] py-2 outline-none placeholder:text-white/25 focus:border-[#e63030] transition-colors duration-200" />
          </div>
        </div>

        {/* ── CENTER: CALENDAR ── */}
        <div className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <motion.button whileTap={{ scale: 0.9 }} onClick={prevMonth}
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:border-white/40 hover:text-white transition-all duration-200">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
            </motion.button>
            <div className="flex items-center gap-2">
              <select value={viewMonth} onChange={e => setViewMonth(Number(e.target.value))}
                className="bg-transparent text-white text-[16px] font-semibold font-syne outline-none cursor-pointer border-none appearance-none pr-1">
                {MONTH_NAMES.map((m, i) => (
                  <option key={m} value={i} style={{ background: "#1c1c1c" }}>{m}</option>
                ))}
              </select>
              <div className="relative" onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowYearPicker(v => !v)}
                  className="flex items-center gap-1.5 text-white text-[16px] font-semibold font-syne hover:text-[#e63030] transition-colors">
                  {viewYear}
                  <motion.svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5"
                    animate={{ rotate: showYearPicker ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <polyline points="6 9 12 15 18 9" />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {showYearPicker && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
                      className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 rounded-lg overflow-hidden border border-white/10"
                      style={{ background: "#252525", boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}>
                      {yearRange.map(y => (
                        <button key={y} onClick={() => { setViewYear(y); setShowYearPicker(false); }}
                          className={`w-full px-6 py-2 text-[14px] text-left transition-colors duration-150 ${y === viewYear ? "bg-[#e63030] text-white font-semibold" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
                          {y}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <motion.button whileTap={{ scale: 0.9 }} onClick={nextMonth}
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white hover:border-white/40 transition-all duration-200 bg-white/10">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
            </motion.button>
          </div>

          <div className="grid grid-cols-7 mb-3">
            {DAYS_OF_WEEK.map(d => (
              <div key={d} className="text-center text-[11px] font-semibold text-white/30 tracking-[1px] py-1">{d}</div>
            ))}
          </div>

          <motion.div key={`${viewYear}-${viewMonth}`}
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="grid grid-cols-7 gap-y-1">
            {calendarCells.map((day, idx) => {
              if (!day) return <div key={idx} />;
              const past = isPast(day);
              const todayDate = isToday(day);
              const selected = selectedDate === day;
              return (
                <motion.button key={idx} whileHover={!past ? { scale: 1.15 } : {}}
                  whileTap={!past ? { scale: 0.95 } : {}}
                  onClick={() => !past && setSelectedDate(day)} disabled={past}
                  className={`relative flex items-center justify-center h-10 w-10 mx-auto rounded-full text-[14px] font-medium transition-all duration-200
                    ${past ? "text-white/15 cursor-not-allowed" : "cursor-pointer"}
                    ${selected ? "bg-[#e63030] text-white font-bold" : ""}
                    ${!selected && todayDate ? "text-[#e63030]" : ""}
                    ${!selected && !past ? "text-white/75 hover:text-white hover:bg-white/10" : ""}`}>
                  {todayDate && !selected && (
                    <span className="absolute inset-0 rounded-full ring-2 ring-[#e63030] ring-offset-0 opacity-60" />
                  )}
                  {day}
                </motion.button>
              );
            })}
          </motion.div>

          <div className="flex items-center gap-3 mt-7 pt-5 border-t border-white/[0.07]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40 flex-shrink-0">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span className="text-[13px] text-white/40 flex-shrink-0">Time Zone:</span>
            <select value={timezone} onChange={e => setTimezone(e.target.value)}
              className="flex-1 border border-white/15 rounded-md text-white text-[13px] px-3 py-1.5 outline-none cursor-pointer appearance-none hover:border-white/30 focus:border-[#e63030] transition-colors duration-200"
              style={{ background: "rgba(255,255,255,0.04)" }}>
              {TIMEZONES.map(tz => (
                <option key={tz} value={tz} style={{ background: "#1c1c1c" }}>{tz}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── RIGHT: TIME SLOTS + CONFIRM ── */}
        <div data-lenis-prevent className="lg:w-[160px] flex-shrink-0 p-6 flex flex-col border-l border-white/[0.07]">
          <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1"
            style={{ maxHeight: "380px", scrollbarWidth: "thin", scrollbarColor: "#e63030 transparent" }}>
            {TIME_SLOTS.map(slot => {
              const isSelected = selectedTime === slot;
              return (
                <motion.button key={slot} whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTime(slot)}
                  onHoverStart={() => setHoveredTime(slot)}
                  onHoverEnd={() => setHoveredTime(null)}
                  className={`w-full py-2.5 px-3 rounded-md text-[13px] font-medium border transition-all duration-200 text-center cursor-pointer
                    ${isSelected
                      ? "bg-[#e63030] border-[#e63030] text-white"
                      : "border-white/15 text-white/70 hover:border-[#e63030] hover:text-white hover:bg-[#e63030]/10"}`}>
                  {slot}
                </motion.button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-white/[0.07]">
            <AnimatePresence mode="wait">
              {status === "sent" ? (
                <motion.div key="sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-3">
                  <div className="text-[#4ade80] text-[13px] font-semibold mb-1">✓ Booked!</div>
                  <div className="text-[11px] text-white/40">Check your email</div>
                </motion.div>
              ) : status === "error" ? (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-2">
                  <div className="text-[#f87171] text-[12px]">Error — try again</div>
                  <button onClick={() => setStatus("idle")} className="text-[11px] text-white/40 underline mt-1">Retry</button>
                </motion.div>
              ) : (
                <motion.button key="confirm" onClick={handleConfirm} disabled={isConfirmDisabled}
                  whileHover={!isConfirmDisabled ? { scale: 1.03 } : {}}
                  whileTap={!isConfirmDisabled ? { scale: 0.97 } : {}}
                  className={`w-full py-3 rounded-md text-[14px] font-bold tracking-[0.3px] transition-all duration-200
                    ${isConfirmDisabled ? "bg-white/10 text-white/25 cursor-not-allowed" : "bg-[#e63030] text-white hover:bg-[#c72020] cursor-pointer"}`}>
                  {status === "sending" ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                      Sending...
                    </span>
                  ) : "Confirm"}
                </motion.button>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {selectedDate && selectedTime && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }} className="mt-3 overflow-hidden">
                  <div className="text-[11px] text-white/30 text-center leading-relaxed">
                    {MONTH_NAMES[viewMonth].slice(0, 3)} {selectedDate}<br />
                    {selectedTime}<br />
                    <span className="text-white/20">{timezone.split("/")[1]?.replace("_", " ")}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </motion.div>
  );

  // ── Modal mode ──────────────────────────────────────────────────────────────
  if (modal) {
    return (
      <>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={() => setIsOpen(true)}
          className="bg-[#e63030] text-white text-[13px] font-semibold px-7 py-3 border-2 border-[#e63030] hover:bg-[#c72020] hover:border-[#c72020] transition-all duration-200">
          Book A Strategy Call
        </motion.button>
        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[999] flex items-center justify-center p-4"
              style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
              onClick={() => setIsOpen(false)}>
              <div onClick={e => e.stopPropagation()} className="w-full max-w-[1080px]">
                <div className="flex justify-end mb-3">
                  <button onClick={() => setIsOpen(false)}
                    className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-all">
                    ✕
                  </button>
                </div>
                {card}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4 md:p-8 overflow-hidden">

           <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <Image src="/dp-bg.png" alt="Background" fill priority className="object-cover opacity-100" />
      </div>

      {/* Subtle radial vignette */}
      <div className="absolute inset-0 z-[1] pointer-events-none"  />

      {/* Card sits above everything */}
      <div className="relative z-[2] w-full max-w-[1080px]">
        {card}
      </div>
    </div>
  );
}