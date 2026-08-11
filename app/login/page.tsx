"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getPlayerByMobile } from "@/lib/players";

export default function LoginPage() {
  const [mobile, setMobile] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    setMessage("");
    setLoading(true);

    try {
      const player = await getPlayerByMobile(mobile);

      if (!player) {
        setMessage("Player not found.");
        setLoading(false);
        return;
      }

      if (!player.email) {
        setMessage("This player does not have an email address.");
        setLoading(false);
        return;
      }

      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email: player.email,
        password: pin,
      });

      if (error) {
        console.error("Login error:", error);
        setMessage("Login failed. Please check your mobile number and PIN.");
        setLoading(false);
        return;
      }

      window.location.href = "/";
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Unable to log in. Please try again.");
      setLoading(false);
    }
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
          placeholder="PIN"
          type="password"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />

        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-green-700 text-white rounded-lg p-3 font-semibold disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && (
          <p className="mt-4 text-sm text-red-600">
            {message}
          </p>
        )}

      </div>
    </main>
  );
}
