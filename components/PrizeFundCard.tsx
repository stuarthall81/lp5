import { Competition } from "@/types/competition";
import { calculatePrizeFund } from "@/lib/prizeFund";

type PrizeFundCardProps = {
  competition: Competition;
};

export default function PrizeFundCard({
  competition,
}: PrizeFundCardProps) {
  const prizeFund = calculatePrizeFund(competition);

  return (
    <div className="bg-green-50 border border-green-300 rounded-xl p-4 mb-6">

      <h2 className="font-semibold text-lg">
        💰 Prize Fund
      </h2>

      <div className="mt-3 space-y-2">

        <div className="flex justify-between">
          <span>Current Entries</span>
          <span>{competition.entries}</span>
        </div>

        <div className="flex justify-between">
          <span>Entry Fee</span>
          <span>£{competition.entryFee}</span>
        </div>

        {competition.rollover > 0 && (
          <div className="flex justify-between">
            <span>Carry Forward</span>
            <span>£{competition.rollover}</span>
          </div>
        )}

        <div className="flex justify-between font-bold">
          <span>Winner's Prize</span>
          <span>£{prizeFund}</span>
        </div>

      </div>

    </div>
  );
}
