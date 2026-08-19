import Link from "next/link";
import { getCompetition } from "@/lib/db/competitions";
import { getEntries } from "@/lib/entries";
import { supabase } from "@/lib/supabase";
import AdminEntriesTable from "@/components/AdminEntriesTable";
import CompetitionStatusControls from "@/components/CompetitionStatusControls";
import {
  getCompetitionStatusLabel,
} from "@/lib/competitionStatus";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminCompetitionDetailPage({
  params,
}: Props) {
  const { id } = await params;

  const competition = await getCompetition(id);

  if (!competition) {
    return (
      <main className="min-h-screen bg-green-100 px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold">
            Competition not found
          </h1>

          <Link
            href="/admin/competition"
            className="block mt-6 text-green-700 font-semibold"
          >
            ← Back to Manage Competitions
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

  const competitionStatus =
    competition.status ?? "DRAFT";

  return (
    <main className="min-h-screen bg-green-100 px-4 py-8 pb-24">
      <div className="w-full max-w-3xl mx-auto space-y-6">

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
            Status: {getCompetitionStatusLabel(competition)}
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
            Competition Status
          </h2>

          <CompetitionStatusControls
            competitionId={competition.id}
            currentStatus={competitionStatus}
          />
        </div>

        <Link
          href="/admin/competition"
          className="block text-center text-green-700 font-semibold"
        >
          ← Back to Manage Competitions
        </Link>

      </div>
    </main>
  );
}
