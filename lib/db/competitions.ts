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
    .order("competition_date");

  if (error) throw error;

  return data ?? [];
}

export async function getPreviousCompetition(
  competitionDate: string
) {
  const { data, error } = await supabase
    .from("competitions")
    .select("*")
    .lt("competition_date", competitionDate)
    .order("competition_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return data;
}
