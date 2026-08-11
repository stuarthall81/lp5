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
