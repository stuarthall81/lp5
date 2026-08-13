import PrizeFundCard from "@/components/PrizeFundCard";
import LeaderboardCard from "@/components/LeaderboardCard";
import CurrentPlayerEntry from "@/components/CurrentPlayerEntry";
import { getEntries } from "@/lib/entries";
import { getCurrentPlayer } from "@/lib/currentPlayer";
import { getCompetition } from "@/lib/db/competitions";
import { getCarryForward } from "@/lib/db/carryForward";
import { calculatePlayerEntryFee } from "@/lib/playerEntryFee";

type CompetitionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CompetitionPage({
  params,
}: CompetitionPageProps) {
  const { id } = await params;

  const dbCompetition = await getCompetition(id);

  if (!dbCompetition) {
    return <p>Competition not found.</p>;
  }

  const carryForward = await getCarryForward(
    dbCompetition.competition_date,
    dbCompetition.rollover ?? 0
  );

  const competition = {
    id: dbCompetition.id,
    name: dbCompetition.name,
    course: dbCompetition.course,
    date: dbCompetition.competition_date,
    entryFee: dbCompetition.entry_fee,
    rollover: carryForward,
    status: dbCompetition.status as
      | "DRAFT"
      | "OPEN"
      | "IN_PROGRESS"
      | "LEADERBOARD"
      | "COMPLETE",
    leaderboardRelease: "16:00",
    entries: 0,
  };

  const entries = await getEntries(competition.id);

  const player = await getCurrentPlayer();

  const playerEntry =
    player
      ? entries.find(
          (entry) => entry.player_id === player.id
        ) ?? null
      : null;

  let playerEntryFee: number | null = null;

  if (player) {
    if (playerEntry?.entry_fee_due != null) {
      playerEntryFee = Number(
        playerEntry.entry_fee_due
      );
    } else {
      playerEntryFee =
        await calculatePlayerEntryFee(
          player.id,
          {
            id: dbCompetition.id,
            competition_date:
              dbCompetition.competition_date,
            entry_fee: Number(
              dbCompetition.entry_fee
            ),
          }
        );
    }
  }

  return (
    <main className="min-h-screen bg-green-100 flex justify-center px-4 py-8 pb-24">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">

        <h1 className="text-2xl font-bold mb-2">
          {competition.name}
        </h1>

        <p className="mb-2">
          📍 {competition.course}
        </p>

        <p className="mb-6">
          📅 {competition.date}
        </p>

        <PrizeFundCard competition={competition} />

        {competition.status !== "COMPLETE" ? (
          <CurrentPlayerEntry
            competitionId={competition.id}
            player={player}
            entry={playerEntry}
            entryFeeDue={playerEntryFee}
          />
        ) : (
          <div className="border rounded-xl p-4 mb-6 bg-gray-50">
            <p className="font-semibold">
              Competition Complete
            </p>

            <p className="text-sm text-gray-600 mt-1">
              This competition is now closed. Final
              results are shown below.
            </p>
          </div>
        )}

        <LeaderboardCard
          competitionId={competition.id}
        />

      </div>
    </main>
  );
}
