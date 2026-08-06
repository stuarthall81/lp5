import { supabase } from "@/lib/supabase";

export async function getPlayerByMobile(mobile: string) {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("mobile", mobile)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}
