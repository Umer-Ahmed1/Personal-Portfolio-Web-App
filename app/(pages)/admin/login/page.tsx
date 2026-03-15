"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import FloatingLines from "@/components/FloatingLines";

const FL_ENABLED_WAVES: Array<"top"|"middle"|"bottom"> = ["middle","bottom"];
const FL_LINE_COUNT    = [14, 8];
const FL_LINE_DISTANCE = [38, 55];
const FL_GRADIENT      = ["#1a0000","#4a0a0a","#8b1010","#B42A2A","#e63030","#ff5a3c"];
const FL_MIDDLE_WAVE   = { x: 3.0, y: 0.0,  rotate:  0.15 };
const FL_BOTTOM_WAVE   = { x: 1.5, y: -0.5, rotate: -0.8  };

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleLogin() {
    if (!username || !password) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Invalid credentials.");
        return;
      }
      router.push("/admin");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleLogin();
  }

  const canLogin = username.trim() && password.trim() && !loading;

  return (
    <div className="relative min-h-screen bg-[#1e1e1e] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <FloatingLines
          enabledWaves={FL_ENABLED_WAVES} lineCount={FL_LINE_COUNT}
          lineDistance={FL_LINE_DISTANCE} bendRadius={20} bendStrength={1.2}
          interactive={false} parallax={false} animationSpeed={0.7}
          linesGradient={FL_GRADIENT} mixBlendMode="screen"
          middleWavePosition={FL_MIDDLE_WAVE} bottomWavePosition={FL_BOTTOM_WAVE}
        />
      </div>
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 20%, rgba(8,0,0,0.7) 100%)" }} />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22,1,0.36,1] }}
        className="relative z-[2] w-full max-w-[400px] mx-4 overflow-hidden"
        style={{ background: "rgba(26,26,26,0.92)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>

        <div className="h-1 bg-[#e63030]" />

        <div className="p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-[#e63030] flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div>
              <h1 className="font-syne font-bold text-[20px] text-white leading-tight">Admin Access</h1>
              <p className="text-[12px] text-white/40">Portfolio dashboard</p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-[2px] text-white/40">Username</label>
              <input value={username} onChange={e => setUsername(e.target.value)} onKeyDown={onKey}
                className="bg-[#222] border border-white/10 text-white text-[14px] px-4 py-3 outline-none focus:border-[#e63030] transition-colors"
                placeholder="admin" autoComplete="username" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-[2px] text-white/40">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={onKey}
                className="bg-[#222] border border-white/10 text-white text-[14px] px-4 py-3 outline-none focus:border-[#e63030] transition-colors"
                placeholder="••••••••" autoComplete="current-password" />
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-[#f87171] text-[13px]">
                {error}
              </motion.p>
            )}

            <motion.button onClick={handleLogin} disabled={!canLogin}
              whileHover={canLogin ? { scale: 1.02 } : {}}
              whileTap={canLogin ? { scale: 0.98 } : {}}
              className={`py-3.5 font-bold text-[14px] flex items-center justify-center gap-2 transition-all mt-2 ${
                canLogin ? "bg-[#e63030] text-white hover:bg-[#c72020] cursor-pointer" : "bg-white/10 text-white/25 cursor-not-allowed"
              }`}>
              {loading ? (
                <>
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block" />
                  Logging in...
                </>
              ) : "Log In"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}