"use client";

// Mission Builder — admin CRUD for certification tracks and missions.
// Track list (left) → Mission list for selected track (right) → Mission editor drawer.
//
// NOTE: Local state only — Convex wiring comes on Day 10 once missions/tracks
// schema tables are deployed. Do NOT wire to Convex before that.

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, GripVertical, X, ChevronRight,
  Globe, EyeOff, Code2, Clock, TestTube2, Pencil,
  Trophy, AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

type TestCase = { input: string; expectedOutput: string };

type Mission = {
  id:             string;
  order:          number;
  title:          string;
  description:    string;
  starterCode:    string;
  language:       string;
  expectedOutput: string;
  timeLimitMins:  number;
  testCases:      TestCase[];
  published:      boolean;
};

type Track = {
  id:          string;
  name:        string;
  description: string;
  published:   boolean;
  missions:    Mission[];
};

const LANGUAGES = ["javascript", "python", "typescript", "java", "cpp", "go", "rust"];

const DEFAULT_MISSION: Omit<Mission, "id" | "order"> = {
  title: "", description: "", starterCode: "", language: "python",
  expectedOutput: "", timeLimitMins: 30, testCases: [], published: false,
};

function uid() { return Math.random().toString(36).slice(2, 9); }

// ─── Drag-to-reorder hook ─────────────────────────────────────────────────────

function useDragSort<T extends { id: string; order: number }>(
  items: T[],
  onReorder: (items: T[]) => void,
) {
  const dragIndex = useRef<number | null>(null);
  const overIndex = useRef<number | null>(null);

  const onDragStart = useCallback((i: number) => { dragIndex.current = i; }, []);
  const onDragEnter = useCallback((i: number) => { overIndex.current = i; }, []);
  const onDragEnd   = useCallback(() => {
    if (dragIndex.current === null || overIndex.current === null || dragIndex.current === overIndex.current) {
      dragIndex.current = null; overIndex.current = null; return;
    }
    const next = [...items];
    const [moved] = next.splice(dragIndex.current, 1);
    next.splice(overIndex.current, 0, moved);
    onReorder(next.map((it, i) => ({ ...it, order: i })));
    dragIndex.current = null; overIndex.current = null;
  }, [items, onReorder]);

  return { onDragStart, onDragEnter, onDragEnd };
}

// ─── Shared field components ──────────────────────────────────────────────────

const inputCls = `
  w-full px-2.5 py-[7px] text-[13px]
  bg-(--bg-input) border border-(--border-subtle) rounded-md
  text-(--text-primary) outline-none
  focus:border-[rgba(58,94,255,0.4)] transition-colors duration-75
`;

const labelCls = "block text-[11px] text-(--text-disabled) mb-1.5";

// ─── MissionEditor drawer ─────────────────────────────────────────────────────

function MissionEditor({ mission, onSave, onClose }: {
  mission: Partial<Mission> & { id?: string };
  onSave:  (m: Mission) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<Mission, "id" | "order">>({
    title:          mission.title          ?? "",
    description:    mission.description    ?? "",
    starterCode:    mission.starterCode    ?? "",
    language:       mission.language       ?? "python",
    expectedOutput: mission.expectedOutput ?? "",
    timeLimitMins:  mission.timeLimitMins  ?? 30,
    testCases:      mission.testCases      ?? [],
    published:      mission.published      ?? false,
  });

  function field(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));
  }

  function addTestCase() {
    setForm((p) => ({ ...p, testCases: [...p.testCases, { input: "", expectedOutput: "" }] }));
  }
  function updateTestCase(i: number, key: keyof TestCase, val: string) {
    setForm((p) => {
      const tc = [...p.testCases]; tc[i] = { ...tc[i], [key]: val };
      return { ...p, testCases: tc };
    });
  }
  function removeTestCase(i: number) {
    setForm((p) => ({ ...p, testCases: p.testCases.filter((_, j) => j !== i) }));
  }

  function handleSave() {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    onSave({ id: mission.id ?? uid(), order: mission.order ?? 0, ...form });
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/25 backdrop-blur-[3px] z-50"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="fixed top-0 right-0 bottom-0 z-[51] flex flex-col bg-(--bg-base) border-l border-(--border-subtle) shadow-lg"
        style={{ width: "min(600px, 100vw)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-(--border-subtle) shrink-0">
          <h3 className="text-[14px] font-semibold text-(--text-primary)">
            {mission.id ? "Edit Mission" : "New Mission"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-(--text-faint) hover:text-(--text-secondary) hover:bg-(--bg-hover) rounded cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3.5">

          {/* Title */}
          <div>
            <label className={labelCls}>Title *</label>
            <input value={form.title} onChange={field("title")} placeholder="e.g. Fix the Broken Loop" className={inputCls} />
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              value={form.description} onChange={field("description")} rows={3}
              placeholder="Brief mission brief shown to the student…"
              className={`${inputCls} resize-vertical leading-relaxed`}
            />
          </div>

          {/* Language + Time limit */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className={labelCls}>Language</label>
              <select value={form.language} onChange={field("language")} className={inputCls}>
                {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Time Limit (minutes)</label>
              <input
                type="number" min={1} max={180}
                value={form.timeLimitMins}
                onChange={(e) => setForm((p) => ({ ...p, timeLimitMins: Number(e.target.value) }))}
                className={inputCls}
              />
            </div>
          </div>

          {/* Starter code */}
          <div>
            <label className={labelCls}>Starter Code</label>
            <textarea
              value={form.starterCode} onChange={field("starterCode")} rows={6}
              placeholder={"def solution(arr):\n    # TODO: fix the bug"}
              className={`${inputCls} resize-vertical font-mono text-[12px] leading-relaxed`}
            />
          </div>

          {/* Expected output */}
          <div>
            <label className={labelCls}>Expected Output (shown on pass)</label>
            <input value={form.expectedOutput} onChange={field("expectedOutput")} placeholder="e.g. [1, 2, 3]" className={inputCls} />
          </div>

          {/* Test cases */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] text-(--text-disabled)">
                Test Cases ({form.testCases.length})
              </label>
              <button
                onClick={addTestCase}
                className="flex items-center gap-1 px-2 py-1 rounded text-[11px] bg-[rgba(58,94,255,0.1)] border border-[rgba(58,94,255,0.2)] text-[#3A5EFF] cursor-pointer hover:bg-[rgba(58,94,255,0.16)] transition-colors"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>

            {form.testCases.length === 0 ? (
              <p className="text-[12px] text-(--text-disabled) italic">No test cases yet.</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {form.testCases.map((tc, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-1.5 px-3 py-2.5 bg-(--bg-elevated) border border-(--border-subtle) rounded-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-(--text-disabled) font-semibold">
                        Test {i + 1}
                      </span>
                      <button
                        onClick={() => removeTestCase(i)}
                        className="p-0.5 text-(--text-disabled) hover:text-red-400/70 cursor-pointer transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-(--text-disabled) mb-1">Input</label>
                        <textarea
                          value={tc.input}
                          onChange={(e) => updateTestCase(i, "input", e.target.value)}
                          rows={2}
                          className={`${inputCls} text-[11px] font-mono resize-none`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-(--text-disabled) mb-1">Expected Output</label>
                        <textarea
                          value={tc.expectedOutput}
                          onChange={(e) => updateTestCase(i, "expectedOutput", e.target.value)}
                          rows={2}
                          className={`${inputCls} text-[11px] font-mono resize-none`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Published toggle */}
          <div className="flex items-center gap-2.5 px-3 py-2.5 bg-(--bg-elevated) border border-(--border-subtle) rounded-md">
            {/* Toggle pill — position of thumb is runtime, inline justified */}
            <button
              onClick={() => setForm((p) => ({ ...p, published: !p.published }))}
              className="relative w-9 h-5 rounded-full border-none cursor-pointer shrink-0 transition-colors duration-150"
              style={{ background: form.published ? "#3A5EFF" : "var(--bg-hover)" }}
            >
              <span
                className="absolute top-[3px] w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-all duration-150"
                style={{ left: form.published ? 19 : 3 }}
              />
            </button>
            <span className="text-[12px] text-(--text-secondary)">
              {form.published ? "Published — visible to students" : "Draft — hidden from students"}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-(--border-subtle) bg-(--bg-elevated) shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md text-[12px] border border-(--border-subtle) text-(--text-muted) bg-transparent hover:bg-(--bg-hover) cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-md text-[12px] font-medium bg-[#3A5EFF] hover:bg-[#4a6aff] text-white border-none cursor-pointer transition-colors"
          >
            Save Mission
          </button>
        </div>
      </motion.div>
    </>
  );
}

// ─── MissionBuilder ───────────────────────────────────────────────────────────

export default function MissionBuilder() {
  const [tracks,          setTracks]          = useState<Track[]>([]);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [editingMission,  setEditingMission]  = useState<Partial<Mission> & { id?: string } | null>(null);
  const [newTrackName,    setNewTrackName]    = useState("");
  const [addingTrack,     setAddingTrack]     = useState(false);

  const selectedTrack = tracks.find((t) => t.id === selectedTrackId) ?? null;

  // ── Track actions ─────────────────────────────────────────────────────────

  function addTrack() {
    if (!newTrackName.trim()) { toast.error("Track name required"); return; }
    const track: Track = { id: uid(), name: newTrackName.trim(), description: "", published: false, missions: [] };
    setTracks((p) => [...p, track]);
    setNewTrackName(""); setAddingTrack(false);
    setSelectedTrackId(track.id);
    toast.success("Track created");
  }

  function toggleTrackPublish(trackId: string) {
    setTracks((p) => p.map((t) => t.id === trackId ? { ...t, published: !t.published } : t));
  }

  function deleteTrack(trackId: string) {
    if (!confirm("Delete this track and all its missions?")) return;
    setTracks((p) => p.filter((t) => t.id !== trackId));
    if (selectedTrackId === trackId) setSelectedTrackId(null);
    toast.success("Track deleted");
  }

  // ── Mission actions ───────────────────────────────────────────────────────

  function saveMission(mission: Mission) {
    setTracks((p) => p.map((t) => {
      if (t.id !== selectedTrackId) return t;
      const existing = t.missions.find((m) => m.id === mission.id);
      if (existing) return { ...t, missions: t.missions.map((m) => m.id === mission.id ? mission : m) };
      return { ...t, missions: [...t.missions, { ...mission, order: t.missions.length }] };
    }));
    setEditingMission(null);
    toast.success("Mission saved");
  }

  function deleteMission(missionId: string) {
    if (!confirm("Delete this mission?")) return;
    setTracks((p) => p.map((t) => {
      if (t.id !== selectedTrackId) return t;
      return { ...t, missions: t.missions.filter((m) => m.id !== missionId).map((m, i) => ({ ...m, order: i })) };
    }));
  }

  function toggleMissionPublish(missionId: string) {
    setTracks((p) => p.map((t) => {
      if (t.id !== selectedTrackId) return t;
      return { ...t, missions: t.missions.map((m) => m.id === missionId ? { ...m, published: !m.published } : m) };
    }));
  }

  const { onDragStart, onDragEnter, onDragEnd } = useDragSort(
    selectedTrack?.missions ?? [],
    (reordered) => {
      setTracks((p) => p.map((t) => t.id === selectedTrackId ? { ...t, missions: reordered } : t));
    },
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-(--text-disabled) mb-1">Admin</p>
        <h2 className="text-[22px] font-semibold text-(--text-primary) mb-1">Mission Builder</h2>
        <p className="text-[13px] text-(--text-faint)">
          Build certification tracks and missions. Required before the Missions feature can launch.
        </p>
        {/* Warning banner */}
        <div className="flex items-start gap-1.5 mt-2 px-3 py-2 rounded-md bg-warning-bg border border-warning-border">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-warning" />
          <p className="text-[11px] text-warning">
            Data is currently stored in local state only. Connect to Convex once the missions/tracks schema is deployed.
          </p>
        </div>
      </div>

      {/* Two-panel layout */}
      <div
        className="flex border border-(--border-subtle) rounded-lg overflow-hidden"
        style={{ height: "calc(100vh - 240px)", minHeight: 500 }}
      >

        {/* ── Left: Track list ─────────────────────────────────────────────── */}
        <div className="w-[240px] shrink-0 border-r border-(--border-subtle) flex flex-col bg-(--bg-elevated)">

          {/* Track list header */}
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-(--border-subtle)">
            <p className="text-[11px] font-semibold text-(--text-secondary) uppercase tracking-[0.05em]">
              Tracks
            </p>
            <button
              onClick={() => setAddingTrack(true)}
              className="flex items-center gap-0.5 px-1.5 py-1 rounded text-[11px] bg-[rgba(58,94,255,0.1)] border border-[rgba(58,94,255,0.2)] text-[#3A5EFF] cursor-pointer hover:bg-[rgba(58,94,255,0.16)] transition-colors"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>

          {/* Add track input */}
          <AnimatePresence>
            {addingTrack && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} className="overflow-hidden"
              >
                <div className="flex gap-1.5 px-2.5 py-2 border-b border-(--border-subtle)">
                  <input
                    autoFocus value={newTrackName}
                    onChange={(e) => setNewTrackName(e.target.value)}
                    placeholder="Track name…"
                    onKeyDown={(e) => {
                      if (e.key === "Enter")  addTrack();
                      if (e.key === "Escape") { setAddingTrack(false); setNewTrackName(""); }
                    }}
                    className="flex-1 h-7 px-2 text-[12px] bg-(--bg-input) border border-(--border-subtle) rounded text-(--text-primary) outline-none focus:border-[rgba(58,94,255,0.4)] transition-colors"
                  />
                  <button
                    onClick={addTrack}
                    className="px-2 h-7 rounded text-[11px] bg-[#3A5EFF] hover:bg-[#4a6aff] text-white border-none cursor-pointer transition-colors"
                  >
                    Add
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Track rows */}
          <div className="flex-1 overflow-y-auto">
            {tracks.length === 0 ? (
              <div className="flex flex-col items-center gap-1.5 py-8 text-(--text-disabled) text-center px-4">
                <Trophy className="w-6 h-6" />
                <p className="text-[12px]">No tracks yet</p>
              </div>
            ) : (
              tracks.map((track) => {
                const active = selectedTrackId === track.id;
                return (
                  <button
                    key={track.id}
                    onClick={() => setSelectedTrackId(track.id)}
                    className={`
                      group w-full flex items-center gap-2 px-3 py-2.5
                      border-none cursor-pointer text-left
                      border-b border-(--border-subtle)
                      border-l-[3px] transition-colors duration-75
                      hover:bg-(--bg-hover)
                      ${active
                        ? "bg-[rgba(58,94,255,0.08)] border-l-[#3A5EFF]"
                        : "bg-transparent border-l-transparent"
                      }
                    `}
                  >
                    <div className="flex-1 min-w-0">
                      <p className={`text-[12px] font-medium truncate ${active ? "text-[#3A5EFF]" : "text-(--text-secondary)"}`}>
                        {track.name}
                      </p>
                      <p className="text-[10px] text-(--text-disabled) mt-0.5">
                        {track.missions.length} mission{track.missions.length !== 1 ? "s" : ""} · {track.published ? "Live" : "Draft"}
                      </p>
                    </div>
                    <ChevronRight className="w-3 h-3 shrink-0 text-(--text-disabled)" />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ── Right: Mission list ───────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col bg-(--bg-base)">
          {!selectedTrack ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-(--text-disabled) p-8">
              <Trophy className="w-8 h-8" />
              <p className="text-[13px]">Select a track to manage its missions</p>
            </div>
          ) : (
            <>
              {/* Track header */}
              <div className="flex items-center gap-2.5 px-4 py-3 border-b border-(--border-subtle) shrink-0">
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-(--text-primary)">{selectedTrack.name}</p>
                  <p className="text-[11px] text-(--text-disabled)">{selectedTrack.missions.length} missions</p>
                </div>

                {/* Publish toggle */}
                <button
                  onClick={() => toggleTrackPublish(selectedTrack.id)}
                  className={`
                    flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium
                    border cursor-pointer transition-colors duration-75
                    ${selectedTrack.published
                      ? "bg-[rgba(34,197,94,0.08)] border-[rgba(34,197,94,0.2)] text-[#22c55e] hover:bg-[rgba(34,197,94,0.14)]"
                      : "bg-(--bg-elevated) border-(--border-subtle) text-(--text-muted) hover:bg-(--bg-hover)"
                    }
                  `}
                >
                  {selectedTrack.published
                    ? <Globe className="w-3 h-3" />
                    : <EyeOff className="w-3 h-3" />
                  }
                  {selectedTrack.published ? "Published" : "Draft"}
                </button>

                {/* Delete track */}
                <button
                  onClick={() => deleteTrack(selectedTrack.id)}
                  className="p-1.5 rounded text-(--text-faint) hover:text-red-400/70 hover:bg-red-500/[0.06] cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Add mission */}
                <button
                  onClick={() => setEditingMission({ ...DEFAULT_MISSION })}
                  className="flex items-center gap-1 px-3 py-1.5 rounded text-[11px] font-medium bg-[#3A5EFF] hover:bg-[#4a6aff] text-white border-none cursor-pointer transition-colors"
                >
                  <Plus className="w-3 h-3" /> Mission
                </button>
              </div>

              {/* Mission rows */}
              <div className="flex-1 overflow-y-auto p-3">
                {selectedTrack.missions.length === 0 ? (
                  <div className="flex flex-col items-center gap-1.5 py-10 text-(--text-disabled)">
                    <Code2 className="w-7 h-7" />
                    <p className="text-[12px]">No missions yet. Click "+ Mission" to add one.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    {[...selectedTrack.missions]
                      .sort((a, b) => a.order - b.order)
                      .map((mission, i) => (
                        <motion.div
                          key={mission.id}
                          layout
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          draggable
                          onDragStart={() => onDragStart(i)}
                          onDragEnter={() => onDragEnter(i)}
                          onDragEnd={onDragEnd}
                          onDragOver={(e) => e.preventDefault()}
                          className="group flex items-center gap-2 px-3 py-2.5 bg-(--bg-elevated) border border-(--border-subtle) rounded-md cursor-grab hover:border-[rgba(58,94,255,0.3)] transition-colors"
                        >
                          <GripVertical className="w-3.5 h-3.5 shrink-0 text-(--text-disabled)" />
                          <span className="text-[10px] font-bold text-(--text-disabled) w-[18px] shrink-0">
                            #{i + 1}
                          </span>

                          {/* Mission info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium text-(--text-secondary) truncate">
                              {mission.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="flex items-center gap-1 text-[10px] text-(--text-disabled)">
                                <Code2 className="w-2.5 h-2.5" />{mission.language}
                              </span>
                              <span className="flex items-center gap-1 text-[10px] text-(--text-disabled)">
                                <Clock className="w-2.5 h-2.5" />{mission.timeLimitMins}m
                              </span>
                              <span className="flex items-center gap-1 text-[10px] text-(--text-disabled)">
                                <TestTube2 className="w-2.5 h-2.5" />{mission.testCases.length} tests
                              </span>
                            </div>
                          </div>

                          {/* Published chip */}
                          <button
                            onClick={() => toggleMissionPublish(mission.id)}
                            className={`
                              px-2 py-0.5 rounded text-[10px] font-medium border shrink-0
                              cursor-pointer transition-colors duration-75
                              ${mission.published
                                ? "bg-[rgba(34,197,94,0.08)] border-[rgba(34,197,94,0.2)] text-[#22c55e] hover:bg-[rgba(34,197,94,0.14)]"
                                : "bg-(--bg-hover) border-(--border-subtle) text-(--text-muted) hover:bg-(--bg-active)"
                              }
                            `}
                          >
                            {mission.published ? "Live" : "Draft"}
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => setEditingMission(mission)}
                            className="p-1 rounded text-(--text-faint) hover:text-(--text-secondary) hover:bg-(--bg-hover) cursor-pointer transition-colors shrink-0"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => deleteMission(mission.id)}
                            className="p-1 rounded text-(--text-faint) hover:text-red-400/70 hover:bg-red-500/[0.06] cursor-pointer transition-colors shrink-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </motion.div>
                      ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mission editor drawer */}
      <AnimatePresence>
        {editingMission && (
          <MissionEditor
            mission={editingMission}
            onSave={saveMission}
            onClose={() => setEditingMission(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}