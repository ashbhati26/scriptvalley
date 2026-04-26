export type RoundType =
  | "Online Assessment"
  | "Technical Interview"
  | "System Design"
  | "HR Interview"
  | "Managerial Round"
  | "Group Discussion"
  | "Hackathon"
  | "Online Interview";

export type Difficulty = "Easy" | "Medium" | "Hard";
export type Outcome    = "Selected" | "Rejected" | "On Hold" | "Withdrew";
export type ExpStatus  = "pending" | "published" | "rejected";
export type SelectionType = "on-campus" | "off-campus";

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
  joiningDate?: string;       // NEW: expected joining month (YYYY-MM)
  selectionType?: SelectionType; // NEW: "on-campus" | "off-campus"
  outcome: Outcome;
  interviewDate: string;
  rounds: InterviewRound[];
  overview: string;
  tips?: string;
  minCgpa?: string;           // NEW: minimum CGPA required
  otherCriteria?: string;     // NEW: other eligibility criteria
  // Meta
  status: ExpStatus;
  createdAt: number;
  publishedAt?: number;
};

export type ExperienceFormData = Omit<
  InterviewExperience,
  "_id" | "status" | "createdAt" | "publishedAt"
>;