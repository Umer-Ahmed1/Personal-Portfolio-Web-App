"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingLines from "@/components/FloatingLines";

// ── Types ─────────────────────────────────────────────────────────────────────
type ModuleStatus  = "Not Started" | "In Progress" | "In Review" | "Completed";
type ModuleName    = "Design" | "Development" | "SEO" | "Deployment";
type OverallStatus = "Not Started" | "In Progress" | "In Review" | "Completed" | "On Hold";

interface Module  { name: ModuleName; status: ModuleStatus; order: number; }
interface Project {
  _id:           string;
  clientId:      string;
  projectName:   string;
  clientName:    string;
  startDate:     string;
  expectedDate:  string;
  overallStatus: OverallStatus;
  modules:       Module[];
  createdAt:     string;
}

// ── Stable FloatingLines constants ────────────────────────────────────────────
const FL_ENABLED_WAVES: Array<"top"|"middle"|"bottom"> = ["middle","bottom"];
const FL_LINE_COUNT    = [14, 8];
const FL_LINE_DISTANCE = [38, 55];
const FL_GRADIENT      = ["#1a0000","#4a0a0a","#8b1010","#B42A2A","#e63030","#ff5a3c"];
const FL_MIDDLE_WAVE   = { x: 3.0, y: 0.0,  rotate:  0.15 };
const FL_BOTTOM_WAVE   = { x: 1.5, y: -0.5, rotate: -0.8  };

const EASE = [0.22, 1, 0.36, 1] as [number,number,number,number];

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<ModuleStatus, { color: string; bg: string; border: string; dot: string }> = {
  "Not Started": { color: "text-white/40",   bg: "bg-white/5",        border: "border-white/10",       dot: "bg-white/30"    },
  "In Progress": { color: "text-blue-300",   bg: "bg-blue-500/10",    border: "border-blue-500/30",    dot: "bg-blue-400"    },
  "In Review":   { color: "text-yellow-300", bg: "bg-yellow-500/10",  border: "border-yellow-500/30",  dot: "bg-yellow-400"  },
  "Completed":   { color: "text-green-300",  bg: "bg-green-500/10",   border: "border-green-500/30",   dot: "bg-green-400"   },
};

const OVERALL_CONFIG: Record<OverallStatus, { color: string; bg: string }> = {
  "Not Started": { color: "text-white/50",   bg: "bg-white/10"        },
  "In Progress": { color: "text-blue-300",   bg: "bg-blue-500/20"     },
  "In Review":   { color: "text-yellow-300", bg: "bg-yellow-500/20"   },
  "Completed":   { color: "text-green-300",  bg: "bg-green-500/20"    },
  "On Hold":     { color: "text-orange-300", bg: "bg-orange-500/20"   },
};

const MODULE_ICONS: Record<ModuleName, React.ReactNode> = {
  Design: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/>
    </svg>
  ),
  Development: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  SEO: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Deployment: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
};

// ── Kanban column ─────────────────────────────────────────────────────────────
function KanbanColumn({
  status, modules, index,
}: {
  status: ModuleStatus;
  modules: Module[];
  index: number;
}) {
  const cfg = STATUS_CONFIG[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay: index * 0.08 }}
      className={`flex flex-col rounded-none border ${cfg.border} ${cfg.bg} min-h-[180px]`}
    >
      {/* Column header */}
      <div className={`flex items-center gap-2.5 px-4 py-3 border-b ${cfg.border}`}>
        <span className={`w-2 h-2 rounded-full ${cfg.dot} shrink-0`} />
        <span className={`text-[12px] font-semibold uppercase tracking-[1.5px] ${cfg.color}`}>
          {status}
        </span>
        <span className={`ml-auto text-[11px] font-bold ${cfg.color} opacity-60`}>
          {modules.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2 p-3 flex-1">
        {modules.length === 0 ? (
          <div className="flex items-center justify-center flex-1 py-6">
            <span className="text-[12px] text-white/15">No modules</span>
          </div>
        ) : (
          modules.map((mod, i) => (
            <motion.div
              key={mod.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.08 + i * 0.05, ease: EASE }}
              className="bg-black/20 border border-white/[0.06] p-4 flex flex-col gap-2"
            >
              <div className={`flex items-center gap-2 ${cfg.color}`}>
                {MODULE_ICONS[mod.name]}
                <span className="text-[14px] font-semibold text-white">{mod.name}</span>
              </div>
              <div className={`text-[11px] font-medium px-2 py-1 rounded-full w-fit ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                {status}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

// ── Login form ────────────────────────────────────────────────────────────────
function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [clientId, setClientId] = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleLogin() {
    if (!clientId.trim() || !password.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/client/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: clientId.trim(), password: password.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Invalid credentials."); return; }
      onSuccess();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleLogin();
  }

  const canLogin = clientId.trim() && password.trim() && !loading;

  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="w-full max-w-[420px] mx-4 overflow-hidden"
      style={{
        background: "rgba(26,26,26,0.92)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="h-1 bg-[#e63030]" />
      <div className="p-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-[#e63030] flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <rect x="2" y="3" width="20" height="14" rx="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <div>
              <h1 className="font-syne font-bold text-[20px] text-white leading-tight">
                Project Status
              </h1>
              <p className="text-[12px] text-white/40">Track your project progress</p>
            </div>
          </div>
          <p className="text-[13px] text-white/40 leading-relaxed">
            Enter the Project ID and password shared by Umer Ahmed to view your project.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {/* Project ID */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-[2px] text-white/40">
              Project ID
            </label>
            <input
              value={clientId}
              onChange={e => setClientId(e.target.value.toUpperCase())}
              onKeyDown={onKey}
              className="bg-[#222] border border-white/10 text-white text-[14px] px-4 py-3 outline-none focus:border-[#e63030] transition-colors font-mono tracking-[2px]"
              placeholder="UA-2024-XXXX"
              autoComplete="username"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-[2px] text-white/40">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={onKey}
              className="bg-[#222] border border-white/10 text-white text-[14px] px-4 py-3 outline-none focus:border-[#e63030] transition-colors"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-[#f87171] text-[13px]"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            onClick={handleLogin}
            disabled={!canLogin}
            whileHover={canLogin ? { scale: 1.02 } : {}}
            whileTap={canLogin  ? { scale: 0.98 } : {}}
            className={`py-3.5 font-bold text-[14px] flex items-center justify-center gap-2 transition-all mt-1 ${
              canLogin
                ? "bg-[#e63030] text-white hover:bg-[#c72020] cursor-pointer"
                : "bg-white/10 text-white/25 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
                />
                Logging in...
              </>
            ) : "View My Project"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ project, onLogout }: { project: Project; onLogout: () => void }) {
  const KANBAN_COLS: ModuleStatus[] = ["Not Started","In Progress","In Review","Completed"];
  const overallCfg = OVERALL_CONFIG[project.overallStatus];

  // Group modules by status
  const grouped = KANBAN_COLS.reduce<Record<ModuleStatus, Module[]>>(
    (acc, col) => {
      acc[col] = project.modules.filter(m => m.status === col).sort((a,b) => a.order - b.order);
      return acc;
    },
    { "Not Started": [], "In Progress": [], "In Review": [], "Completed": [] }
  );

  // Progress — % of completed modules
  const completedCount = project.modules.filter(m => m.status === "Completed").length;
  const totalCount     = project.modules.length;
  const progressPct    = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="w-full max-w-[1200px] mx-4"
    >
      {/* Header card */}
      <div
        className="mb-6 p-6 sm:p-8 overflow-hidden relative"
        style={{
          background: "rgba(26,26,26,0.92)",
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="h-1 bg-[#e63030] absolute top-0 left-0 right-0" />

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mt-2">
          <div className="flex-1">
            <p className="text-[11px] text-white/30 uppercase tracking-[2px] mb-1">Project</p>
            <h1 className="font-syne font-bold text-[24px] sm:text-[28px] text-white leading-tight mb-1">
              {project.projectName}
            </h1>
            <p className="text-[13px] text-white/50">Hi, {project.clientName} 👋</p>
          </div>

          <div className="flex flex-wrap gap-3 items-start">
            <span className={`text-[12px] font-semibold px-4 py-2 ${overallCfg.bg} ${overallCfg.color}`}>
              {project.overallStatus}
            </span>
            <button
              onClick={onLogout}
              className="text-[12px] text-white/40 border border-white/10 px-4 py-2 hover:border-white/30 hover:text-white transition-all"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Dates + progress */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-[11px] text-white/30 uppercase tracking-[2px] mb-1">Start Date</p>
            <p className="text-[14px] text-white/80">{project.startDate}</p>
          </div>
          <div>
            <p className="text-[11px] text-white/30 uppercase tracking-[2px] mb-1">Expected Completion</p>
            <p className="text-[14px] text-white/80">{project.expectedDate}</p>
          </div>
          <div>
            <p className="text-[11px] text-white/30 uppercase tracking-[2px] mb-1">
              Progress — {completedCount}/{totalCount} modules
            </p>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#e63030] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 1, ease: EASE, delay: 0.3 }}
                />
              </div>
              <span className="text-[13px] font-semibold text-white/60 shrink-0">{progressPct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban board */}
      <div
        className="p-5 sm:p-6"
        style={{
          background: "rgba(26,26,26,0.88)",
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(16px)",
        }}
      >
        <p className="text-[11px] text-white/30 uppercase tracking-[2px] mb-5">Module Progress</p>

        {project.modules.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-white/20 text-[14px]">No modules have been added yet.</p>
          </div>
        ) : (
          // 4 columns on desktop, 1 on mobile (stacked)
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {KANBAN_COLS.map((col, i) => (
              <KanbanColumn key={col} status={col} modules={grouped[col]} index={i} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function StatusPage() {
  const [view,    setView]    = useState<"loading"|"login"|"dashboard">("loading");
  const [project, setProject] = useState<Project | null>(null);

  // On mount — check if already logged in
  useEffect(() => {
    fetch("/api/client/project")
      .then(async res => {
        if (res.ok) {
          const data = await res.json();
          setProject(data);
          setView("dashboard");
        } else {
          setView("login");
        }
      })
      .catch(() => setView("login"));
  }, []);

  async function handleLoginSuccess() {
    const res  = await fetch("/api/client/project");
    const data = await res.json();
    setProject(data);
    setView("dashboard");
  }

  async function handleLogout() {
    await fetch("/api/client/logout", { method: "POST" });
    setProject(null);
    setView("login");
  }

  return (
    <div className="relative min-h-screen bg-[#1e1e1e] flex items-center justify-center overflow-hidden py-20">

      {/* FloatingLines background */}
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

      {/* Content */}
      <div className="relative z-[2] w-full flex items-center justify-center">
        <AnimatePresence mode="wait">

          {view === "loading" && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-white/20 border-t-[#e63030] rounded-full"
              />
            </motion.div>
          )}

          {view === "login" && (
            <LoginForm key="login" onSuccess={handleLoginSuccess} />
          )}

          {view === "dashboard" && project && (
            <Dashboard key="dashboard" project={project} onLogout={handleLogout} />
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}