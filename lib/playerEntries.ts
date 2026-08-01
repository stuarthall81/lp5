import { playerEntries } from "@/data/playerEntries";
import { PlayerEntry } from "@/types/playerEntry";

export function getPlayerEntry(
  competitionId: string,
  playerId: string
): PlayerEntry | undefined {
  return playerEntries.find(
    (entry) =>
      entry.competitionId === competitionId &&
      entry.playerId === playerId
  );
}

export function updatePlayerEntry(
  competitionId: string,
  playerId: string,
  updates: Partial<PlayerEntry>
): PlayerEntry {
  let entry = getPlayerEntry(
    competitionId,
    playerId
  );

  if (!entry) {
    entry = {
      competitionId,
      playerId,
      playing: false,
      paid: false,
    };

    playerEntries.push(entry);
  }

  Object.assign(entry, updates);

  return entry;
}

export function submitScore(
  competitionId: string,
  playerId: string,
  score: number
) {
  return updatePlayerEntry(
    competitionId,
    playerId,
    {
      score,
    }
  );
}
