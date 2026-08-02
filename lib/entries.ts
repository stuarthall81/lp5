import { supabase } from "./supabase";

export async function getEntries(competitionId: string) {
  console.log("Competition ID:", competitionId);

  const response = await supabase
    .from("entries")
    .select("*")
    .eq("competition_id", competitionId);

  console.log("Supabase response:", response);

  return response.data ?? [];
}
