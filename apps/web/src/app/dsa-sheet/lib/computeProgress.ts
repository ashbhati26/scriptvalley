// ./src/app/dsa-sheet/lib/computeProgress.ts

export type Difficulty = "easy" | "medium" | "hard";

export type Question = {
  title: string;
  difficulty: string;
};

export type Topic = {
  topic: string;
  questions: Question[];
};

export type Sheet = {
  topics: Topic[];
};

export type Attempt = {
  questionTitle: string;
  attempted: boolean;
};

export type ProgressData = {
  total: { completed: number; total: number };
  easy: { completed: number; total: number };
  medium: { completed: number; total: number };
  hard: { completed: number; total: number };
};

export function computeProgress({
  sheet,
  localAttempts,
  attempts,
}: {
  sheet: Sheet;
  localAttempts: Record<string, boolean>;
  attempts: Attempt[] | undefined;
}): ProgressData {
  const progress: ProgressData = {
    total: { completed: 0, total: 0 },
    easy: { completed: 0, total: 0 },
    medium: { completed: 0, total: 0 },
    hard: { completed: 0, total: 0 },
  };

  // Create a quick-access map from global attempts
  const attemptedMap = new Map(
    attempts?.filter((a) => a.attempted).map((a) => [a.questionTitle, true])
  );

  sheet.topics.forEach((topic) => {
    topic.questions.forEach((q) => {
      const key = `${topic.topic}_${q.title}`;
      const isLocal = localAttempts[key];
      const isGlobal = attemptedMap.get(q.title);

      const attempted = isLocal || isGlobal;
      const diff = q.difficulty.toLowerCase() as Difficulty;

      progress[diff].total += 1;
      progress.total.total += 1;

      if (attempted) {
        progress[diff].completed += 1;
        progress.total.completed += 1;
      }
    });
  });

  return progress;
}
