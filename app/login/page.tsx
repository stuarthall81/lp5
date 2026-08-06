"use client";

import { getPlayerByMobile } from "@/lib/players";
import { useState } from "react";
import { savePlayerSession } from "@/lib/session";

export default function LoginPage() {
  const [mobile, setMobile] = useState("");
  const [pin, setPin] = useState("");

 async function login() {
  const player = await getPlayerByMobile(mobile);

  if (!player) {
    alert("Player not found");
    return;
  }

  savePlayerSession(player.id);

  alert(`Welcome ${player.display_name}`);

  window.location.href = "/";
}

  return (
    <main className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">

        <h1 className="text-2xl font-bold mb-2">
          Lowes Park Golf
        </h1>

        <p className="text-gray-600 mb-6">
          Member Login
        </p>

        <input
          className="border rounded-lg w-full p-3 mb-4"
          placeholder="Mobile number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />

        <input
          className="border rounded-lg w-full p-3 mb-6"
          placeholder="4-digit PIN"
          type="password"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-green-700 text-white rounded-lg p-3 font-semibold"
        >
          Login
        </button>

      </div>
    </main>
  );
}
