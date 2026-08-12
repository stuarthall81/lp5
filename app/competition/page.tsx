import Link from "next/link";
import PrizeFundCard from "@/components/PrizeFundCard";
import { getCurrentPlayer } from "@/lib/currentPlayer";
import {
  getOpenCompetition,
  getCompetitions,
} from "@/lib/db/competitions";
import { getCarryForward } from "@/lib/db/carryForward";

export default async function CompetitionLandingPage() {
  const player = await getCurrentPlayer();

  const openCompetition = await getOpenCompetition();
  const allCompetitions = await getCompetitions();

  const pastCompetitions = allCompetitions
    .filter((competition) => competition.status === "COMPLETE")
    .sort(
      (a, b) =>
        new Date(b.competition_date).getTime() -
        new Date(a.competition_date).getTime()
    )
    .slice(0, 5);

  let currentCompetition = null;

  if (openCompetition) {
    const carryForward = await getCarryForward(
      openCompetition.competition_date,
      openCompetition.rollover ?? 0
    );

    currentCompetition = {
      id: openCompetition.id,
      name: openCompetition.name,
      course: openCompetition.course,
      date: openCompetition.competition_date,
      entryFee: openCompetition.entry_fee,
      rollover: carryForward,
      status: openCompetition.status as
        | "DRAFT"
        | "OPEN"
        | "IN_PROGRESS"
        | "LEADERBOARD"
        | "COMPLETE",
      leaderboardRelease: "16:00",
      entries: 0,
    };
  }

  return (
    <main className="min-h-screen bg-green-100 px-4 py-8 pb-24">
      <div className="w-full max-w-md mx-auto space-y-6">

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold">
            ⛳ Competition
          </h1>

          <p className="mt-2 text-gray-600">
            {player
              ? `Welcome back, ${player.display_name.split(" ")[0]}`
              : "Please log in"}
          </p>
        </div>

        {currentCompetition ? (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold mb-2">
              Current Competition
            </h2>

            <p className="font-semibold text-lg">
              {currentCompetition.name}
            </p>

            <p className="mt-1">
              📍 {currentCompetition.course}
            </p>

            <p className="mb-5">
              📅 {currentCompetition.date}
            </p>

            <PrizeFundCard competition={currentCompetition} />

            <Link
              href={`/competition/${currentCompetition.id}`}
              className="block w-full bg-green-700 text-white rounded-lg py-3 text-center font-semibold"
            >
              Open Competition
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <p>No competition is currently open.</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4">
            Past Competitions
          </h2>

          {pastCompetitions.length === 0 ? (
            <p className="text-gray-600">
              No completed competitions yet.
            </p>
          ) : (
            <div className="space-y-3">
              {pastCompetitions.map((competition) => (
                <Link
                  key={competition.id}
                  href={`/competition/${competition.id}`}
                  className="block border rounded-xl p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="font-semibold">
                        {competition.name}
                      </p>

                      <p className="text-sm text-gray-600">
                        {competition.course}
                      </p>
                    </div>

                    <p className="text-sm text-gray-600 whitespace-nowrap">
                      {competition.competition_date}
                    </p>
                  </div>

                  <p className="mt-2 text-green-700 font-semibold text-sm">
                    View results →
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
