import { getCompetitions } from "@/lib/db/competitions";
import { getEntries } from "@/lib/entries";

type CompetitionRow = {
  id: string;
  competition_date: string;
  entry_fee: number;
};

function competitionRolledOver(
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

  const playersOnLowestScore =
    scoredEntries.filter(
      (entry) => entry.score === lowestScore
    ).length;

  return playersOnLowestScore !== 1;
}

export async function calculatePlayerEntryFee(
  playerId: string,
  currentCompetition: CompetitionRow
) {
  const competitions = await getCompetitions();

  const previousCompetitions = competitions
    .filter(
      (competition) =>
        competition.competition_date <
        currentCompetition.competition_date
    )
    .sort(
      (a, b) =>
        new Date(b.competition_date).getTime() -
        new Date(a.competition_date).getTime()
    );

  const rolloverChain: CompetitionRow[] = [];

  for (const competition of previousCompetitions) {
    const entries = await getEntries(
      competition.id
    );

    if (!competitionRolledOver(entries)) {
      break;
    }

    rolloverChain.unshift(competition);
  }

  const totalRequired =
    currentCompetition.entry_fee +
    rolloverChain.reduce(
      (total, competition) =>
        total + competition.entry_fee,
      0
    );

  let alreadyPaid = 0;

  for (const competition of rolloverChain) {
    const entries = await getEntries(
      competition.id
    );

    const playerEntry = entries.find(
      (entry) =>
        entry.player_id === playerId &&
        entry.paid
    );

    if (playerEntry?.entry_fee_due) {
      alreadyPaid += Number(
        playerEntry.entry_fee_due
      );
    }
  }

  return Math.max(
    currentCompetition.entry_fee,
    totalRequired - alreadyPaid
  );
}
