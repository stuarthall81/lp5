"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const players = [
  "John Smith",
  "Dave Jones",
  "Chris Taylor",
];

export default function SelectPlayer() {
  const router = useRouter();

  const [selectedPlayer, setSelectedPlayer] = useState("");

  useEffect(() => {
    const savedPlayer = localStorage.getItem("lowesParkPlayer");

    if (savedPlayer) {
      setSelectedPlayer(savedPlayer);
    }
  }, []);

  function choosePlayer(player: string) {
    setSelectedPlayer(player);
    localStorage.setItem("lowesParkPlayer", player);
  }

  return (
    <main className="min-h-screen bg-green-100 flex justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">

        <h1 className="text-3xl font-bold text-center">
  ⛳ Lowes Park Fivers
</h1>

        <p className="text-center mt-4 mb-6">
          Who are you?
        </p>

        <p className="text-center text-sm mb-6">
          Selected: {selectedPlayer || "none"}
        </p>

        <div className="space-y-4">
          {players.map((player) => (
            <button
              key={player}
              type="button"
              onClick={() => choosePlayer(player)}
              className={
                selectedPlayer === player
                  ? "w-full rounded-xl border p-4 text-lg bg-green-700 text-white border-green-700"
                  : "w-full rounded-xl border p-4 text-lg bg-white text-black"
              }
            >
              {player}
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={!selectedPlayer}
          onClick={() => router.push("/")}
          className={`w-full mt-8 rounded-xl py-3 font-semibold text-white ${
            selectedPlayer
              ? "bg-green-700"
              : "bg-gray-400"
          }`}
        >
          Continue
        </button>

      </div>
    </main>
  );
}
