"use client";

import PlayerEntryCard from "./PlayerEntryCard";

type Entry = {
  player_id: string;
  playing: boolean;
  paid: boolean;
  score: number | null;
  entry_fee_due?: number | null;
};

type Player = {
  id: string;
  display_name: string;
};

type Props = {
  competitionId: string;
  player: Player | null;
  entry: Entry | null;
  entryFeeDue: number | null;
};

export default function CurrentPlayerEntry({
  competitionId,
  player,
  entry,
  entryFeeDue,
}: Props) {
  if (!player) {
    return (
      <p className="text-gray-600">
        Please log in to enter this competition.
      </p>
    );
  }

  return (
    <PlayerEntryCard
      competitionId={competitionId}
      playerId={player.id}
      playerName={player.display_name}
      playing={entry?.playing ?? false}
      paid={entry?.paid ?? false}
      score={entry?.score ?? undefined}
      entryFeeDue={entryFeeDue ?? 0}
    />
  );
}
