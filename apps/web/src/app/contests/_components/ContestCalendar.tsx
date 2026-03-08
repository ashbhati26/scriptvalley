"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, ExternalLink, Timer, X, CalendarPlus, Check } from "lucide-react";
import ContestCalendarSkeleton from "./Contestcalendarskeleton";

type Contest = {
  platform: string;
  name: string;
  startTime: string;
  startTimeUnix: number;
  duration: string;
  durationSeconds: number;
  url: string;
};

const PLATFORM_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  LeetCode:    { bg: "rgba(255,161,22,0.08)",  border: "rgba(255,161,22,0.2)",  text: "#ffa116" },
  Codeforces:  { bg: "rgba(58,94,255,0.08)",   border: "rgba(58,94,255,0.2)",   text: "#3A5EFF" },
  CodeChef:    { bg: "rgba(99,102,241,0.08)",  border: "rgba(99,102,241,0.2)",  text: "#818cf8" },
  HackerRank:  { bg: "rgba(34,197,94,0.08)",   border: "rgba(34,197,94,0.2)",   text: "#4ade80" },
  HackerEarth: { bg: "rgba(14,165,233,0.08)",  border: "rgba(14,165,233,0.2)",  text: "#38bdf8" },
  AtCoder:     { bg: "rgba(168,85,247,0.08)",  border: "rgba(168,85,247,0.2)",  text: "#c084fc" },
};

function getPlatformStyle(platform: string) {
  return PLATFORM_COLORS[platform] ?? {
    bg: "var(--bg-elevated)",
    border: "var(--border-subtle)",
    text: "var(--text-faint)",
  };
}

function isUpcoming(startTimeUnix: number) {
  return startTimeUnix * 1000 > Date.now();
}

// ─── Google Calendar URL builder ──────────────────────────────────────────────
// Uses the public /calendar/render endpoint — no API key, no OAuth needed.
// Opens Google Calendar in a new tab with the event pre-filled.

function buildGoogleCalendarUrl(contest: Contest): string {
  const start = new Date(contest.startTime);
  const end   = new Date(start.getTime() + contest.durationSeconds * 1000);

  // Google Calendar expects: YYYYMMDDTHHmmssZ
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const params = new URLSearchParams({
    action:   "TEMPLATE",
    text:     `${contest.platform}: ${contest.name}`,
    dates:    `${fmt(start)}/${fmt(end)}`,
    details:  `Competitive programming contest on ${contest.platform}.\n\nJoin here: ${contest.url}`,
    location: contest.url,
    sprop:    `website:${contest.url}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// ─── Add to Calendar button ───────────────────────────────────────────────────

function AddToCalendarButton({ contest }: { contest: Contest }) {
  const [added, setAdded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(buildGoogleCalendarUrl(contest), "_blank", "noopener,noreferrer");
    // Brief "added" feedback flash
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      title="Add to Google Calendar"
      className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border transition-all duration-100"
      style={
        added
          ? {
              background: "rgba(34,197,94,0.08)",
              borderColor: "rgba(34,197,94,0.25)",
              color: "#4ade80",
            }
          : {
              background: "transparent",
              borderColor: "var(--border-subtle)",
              color: "var(--text-faint)",
            }
      }
      onMouseEnter={(e) => {
        if (!added) {
          e.currentTarget.style.borderColor = "var(--border-medium)";
          e.currentTarget.style.color = "var(--text-secondary)";
        }
      }}
      onMouseLeave={(e) => {
        if (!added) {
          e.currentTarget.style.borderColor = "var(--border-subtle)";
          e.currentTarget.style.color = "var(--text-faint)";
        }
      }}
    >
      {added ? (
        <>
          <Check className="w-3 h-3 shrink-0" />
          <span>Opening…</span>
        </>
      ) : (
        <>
          <CalendarPlus className="w-3 h-3 shrink-0" />
          <span>Remind me</span>
        </>
      )}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ContestCalendar() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("All");

  useEffect(() => {
    async function fetchContests() {
      try {
        const res  = await fetch("https://contests-backend-main.vercel.app/contests");
        const json = await res.json();
        setContests(json.data || []);
      } catch (err) {
        console.error("Failed to fetch contests", err);
      } finally {
        setLoading(false);
      }
    }
    fetchContests();
  }, []);

  const platforms = useMemo(
    () => ["All", ...Array.from(new Set(contests.map((c) => c.platform)))],
    [contests],
  );

  const filteredContests = useMemo(
    () => filter === "All" ? contests : contests.filter((c) => c.platform === filter),
    [filter, contests],
  );

  const groupedByMonth = useMemo(() => {
    return filteredContests.reduce((acc: Record<string, Contest[]>, contest) => {
      const key = new Date(contest.startTime).toLocaleString("default", {
        month: "long", year: "numeric",
      });
      if (!acc[key]) acc[key] = [];
      acc[key].push(contest);
      return acc;
    }, {});
  }, [filteredContests]);

  if (loading) return <ContestCalendarSkeleton />;

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 mt-8 mb-16 space-y-8">

        {/* Header */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-1"
          >
            Schedule
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="flex items-center gap-2 mb-2"
          >
            <Calendar className="w-5 h-5 text-[var(--text-faint)]" />
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Contest Calendar</h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 }}
            className="text-sm text-[var(--text-muted)]"
          >
            {filteredContests.length} contest{filteredContests.length !== 1 && "s"} across{" "}
            {Object.keys(groupedByMonth).length} month{Object.keys(groupedByMonth).length !== 1 && "s"}
          </motion.p>
        </div>

        {/* Platform filter chips */}
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">Platform</p>
          <div className="flex flex-wrap gap-1.5">
            {platforms.map((p) => {
              const style  = getPlatformStyle(p);
              const active = filter === p;
              return (
                <button
                  key={p}
                  onClick={() => setFilter(p)}
                  className="text-xs px-2.5 py-1 rounded-md border transition-colors duration-100"
                  style={
                    active && p !== "All"
                      ? { background: style.bg, borderColor: style.border, color: style.text }
                      : active
                      ? { background: "var(--bg-hover)", borderColor: "var(--border-medium)", color: "var(--text-secondary)" }
                      : { background: "transparent", borderColor: "var(--border-subtle)", color: "var(--text-faint)" }
                  }
                >
                  {p}
                </button>
              );
            })}

            {filter !== "All" && (
              <button
                onClick={() => setFilter("All")}
                className="flex items-center gap-1 text-xs text-[var(--text-disabled)] hover:text-[var(--text-muted)] transition-colors"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="border-t border-[var(--border-subtle)]" />

        {/* Month groups */}
        <AnimatePresence mode="wait">
          {Object.keys(groupedByMonth).length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center gap-2 py-16 text-[var(--bg-active)]"
            >
              <Calendar className="w-8 h-8" />
              <p className="text-sm text-[var(--text-faint)]">No contests found</p>
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
              {Object.entries(groupedByMonth).map(([month, list], mi) => (
                <motion.div
                  key={month}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: mi * 0.05 }}
                  className="space-y-3"
                >
                  {/* Month label */}
                  <div className="flex items-center gap-3">
                    <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">{month}</p>
                    <div className="flex-1 h-px bg-[var(--border-subtle)]" />
                    <span className="text-[10px] text-[var(--text-disabled)]">{list.length}</span>
                  </div>

                  {/* Cards grid */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {list.map((contest, idx) => {
                      const style    = getPlatformStyle(contest.platform);
                      const upcoming = isUpcoming(contest.startTimeUnix);

                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: mi * 0.05 + idx * 0.03 }}
                          className="group relative rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-medium)] transition-colors duration-100 overflow-hidden flex flex-col"
                        >
                          {/* Top accent line */}
                          <div
                            className="absolute inset-x-0 top-0 h-[2px]"
                            style={{ background: style.text, opacity: upcoming ? 1 : 0.3 }}
                          />

                          <div className="p-4 pt-5 flex flex-col gap-3 flex-1">
                            {/* Platform badge + upcoming tag */}
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className="text-[10px] uppercase tracking-widest rounded-md px-2 py-0.5 border"
                                style={{ background: style.bg, borderColor: style.border, color: style.text }}
                              >
                                {contest.platform}
                              </span>
                              {upcoming && (
                                <span className="text-[10px] uppercase tracking-widest text-[#3A5EFF] bg-[#3A5EFF]/[0.08] border border-[#3A5EFF]/20 rounded-md px-2 py-0.5">
                                  Upcoming
                                </span>
                              )}
                            </div>

                            {/* Contest name */}
                            <h3 className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors leading-snug line-clamp-2">
                              {contest.name}
                            </h3>

                            {/* Meta */}
                            <div className="mt-auto space-y-1.5">
                              <div className="flex items-center gap-1.5 text-xs text-[var(--text-faint)]">
                                <Clock className="w-3 h-3 shrink-0" />
                                <span>{new Date(contest.startTime).toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-[var(--text-faint)]">
                                <Timer className="w-3 h-3 shrink-0" />
                                <span>{contest.duration}</span>
                              </div>
                            </div>

                            {/* CTA row — Go to Contest + Add to Calendar */}
                            <div className="flex items-center justify-between gap-2 pt-1 border-t border-[var(--border-subtle)]">
                              <a
                                href={contest.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 text-xs font-medium transition-colors duration-100"
                                style={{ color: upcoming ? style.text : "var(--text-disabled)" }}
                                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                              >
                                Go to Contest
                                <ExternalLink className="w-3 h-3" />
                              </a>

                              {/* Only show reminder for upcoming contests */}
                              {upcoming && <AddToCalendarButton contest={contest} />}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}