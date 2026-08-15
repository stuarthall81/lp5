type Entry = {
  playing: boolean;
  score: number | null;
  entry_fee_due?: number | null;
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

  const currentEntryFees = playingEntries.reduce(
    (total, entry) => {
      const fee =
        entry.entry_fee_due != null
          ? Number(entry.entry_fee_due)
          : entryFee;

      return total + fee;
    },
    0
  );

  const prizeFund =
    currentRollover + currentEntryFees;

  // No scores = no unique winner, so everything rolls over.
  if (scoredEntries.length === 0) {
    return prizeFund;
  }

  const lowestScore = Math.min(
    ...scoredEntries.map((entry) => entry.score!)
  );

  const lowestScoreCount = scoredEntries.filter(
    (entry) => entry.score === lowestScore
  ).length;

  // Exactly one lowest score = winner, rollover resets.
  if (lowestScoreCount === 1) {
    return 0;
  }

  // Tie for lowest = entire prize fund rolls over.
  return prizeFund;
}
