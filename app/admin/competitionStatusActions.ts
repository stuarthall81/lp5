"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentPlayer } from "@/lib/currentPlayer";

type CompetitionStatus =
  | "DRAFT"
  | "OPEN"
  | "IN_PROGRESS"
  | "LEADERBOARD"
  | "COMPLETE";

export async function updateCompetitionStatus(
  competitionId: string,
  newStatus: CompetitionStatus
) {
  const currentPlayer = await getCurrentPlayer();

  if (!currentPlayer?.is_admin) {
    return {
      success: false,
      message:
        "You are not authorised to change competition status.",
    };
  }

  const supabase = createAdminClient();

  if (newStatus === "OPEN") {
    const { data: existingOpen, error: openError } =
      await supabase
        .from("competitions")
        .select("id, name")
        .eq("status", "OPEN")
        .neq("id", competitionId)
        .limit(1)
        .maybeSingle();

    if (openError) {
      console.error(
        "Open competition lookup failed:",
        openError
      );

      return {
        success: false,
        message:
          "Unable to check the current open competition.",
      };
    }

    if (existingOpen) {
      return {
        success: false,
        message:
          `${existingOpen.name} is already open. Complete or change its status first.`,
      };
    }
  }

  const { error } = await supabase
    .from("competitions")
    .update({
      status: newStatus,
    })
    .eq("id", competitionId);

  if (error) {
    console.error(
      "Competition status update failed:",
      error
    );

    return {
      success: false,
      message:
        "Unable to update competition status.",
    };
  }

  return {
    success: true,
    message: `Competition status changed to ${newStatus}.`,
  };
}
