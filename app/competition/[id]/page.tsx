import { competitions } from "@/data/competitions";
import PrizeFundCard from "@/components/PrizeFundCard";
import LeaderboardCard from "@/components/LeaderboardCard";
import CurrentPlayerEntry from "@/components/CurrentPlayerEntry";
import { getEntries } from "@/lib/entries";
import { getCurrentPlayer } from "@/lib/currentPlayer";

type CompetitionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CompetitionPage({
  params,
}: CompetitionPageProps) {
  const { id } = await params;

  const competition = competitions.find(
    (c) => c.id === id
  );

  if (!competition) {
    return <p>Competition not found.</p>;
  }

  const entries = await getEntries(competition.id);

  const player = await getCurrentPlayer();

  const playerEntry =
    player
      ? entries.find(
          (entry) => entry.player_id === player.id
        ) ?? null
      : null;

  return (
    <main className="min-h-screen bg-green-100 flex justify-center px-4 py-8">
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

        <CurrentPlayerEntry
          competitionId={competition.id}
          player={player}
          entry={playerEntry}
        />

        <LeaderboardCard
          competitionId={competition.id}
        />

      </div>
    </main>
  );
}
