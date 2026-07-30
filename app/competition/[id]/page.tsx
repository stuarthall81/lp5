import { competitions } from "@/data/competitions";
import { playerEntries } from "@/data/playerEntries";

import PrizeFundCard from "@/components/PrizeFundCard";
import PlayerEntryCard from "@/components/PlayerEntryCard";

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

  // Temporary until authentication is added
  const currentPlayer = "John Smith";

  const playerEntry = playerEntries.find(
    (entry) =>
      entry.playerId === currentPlayer &&
      entry.competitionId === competition.id
  );

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

        {playerEntry && (
          <PlayerEntryCard
            playing={playerEntry.playing}
            paid={playerEntry.paid}
            score={playerEntry.score}
          />
        )}

      </div>
    </main>
  );
}
