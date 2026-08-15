import Link from "next/link";
import { getOpenCompetition } from "@/lib/db/competitions";
import { getEntries } from "@/lib/entries";
import { supabase } from "@/lib/supabase";
import AdminEntriesTable from "@/components/AdminEntriesTable";

export default async function AdminCompetitionPage() {
  const competition = await getOpenCompetition();

  if (!competition) {
    return (
      <main className="min-h-screen bg-green-100 flex justify-center px-4 py-8 pb-24">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold">
            Manage Competition
          </h1>

          <p className="mt-4">
            No competition is currently open.
          </p>

          <Link
            href="/admin"
            className="block mt-6 text-green-700 font-semibold"
          >
            ← Back to Admin
          </Link>
        </div>
      </main>
    );
  }

  const entries = await getEntries(competition.id);

  const playerIds = entries.map(
    (entry) => entry.player_id
  );

  const { data: players, error: playersError } =
    playerIds.length > 0
      ? await supabase
          .from("players")
          .select("id, display_name")
          .in("id", playerIds)
      : { data: [], error: null };

  if (playersError) {
    console.error(
      "Admin competition player lookup failed:",
      playersError
    );
  }

  const playerNames = new Map(
    (players ?? []).map((player) => [
      player.id,
      player.display_name,
    ])
  );

  const adminEntries = entries.map((entry) => ({
    id: entry.id,
    playerName:
      playerNames.get(entry.player_id) ??
      entry.player_id,
    playing: entry.playing ?? false,
    paid: entry.paid ?? false,
    entryFeeDue: Number(
      entry.entry_fee_due ?? 0
    ),
    score: entry.score,
  }));

  return (
    <main className="min-h-screen bg-green-100 flex justify-center px-4 py-8 pb-24">
      <div className="w-full max-w-3xl space-y-6">

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold">
            Manage Competition
          </h1>

          <p className="mt-4 font-semibold text-lg">
            {competition.name}
          </p>

          <p>
            📍 {competition.course}
          </p>

          <p>
            📅 {competition.competition_date}
          </p>

          <p className="mt-3 text-sm text-gray-600">
            Status: {competition.status}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            Entrants
          </h2>

          {adminEntries.length === 0 ? (
            <p className="text-gray-600">
              No players entered yet.
            </p>
          ) : (
            <AdminEntriesTable
              entries={adminEntries}
            />
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            Competition Actions
          </h2>

          <div className="space-y-3">
            <button
              disabled
              className="w-full bg-gray-200 text-gray-500 rounded-xl py-3 font-semibold"
            >
              Change Competition Status
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Competition status controls will be added next.
          </p>
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
