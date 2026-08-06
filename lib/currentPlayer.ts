import { getPlayerSession } from "./session";
import { supabase } from "./supabase";

export type Player = {
  id: string;
  display_name: string;
  email: string | null;
  mobile: string | null;
  golf_link_number: string | null;
  is_admin: boolean;
};

export async function getCurrentPlayer(): Promise<Player | null> {
  const id = getPlayerSession();

  if (!id) return null;

  const { data, error } = await supabase
    .from("players")
    .select(
      "id, display_name, email, mobile, golf_link_number, is_admin"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}
