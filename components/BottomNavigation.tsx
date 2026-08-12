"use client";

import Link from "next/link";

export default function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md">
      <div className="max-w-md mx-auto flex justify-around py-3">

        <Link href="/competition" className="flex flex-col items-center text-sm">
  <span className="text-xl">⛳</span>
  Competition
</Link>

        <Link href="/leaderboard" className="flex flex-col items-center text-sm">
          <span className="text-xl">🏆</span>
          Leaderboard
        </Link>

        <Link href="/history" className="flex flex-col items-center text-sm">
          <span className="text-xl">📜</span>
          History
        </Link>

        <Link href="/profile" className="flex flex-col items-center text-sm">
          <span className="text-xl">👤</span>
          Profile
        </Link>

        <Link href="/admin" className="flex flex-col items-center text-sm">
  <span className="text-xl">⚙️</span>
  Admin
</Link>

      </div>
    </nav>
  );
}