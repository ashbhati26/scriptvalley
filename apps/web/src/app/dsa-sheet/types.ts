export type Difficulty = "Easy" | "Medium" | "Hard" | string;

export type LinkObj = {
  platform: string; // keep as string to match backend JSON (e.g. "leetcode", "gfg", etc.)
  url: string;
};

export interface Question {
  title:       string;
  difficulty:  Difficulty;
  link: {
    platform: string;
    url:      string;
  };
  githubLink?: string;
  notes?:      string;
}

// Sub-topic — used when a topic has useSubTopics = true (Striver-style sheets)
export interface SubTopic {
  name:      string;
  questions: Question[];
}

export interface Topic {
  topic:        string;
  questions:    Question[];
  // Sub-topic fields — present when the instructor used the sub-topics mode
  useSubTopics: boolean;
  subTopics?:   SubTopic[];
}

export interface DSASheet {
  _id:          string;
  slug:         string;
  name:         string;
  category?:    string;
  description?: string;
  note?:        string[];
  topics: Topic[];
}