type PrizeFundCardProps = {
  entries: number;
  entryFee: number;
  rollover?: number;
};

export default function PrizeFundCard({
  entries,
  entryFee,
  rollover = 0,
}: PrizeFundCardProps) {
  const prizeFund = entries * entryFee + rollover;

  return (
    <div className="bg-green-50 border border-green-300 rounded-xl p-4 mb-6">

      <h2 className="font-semibold text-lg">
        💰 Prize Fund
      </h2>

      <div className="mt-3 space-y-2">

        <div className="flex justify-between">
          <span>Current Entries</span>
          <span>{entries}</span>
        </div>

        <div className="flex justify-between">
          <span>Entry Fee</span>
          <span>£{entryFee}</span>
        </div>

        {rollover > 0 && (
          <div className="flex justify-between">
            <span>Carry Forward</span>
            <span>£{rollover}</span>
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
