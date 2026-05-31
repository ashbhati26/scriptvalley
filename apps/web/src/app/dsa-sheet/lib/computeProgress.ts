export type Difficulty = "easy" | "medium" | "hard";

export type Question = {
  title:      string;
  difficulty: string;
};

export type SubTopic = {
  name:      string;
  questions: Question[];
};

export type Topic = {
  topic:        string;
  questions:    Question[];
  useSubTopics: boolean;
  subTopics?:   SubTopic[];
};

export type Sheet = {
  topics: Topic[];
};

export type Attempt = {
  questionTitle: string;
  attempted:     boolean;
};

export type ProgressData = {
  total:  { completed: number; total: number };
  easy:   { completed: number; total: number };
  medium: { completed: number; total: number };
  hard:   { completed: number; total: number };
};

export function computeProgress({
  sheet,
  localAttempts,
  attempts,
}: {
  sheet:         Sheet;
  localAttempts: Record<string, boolean>;
  attempts:      Attempt[] | undefined;
}): ProgressData {
  const progress: ProgressData = {
    total:  { completed: 0, total: 0 },
    easy:   { completed: 0, total: 0 },
    medium: { completed: 0, total: 0 },
    hard:   { completed: 0, total: 0 },
  };

  // Quick-access map: questionTitle → attempted
  const attemptedMap = new Map(
    attempts?.filter((a) => a.attempted).map((a) => [a.questionTitle, true])
  );

  function countQuestion(topicName: string, q: Question) {
    const key       = `${topicName}_${q.title}`;
    const isLocal   = localAttempts[key];
    const isGlobal  = attemptedMap.get(q.title);
    const attempted = isLocal || isGlobal;

    // Normalise to lower-case; fall back to "medium" for unknown values
    const raw  = q.difficulty?.toLowerCase() ?? "medium";
    const diff = (["easy", "medium", "hard"].includes(raw) ? raw : "medium") as Difficulty;

    progress[diff].total       += 1;
    progress.total.total       += 1;

    if (attempted) {
      progress[diff].completed   += 1;
      progress.total.completed   += 1;
    }
  }

  sheet.topics.forEach((topic) => {
    if (topic.useSubTopics && topic.subTopics?.length) {
      // ── Sub-topics mode (Striver-style) ─────────────────────────────────
      topic.subTopics.forEach((st) => {
        st.questions.forEach((q) => countQuestion(topic.topic, q));
      });
    } else {
      // ── Flat questions mode ──────────────────────────────────────────────
      topic.questions.forEach((q) => countQuestion(topic.topic, q));
    }
  });

  return progress;
}