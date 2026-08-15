"use client";

import { useState } from "react";
import { adminUpdateEntry } from "@/lib/entries";

type EntryRow = {
  id: number;
  playerName: string;
  playing: boolean;
  paid: boolean;
  entryFeeDue: number;
  score: number | null;
};

type Props = {
  entries: EntryRow[];
};

export default function AdminEntriesTable({
  entries,
}: Props) {
  const [rows, setRows] = useState(entries);
  const [savingId, setSavingId] =
    useState<number | null>(null);
  const [message, setMessage] = useState("");

  function updateRow(
    id: number,
    changes: Partial<EntryRow>
  ) {
    setRows((current) =>
      current.map((row) =>
        row.id === id
          ? { ...row, ...changes }
          : row
      )
    );
  }

  async function saveRow(row: EntryRow) {
    setSavingId(row.id);
    setMessage("");

    try {
      await adminUpdateEntry(row.id, {
        playing: row.playing,
        paid: row.paid,
        score: row.score,
        entryFeeDue: row.entryFeeDue,
      });

      setMessage(
        `${row.playerName} updated successfully.`
      );
    } catch (error) {
      console.error(error);
      setMessage(
        `Unable to update ${row.playerName}.`
      );
    } finally {
      setSavingId(null);
    }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 pr-4">
                Player
              </th>

              <th className="text-center py-2 px-2">
                Playing
              </th>

              <th className="text-center py-2 px-2">
                Paid
              </th>

              <th className="text-right py-2 px-2">
                Fee
              </th>

              <th className="text-right py-2 px-2">
                Score
              </th>

              <th className="text-right py-2 pl-2">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b last:border-b-0"
              >
                <td className="py-3 pr-4 font-medium whitespace-nowrap">
                  {row.playerName}
                </td>

                <td className="py-3 px-2 text-center">
                  <input
                    type="checkbox"
                    checked={row.playing}
                    onChange={(e) =>
                      updateRow(row.id, {
                        playing: e.target.checked,
                      })
                    }
                  />
                </td>

                <td className="py-3 px-2 text-center">
                  <input
                    type="checkbox"
                    checked={row.paid}
                    onChange={(e) =>
                      updateRow(row.id, {
                        paid: e.target.checked,
                      })
                    }
                  />
                </td>

                <td className="py-3 px-2 text-right">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={row.entryFeeDue}
                    onChange={(e) =>
                      updateRow(row.id, {
                        entryFeeDue: Number(
                          e.target.value
                        ),
                      })
                    }
                    className="w-16 border rounded px-2 py-1 text-right"
                  />
                </td>

                <td className="py-3 px-2 text-right">
                  <input
                    type="number"
                    value={row.score ?? ""}
                    onChange={(e) =>
                      updateRow(row.id, {
                        score:
                          e.target.value === ""
                            ? null
                            : Number(
                                e.target.value
                              ),
                      })
                    }
                    className="w-16 border rounded px-2 py-1 text-right"
                  />
                </td>

                <td className="py-3 pl-2 text-right">
                  <button
                    onClick={() => saveRow(row)}
                    disabled={savingId === row.id}
                    className="bg-blue-700 text-white rounded-lg px-3 py-1 font-semibold disabled:opacity-50"
                  >
                    {savingId === row.id
                      ? "Saving..."
                      : "Save"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {message && (
        <p className="mt-4 text-sm text-center">
          {message}
        </p>
      )}
    </>
  );
}
