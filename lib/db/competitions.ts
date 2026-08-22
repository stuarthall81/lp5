import { supabase } from "../supabase";
import {
  getEffectiveCompetitionStatus,
} from "@/lib/competitionStatus";

export async function getCompetition(id: string) {
  const { data, error } = await supabase
    .from("competitions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function getCompetitions() {
  const { data, error } = await supabase
    .from("competitions")
    .select("*")
    .order("competition_date");

  if (error) throw error;

  return data ?? [];
}

export async function getPreviousCompetition(
  competitionDate: string
) {
  const { data, error } = await supabase
    .from("competitions")
    .select("*")
    .lt(
      "competition_date",
      competitionDate
    )
    .order("competition_date", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return data;
}

async function previousCompetitionAllowsOpening(
  competitionDate: string
) {
  const previousCompetition =
    await getPreviousCompetition(
      competitionDate
    );

  // First competition has nothing blocking it.
  if (!previousCompetition) {
    return true;
  }

  const previousStatus =
    getEffectiveCompetitionStatus(
      previousCompetition
    );

  /*
   * The next competition may open once
   * player self-entry has closed on the
   * previous competition.
   */
  return (
    previousStatus === "LEADERBOARD" ||
    previousStatus === "COMPLETE"
  );
}

export async function getEntryCompetition() {
  const competitions =
    await getCompetitions();

  /*
   * Work through competitions chronologically.
   * Only one competition can accept player
   * self-entry at a time.
   */
  for (const competition of competitions) {
    if (
      competition.status === "COMPLETE"
    ) {
      continue;
    }

    const effectiveStatus =
      getEffectiveCompetitionStatus(
        competition
      );

    /*
     * Player self-entry is allowed during
     * OPEN and IN_PROGRESS only.
     */
    if (
      effectiveStatus !== "OPEN" &&
      effectiveStatus !== "IN_PROGRESS"
    ) {
      continue;
    }

    /*
     * For a competition which is still stored
     * as DRAFT, its automatic/scheduled opening
     * cannot take effect until the previous
     * competition has closed for self-entry.
     */
    if (competition.status === "DRAFT") {
      const previousClosed =
        await previousCompetitionAllowsOpening(
          competition.competition_date
        );

      if (!previousClosed) {
        continue;
      }
    }

    return {
      ...competition,
      status: effectiveStatus,
    };
  }

  return null;
}

export async function getOpenCompetition() {
  /*
   * Kept for existing parts of LP5 which still
   * call getOpenCompetition().
   *
   * OPEN and IN_PROGRESS both count as the
   * competition currently accepting entries.
   */
  return getEntryCompetition();
}

export async function getCurrentCompetition() {
  /*
   * First preference is the competition
   * currently accepting entries.
   */
  const entryCompetition =
    await getEntryCompetition();

  if (entryCompetition) {
    return entryCompetition;
  }

  const competitions =
    await getCompetitions();

  /*
   * If self-entry has closed, keep the
   * LEADERBOARD competition player-facing
   * while scores are still being submitted.
   */
  const leaderboardCompetitions =
    competitions
      .filter(
        (competition) =>
          competition.status !==
          "COMPLETE"
      )
      .map((competition) => ({
        ...competition,
        effectiveStatus:
          getEffectiveCompetitionStatus(
            competition
          ),
      }))
      .filter(
        (competition) =>
          competition.effectiveStatus ===
          "LEADERBOARD"
      )
      .sort(
        (a, b) =>
          new Date(
            b.competition_date
          ).getTime() -
          new Date(
            a.competition_date
          ).getTime()
      );

  const leaderboardCompetition =
    leaderboardCompetitions[0];

  if (!leaderboardCompetition) {
    return null;
  }

  const {
    effectiveStatus,
    ...competition
  } = leaderboardCompetition;

  return {
    ...competition,
    status: effectiveStatus,
  };
}
