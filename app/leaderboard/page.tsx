import Link from "next/link";
import LeaderboardCard from "@/components/LeaderboardCard";
import { getCurrentCompetition } from "@/lib/db/competitions";
import { isLeaderboardVisible } from "@/lib/leaderboardVisibility";

export default async function LeaderboardPage() {
  const competition =
    await getCurrentCompetition();

  if (!competition) {
    return (
      <main className="min-h-screen bg-green-100 px-4 py-8 pb-24">
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6">

          <h1 className="text-2xl font-bold">
            🏆 Leaderboard
          </h1>

          <p className="mt-4 text-gray-600">
            No current competition.
          </p>

        </div>
      </main>
    );
  }

  const leaderboardVisible =
    isLeaderboardVisible(competition);

  return (
    <main className="min-h-screen bg-green-100 px-4 py-8 pb-24">
      <div className="w-full max-w-md mx-auto">

        <div className="bg-white rounded-2xl shadow-xl p-6">

          <h1 className="text-2xl font-bold">
            🏆 Leaderboard
          </h1>

          <p className="mt-3 font-semibold">
            {competition.name}
          </p>

          <p className="text-sm text-gray-600">
            📍 {competition.course}
          </p>

          <p className="text-sm text-gray-600">
            📅 {competition.competition_date}
          </p>

          {leaderboardVisible ? (
            <>
              <div className="mt-5 bg-green-50 border border-green-300 rounded-lg p-3">
                <p className="font-semibold text-green-800">
                  🟢 Leaderboard Live
                </p>

                {competition.status !== "COMPLETE" && (
                  <p className="text-sm text-gray-600 mt-1">
                    Scores will update as players finish and submit their rounds.
                  </p>
                )}
              </div>

              <LeaderboardCard
                competitionId={competition.id}
              />
            </>
          ) : (
            <div className="mt-5 bg-yellow-50 border border-yellow-300 rounded-xl p-4">
              <p className="font-semibold">
                🔒 Leaderboard not yet available
              </p>

              <p className="mt-2 text-sm text-gray-600">
                The leaderboard goes live at 16:00 on competition day.
              </p>
            </div>
          )}

          <Link
            href={`/competition/${competition.id}`}
            className="block mt-6 text-center text-green-700 font-semibold"
          >
            ← Competition
          </Link>

        </div>

      </div>
    </main>
  );
}
