"use client";

type PlayerEntryCardProps = {
  playing: boolean;
  paid: boolean;
  score?: number;
};

export default function PlayerEntryCard({
  playing,
  paid,
  score,
}: PlayerEntryCardProps) {
  return (
    <div className="border rounded-xl p-4 space-y-4">

      <h2 className="font-semibold text-lg">
        Your Entry
      </h2>

      <label className="flex justify-between">
        <span>I'm Playing</span>
        <input
          type="checkbox"
          checked={playing}
          readOnly
        />
      </label>

      <label className="flex justify-between">
        <span>Entry Fee Paid</span>
        <input
          type="checkbox"
          checked={paid}
          readOnly
        />
      </label>

      <div>
        <label className="block mb-2">
          Net Score
        </label>

        <input
          className="w-full border rounded-lg p-3"
          value={score ?? ""}
          readOnly
        />
      </div>

    </div>
  );
}
