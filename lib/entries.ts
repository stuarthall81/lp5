import { supabase } from "./supabase";

export async function getEntries(competitionId: string) {
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("competition_id", competitionId);

  if (error) throw error;

  return data ?? [];
}

export async function updatePlayerEntry(
  competitionId: string,
  playerId: string,
  updates: {
    playing: boolean;
    paid: boolean;
    entryFeeDue: number;
  }
) {
  const { error } = await supabase
    .from("entries")
    .upsert(
      {
        competition_id: competitionId,
        player_id: playerId,
        playing: updates.playing,
        paid: updates.paid,
        entry_fee_due: updates.entryFeeDue,
      },
      {
        onConflict: "competition_id,player_id",
      }
    );

  if (error) throw error;
}

export async function submitScore(
  competitionId: string,
  playerId: string,
  score: number
) {
  const { error } = await supabase
    .from("entries")
    .update({
      score,
    })
    .eq("competition_id", competitionId)
    .eq("player_id", playerId);

  if (error) throw error;
}

export async function adminUpdateEntry(
  entryId: number,
  updates: {
    playing?: boolean;
    paid?: boolean;
    score?: number | null;
    entryFeeDue?: number;
  }
) {
  const updateData: {
    playing?: boolean;
    paid?: boolean;
    score?: number | null;
    entry_fee_due?: number;
  } = {};

  if (updates.playing !== undefined) {
    updateData.playing = updates.playing;
  }

  if (updates.paid !== undefined) {
    updateData.paid = updates.paid;
  }

  if (updates.score !== undefined) {
    updateData.score = updates.score;
  }

  if (updates.entryFeeDue !== undefined) {
    updateData.entry_fee_due = updates.entryFeeDue;
  }

  const { error } = await supabase
    .from("entries")
    .update(updateData)
    .eq("id", entryId);

  if (error) throw error;
}
