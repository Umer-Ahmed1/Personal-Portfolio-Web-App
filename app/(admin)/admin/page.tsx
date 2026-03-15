"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// ── Types ─────────────────────────────────────────────────────────────────────
type ModuleName   = "Design" | "Development" | "SEO" | "Deployment";
type ModuleStatus = "Not Started" | "In Progress" | "In Review" | "Completed";
type OverallStatus = "Not Started" | "In Progress" | "In Review" | "Completed" | "On Hold";

interface Module { name: ModuleName; status: ModuleStatus; order: number; }
interface Project {
  _id:           string;
  clientId:      string;
  passwordPlain: string;
  projectName:   string;
  clientName:    string;
  clientEmail:   string;
  startDate:     string;
  expectedDate:  string;
  overallStatus: OverallStatus;
  modules:       Module[];
  createdAt:     string;
}

const MODULE_NAMES: ModuleName[] = ["Design", "Development", "SEO", "Deployment"];
const MODULE_STATUSES: ModuleStatus[] = ["Not Started", "In Progress", "In Review", "Completed"];
const OVERALL_STATUSES: OverallStatus[] = ["Not Started", "In Progress", "In Review", "Completed", "On Hold"];

const STATUS_COLORS: Record<string, string> = {
  "Not Started": "bg-white/10 text-white/50",
  "In Progress": "bg-blue-500/20 text-blue-300",
  "In Review":   "bg-yellow-500/20 text-yellow-300",
  "Completed":   "bg-green-500/20 text-green-300",
  "On Hold":     "bg-orange-500/20 text-orange-300",
};

const EASE = [0.22, 1, 0.36, 1] as [number,number,number,number];

// ── Reusable field ─────────────────────────────────────────────────────────────
function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-[2px] text-white/40">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "bg-[#2a2a2a] border border-white/10 text-white text-[14px] px-3 py-2.5 outline-none focus:border-[#e63030] transition-colors duration-200 w-full";
const selectCls = inputCls + " cursor-pointer appearance-none";

// ── Credentials modal shown after project creation ────────────────────────────
function CredentialsModal({ clientId, password, onClose }: {
  clientId: string; password: string; onClose: () => void;
}) {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPw, setCopiedPw] = useState(false);

  function copy(text: string, which: "id"|"pw") {
    navigator.clipboard.writeText(text);
    if (which === "id") { setCopiedId(true); setTimeout(() => setCopiedId(false), 2000); }
    else                { setCopiedPw(true); setTimeout(() => setCopiedPw(false), 2000); }
  }

  return (
    <motion.div className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="w-full max-w-[460px] overflow-hidden"
        style={{ background: "#1a1a1a", border: "1px solid rgba(230,48,48,0.3)" }}>

        {/* Red top bar */}
        <div className="h-1 bg-[#e63030]" />

        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <h3 className="font-syne font-bold text-white text-[18px]">Project Created!</h3>
              <p className="text-[12px] text-white/40">Credentials emailed to client automatically</p>
            </div>
          </div>

          <p className="text-[13px] text-white/50 mb-6 leading-relaxed">
            Share these credentials with your client. They can log in at{" "}
            <span className="text-[#e63030]">/status</span> to track progress.
          </p>

          {/* Client ID */}
          <div className="mb-4">
            <p className="text-[11px] text-white/40 uppercase tracking-[2px] mb-2">Project ID (username)</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#222] border border-white/10 px-4 py-3 font-mono text-[18px] font-bold text-white tracking-[3px]">
                {clientId}
              </div>
              <button onClick={() => copy(clientId, "id")}
                className="px-4 py-3 border border-white/15 text-white/60 hover:border-[#e63030] hover:text-[#e63030] transition-all text-[12px] whitespace-nowrap">
                {copiedId ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Password */}
          <div className="mb-8">
            <p className="text-[11px] text-white/40 uppercase tracking-[2px] mb-2">Password</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#222] border border-white/10 px-4 py-3 font-mono text-[18px] font-bold text-white tracking-[3px]">
                {password}
              </div>
              <button onClick={() => copy(password, "pw")}
                className="px-4 py-3 border border-white/15 text-white/60 hover:border-[#e63030] hover:text-[#e63030] transition-all text-[12px] whitespace-nowrap">
                {copiedPw ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </div>

          <button onClick={onClose}
            className="w-full py-3 bg-[#e63030] text-white font-bold text-[14px] hover:bg-[#c72020] transition-colors">
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Create / Edit project modal ────────────────────────────────────────────────
function ProjectModal({
  initial, onSave, onClose, saving,
}: {
  initial?: Project | null;
  onSave: (data: Partial<Project>) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const isEdit = !!initial;

  const [projectName,   setProjectName]   = useState(initial?.projectName   || "");
  const [clientName,    setClientName]    = useState(initial?.clientName    || "");
  const [clientEmail,   setClientEmail]   = useState(initial?.clientEmail   || "");
  const [startDate,     setStartDate]     = useState(initial?.startDate     || "");
  const [expectedDate,  setExpectedDate]  = useState(initial?.expectedDate  || "");
  const [overallStatus, setOverallStatus] = useState<OverallStatus>(initial?.overallStatus || "Not Started");
  const [selectedMods,  setSelectedMods]  = useState<Set<ModuleName>>(
    new Set((initial?.modules || []).map(m => m.name))
  );
  const [moduleStatuses, setModuleStatuses] = useState<Record<ModuleName, ModuleStatus>>(
    Object.fromEntries(
      MODULE_NAMES.map(n => [
        n,
        initial?.modules.find(m => m.name === n)?.status || "Not Started",
      ])
    ) as Record<ModuleName, ModuleStatus>
  );

  function toggleModule(name: ModuleName) {
    setSelectedMods(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  function handleSave() {
    const modules: Module[] = MODULE_NAMES
      .filter(n => selectedMods.has(n))
      .map((n, i) => ({ name: n, status: moduleStatuses[n], order: i }));

    onSave({ projectName, clientName, clientEmail, startDate, expectedDate, overallStatus, modules });
  }

  const canSave = projectName && clientName && clientEmail && startDate && expectedDate;

  return (
    <motion.div className="fixed inset-0 z-[998] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        initial={{ scale: 0.94, y: 24 }} animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="w-full max-w-[620px] max-h-[90vh] overflow-y-auto"
        style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)" }}>

        <div className="h-1 bg-[#e63030]" />

        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-syne font-bold text-white text-[20px]">
              {isEdit ? "Edit Project" : "Create New Project"}
            </h3>
            <button onClick={onClose}
              className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-all">
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-5">
            {/* Project + client name */}
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Project Name">
                <input className={inputCls} value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="e.g. E-commerce Website" />
              </FormField>
              <FormField label="Client Name">
                <input className={inputCls} value={clientName} onChange={e => setClientName(e.target.value)} placeholder="John Doe" />
              </FormField>
            </div>

            {/* Email */}
            <FormField label="Client Email">
              <input type="email" className={inputCls} value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="john@example.com" />
            </FormField>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Start Date">
                <input type="date" className={inputCls} value={startDate} onChange={e => setStartDate(e.target.value)} />
              </FormField>
              <FormField label="Expected End Date">
                <input type="date" className={inputCls} value={expectedDate} onChange={e => setExpectedDate(e.target.value)} />
              </FormField>
            </div>

            {/* Overall status */}
            <FormField label="Overall Status">
              <select className={selectCls} value={overallStatus} onChange={e => setOverallStatus(e.target.value as OverallStatus)}
                style={{ background: "#2a2a2a" }}>
                {OVERALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>

            {/* Modules */}
            <div className="flex flex-col gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[2px] text-white/40">
                Modules — select which apply
              </p>
              <div className="flex flex-col gap-3">
                {MODULE_NAMES.map(name => {
                  const active = selectedMods.has(name);
                  return (
                    <div key={name} className={`border transition-all duration-200 ${active ? "border-[#e63030]/40 bg-[#e63030]/5" : "border-white/08 bg-white/[0.02]"}`}>
                      <div className="flex items-center justify-between p-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <span onClick={() => toggleModule(name)}
                            className={`w-5 h-5 border-2 flex items-center justify-center transition-all duration-200 ${active ? "border-[#e63030] bg-[#e63030]" : "border-white/30"}`}>
                            {active && (
                              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5">
                                <polyline points="2 6 5 9 10 3" />
                              </svg>
                            )}
                          </span>
                          <span onClick={() => toggleModule(name)} className={`text-[14px] font-medium ${active ? "text-white" : "text-white/40"}`}>
                            {name}
                          </span>
                        </label>

                        {active && (
                          <select
                            value={moduleStatuses[name]}
                            onChange={e => setModuleStatuses(p => ({ ...p, [name]: e.target.value as ModuleStatus }))}
                            className="bg-[#222] border border-white/15 text-white text-[12px] px-2 py-1.5 outline-none focus:border-[#e63030] cursor-pointer"
                            style={{ background: "#222" }}>
                            {MODULE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button onClick={onClose}
                className="flex-1 py-3 border border-white/15 text-white/60 hover:border-white/40 hover:text-white transition-all text-[13px] font-semibold">
                Cancel
              </button>
              <motion.button onClick={handleSave} disabled={!canSave || saving}
                whileHover={canSave ? { scale: 1.02 } : {}}
                whileTap={canSave ? { scale: 0.98 } : {}}
                className={`flex-1 py-3 text-[13px] font-bold transition-all flex items-center justify-center gap-2 ${
                  canSave && !saving ? "bg-[#e63030] text-white hover:bg-[#c72020]" : "bg-white/10 text-white/30 cursor-not-allowed"
                }`}>
                {saving ? (
                  <>
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block" />
                    {isEdit ? "Saving..." : "Creating..."}
                  </>
                ) : (
                  isEdit ? "Save Changes" : "Create Project"
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Delete confirm modal ───────────────────────────────────────────────────────
function DeleteModal({ project, onConfirm, onClose, deleting }: {
  project: Project; onConfirm: () => void; onClose: () => void; deleting: boolean;
}) {
  return (
    <motion.div className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div initial={{ scale: 0.94 }} animate={{ scale: 1 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="w-full max-w-[400px] p-8"
        style={{ background: "#1a1a1a", border: "1px solid rgba(230,48,48,0.2)" }}>
        <h3 className="font-syne font-bold text-white text-[18px] mb-2">Delete Project?</h3>
        <p className="text-[13px] text-white/50 mb-6 leading-relaxed">
          This will permanently delete <strong className="text-white">{project.projectName}</strong> for{" "}
          <strong className="text-white">{project.clientName}</strong>. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-white/15 text-white/60 hover:text-white transition-all text-[13px]">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={deleting}
            className="flex-1 py-3 bg-[#e63030] text-white font-bold text-[13px] hover:bg-[#c72020] transition-colors disabled:opacity-50">
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Project row card ──────────────────────────────────────────────────────────
function ProjectCard({ project, onEdit, onDelete }: {
  project: Project;
  onEdit: (p: Project) => void;
  onDelete: (p: Project) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div layout className="border border-white/08 overflow-hidden"
      style={{ background: "rgba(255,255,255,0.02)" }}>

      {/* Header row */}
      <div className="flex items-center justify-between p-5 gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <button onClick={() => setExpanded(e => !e)}
            className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 transition-all shrink-0">
            <motion.svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
              <polyline points="9 18 15 12 9 6" />
            </motion.svg>
          </button>

          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-white truncate">{project.projectName}</p>
            <p className="text-[12px] text-white/40">{project.clientName} · {project.clientEmail}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <span className={`text-[11px] font-semibold px-3 py-1.5 rounded-full ${STATUS_COLORS[project.overallStatus]}`}>
            {project.overallStatus}
          </span>
          <span className="text-[12px] text-white/30">Due {project.expectedDate}</span>

          <div className="flex gap-2">
            <button onClick={() => onEdit(project)}
              className="px-3 py-1.5 border border-white/15 text-white/60 text-[12px] hover:border-white/40 hover:text-white transition-all">
              Edit
            </button>
            <button onClick={() => onDelete(project)}
              className="px-3 py-1.5 border border-[#e63030]/30 text-[#e63030]/70 text-[12px] hover:border-[#e63030] hover:text-[#e63030] transition-all">
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Expanded: modules + credentials */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: EASE }}
            className="overflow-hidden border-t border-white/08">
            <div className="p-5 flex flex-col gap-5">

              {/* Modules kanban */}
              {project.modules.length > 0 && (
                <div>
                  <p className="text-[11px] text-white/30 uppercase tracking-[2px] mb-3">Modules</p>
                  <div className="flex flex-wrap gap-2">
                    {project.modules.map(m => (
                      <div key={m.name} className="flex items-center gap-2 border border-white/10 px-3 py-2 bg-white/[0.02]">
                        <span className="text-[13px] text-white/70">{m.name}</span>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full ${STATUS_COLORS[m.status]}`}>
                          {m.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Credentials */}
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-[11px] text-white/30 uppercase tracking-[2px] mb-1">Client ID</p>
                  <p className="font-mono text-[15px] font-bold text-white tracking-[2px]">{project.clientId}</p>
                </div>
                <div>
                  <p className="text-[11px] text-white/30 uppercase tracking-[2px] mb-1">Password</p>
                  <p className="font-mono text-[15px] font-bold text-white tracking-[2px]">{project.passwordPlain}</p>
                </div>
                <div>
                  <p className="text-[11px] text-white/30 uppercase tracking-[2px] mb-1">Start Date</p>
                  <p className="text-[14px] text-white/70">{project.startDate}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main dashboard ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [projects,  setProjects]  = useState<Project[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [deleting,  setDeleting]  = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);
  const [credentials, setCredentials] = useState<{ clientId: string; password: string } | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      if (res.status === 401) { router.push("/admin/login"); return; }
      const data = await res.json();
      // Guard: API must return an array — if not, log the error and show empty
      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        console.error("GET /api/admin/projects returned non-array:", data);
        setProjects([]);
      }
    } catch (err) {
      console.error("fetchProjects error:", err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  async function handleCreate(data: Partial<Project>) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setShowCreate(false);
      setCredentials({ clientId: json.clientId, password: json.passwordPlain });
      fetchProjects();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create project.");
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit(data: Partial<Project>) {
    if (!editProject) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/projects/${editProject._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update.");
      setEditProject(null);
      fetchProjects();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update project.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteProject) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/projects/${deleteProject._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete.");
      setDeleteProject(null);
      fetchProjects();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete project.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white">

      {/* Top bar */}
      <div className="border-b border-white/08 bg-[#0d0d0d] sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-[#e63030] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
            </div>
            <span className="font-syne font-bold text-[16px]">Admin Dashboard</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[12px] text-white/30 hidden sm:block">
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </span>
            <button onClick={handleLogout}
              className="text-[13px] text-white/50 hover:text-white border border-white/15 hover:border-white/40 px-4 py-1.5 transition-all">
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="font-syne font-bold text-[28px] text-white leading-tight">Projects</h1>
            <p className="text-[13px] text-white/40 mt-1">Manage client projects and track module progress</p>
          </div>
          <motion.button onClick={() => setShowCreate(true)}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="bg-[#e63030] text-white px-6 py-3 font-bold text-[13px] flex items-center gap-2 hover:bg-[#c72020] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Project
          </motion.button>
        </div>

        {/* Projects list */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-white/20 border-t-[#e63030] rounded-full" />
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 border-2 border-white/10 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
                <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <p className="text-white/30 text-[14px]">No projects yet</p>
            <button onClick={() => setShowCreate(true)} className="text-[#e63030] text-[13px] underline">
              Create your first project
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {projects.map(p => (
                <motion.div key={p._id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: EASE }}>
                  <ProjectCard project={p} onEdit={setEditProject} onDelete={setDeleteProject} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCreate && (
          <ProjectModal key="create" onSave={handleCreate} onClose={() => setShowCreate(false)} saving={saving} />
        )}
        {editProject && (
          <ProjectModal key="edit" initial={editProject} onSave={handleEdit} onClose={() => setEditProject(null)} saving={saving} />
        )}
        {deleteProject && (
          <DeleteModal project={deleteProject} onConfirm={handleDelete} onClose={() => setDeleteProject(null)} deleting={deleting} />
        )}
        {credentials && (
          <CredentialsModal clientId={credentials.clientId} password={credentials.password} onClose={() => setCredentials(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}