"use client";

import { useState } from "react";
import {
  updatePlayerEntry,
  submitScore,
} from "@/lib/entries";

type PlayerEntryCardProps = {
  competitionId: string;
  playerId: string;
  playerName: string;
  playing: boolean;
  paid: boolean;
  score?: number;
};

export default function PlayerEntryCard({
  competitionId,
  playerId,
  playerName,
  playing,
  paid,
  score,
}: PlayerEntryCardProps) {
  const firstName = playerName.split(" ")[0];
  const heading = firstName.endsWith("s")
    ? `${firstName}' Entry`
    : `${firstName}'s Entry`;

  const [isPlaying, setIsPlaying] = useState(playing);
  const [hasPaid, setHasPaid] = useState(paid);
  const [netScore, setNetScore] = useState(
    score?.toString() ?? ""
  );
  const [entered, setEntered] = useState(playing);
  const [message, setMessage] = useState("");

  async function enterCompetition() {
    await updatePlayerEntry(
      competitionId,
      playerId,
      {
        playing: isPlaying,
        paid: hasPaid,
      }
    );

    setEntered(true);

    setMessage("Competition entry saved");

    window.location.reload();
  }

  async function submitPlayerScore() {
    await submitScore(
      competitionId,
      playerId,
      Number(netScore)
    );

    setMessage("Score submitted");

    window.location.reload();
  }

  return (
    <div className="border rounded-xl p-4 space-y-5">

      <h2 className="font-semibold text-lg">
        {heading}
      </h2>

      {!entered ? (
        <>
          <label className="flex justify-between">
            <span>I'm Playing</span>

            <input
              type="checkbox"
              checked={isPlaying}
              onChange={(e) =>
                setIsPlaying(e.target.checked)
              }
            />
          </label>

          <label className="flex justify-between">
            <span>I've Paid</span>

            <input
              type="checkbox"
              checked={hasPaid}
              onChange={(e) =>
                setHasPaid(e.target.checked)
              }
            />
          </label>

          <button
            onClick={enterCompetition}
            className="w-full bg-green-700 text-white rounded-lg py-3 font-semibold"
          >
            Enter Competition
          </button>
        </>
      ) : (
        <>
          <div className="bg-green-50 border border-green-300 rounded-lg p-3">
            ✅ You're entered
          </div>

          {!hasPaid && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 text-sm">
              ⚠ Please remember to pay before the competition closes.
            </div>
          )}

          <div>
            <label className="block mb-2 font-medium">
              Today's Net Score
            </label>

            <input
              type="number"
              value={netScore}
              onChange={(e) =>
                setNetScore(e.target.value)
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

          <button
            onClick={submitPlayerScore}
            className="w-full bg-blue-700 text-white rounded-lg py-3 font-semibold"
          >
            Submit Score
          </button>
        </>
      )}

      {message && (
        <div className="bg-green-100 border border-green-300 rounded-lg p-3 text-center">
          ✓ {message}
        </div>
      )}

    </div>
  );
}
