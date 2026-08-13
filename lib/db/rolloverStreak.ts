import { getCompetitions } from "@/lib/db/competitions";
import { getEntries } from "@/lib/entries";

function hasRollover(
  entries: {
    playing: boolean;
    score: number | null;
  }[]
) {
  const scoredEntries = entries.filter(
    (entry) =>
      entry.playing &&
      entry.score !== null
  );

  if (scoredEntries.length === 0) {
    return true;
  }

  const lowestScore = Math.min(
    ...scoredEntries.map((entry) => entry.score!)
  );

  const lowestScoreCount = scoredEntries.filter(
    (entry) => entry.score === lowestScore
  ).length;

  return lowestScoreCount > 1;
}

export async function getRolloverStreak(
  competitionDate: string
) {
  const competitions = await getCompetitions();

  const previousCompetitions = competitions
    .filter(
      (competition) =>
        competition.competition_date < competitionDate
    )
    .sort(
      (a, b) =>
        new Date(b.competition_date).getTime() -
        new Date(a.competition_date).getTime()
    );

  let streak = 0;

  for (const competition of previousCompetitions) {
    const entries = await getEntries(
      competition.id
    );

    if (!hasRollover(entries)) {
      break;
    }

    streak += 1;
  }

  return streak;
}
