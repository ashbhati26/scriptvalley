import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type ProgressData = {
  total:  { completed: number; total: number };
  easy:   { completed: number; total: number };
  medium: { completed: number; total: number };
  hard:   { completed: number; total: number };
};

type Topic = {
  topic: string;
  questions: { title: string; link: { platform: string; url: string }; difficulty: string }[];
};

type SheetProgressCardProps = {
  progress: ProgressData;
  topics?: Topic[];
};

// Difficulty colors are semantic data colors — kept hardcoded
function DiffBar({
  label, completed, total, color,
}: { label: string; completed: number; total: number; color: string }) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium" style={{ color }}>{label}</span>
        <span className="text-[10px] text-[var(--text-disabled)]">{completed}/{total}</span>
      </div>
      <div className="h-1 rounded-full bg-[var(--bg-hover)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function SheetProgressCard({ progress, topics = [] }: SheetProgressCardProps) {
  const totalPct = Math.round(
    (progress.total.completed / Math.max(1, progress.total.total)) * 100 || 0,
  );

  return (
    <div className="space-y-6 mb-8">

      {/* Progress panel */}
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] overflow-hidden">
        <div className="px-4 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-input)]">
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">Your Progress</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-4 sm:p-5">
          {/* Circular donut — brand blue path intentionally hardcoded */}
          <div className="flex flex-col items-center shrink-0">
            <div className="w-[88px] h-[88px]">
              <CircularProgressbar
                value={totalPct}
                text={`${totalPct}%`}
                styles={buildStyles({
                  pathColor:  "#3A5EFF",
                  textColor:  "var(--text-primary)" as string,
                  trailColor: "var(--bg-hover)"     as string,
                  textSize:   "22px",
                })}
              />
            </div>
            <p className="text-[10px] text-[var(--text-disabled)] mt-2 uppercase tracking-widest">
              {progress.total.completed} / {progress.total.total}
            </p>
          </div>

          {/* Vertical divider */}
          <div className="hidden sm:block h-16 w-px bg-[var(--border-subtle)]" />

          {/* Diff bars */}
          <div className="flex flex-col sm:flex-row flex-1 gap-4">
            <DiffBar label="Easy"   completed={progress.easy.completed}   total={progress.easy.total}   color="#22c55e" />
            <div className="hidden sm:block h-12 w-px bg-[var(--border-subtle)] self-center" />
            <DiffBar label="Medium" completed={progress.medium.completed} total={progress.medium.total} color="#f59e0b" />
            <div className="hidden sm:block h-12 w-px bg-[var(--border-subtle)] self-center" />
            <DiffBar label="Hard"   completed={progress.hard.completed}   total={progress.hard.total}   color="#ef4444" />
          </div>
        </div>
      </div>

      {/* Topics covered chips */}
      {topics.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-2">
            Topics Covered
          </p>
          <div className="flex flex-wrap gap-1.5">
            {topics.map((topic, i) => (
              <span
                key={i}
                className="text-xs text-[var(--text-faint)] bg-[var(--bg-hover)] border border-[var(--border-subtle)] rounded-md px-2.5 py-1"
              >
                {topic.topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}