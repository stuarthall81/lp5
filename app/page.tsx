import Link from "next/link";
import { getCurrentPlayer } from "@/lib/currentPlayer";

export default async function Home() {
  const player = await getCurrentPlayer();

  return (
    <main className="min-h-screen bg-green-100 flex justify-center px-4 py-8 pb-24">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 text-center">

        <h1 className="text-3xl font-bold">
          ⛳ Lowes Park Fivers
        </h1>

        {player ? (
          <>
            <p className="mt-6 text-xl font-semibold">
              Welcome back,{" "}
              {player.display_name.split(" ")[0]}, to LP5 👋
            </p>

            <p className="mt-3 text-gray-600">
              Use the menu below to view the current competition,
              leaderboard and your profile.
            </p>

            <Link
              href="/competition"
              className="block w-full bg-green-700 text-white rounded-xl py-3 mt-8 font-semibold"
            >
              View Competition
            </Link>
          </>
        ) : (
          <>
            <p className="mt-6 text-lg text-gray-600">
              Welcome to LP5.
            </p>

            <Link
              href="/login"
              className="block w-full bg-green-700 text-white rounded-xl py-3 mt-8 font-semibold"
            >
              Member Login
            </Link>
          </>
        )}

      </div>
    </main>
  );
}
