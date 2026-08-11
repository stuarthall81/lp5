import { calculatePrizeFund } from "@/lib/prizeFund";

type Entry = {
  playing: boolean;
  score: number | null;
};

export function calculateCarryForward(
  entries: Entry[],
  entryFee: number,
  currentRollover: number
) {
  const playingEntries = entries.filter(
    (entry) => entry.playing
  );

  const scoredEntries = playingEntries.filter(
    (entry) => entry.score !== null
  );

  const prizeFund = calculatePrizeFund(
    playingEntries.length,
    entryFee,
    currentRollover
  );

  // No scores means there is no unique winner.
  if (scoredEntries.length === 0) {
    return prizeFund;
  }

  const lowestScore = Math.min(
    ...scoredEntries.map((entry) => entry.score!)
  );

  const lowestScoreCount = scoredEntries.filter(
    (entry) => entry.score === lowestScore
  ).length;

  // One player has the lowest score = winner.
  if (lowestScoreCount === 1) {
    return 0;
  }

  // Two or more players tied for lowest = rollover.
  return prizeFund;
}
