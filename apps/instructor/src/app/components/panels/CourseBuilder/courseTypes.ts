// ─── Primitive types ──────────────────────────────────────────────────────────

export type FilterKey     = "all" | "draft" | "pending_review" | "published" | "rejected";
export type CourseLevel   = "beginner" | "intermediate" | "advanced" | "all-levels";
export type CourseTemplate = "freeform" | "structured";
export type Difficulty    = "easy" | "medium" | "hard";

export const PLATFORMS = [
  { value: "leetcode",     label: "LeetCode"      },
  { value: "gfg",          label: "GeeksForGeeks" },
  { value: "codingninjas", label: "Coding Ninjas"  },
  { value: "hackerrank",   label: "HackerRank"    },
  { value: "codeforces",   label: "Codeforces"    },
  { value: "custom",       label: "Custom URL"    },
] as const;

export const LEVELS: { value: CourseLevel; label: string }[] = [
  { value: "beginner",     label: "Beginner"     },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced",     label: "Advanced"     },
  { value: "all-levels",   label: "All Levels"   },
];

// ─── Lesson ───────────────────────────────────────────────────────────────────
// One lesson = one flowing TipTap article.
// Instructor writes theory, drops code blocks inline, adds callouts — all in one editor.

export interface Lesson {
  _key:           string;   // client-only UUID
  order:          number;
  lessonNumber?:  string;   // "1.1", "2.3" — optional display label
  title:          string;
  topicsCovered?: string;   // short plain-text summary shown in lesson list
  content?:       string;   // TipTap HTML — the full flowing article
}

// ─── MCQ ─────────────────────────────────────────────────────────────────────

export interface MCQOption {
  text:      string;
  isCorrect: boolean;         // supports multi-correct
}

export interface MCQQuestion {
  _key:         string;       // client-only UUID
  question:     string;
  options:      MCQOption[];  // flexible count
  explanation?: string;       // shown after answering
}

// ─── Coding challenge / mini project ─────────────────────────────────────────

export interface CodingChallenge {
  _key:        string;
  title:       string;
  description: string;
  difficulty?: Difficulty;
  platform?:   string;
  link?:       string;
  hint?:       string;
}

// ─── Module ───────────────────────────────────────────────────────────────────
// Module holds lessons (the content) + module-level assessments.
// MCQs, challenges, mini project are at module level — not lesson level.

export interface Module {
  _key:             string;
  order:            number;
  title:            string;
  slug:             string;
  description?:     string;
  // freeform mode — single TipTap per module (backward compat)
  content?:         string;
  // structured mode
  lessons:          Lesson[];
  mcqQuestions:     MCQQuestion[];
  codingChallenges: CodingChallenge[];
  miniProject?:     CodingChallenge;
}

// ─── Course ───────────────────────────────────────────────────────────────────

export interface CourseForm {
  _id?:             string;
  title:            string;
  slug:             string;
  description?:     string;
  template?:        CourseTemplate;
  level?:           CourseLevel;
  status?:          string;
  modules:          Module[];
  createdAt?:       number;
  rejectionReason?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function makeSlug(v = "") {
  return v.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function emptyLesson(order: number): Lesson {
  return { _key: crypto.randomUUID(), order, title: "", content: "" };
}

export function emptyMCQ(): MCQQuestion {
  return {
    _key:     crypto.randomUUID(),
    question: "",
    options:  [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  };
}

export function emptyCodingChallenge(): CodingChallenge {
  return { _key: crypto.randomUUID(), title: "", description: "" };
}

export function emptyModule(order: number): Module {
  return {
    _key:             crypto.randomUUID(),
    order,
    title:            "",
    slug:             `module-${order + 1}`,
    lessons:          [],
    mcqQuestions:     [],
    codingChallenges: [],
  };
}

// Strip client _keys before sending to Convex
export function stripKeys(modules: Module[]) {
  return modules.map((m, i) => ({
    order:       i,
    title:       m.title.trim(),
    slug:        makeSlug(m.title) || m.slug,
    description: m.description?.trim() || undefined,
    content:     m.content || undefined,
    lessons: (m.lessons ?? []).map((l, li) => ({
      order:         li,
      lessonNumber:  l.lessonNumber?.trim() || undefined,
      title:         l.title.trim(),
      topicsCovered: l.topicsCovered?.trim() || undefined,
      content:       l.content || undefined,
    })),
    mcqQuestions: (m.mcqQuestions ?? []).map((q) => ({
      question:    q.question,
      options:     q.options,
      explanation: q.explanation || undefined,
    })),
    codingChallenges: (m.codingChallenges ?? []).map((c) => ({
      title:       c.title,
      description: c.description,
      difficulty:  c.difficulty,
      platform:    c.platform  || undefined,
      link:        c.link      || undefined,
      hint:        c.hint      || undefined,
    })),
    miniProject: m.miniProject ? {
      title:       m.miniProject.title,
      description: m.miniProject.description,
      difficulty:  m.miniProject.difficulty,
      platform:    m.miniProject.platform || undefined,
      link:        m.miniProject.link     || undefined,
      hint:        m.miniProject.hint     || undefined,
    } : undefined,
  }));
}

// Hydrate raw Convex data → client Module[] (add _keys)
export function hydrateModules(raw: any[]): Module[] {
  return (raw ?? []).map((m, i) => ({
    _key:        crypto.randomUUID(),
    order:       m.order ?? i,
    title:       m.title ?? "",
    slug:        m.slug  ?? `module-${i + 1}`,
    description: m.description,
    content:     m.content,
    lessons: (m.lessons ?? []).map((l: any, li: number) => ({
      _key:          crypto.randomUUID(),
      order:         l.order ?? li,
      lessonNumber:  l.lessonNumber,
      title:         l.title ?? "",
      topicsCovered: l.topicsCovered,
      content:       l.content ?? "",
    })),
    mcqQuestions: (m.mcqQuestions ?? []).map((q: any) => ({
      _key:        crypto.randomUUID(),
      question:    q.question ?? "",
      options:     q.options  ?? [],
      explanation: q.explanation,
    })),
    codingChallenges: (m.codingChallenges ?? []).map((c: any) => ({
      _key:        crypto.randomUUID(),
      title:       c.title       ?? "",
      description: c.description ?? "",
      difficulty:  c.difficulty,
      platform:    c.platform,
      link:        c.link,
      hint:        c.hint,
    })),
    miniProject: m.miniProject ? {
      _key:        crypto.randomUUID(),
      title:       m.miniProject.title       ?? "",
      description: m.miniProject.description ?? "",
      difficulty:  m.miniProject.difficulty,
      platform:    m.miniProject.platform,
      link:        m.miniProject.link,
      hint:        m.miniProject.hint,
    } : undefined,
  }));
}

// ─── Status meta ──────────────────────────────────────────────────────────────

export const STATUS_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  draft:          { label: "Draft",     color: "var(--text-faint)", bg: "var(--bg-hover)",      border: "var(--border-subtle)"  },
  pending_review: { label: "In Review", color: "#d97706",           bg: "rgba(217,119,6,0.08)", border: "rgba(217,119,6,0.20)" },
  published:      { label: "Published", color: "var(--brand)",      bg: "var(--brand-subtle)",  border: "var(--brand-border)"  },
  rejected:       { label: "Rejected",  color: "#dc2626",           bg: "rgba(220,38,38,0.08)", border: "rgba(220,38,38,0.20)" },
};