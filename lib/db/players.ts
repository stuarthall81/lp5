import { supabase } from "../supabase";

export async function getPlayerByName(name: string) {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("display_name", name)
    .single();

  if (error) throw error;

  return data;
}

export async function getPlayer(uuid: string) {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("id", uuid)
    .single();

  if (error) throw error;

  return data;
}
