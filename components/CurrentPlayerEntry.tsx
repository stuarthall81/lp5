"use client";

import PlayerEntryCard from "./PlayerEntryCard";

type Entry = {
  player_id: string;
  playing: boolean;
  paid: boolean;
  score: number | null;
};

type Props = {
  competitionId: string;
  playerName: string;
  entry: Entry | null;
};

export default function CurrentPlayerEntry({
  competitionId,
  playerName,
  entry,
}: Props) {
  if (!entry) {
    return (
      <p className="text-gray-600">
        You haven't entered this competition yet.
      </p>
    );
  }

  return (
    <PlayerEntryCard
      competitionId={competitionId}
      playerId={playerName}
      playerName={playerName}
      playing={entry.playing}
      paid={entry.paid}
      score={entry.score ?? undefined}
    />
  );
}
