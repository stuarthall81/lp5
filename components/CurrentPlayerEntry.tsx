"use client";

import { getCurrentPlayer } from "@/lib/player";
import { playerEntries } from "@/data/playerEntries";
import PlayerEntryCard from "./PlayerEntryCard";
import { useEffect, useState } from "react";

type Props = {
  competitionId: string;
};

export default function CurrentPlayerEntry({
  competitionId,
}: Props) {
  const [player, setPlayer] = useState("");

  useEffect(() => {
    const current = getCurrentPlayer();

    if (current) {
      setPlayer(current);
    }
  }, []);

  if (!player) return null;

  const entry = playerEntries.find(
    (e) =>
      e.playerId === player &&
      e.competitionId === competitionId
  );

  if (!entry) return null;

  return (
    <PlayerEntryCard
      competitionId={competitionId}
      playerId={player}
      playerName={player}
      playing={entry.playing}
      paid={entry.paid}
      score={entry.score}
    />
  );
}