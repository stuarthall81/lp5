"use client";

import { useState } from "react";
import Link from "next/link";
import { createCompetition } from "@/app/admin/competitionActions";

export default function NewCompetitionPage() {
  const [name, setName] = useState("");
  const [course, setCourse] =
    useState("Lowes Park White");
  const [competitionDate, setCompetitionDate] =
    useState("");
  const [opensAt, setOpensAt] =
    useState("");
  const [entryFee, setEntryFee] =
    useState("5");

  const [message, setMessage] =
    useState("");
  const [saving, setSaving] =
    useState(false);
  const [createdId, setCreatedId] =
    useState<string | null>(null);

  async function handleCreateCompetition() {
    setMessage("");
    setCreatedId(null);
    setSaving(true);

    const result =
      await createCompetition({
        name,
        course,
        competitionDate,
        entryFee: Number(entryFee),
        opensAt,
      });

    setMessage(result.message);
    setSaving(false);

    if (
      result.success &&
      result.competitionId
    ) {
      setCreatedId(
        result.competitionId
      );
    }
  }

  return (
    <main className="min-h-screen bg-green-100 px-4 py-8 pb-24">
      <div className="w-full max-w-md mx-auto space-y-6">

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold">
            Create Competition
          </h1>

          <p className="text-gray-600 mt-2">
            Create a new Lowes Park Fivers competition.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">

          <label className="block mb-2 font-medium">
            Competition Name
          </label>

          <input
            className="w-full border rounded-lg p-3 mb-5"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="e.g. August Fiver"
          />

          <label className="block mb-2 font-medium">
            Course
          </label>

          <input
            className="w-full border rounded-lg p-3 mb-5"
            value={course}
            onChange={(e) =>
              setCourse(e.target.value)
            }
          />

          <label className="block mb-2 font-medium">
            Competition Date
          </label>

          <input
            type="date"
            className="w-full border rounded-lg p-3 mb-5"
            value={competitionDate}
            onChange={(e) =>
              setCompetitionDate(
                e.target.value
              )
            }
          />

          <label className="block mb-2 font-medium">
            Entries Open From
          </label>

          <input
            type="datetime-local"
            className="w-full border rounded-lg p-3 mb-2"
            value={opensAt}
            onChange={(e) =>
              setOpensAt(e.target.value)
            }
          />

          <p className="text-xs text-gray-500 mb-5">
            Leave blank if you want to open entries manually.
          </p>

          <label className="block mb-2 font-medium">
            Standard Entry Fee (£)
          </label>

          <input
            type="number"
            min="1"
            step="1"
            className="w-full border rounded-lg p-3 mb-6"
            value={entryFee}
            onChange={(e) =>
              setEntryFee(e.target.value)
            }
          />

          <button
            onClick={
              handleCreateCompetition
            }
            disabled={saving}
            className="w-full bg-green-700 text-white rounded-xl py-3 font-semibold disabled:opacity-50"
          >
            {saving
              ? "Creating..."
              : "Create Competition"}
          </button>

          {message && (
            <div className="mt-5 border rounded-lg p-3">
              {message}
            </div>
          )}

          {createdId && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-3">
                The competition has been created as a draft.
              </p>

              <Link
                href={`/competition/${createdId}`}
                className="block w-full bg-blue-700 text-white rounded-xl py-3 text-center font-semibold"
              >
                View Competition
              </Link>
            </div>
          )}

        </div>

        <Link
          href="/admin"
          className="block text-center text-green-700 font-semibold"
        >
          ← Back to Admin
        </Link>

      </div>
    </main>
  );
}
