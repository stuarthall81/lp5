import { getPreviousCompetition } from "@/lib/db/competitions";
import { getEntries } from "@/lib/entries";
import { calculateCarryForward } from "@/lib/rollover";

export async function getCarryForward(
  competitionDate: string,
  startingRollover: number
) {
  const previousCompetition =
    await getPreviousCompetition(competitionDate);

  console.log(
    "Previous competition:",
    previousCompetition
  );

  if (!previousCompetition) {
    console.log(
      "No previous competition - using starting rollover:",
      startingRollover
    );

    return startingRollover;
  }

  const previousEntries = await getEntries(
    previousCompetition.id
  );

  console.log(
    "Previous entries:",
    previousEntries
  );

  const carryForward = calculateCarryForward(
    previousEntries,
    previousCompetition.entry_fee,
    previousCompetition.rollover ?? 0
  );

  console.log(
    "Calculated carry forward:",
    carryForward
  );

  return carryForward;
}
