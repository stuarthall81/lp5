import { getEntries } from "@/lib/entries";
import { supabase } from "@/lib/supabase";

type Props = {
  competitionId: string;
};

export default async function LeaderboardCard({
  competitionId,
}: Props) {
  const entries = await getEntries(competitionId);

  const leaderboardEntries = entries
    .filter(
      (entry) =>
        entry.playing &&
        entry.score !== null
    )
    .sort(
      (a, b) =>
        (a.score ?? 0) - (b.score ?? 0)
    );

  const playerIds = leaderboardEntries.map(
    (entry) => entry.player_id
  );

  const { data: players, error } = await supabase
    .from("players")
    .select("id, display_name")
    .in("id", playerIds);

  if (error) {
    console.error("Leaderboard player lookup error:", error);
  }

  const playerNames = new Map(
    (players ?? []).map((player) => [
      player.id,
      player.display_name,
    ])
  );

  return (
    <div className="border rounded-xl p-4 mt-6">
      <h2 className="font-semibold text-lg mb-4">
        🏆 Leaderboard
      </h2>

      {leaderboardEntries.length === 0 ? (
        <p>No scores submitted yet.</p>
      ) : (
        leaderboardEntries.map((entry, index) => (
          <div
            key={entry.id}
            className="flex justify-between py-2 border-b last:border-b-0"
          >
            <span>
              {index + 1}.{" "}
              {playerNames.get(entry.player_id) ??
                entry.player_id}
            </span>

            <span className="font-semibold">
              {entry.score}
            </span>
          </div>
        ))
      )}
    </div>
  );
}