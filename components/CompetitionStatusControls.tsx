"use client";

import { useEffect, useState } from "react";
import { updateCompetitionStatus } from "@/app/admin/competitionStatusActions";

type CompetitionStatus =
  | "DRAFT"
  | "OPEN"
  | "IN_PROGRESS"
  | "LEADERBOARD"
  | "COMPLETE";

type Props = {
  competitionId: string;
  currentStatus: CompetitionStatus;
};

export default function CompetitionStatusControls({
  competitionId,
  currentStatus,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function changeStatus(
    newStatus: CompetitionStatus
  ) {
    setMessage("");
    setSaving(true);

    const result = await updateCompetitionStatus(
      competitionId,
      newStatus
    );

    if (!result.success) {
      setMessage(result.message);
      setSaving(false);
      return;
    }

    window.location.reload();
  }

  if (!mounted) {
    return (
      <div className="text-sm text-gray-500">
        Loading competition controls...
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">
        Current status: {currentStatus}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        <button
          type="button"
          onClick={() => changeStatus("DRAFT")}
          disabled={
            saving ||
            currentStatus === "DRAFT"
          }
          className="w-full bg-gray-700 text-white rounded-xl py-3 font-semibold disabled:opacity-40"
        >
          Set Draft
        </button>

        <button
          type="button"
          onClick={() => changeStatus("OPEN")}
          disabled={
            saving ||
            currentStatus === "OPEN"
          }
          className="w-full bg-green-700 text-white rounded-xl py-3 font-semibold disabled:opacity-40"
        >
          Open Entries
        </button>

        <button
          type="button"
          onClick={() =>
            changeStatus("IN_PROGRESS")
          }
          disabled={
            saving ||
            currentStatus === "IN_PROGRESS"
          }
          className="w-full bg-blue-700 text-white rounded-xl py-3 font-semibold disabled:opacity-40"
        >
          Start Competition
        </button>

        <button
          type="button"
          onClick={() =>
            changeStatus("LEADERBOARD")
          }
          disabled={
            saving ||
            currentStatus === "LEADERBOARD"
          }
          className="w-full bg-yellow-600 text-white rounded-xl py-3 font-semibold disabled:opacity-40"
        >
          Release Leaderboard
        </button>

        <button
          type="button"
          onClick={() =>
            changeStatus("COMPLETE")
          }
          disabled={
            saving ||
            currentStatus === "COMPLETE"
          }
          className="w-full bg-black text-white rounded-xl py-3 font-semibold disabled:opacity-40 sm:col-span-2"
        >
          Complete Competition
        </button>

      </div>

      {saving && (
        <p className="mt-4 text-sm text-gray-500">
          Updating competition...
        </p>
      )}

      {message && (
        <div className="mt-4 border rounded-lg p-3 text-sm">
          {message}
        </div>
      )}
    </div>
  );
}
