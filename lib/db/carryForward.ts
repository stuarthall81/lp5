import { getPreviousCompetition } from "@/lib/db/competitions";
import { getEntries } from "@/lib/entries";
import { calculateCarryForward } from "@/lib/rollover";

export async function getCarryForward(
  competitionDate: string,
  startingRollover: number
) {
  const previousCompetition =
    await getPreviousCompetition(competitionDate);

  if (!previousCompetition) {
    return startingRollover;
  }

  const previousEntries = await getEntries(
    previousCompetition.id
  );

  return calculateCarryForward(
    previousEntries,
    previousCompetition.entry_fee,
    previousCompetition.rollover ?? 0
  );
}
