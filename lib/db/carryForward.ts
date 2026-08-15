import { getPreviousCompetition } from "@/lib/db/competitions";
import { getEntries } from "@/lib/entries";
import { calculateCarryForward } from "@/lib/rollover";

export async function getCarryForward(
  competitionDate: string,
  startingRollover: number
): Promise<number> {
  const previousCompetition =
    await getPreviousCompetition(competitionDate);

  // First competition in the chain.
  if (!previousCompetition) {
    return startingRollover;
  }

  // Work out what rollover was actually available
  // when the previous competition was played.
  const previousCarryForward =
    await getCarryForward(
      previousCompetition.competition_date,
      previousCompetition.rollover ?? 0
    );

  const previousEntries = await getEntries(
    previousCompetition.id
  );

  return calculateCarryForward(
    previousEntries,
    Number(previousCompetition.entry_fee),
    previousCarryForward
  );
}
