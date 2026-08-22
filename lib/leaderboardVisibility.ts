type CompetitionLike = {
  competition_date: string;
  status: string | null;
};

export function isLeaderboardVisible(
  competition: CompetitionLike
) {
  if (
    competition.status === "LEADERBOARD" ||
    competition.status === "COMPLETE"
  ) {
    return true;
  }

  const now = new Date();

  const parts = new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: "Europe/London",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }
  ).formatToParts(now);

  const values = Object.fromEntries(
    parts.map((part) => [
      part.type,
      part.value,
    ])
  );

  const today =
    `${values.year}-${values.month}-${values.day}`;

  const currentMinutes =
    Number(values.hour) * 60 +
    Number(values.minute);

  if (today > competition.competition_date) {
    return true;
  }

  if (today < competition.competition_date) {
    return false;
  }

  // Default leaderboard release = 16:00.
  return currentMinutes >= 16 * 60;
}
