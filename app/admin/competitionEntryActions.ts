"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentPlayer } from "@/lib/currentPlayer";
import { calculatePlayerEntryFee } from "@/lib/playerEntryFee";

export async function adminAddPlayerToCompetition(
  competitionId: string,
  playerId: string
) {
  const currentPlayer = await getCurrentPlayer();

  if (!currentPlayer?.is_admin) {
    return {
      success: false,
      message:
        "You are not authorised to add competition entries.",
    };
  }

  if (!playerId) {
    return {
      success: false,
      message: "Please select a player.",
    };
  }

  const supabase = createAdminClient();

  const {
    data: competition,
    error: competitionError,
  } = await supabase
    .from("competitions")
    .select(
      "id, competition_date, entry_fee"
    )
    .eq("id", competitionId)
    .single();

  if (
    competitionError ||
    !competition
  ) {
    return {
      success: false,
      message: "Competition not found.",
    };
  }

  const {
    data: existingEntry,
    error: existingError,
  } = await supabase
    .from("entries")
    .select("id")
    .eq(
      "competition_id",
      competitionId
    )
    .eq("player_id", playerId)
    .maybeSingle();

  if (existingError) {
    console.error(
      "Entry lookup failed:",
      existingError
    );

    return {
      success: false,
      message:
        "Unable to check the player's entry.",
    };
  }

  if (existingEntry) {
    return {
      success: false,
      message:
        "This player is already entered in the competition.",
    };
  }

  const entryFeeDue =
    await calculatePlayerEntryFee(
      playerId,
      {
        id: competition.id,
        competition_date:
          competition.competition_date,
        entry_fee: Number(
          competition.entry_fee
        ),
      }
    );

  const { error: insertError } =
    await supabase
      .from("entries")
      .insert({
        competition_id:
          competitionId,
        player_id: playerId,
        playing: true,
        paid: false,
        score: null,
        entry_fee_due:
          entryFeeDue,
      });

  if (insertError) {
    console.error(
      "Admin add competition entry failed:",
      insertError
    );

    return {
      success: false,
      message:
        "Unable to add player to competition.",
    };
  }

  return {
    success: true,
    message:
      `Player added successfully. Entry fee due: £${entryFeeDue}.`,
  };
}
