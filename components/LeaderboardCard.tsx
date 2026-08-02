import { playerEntries } from "@/data/playerEntries";

type Props = {
  competitionId: string;
};

export default function LeaderboardCard({
  competitionId,
}: Props) {
  const leaderboard = playerEntries
    .filter(
      (entry) =>
        entry.competitionId === competitionId &&
        entry.playing &&
        entry.score !== undefined
    )
    .sort((a, b) => a.score! - b.score!);

  return (
    <div className="border rounded-xl p-4 mt-6">

      <h2 className="font-semibold text-lg mb-4">
        🏆 Leaderboard
      </h2>

      {leaderboard.length === 0 ? (
        <p>No scores submitted yet.</p>
      ) : (
        leaderboard.map((entry, index) => (
          <div
            key={entry.playerId}
            className="flex justify-between py-2 border-b last:border-b-0"
          >
            <span>
              {index + 1}. {entry.playerId}
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
