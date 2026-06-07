"use client";

// PrintableSheet renders a hidden div that becomes the entire page during print.
// Uses @media print CSS to hide all other UI and show only this component.
// Triggered by window.print() from the Download PDF button in SheetHeader.

import type { DSASheet } from "../types";
import type { Attempt } from "@/app/dsa-sheet/lib/computeProgress";

interface Props {
  sheet:         DSASheet;
  attempts:      Attempt[] | undefined;
  localAttempts: Record<string, boolean>;
  progress: {
    total:  { completed: number; total: number };
    easy:   { completed: number; total: number };
    medium: { completed: number; total: number };
    hard:   { completed: number; total: number };
  };
}

function isAttempted(
  topicName:     string,
  questionTitle: string,
  localAttempts: Record<string, boolean>,
  attempts:      Attempt[] | undefined,
): boolean {
  const key = `${topicName}_${questionTitle}`;
  if (localAttempts[key] !== undefined) return localAttempts[key];
  return attempts?.some((a) => a.questionTitle === questionTitle && a.attempted) ?? false;
}

const DIFF_COLOR: Record<string, string> = {
  Easy:   "#22c55e",
  Medium: "#d97706",
  Hard:   "#dc2626",
};

export default function PrintableSheet({ sheet, attempts, localAttempts, progress }: Props) {
  const totalPct = progress.total.total === 0
    ? 0
    : Math.round((progress.total.completed / progress.total.total) * 100);

  return (
    <div className="sv-print-only" aria-hidden="true">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="sv-print-header">
        <div>
          <p className="sv-print-eyebrow">ScriptValley · DSA Sheet</p>
          <h1 className="sv-print-title">{sheet.name}</h1>
          {sheet.description && (
            <p
              className="sv-print-desc"
              dangerouslySetInnerHTML={{ __html: sheet.description }}
            />
          )}
        </div>
        <div className="sv-print-header-right">
          <p className="sv-print-progress-label">Progress</p>
          <p className="sv-print-progress-value">
            {progress.total.completed} / {progress.total.total} ({totalPct}%)
          </p>
        </div>
      </div>

      {/* ── Progress summary row ────────────────────────────────────────────── */}
      <div className="sv-print-summary">
        {[
          { label: "Easy",   data: progress.easy,   color: DIFF_COLOR.Easy   },
          { label: "Medium", data: progress.medium, color: DIFF_COLOR.Medium },
          { label: "Hard",   data: progress.hard,   color: DIFF_COLOR.Hard   },
        ].map(({ label, data, color }) => {
          const pct = data.total === 0 ? 0 : Math.round((data.completed / data.total) * 100);
          return (
            <div key={label} className="sv-print-summary-cell">
              <span className="sv-print-summary-label" style={{ color }}>{label}</span>
              <span className="sv-print-summary-count">
                {data.completed}/{data.total}
              </span>
              {/* Mini progress bar */}
              <div className="sv-print-bar-track">
                <div
                  className="sv-print-bar-fill"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Topics ─────────────────────────────────────────────────────────── */}
      {sheet.topics.map((topic, ti) => {
        const isSubTopics = topic.useSubTopics && (topic.subTopics?.length ?? 0) > 0;

        return (
          <div key={`${topic.topic}-${ti}`} className="sv-print-topic">
            {/* Topic header */}
            <div className="sv-print-topic-header">
              <span className="sv-print-step">Step {ti + 1}</span>
              <span className="sv-print-topic-name">{topic.topic}</span>
            </div>

            {isSubTopics ? (
              // ── Sub-topic mode ──────────────────────────────────────────────
              (topic.subTopics ?? []).map((st, si) => (
                <div key={`${st.name}-${si}`} className="sv-print-subtopic">
                  <p className="sv-print-subtopic-name">▸ {st.name}</p>
                  <table className="sv-print-table">
                    <tbody>
                      {st.questions.map((q, qi) => {
                        const done = isAttempted(topic.topic, q.title, localAttempts, attempts);
                        return (
                          <tr key={`${q.title}-${qi}`} className={done ? "sv-print-row-done" : "sv-print-row"}>
                            <td className="sv-print-col-check">
                              <span className="sv-print-checkbox">{done ? "✓" : "○"}</span>
                            </td>
                            <td className="sv-print-col-title">{q.title}</td>
                            <td className="sv-print-col-diff">
                              <span style={{ color: DIFF_COLOR[q.difficulty] ?? "#6b6b6b" }}>
                                {q.difficulty}
                              </span>
                            </td>
                            <td className="sv-print-col-platform">
                              {q.link?.platform ?? ""}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))
            ) : (
              // ── Flat mode ───────────────────────────────────────────────────
              <table className="sv-print-table">
                <tbody>
                  {topic.questions.map((q, qi) => {
                    const done = isAttempted(topic.topic, q.title, localAttempts, attempts);
                    return (
                      <tr key={`${q.title}-${qi}`} className={done ? "sv-print-row-done" : "sv-print-row"}>
                        <td className="sv-print-col-check">
                          <span className="sv-print-checkbox">{done ? "✓" : "○"}</span>
                        </td>
                        <td className="sv-print-col-title">{q.title}</td>
                        <td className="sv-print-col-diff">
                          <span style={{ color: DIFF_COLOR[q.difficulty] ?? "#6b6b6b" }}>
                            {q.difficulty}
                          </span>
                        </td>
                        <td className="sv-print-col-platform">
                          {q.link?.platform ?? ""}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        );
      })}

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <div className="sv-print-footer">
        <span>scriptvalley.com</span>
        <span>·</span>
        <span>Printed {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
      </div>
    </div>
  );
}