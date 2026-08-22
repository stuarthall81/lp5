"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminAddPlayerToCompetition } from "@/app/admin/competitionEntryActions";

type AvailablePlayer = {
  id: string;
  display_name: string;
};

type Props = {
  competitionId: string;
  players: AvailablePlayer[];
};

export default function AdminAddPlayerToCompetition({
  competitionId,
  players,
}: Props) {
  const router = useRouter();

  const [playerId, setPlayerId] =
    useState("");
  const [message, setMessage] =
    useState("");
  const [saving, setSaving] =
    useState(false);

  async function handleAddPlayer() {
    setMessage("");

    if (!playerId) {
      setMessage(
        "Please select a player."
      );
      return;
    }

    setSaving(true);

    const result =
      await adminAddPlayerToCompetition(
        competitionId,
        playerId
      );

    setSaving(false);
    setMessage(result.message);

    if (result.success) {
      setPlayerId("");
      router.refresh();
    }
  }

  if (players.length === 0) {
    return (
      <p className="text-sm text-gray-600">
        All active players are already
        entered.
      </p>
    );
  }

  return (
    <div>
      <select
        value={playerId}
        onChange={(e) =>
          setPlayerId(e.target.value)
        }
        className="w-full border rounded-lg p-3 mb-3"
      >
        <option value="">
          Select player
        </option>

        {players.map((player) => (
          <option
            key={player.id}
            value={player.id}
          >
            {player.display_name}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={handleAddPlayer}
        disabled={saving}
        className="w-full bg-green-700 text-white rounded-xl py-3 font-semibold disabled:opacity-50"
      >
        {saving
          ? "Adding..."
          : "Add Player to Competition"}
      </button>

      {message && (
        <div className="mt-3 border rounded-lg p-3 text-sm">
          {message}
        </div>
      )}
    </div>
  );
}
