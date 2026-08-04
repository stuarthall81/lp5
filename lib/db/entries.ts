import { supabase } from "../supabase";

export async function getEntries(competitionId: string) {
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("competition_id", competitionId);

  if (error) throw error;

  return data ?? [];
}

export async function getPlayerEntry(
  competitionId: string,
  playerUuid: string
) {
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("competition_id", competitionId)
    .eq("player_uuid", playerUuid)
    .single();

  if (error && error.code !== "PGRST116") throw error;

  return data;
}

export async function updatePlayerEntry(
  competitionId: string,
  playerUuid: string,
  playing: boolean,
  paid: boolean
) {
  const { error } = await supabase
    .from("entries")
    .upsert({
      competition_id: competitionId,
      player_uuid: playerUuid,
      playing,
      paid,
    });

  if (error) throw error;
}

export async function submitScore(
  competitionId: string,
  playerUuid: string,
  score: number
) {
  const { error } = await supabase
    .from("entries")
    .update({ score })
    .eq("competition_id", competitionId)
    .eq("player_uuid", playerUuid);

  if (error) throw error;
}
