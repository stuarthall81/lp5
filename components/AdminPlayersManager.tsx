"use client";

import { useState } from "react";
import {
  createPlayer,
  resetPlayerPin,
  setPlayerActive,
  updatePlayer,
} from "@/app/admin/playerActions";

type PlayerRow = {
  id: string;
  display_name: string;
  mobile: string | null;
  golf_link_number: string | null;
  is_admin: boolean;
  active: boolean;
};

type Props = {
  players: PlayerRow[];
};

export default function AdminPlayersManager({
  players,
}: Props) {
  const [rows, setRows] = useState(players);

  const [displayName, setDisplayName] = useState("");
  const [mobile, setMobile] = useState("");
  const [golfLinkNumber, setGolfLinkNumber] = useState("");
  const [temporaryPin, setTemporaryPin] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [resetPinId, setResetPinId] = useState<string | null>(null);
  const [newPin, setNewPin] = useState("");

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
      window.location.reload();
    }
  }

  function updateRow(
    id: string,
    changes: Partial<PlayerRow>
  ) {
    setRows((current) =>
      current.map((row) =>
        row.id === id
          ? { ...row, ...changes }
          : row
      )
    );
  }

  async function savePlayer(row: PlayerRow) {
    setMessage("");

    const result = await updatePlayer({
      playerId: row.id,
      displayName: row.display_name,
      mobile: row.mobile ?? "",
      golfLinkNumber: row.golf_link_number ?? "",
      isAdmin: row.is_admin,
    });

    setMessage(result.message);

    if (result.success) {
      setEditingId(null);
    }
  }

  async function toggleActive(row: PlayerRow) {
    setMessage("");

    const result = await setPlayerActive(
      row.id,
      !row.active
    );

    setMessage(result.message);

    if (result.success) {
      updateRow(row.id, {
        active: !row.active,
      });
    }
  }

  async function handleResetPin(playerId: string) {
    setMessage("");

    const result = await resetPlayerPin(
      playerId,
      newPin
    );

    setMessage(result.message);

    if (result.success) {
      setResetPinId(null);
      setNewPin("");
    }
  }

  return (
    <div className="space-y-6">

      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-semibold mb-5">
          Add Player
        </h2>

        <label className="block mb-2 font-medium">
          Player Name
        </label>

        <input
          className="w-full border rounded-lg p-3 mb-4"
          value={displayName}
          onChange={(e) =>
            setDisplayName(e.target.value)
          }
        />

        <label className="block mb-2 font-medium">
          Mobile Number
        </label>

        <input
          className="w-full border rounded-lg p-3 mb-4"
          value={mobile}
          onChange={(e) =>
            setMobile(e.target.value)
          }
        />

        <label className="block mb-2 font-medium">
          Golf Link Number
        </label>

        <input
          className="w-full border rounded-lg p-3 mb-4"
          value={golfLinkNumber}
          onChange={(e) =>
            setGolfLinkNumber(e.target.value)
          }
        />

        <label className="block mb-2 font-medium">
          Temporary PIN
        </label>

        <input
          type="password"
          inputMode="numeric"
          maxLength={6}
          className="w-full border rounded-lg p-3 mb-4"
          value={temporaryPin}
          onChange={(e) =>
            setTemporaryPin(e.target.value)
          }
        />

        <label className="flex gap-3 items-center mb-5">
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
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          Existing Players
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-3">
                  Player
                </th>

                <th className="text-left py-2 px-2">
                  Mobile
                </th>

                <th className="text-center py-2 px-2">
                  Admin
                </th>

                <th className="text-center py-2 px-2">
                  Active
                </th>

                <th className="text-right py-2 pl-2">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => {
                const editing = editingId === row.id;

                return (
                  <tr
                    key={row.id}
                    className="border-b last:border-b-0 align-top"
                  >
                    <td className="py-3 pr-3">
                      {editing ? (
                        <input
                          className="border rounded px-2 py-1 w-36"
                          value={row.display_name}
                          onChange={(e) =>
                            updateRow(row.id, {
                              display_name:
                                e.target.value,
                            })
                          }
                        />
                      ) : (
                        <div>
                          <p className="font-medium">
                            {row.display_name}
                          </p>

                          {row.golf_link_number && (
                            <p className="text-xs text-gray-500">
                              Golf Link:{" "}
                              {row.golf_link_number}
                            </p>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-2">
                      {editing ? (
                        <div className="space-y-2">
                          <input
                            className="border rounded px-2 py-1 w-32"
                            value={row.mobile ?? ""}
                            onChange={(e) =>
                              updateRow(row.id, {
                                mobile:
                                  e.target.value,
                              })
                            }
                          />

                          <input
                            className="border rounded px-2 py-1 w-32"
                            placeholder="Golf Link"
                            value={
                              row.golf_link_number ??
                              ""
                            }
                            onChange={(e) =>
                              updateRow(row.id, {
                                golf_link_number:
                                  e.target.value,
                              })
                            }
                          />
                        </div>
                      ) : (
                        row.mobile ?? "—"
                      )}
                    </td>

                    <td className="py-3 px-2 text-center">
                      <input
                        type="checkbox"
                        disabled={!editing}
                        checked={row.is_admin}
                        onChange={(e) =>
                          updateRow(row.id, {
                            is_admin:
                              e.target.checked,
                          })
                        }
                      />
                    </td>

                    <td className="py-3 px-2 text-center">
                      {row.active ? "✓" : "—"}
                    </td>

                    <td className="py-3 pl-2">
                      <div className="flex flex-col gap-2 items-end">
                        {editing ? (
                          <>
                            <button
                              onClick={() =>
                                savePlayer(row)
                              }
                              className="text-blue-700 font-semibold"
                            >
                              Save
                            </button>

                            <button
                              onClick={() =>
                                setEditingId(null)
                              }
                              className="text-gray-600"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() =>
                              setEditingId(row.id)
                            }
                            className="text-blue-700 font-semibold"
                          >
                            Edit
                          </button>
                        )}

                        <button
                          onClick={() =>
                            setResetPinId(row.id)
                          }
                          className="text-purple-700 font-semibold"
                        >
                          Reset PIN
                        </button>

                        <button
                          onClick={() =>
                            toggleActive(row)
                          }
                          className={
                            row.active
                              ? "text-red-700 font-semibold"
                              : "text-green-700 font-semibold"
                          }
                        >
                          {row.active
                            ? "Deactivate"
                            : "Reactivate"}
                        </button>

                        {resetPinId === row.id && (
                          <div className="mt-2 border rounded-lg p-2 bg-gray-50">
                            <input
                              type="password"
                              inputMode="numeric"
                              maxLength={6}
                              placeholder="New 6-digit PIN"
                              className="border rounded px-2 py-1 w-32"
                              value={newPin}
                              onChange={(e) =>
                                setNewPin(
                                  e.target.value
                                )
                              }
                            />

                            <button
                              onClick={() =>
                                handleResetPin(
                                  row.id
                                )
                              }
                              className="block mt-2 text-purple-700 font-semibold"
                            >
                              Save PIN
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {message && (
          <div className="mt-5 border rounded-lg p-3">
            {message}
          </div>
        )}
      </div>

    </div>
  );
}
