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

export async function getOpenCompetition() {
  const now = new Date().toISOString();

  const {
    data: manualOpen,
    error: manualOpenError,
  } = await supabase
    .from("competitions")
    .select("*")
    .eq("status", "OPEN")
    .order("competition_date", {
      ascending: true,
    })
    .limit(1)
    .maybeSingle();

  if (manualOpenError) {
    throw manualOpenError;
  }

  if (manualOpen) {
    return manualOpen;
  }

  const {
    data: scheduledOpen,
    error: scheduledOpenError,
  } = await supabase
    .from("competitions")
    .select("*")
    .eq("status", "DRAFT")
    .not("opens_at", "is", null)
    .lte("opens_at", now)
    .order("opens_at", {
      ascending: true,
    })
    .limit(1)
    .maybeSingle();

  if (scheduledOpenError) {
    throw scheduledOpenError;
  }

  if (!scheduledOpen) {
    return null;
  }

  return {
    ...scheduledOpen,
    status: "OPEN",
  };
}

export async function getCurrentCompetition() {
  const now = new Date().toISOString();

  // First look for a competition already in its active lifecycle.
  const {
    data: activeCompetition,
    error: activeError,
  } = await supabase
    .from("competitions")
    .select("*")
    .in("status", [
      "OPEN",
      "IN_PROGRESS",
      "LEADERBOARD",
    ])
    .order("competition_date", {
      ascending: true,
    })
    .limit(1)
    .maybeSingle();

  if (activeError) {
    throw activeError;
  }

  if (activeCompetition) {
    return activeCompetition;
  }

  // If none is explicitly active, allow a scheduled DRAFT
  // whose opening time has arrived.
  const {
    data: scheduledOpen,
    error: scheduledError,
  } = await supabase
    .from("competitions")
    .select("*")
    .eq("status", "DRAFT")
    .not("opens_at", "is", null)
    .lte("opens_at", now)
    .order("opens_at", {
      ascending: true,
    })
    .limit(1)
    .maybeSingle();

  if (scheduledError) {
    throw scheduledError;
  }

  if (!scheduledOpen) {
    return null;
  }

  return {
    ...scheduledOpen,
    status: "OPEN",
  };
}
