export type CourseTemplate = "freeform" | "structured";
export type CourseLevel    = "beginner" | "intermediate" | "advanced" | "all-levels";
export type Difficulty     = "easy" | "medium" | "hard";

export interface MCQOption {
  text:      string;
  isCorrect: boolean;
}

export interface MCQQuestion {
  question:    string;
  options:     MCQOption[];
  explanation?: string;
}

export interface CodingChallenge {
  title:       string;
  description: string;
  difficulty?: Difficulty;
  platform?:   string;
  link?:       string;
  hint?:       string;
}

// One lesson = one flowing TipTap article
export interface Lesson {
  order:          number;
  lessonNumber?:  string;
  title:          string;
  topicsCovered?: string;
  content?:       string; // TipTap HTML
}

export interface CourseModule {
  order:            number;
  title:            string;
  slug:             string;
  description?:     string;
  // freeform
  content?:         string;
  // structured
  lessons?:          Lesson[];
  mcqQuestions?:     MCQQuestion[];
  codingChallenges?: CodingChallenge[];
  miniProject?:      CodingChallenge;
}

export interface Course {
  _id:          string;
  title:        string;
  slug:         string;
  description?: string;
  template?:    CourseTemplate;
  level?:       CourseLevel;
  modules:      CourseModule[];
  status:       string;
  category?:    string;
}

export const DIFFICULTY_META: Record<Difficulty, { label: string; color: string; bg: string; border: string }> = {
  easy:   { label: "Easy",   color: "#22c55e", bg: "rgba(34,197,94,0.08)",   border: "rgba(34,197,94,0.25)"   },
  medium: { label: "Medium", color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.25)"  },
  hard:   { label: "Hard",   color: "#ef4444", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.25)"   },
};

export const PLATFORM_LABELS: Record<string, string> = {
  leetcode:     "LeetCode",
  gfg:          "GeeksForGeeks",
  codingninjas: "Coding Ninjas",
  hackerrank:   "HackerRank",
  codeforces:   "Codeforces",
  custom:       "Link",
};

// Generate a URL-safe slug from lesson title or index
export function lessonSlug(lesson: Lesson, idx: number): string {
  const base = lesson.title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 60);
  return base || `lesson-${idx + 1}`;
}