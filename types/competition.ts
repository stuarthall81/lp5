export type Competition = {
  id: string;
  name: string;
  course: string;
  date: string;

  entryFee: number;

  status: "DRAFT" | "OPEN" | "IN_PROGRESS" | "LEADERBOARD" | "COMPLETE";

  leaderboardRelease: string;

  entries: number;

  rollover: number;
};

