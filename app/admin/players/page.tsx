"use client";

import { useState } from "react";
import { createPlayer } from "@/app/admin/playerActions";

export default function AdminPlayersPage() {
  const [displayName, setDisplayName] = useState("");
  const [mobile, setMobile] = useState("");
  const [golfLinkNumber, setGolfLinkNumber] = useState("");
  const [temporaryPin, setTemporaryPin] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleCreatePlayer() {
    setMessage("");
    setSaving(true);

    const result = await createPlayer({
      displayName,
      mobile,
      golfLinkNumber,
      temporaryPin,
      isAdmin,
    });

    setMessage(result.message);
    setSaving(false);

    if (result.success) {
      setDisplayName("");
      setMobile("");
      setGolfLinkNumber("");
      setTemporaryPin("");
      setIsAdmin(false);
    }
  }

  return (
    <main className="min-h-screen bg-green-100 flex justify-center px-4 py-8 pb-24">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">

        <h1 className="text-2xl font-bold">
          Player Management
        </h1>

        <p className="text-gray-600 mt-2 mb-6">
          Add a new Lowes Park Fivers player.
        </p>

        <label className="block mb-2 font-medium">
          Player Name
        </label>

        <input
          className="w-full border rounded-lg p-3 mb-5"
          value={displayName}
          onChange={(e) =>
            setDisplayName(e.target.value)
          }
          placeholder="e.g. Paddy O'Shea"
        />

        <label className="block mb-2 font-medium">
          Mobile Number
        </label>

        <input
          className="w-full border rounded-lg p-3 mb-5"
          value={mobile}
          onChange={(e) =>
            setMobile(e.target.value)
          }
          placeholder="07..."
        />

        <label className="block mb-2 font-medium">
          Golf Link Number
        </label>

        <input
          className="w-full border rounded-lg p-3 mb-5"
          value={golfLinkNumber}
          onChange={(e) =>
            setGolfLinkNumber(e.target.value)
          }
          placeholder="Optional"
        />

        <label className="block mb-2 font-medium">
          Temporary PIN
        </label>

        <input
          className="w-full border rounded-lg p-3 mb-5"
          type="password"
          inputMode="numeric"
          maxLength={6}
          value={temporaryPin}
          onChange={(e) =>
            setTemporaryPin(e.target.value)
          }
          placeholder="6 digits"
        />

        <label className="flex items-center gap-3 mb-6">
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) =>
              setIsAdmin(e.target.checked)
            }
          />

          <span>Administrator</span>
        </label>

        <button
          onClick={handleCreatePlayer}
          disabled={saving}
          className="w-full bg-green-700 text-white rounded-xl py-3 font-semibold disabled:opacity-50"
        >
          {saving ? "Creating..." : "Add Player"}
        </button>

        {message && (
          <div className="mt-5 border rounded-lg p-3">
            {message}
          </div>
        )}

      </div>
    </main>
  );
}
