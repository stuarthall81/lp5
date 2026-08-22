type CompetitionLike = {
  competition_date: string;
  status: string | null;
  opens_at?: string | null;
  starts_at?: string | null;
  leaderboard_at?: string | null;
};

type EffectiveStatus =
  | "DRAFT"
  | "OPEN"
  | "IN_PROGRESS"
  | "LEADERBOARD"
  | "COMPLETE";

function getLondonDateTime(
  competitionDate: string,
  hour: number,
  minute: number
) {
  /*
   * We convert the competition-day local London time
   * into an absolute timestamp.
   *
   * The +01:00 / +00:00 offset is determined from
   * Europe/London automatically by Intl.
   */

  const noonUtc = new Date(
    `${competitionDate}T12:00:00Z`
  );

  const formatter =
    new Intl.DateTimeFormat(
      "en-GB",
      {
        timeZone: "Europe/London",
        timeZoneName: "longOffset",
      }
    );

  const parts =
    formatter.formatToParts(noonUtc);

  const offsetPart =
    parts.find(
      (part) =>
        part.type === "timeZoneName"
    )?.value;

  let offset = "+00:00";

  if (offsetPart) {
    const match =
      offsetPart.match(
        /GMT([+-]\d{2}:\d{2})/
      );

    if (match) {
      offset = match[1];
    }
  }

  const hh =
    String(hour).padStart(2, "0");

  const mm =
    String(minute).padStart(2, "0");

  return new Date(
    `${competitionDate}T${hh}:${mm}:00${offset}`
  );
}

function getOpenTime(
  competition: CompetitionLike
) {
  if (competition.opens_at) {
    return new Date(
      competition.opens_at
    );
  }

  return getLondonDateTime(
    competition.competition_date,
    0,
    1
  );
}

function getStartTime(
  competition: CompetitionLike
) {
  if (competition.starts_at) {
    return new Date(
      competition.starts_at
    );
  }

  return getLondonDateTime(
    competition.competition_date,
    9,
    0
  );
}

function getLeaderboardTime(
  competition: CompetitionLike
) {
  if (competition.leaderboard_at) {
    return new Date(
      competition.leaderboard_at
    );
  }

  return getLondonDateTime(
    competition.competition_date,
    16,
    0
  );
}

export function getEffectiveCompetitionStatus(
  competition: CompetitionLike
): EffectiveStatus {
  /*
   * COMPLETE is always final.
   */
  if (
    competition.status === "COMPLETE"
  ) {
    return "COMPLETE";
  }

  /*
   * Manual status may move a competition
   * forward earlier than its scheduled times.
   */
  if (
    competition.status === "LEADERBOARD"
  ) {
    return "LEADERBOARD";
  }

  if (
    competition.status === "IN_PROGRESS"
  ) {
    const now = new Date();

    if (
      now >=
      getLeaderboardTime(
        competition
      )
    ) {
      return "LEADERBOARD";
    }

    return "IN_PROGRESS";
  }

  if (
    competition.status === "OPEN"
  ) {
    const now = new Date();

    if (
      now >=
      getLeaderboardTime(
        competition
      )
    ) {
      return "LEADERBOARD";
    }

    if (
      now >=
      getStartTime(
        competition
      )
    ) {
      return "IN_PROGRESS";
    }

    return "OPEN";
  }

  /*
   * DRAFT competitions progress automatically
   * according to their configured/default times.
   */
  const now = new Date();

  if (
    now >=
    getLeaderboardTime(
      competition
    )
  ) {
    return "LEADERBOARD";
  }

  if (
    now >=
    getStartTime(
      competition
    )
  ) {
    return "IN_PROGRESS";
  }

  if (
    now >=
    getOpenTime(
      competition
    )
  ) {
    return "OPEN";
  }

  return "DRAFT";
}

export function getCompetitionStatusLabel(
  competition: CompetitionLike
) {
  const status =
    getEffectiveCompetitionStatus(
      competition
    );

  switch (status) {
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
