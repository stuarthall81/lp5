"use client";

import { useEffect, useState } from "react";
const competition = {
  name: "Proude Cup",
  course: "Lowes Park White",
  date: "25 July 2026",
  status: "OPEN",
  leaderboardRelease: "16:00",
};

export default function Home() {

  const [player, setPlayer] = useState("");

  useEffect(() => {
    const savedPlayer = localStorage.getItem("lowesParkPlayer");

    if (savedPlayer) {
      setPlayer(savedPlayer);
    }
  }, []);
  return (

    <main className="min-h-screen bg-green-100 flex justify-center px-4 py-8">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">

        <header className="text-3xl font-bold text-center">
          <h1 className="text-3xl font-bold text-center">        
            ⛳ Lowes Park Fivers
          </h1>
          <p className="text-center mt-4 text-lg">
  {player
     ? `Welcome back, ${player.split(" ")[0]} 👋`
    : "Please select your player"}
</p>

          <p className="mt-3 text-lg">
            {competition.name}
          </p>

          <p>
            📍 {competition.course}
          </p>

          <p>
            📅 {competition.date}
          </p>
        </header>


        <section className="p-6">

          <div className="mb-6">
            <h2 className="font-semibold text-lg">
              Competition Status
            </h2>

            <p className="text-green-700 font-bold mt-2">
              🟢 {competition.status}
            </p>
          </div>


          <div className="border rounded-xl p-4 mb-6">

            <h2 className="font-semibold text-lg mb-4">
              Your Entry
            </h2>


            <label className="flex justify-between mb-4">
              <span>Playing?</span>
              <input type="checkbox" defaultChecked />
            </label>


            <label className="flex justify-between">
              <span>Entry fee paid?</span>
              <input type="checkbox" />
            </label>

          </div>


          <div className="mb-6">

            <label className="font-semibold">
              Net Score
            </label>

            <input
              type="number"
              placeholder="Enter your score"
              className="w-full mt-2 border rounded-lg p-3"
            />

          </div>


          <button className="w-full bg-green-700 text-white rounded-lg py-3 font-semibold">
            Submit Score
          </button>


          <div className="mt-8 bg-yellow-50 border border-yellow-300 rounded-xl p-4">

            <h2 className="font-semibold">
              🏆 Leaderboard
            </h2>

            <p className="mt-2">
              🔒 Hidden until {competition.leaderboardRelease}
            </p>

          </div>


        </section>

      </div>

    </main>
  );
}