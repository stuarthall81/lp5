import PrizeFundCard from "@/components/PrizeFundCard";
import Link from "next/link";
import { getCurrentPlayer } from "@/lib/currentPlayer";
import { getOpenCompetition } from "@/lib/db/competitions";

export default async function Home() {
  const player = await getCurrentPlayer();

  const dbCompetition = await getOpenCompetition();

  if (!dbCompetition) {
    return (
      <main className="min-h-screen bg-green-100 flex justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-3xl font-bold text-center">
            ⛳ Lowes Park Fivers
          </h1>

          <p className="text-center mt-6">
            No competitions available.
          </p>
        </div>
      </main>
    );
  }

  const competition = {
    id: dbCompetition.id,
    name: dbCompetition.name,
    course: dbCompetition.course,
    date: dbCompetition.competition_date,
    entryFee: dbCompetition.entry_fee,
    rollover: dbCompetition.rollover,
    status: dbCompetition.status as
      | "DRAFT"
      | "OPEN"
      | "IN_PROGRESS"
      | "LEADERBOARD"
      | "COMPLETE",
    leaderboardRelease: "16:00",
    entries: 0,
  };

  return (
    <main className="min-h-screen bg-green-100 flex justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">

        <header className="p-6 text-center">
          <h1 className="text-3xl font-bold">
            ⛳ Lowes Park Fivers
          </h1>

          <p className="mt-4 text-lg">
            {player
              ? `Welcome back, ${player.display_name.split(" ")[0]} 👋`
              : "Please log in"}
          </p>

          {!player && (
            <Link
              href="/login"
              className="inline-block mt-3 text-green-700 font-semibold"
            >
              Member Login
            </Link>
          )}

          <p className="mt-4 text-lg font-semibold">
            {competition.name}
          </p>

          <p>📍 {competition.course}</p>

          <p>📅 {competition.date}</p>
        </header>

        <section className="p-6">

          <div className="mb-6">
            <h2 className="font-semibold text-lg">
              Competition Status
            </h2>

            <p className="text-green-700 font-bold mt-2">
              🟢 Open for Entries
            </p>
          </div>

          <PrizeFundCard competition={competition} />

          <Link
            href={`/competition/${competition.id}`}
            className="block w-full bg-green-700 text-white rounded-lg py-3 text-center font-semibold"
          >
            Open Competition
          </Link>

          <div className="mt-8 bg-yellow-50 border border-yellow-300 rounded-xl p-4">
            <h2 className="font-semibold">
              🏆 Leaderboard
            </h2>

            <p className="mt-2">
              🔒 Leaderboard goes live at 16:00
            </p>
          </div>

        </section>
      </div>
    </main>
  );
}
