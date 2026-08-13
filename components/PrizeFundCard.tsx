import { Competition } from "@/types/competition";
import { getEntries } from "@/lib/entries";
import { getRolloverStreak } from "@/lib/db/rolloverStreak";

type PrizeFundCardProps = {
  competition: Competition;
};

export default async function PrizeFundCard({
  competition,
}: PrizeFundCardProps) {
  const entries = await getEntries(competition.id);

  const playingEntries = entries.filter(
    (entry) => entry.playing
  );

  const currentEntryFees = playingEntries.reduce(
    (total, entry) => {
      const fee =
        entry.entry_fee_due != null
          ? Number(entry.entry_fee_due)
          : competition.entryFee;

      return total + fee;
    },
    0
  );

  const prizeFund =
    competition.rollover + currentEntryFees;

  const rolloverStreak = await getRolloverStreak(
    competition.date
  );

  let prizeHeading = "💰 Prize Fund";

  if (competition.rollover > 0) {
    if (rolloverStreak >= 3) {
      prizeHeading = "💰 Mega Donker!!!!";
    } else if (rolloverStreak === 2) {
      prizeHeading = "💰 Triple Donker!!!";
    } else {
      prizeHeading = "💰 Double Donker!!";
    }
  }

  return (
    <div className="bg-green-50 border border-green-300 rounded-xl p-4 mb-6">
      <h2 className="font-semibold text-lg">
        {prizeHeading}
      </h2>

      <div className="mt-3 space-y-2">

        <div className="flex justify-between">
          <span>Current Entries</span>
          <span>{playingEntries.length}</span>
        </div>

        <div className="flex justify-between">
          <span>Standard Entry Fee</span>
          <span>£{competition.entryFee}</span>
        </div>

        {competition.rollover > 0 && (
          <div className="flex justify-between">
            <span>Rollover</span>
            <span>£{competition.rollover}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Current Entry Fees</span>
          <span>£{currentEntryFees}</span>
        </div>

        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Winner&apos;s Prize</span>
          <span>£{prizeFund}</span>
        </div>

      </div>
    </div>
  );
}
