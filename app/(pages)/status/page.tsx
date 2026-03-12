"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import FloatingLines from "@/components/FloatingLines";

// ── Stable module-level constants — never re-created on render ────────────────
const FL_ENABLED_WAVES: Array<"top" | "middle" | "bottom"> = ["middle", "bottom"];
const FL_LINE_COUNT    = [14, 8];
const FL_LINE_DISTANCE = [38, 55];
const FL_GRADIENT      = ["#1a0000","#4a0a0a","#8b1010","#B42A2A","#e63030","#ff5a3c"];
const FL_MIDDLE_WAVE   = { x: 3.0, y: 0.0,  rotate:  0.15 };
const FL_BOTTOM_WAVE   = { x: 1.5, y: -0.5, rotate: -0.8  };
const VIGNETTE_STYLE: React.CSSProperties = {
  background:
    "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 20%, rgba(8,0,0,0.65) 100%)",
};

// ── Animated underline field ──────────────────────────────────────────────────
function Field({
  label, type = "text", value, onChange, placeholder,
}: {
  label: string; type?: string;
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] text-white/60 font-medium">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full bg-transparent text-white text-[14px] py-2 outline-none placeholder:text-white/20 border-b border-white/15"
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

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const [name,       setName]       = useState("");
  const [email,      setEmail]      = useState("");
  const [remember,   setRemember]   = useState(false);
  const [status,     setStatus]     = useState<"idle"|"loading"|"error">("idle");
  const [errorMsg,   setErrorMsg]   = useState("");

  const canSubmit = name.trim() && email.trim() && status !== "loading";

  async function handleSignIn() {
    if (!canSubmit) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      // wire to your auth endpoint here
      await new Promise(r => setTimeout(r, 1200));
      // router.push("/dashboard");
      setStatus("idle");
    } catch {
      setStatus("error");
      setErrorMsg("Invalid credentials. Please try again.");
    }
  }

  return (
    <div className="relative min-h-screen bg-[#1e1e1e] flex items-center justify-center overflow-hidden">

      {/* ── FloatingLines full background ── */}
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

      {/* vignette */}
      <div className="absolute inset-0 z-[1] pointer-events-none" style={VIGNETTE_STYLE} />

      {/* ── Login Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0,  scale: 1    }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-[2] w-full max-w-[420px] mx-4"
        style={{
          background:    "rgba(26,26,26,0.88)",
          border:        "1px solid rgba(255,255,255,0.07)",
          backdropFilter:"blur(16px)",
          padding:       "2.5rem 2rem",
        }}
      >

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="font-syne font-bold text-[2rem] text-white leading-tight tracking-[-0.5px]">
            Welcome back
          </h1>
          <p className="text-[13px] text-white/40 mt-2 leading-relaxed">
            Please login using the credentials<br />provided by the admin
          </p>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-6">
          <Field
            label="Name"
            value={name}
            onChange={setName}
            placeholder="Joe Doe"
          />
          <Field
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Joe@example.com"
          />
        </div>

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between mt-6">
          <label className="flex items-center gap-2 cursor-pointer group">
            <span
              onClick={() => setRemember(r => !r)}
              className={`w-4 h-4 border flex items-center justify-center transition-all duration-200 shrink-0 ${
                remember
                  ? "bg-[#e63030] border-[#e63030]"
                  : "border-white/30 group-hover:border-white/60"
              }`}
            >
              {remember && (
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5">
                  <polyline points="2 6 5 9 10 3" />
                </svg>
              )}
            </span>
            <span
              onClick={() => setRemember(r => !r)}
              className="text-[13px] text-white/50 group-hover:text-white/75 transition-colors select-none"
            >
              Remember me
            </span>
          </label>

          <button
            onClick={() => {/* handle forgot password */}}
            className="text-[13px] text-white/50 hover:text-[#e63030] transition-colors duration-200 underline underline-offset-2"
          >
            Forgot password
          </button>
        </div>

        {/* Error message */}
        <AnimatePresence>
          {status === "error" && errorMsg && (
            <motion.p
              key="err"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[12px] text-[#f87171] mt-4 text-center"
            >
              {errorMsg}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Sign In button */}
        <motion.button
          onClick={handleSignIn}
          disabled={!canSubmit}
          whileHover={canSubmit ? { scale: 1.02 } : {}}
          whileTap={canSubmit  ? { scale: 0.98 } : {}}
          className={`w-full mt-7 py-3.5 text-[14px] font-bold tracking-[0.8px] transition-all duration-200 flex items-center justify-center gap-2 ${
            canSubmit
              ? "bg-[#e63030] text-white hover:bg-[#c72020] cursor-pointer"
              : "bg-white/10 text-white/25 cursor-not-allowed"
          }`}
        >
          {status === "loading" ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </motion.button>

      </motion.div>
    </div>
  );
}