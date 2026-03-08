export type Difficulty = "Easy" | "Medium" | "Hard" | string;

export type LinkObj = {
  platform: string; // keep as string to match backend JSON (e.g. "leetcode", "gfg", etc.)
  url: string;
};

export interface Question {
  title: string;
  difficulty: Difficulty;
  link: {
    platform: string;
    url: string;
  };
  githubLink?: string;
}

export interface Topic {
  topic: string;
  questions: Question[];
}

export interface DSASheet {
  _id: string;
  slug: string;
  name: string;
  category?: string;
  description?: string;
  note?: string[];
  topics: {
    topic: string;
    questions: {
      title: string;
      difficulty: string;
      link: { platform: string; url: string };
      githubLink?: string;
    }[];
  }[];
}

