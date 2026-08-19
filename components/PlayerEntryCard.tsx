"use client";

import { useState } from "react";
import {
  updatePlayerEntry,
  submitScore,
} from "@/lib/entries";

type CompetitionStatus =
  | "DRAFT"
  | "OPEN"
  | "IN_PROGRESS"
  | "LEADERBOARD"
  | "COMPLETE";

type PlayerEntryCardProps = {
  competitionId: string;
  playerId: string;
  playerName: string;
  playing: boolean;
  paid: boolean;
  score?: number;
  entryFeeDue: number;
  competitionStatus: CompetitionStatus;
};

export default function PlayerEntryCard({
  competitionId,
  playerId,
  playerName,
  playing,
  paid,
  score,
  entryFeeDue,
  competitionStatus,
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

  const entriesOpen = competitionStatus === "OPEN";
  const scoringOpen =
    competitionStatus === "IN_PROGRESS";

  async function enterCompetition() {
    if (!entriesOpen) {
      setMessage("Entries are closed.");
      return;
    }

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
    if (!scoringOpen) {
      setMessage(
        "Score submission is not currently open."
      );
      return;
    }

    if (netScore.trim() === "") {
      setMessage("Please enter a score.");
      return;
    }

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

      {competitionStatus === "DRAFT" && (
        <div className="bg-gray-50 border rounded-lg p-3 text-sm">
          Entries are not open yet.
        </div>
      )}

      {competitionStatus === "LEADERBOARD" && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 text-sm">
          Competition scoring is closed. The leaderboard is now available.
        </div>
      )}

      {competitionStatus === "COMPLETE" && (
        <div className="bg-gray-50 border rounded-lg p-3 text-sm">
          This competition is complete.
        </div>
      )}

      {!entered ? (
        <>
          {entriesOpen ? (
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
            <div className="bg-gray-50 border rounded-lg p-3 text-sm">
              Entries are closed.
            </div>
          )}
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
              ⚠ Please remember to pay.
            </div>
          )}

          {scoringOpen ? (
            <>
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
          ) : competitionStatus === "OPEN" ? (
            <div className="bg-gray-50 border rounded-lg p-3 text-sm">
              Score submission will open when the competition starts.
            </div>
          ) : competitionStatus === "LEADERBOARD" ? (
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 text-sm">
              Score submission is closed.
            </div>
          ) : competitionStatus === "COMPLETE" ? (
            <div className="bg-gray-50 border rounded-lg p-3 text-sm">
              Final score: {score ?? "No score submitted"}
            </div>
          ) : null}
        </>
      )}

      {message && (
        <div className="bg-green-100 border border-green-300 rounded-lg p-3 text-center">
          {message}
        </div>
      )}

    </div>
  );
}
