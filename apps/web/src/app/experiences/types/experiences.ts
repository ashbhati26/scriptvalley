export type RoundType =
  | "Online Assessment"
  | "Technical Interview"
  | "System Design"
  | "HR Interview"
  | "Managerial Round"
  | "Group Discussion";

export type Difficulty = "Easy" | "Medium" | "Hard";
export type Outcome    = "Selected" | "Rejected" | "On Hold" | "Withdrew";
export type ExpStatus  = "pending" | "published" | "rejected";

export type InterviewRound = {
  type: RoundType;
  description: string;
  duration?: string;
  difficulty?: Difficulty;
};

export type InterviewExperience = {
  _id: string;
  slug: string;
  name: string;
  email: string;
  linkedinUrl: string;
  company: string;
  role: string;
  location?: string;
  package?: string;
  outcome: Outcome;
  interviewDate: string;
  rounds: InterviewRound[];
  overview: string;
  tips?: string;
  // Meta
  status: ExpStatus;
  createdAt: number;
  publishedAt?: number;
};

export type ExperienceFormData = Omit<
  InterviewExperience,
  "_id" | "status" | "createdAt" | "publishedAt"
>;