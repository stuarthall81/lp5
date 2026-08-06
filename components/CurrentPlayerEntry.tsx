"use client";

import PlayerEntryCard from "./PlayerEntryCard";

type Player = {
  id: string;
  display_name: string;
};

type Entry = {
  player_id: string;
  playing: boolean;
  paid: boolean;
  score: number | null;
};

type Props = {
  competitionId: string;
  player: Player | null;
  entry: Entry | null;
};

export default function CurrentPlayerEntry({
  competitionId,
  player,
  entry,
}: Props) {
  if (!player) {
    return (
      <p className="text-gray-600">
        Please log in.
      </p>
    );
  }

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
      playerId={player.id}
      playerName={player.display_name}
      playing={entry.playing}
      paid={entry.paid}
      score={entry.score ?? undefined}
    />
  );
}
