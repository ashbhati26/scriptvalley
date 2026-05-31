// ─── DSA Sheet Types ──────────────────────────────────────────────────────────

export type FilterStatus = "all" | "draft" | "pending_review" | "published" | "rejected";
export type Difficulty   = "Easy" | "Medium" | "Hard";

export interface LinkObj {
  platform: string;
  url:      string;
}

export interface Question {
  title:      string;
  link:       LinkObj;
  difficulty: Difficulty;
  notes?:     string;
}

export interface SubTopic {
  _key:      string;
  name:      string;
  questions: Question[];
}

export interface Topic {
  _key:         string;
  topic:        string;
  questions:    Question[];
  subTopics?:   SubTopic[];
  useSubTopics: boolean;
}

export interface SheetForm {
  _id?:             string;
  name:             string;
  category:         string;
  description:      string;
  notes:            string[];
  topics:           Topic[];
  status?:          string;
  rejectionReason?: string;
  createdAt?:       number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  Easy:   "#4ade80",
  Medium: "#f59e0b",
  Hard:   "#f87171",
};

export const PLATFORM_OPTIONS = [
  { key: "leetcode",    label: "LeetCode"    },
  { key: "gfg",         label: "GFG"         },
  { key: "hackerrank",  label: "HackerRank"  },
  { key: "hackerearth", label: "HackerEarth" },
  { key: "codechef",    label: "CodeChef"    },
  { key: "codeforces",  label: "Codeforces"  },
  { key: "others",      label: "Others"      },
] as const;

export const CATEGORY_OPTIONS = [
  "Popular",
  "Complete DSA",
  "Quick Revision",
  "Topic Specific",
  "Interview Prep",
] as const;

// STATUS_META — Linear token-aligned
export const STATUS_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  draft:          { label: "Draft",     color: "var(--text-faint)",  bg: "var(--bg-hover)",        border: "var(--border-subtle)"   },
  pending_review: { label: "In Review", color: "var(--warning)",     bg: "var(--warning-bg)",       border: "var(--warning-border)"  },
  published:      { label: "Published", color: "var(--brand)",       bg: "var(--brand-subtle)",     border: "var(--brand-border)"    },
  rejected:       { label: "Rejected",  color: "var(--danger)",      bg: "var(--danger-bg)",        border: "var(--danger-border)"   },
};

// ─── Factory helpers ──────────────────────────────────────────────────────────

export function emptyQuestion(): Question {
  return { title: "", link: { platform: "leetcode", url: "" }, difficulty: "Medium" };
}

export function emptySubTopic(): SubTopic {
  return { _key: crypto.randomUUID(), name: "New Sub-topic", questions: [] };
}

export function emptyTopic(): Topic {
  return {
    _key:         crypto.randomUUID(),
    topic:        "New Topic",
    questions:    [],
    subTopics:    [],
    useSubTopics: false,
  };
}

export function makeSlug(v = "") {
  return v.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function stripSheetKeys(topics: Topic[]) {
  return topics.map((t) => ({
    topic:        t.topic.trim(),
    useSubTopics: t.useSubTopics,
    questions: t.useSubTopics
      ? []
      : t.questions.filter((q) => q.title.trim()).map((q) => ({
          title:      q.title.trim(),
          link:       q.link,
          difficulty: q.difficulty,
          notes:      q.notes?.trim() || undefined,
        })),
    subTopics: t.useSubTopics
      ? (t.subTopics ?? []).map((st) => ({
          name:      st.name.trim(),
          questions: st.questions.filter((q) => q.title.trim()).map((q) => ({
            title:      q.title.trim(),
            link:       q.link,
            difficulty: q.difficulty,
            notes:      q.notes?.trim() || undefined,
          })),
        }))
      : [],
  }));
}

export function hydrateTopics(raw: any[]): Topic[] {
  return (raw ?? []).map((t) => ({
    _key:         crypto.randomUUID(),
    topic:        t.topic ?? "",
    useSubTopics: t.useSubTopics ?? false,
    questions:    (t.questions ?? []).map((q: any) => ({
      title:      q.title ?? "",
      link:       q.link  ?? { platform: "leetcode", url: "" },
      difficulty: q.difficulty ?? "Medium",
      notes:      q.notes,
    })),
    subTopics: (t.subTopics ?? []).map((st: any) => ({
      _key:      crypto.randomUUID(),
      name:      st.name ?? "",
      questions: (st.questions ?? []).map((q: any) => ({
        title:      q.title ?? "",
        link:       q.link  ?? { platform: "leetcode", url: "" },
        difficulty: q.difficulty ?? "Medium",
        notes:      q.notes,
      })),
    })),
  }));
}

export function countQuestions(topics: Topic[]): number {
  return topics.reduce((a, t) => {
    if (t.useSubTopics) {
      return a + (t.subTopics ?? []).reduce((b, st) => b + st.questions.length, 0);
    }
    return a + t.questions.length;
  }, 0);
}