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
  entryFeeDue: number;
};

export default function PlayerEntryCard({
  competitionId,
  playerId,
  playerName,
  playing,
  paid,
  score,
  entryFeeDue,
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
        entryFeeDue,
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
  }

  return (
    <div className="border rounded-xl p-4 space-y-5">

      <h2 className="font-semibold text-lg">
        {heading}
      </h2>

      {!entered ? (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex justify-between font-semibold">
              <span>Your Entry Fee</span>
              <span>£{entryFeeDue}</span>
            </div>

            {entryFeeDue > 5 && (
              <p className="text-sm text-gray-600 mt-1">
                Includes rollover catch-up from previous competitions.
              </p>
            )}
          </div>

          <label className="flex justify-between">
            <span>I&apos;m Playing</span>

            <input
              type="checkbox"
              checked={isPlaying}
              onChange={(e) =>
                setIsPlaying(e.target.checked)
              }
            />
          </label>

          <label className="flex justify-between">
            <span>I&apos;ve Paid</span>

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
            ✅ You&apos;re entered
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex justify-between font-semibold">
              <span>Entry Fee</span>
              <span>£{entryFeeDue}</span>
            </div>
          </div>

          {!hasPaid && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 text-sm">
              ⚠ Please remember to pay before the competition closes.
            </div>
          )}

          <div>
            <label className="block mb-2 font-medium">
              Today&apos;s Net Score
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
