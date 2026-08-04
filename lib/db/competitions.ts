import { supabase } from "../supabase";

export async function getCompetition(id: string) {
  const { data, error } = await supabase
    .from("competitions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function getCompetitions() {
  const { data, error } = await supabase
    .from("competitions")
    .select("*")
    .order("date");

  if (error) throw error;

  return data ?? [];
}
