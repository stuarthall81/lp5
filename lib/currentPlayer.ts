import { createClient } from "@/lib/supabase/server";

export type Player = {
  id: string;
  display_name: string;
  email: string | null;
  mobile: string | null;
  golf_link_number: string | null;
  is_admin: boolean;
};

export async function getCurrentPlayer(): Promise<Player | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("players")
    .select(
      "id, display_name, email, mobile, golf_link_number, is_admin"
    )
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Current player lookup failed:", error);
    return null;
  }

  return data;
}
