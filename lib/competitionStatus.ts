type CompetitionLike = {
  status: string | null;
  opens_at?: string | null;
};

export function getEffectiveCompetitionStatus(
  competition: CompetitionLike
) {
  if (
    competition.status === "DRAFT" &&
    competition.opens_at
  ) {
    const opensAt = new Date(
      competition.opens_at
    );

    const now = new Date();

    if (opensAt <= now) {
      return "OPEN_SCHEDULED";
    }
  }

  return competition.status ?? "DRAFT";
}

export function getCompetitionStatusLabel(
  competition: CompetitionLike
) {
  const effectiveStatus =
    getEffectiveCompetitionStatus(
      competition
    );

  switch (effectiveStatus) {
    case "OPEN_SCHEDULED":
      return "OPEN (scheduled)";

    case "OPEN":
      return "OPEN";

    case "IN_PROGRESS":
      return "IN PROGRESS";

    case "LEADERBOARD":
      return "LEADERBOARD";

    case "COMPLETE":
      return "COMPLETE";

    default:
      return "DRAFT";
  }
}
