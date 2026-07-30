import { Competition } from "@/types/competition";

export function calculatePrizeFund(competition: Competition) {
  return competition.entries * competition.entryFee + competition.rollover;
}
