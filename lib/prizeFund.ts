export function calculatePrizeFund(
  currentEntries: number,
  entryFee: number,
  rollover: number
) {
  return currentEntries * entryFee + rollover;
}

