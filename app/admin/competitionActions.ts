"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentPlayer } from "@/lib/currentPlayer";

type CreateCompetitionInput = {
  name: string;
  course: string;
  competitionDate: string;
  entryFee: number;
  opensAt?: string;
};

export async function createCompetition(
  input: CreateCompetitionInput
) {
  const currentPlayer = await getCurrentPlayer();

  if (!currentPlayer?.is_admin) {
    return {
      success: false,
      message:
        "You are not authorised to create competitions.",
    };
  }

  const name = input.name.trim();
  const course = input.course.trim();
  const competitionDate =
    input.competitionDate.trim();
  const entryFee = Number(input.entryFee);
  const opensAt =
    input.opensAt?.trim() || null;

  if (!name) {
    return {
      success: false,
      message: "Competition name is required.",
    };
  }

  if (!course) {
    return {
      success: false,
      message: "Course is required.",
    };
  }

  if (!competitionDate) {
    return {
      success: false,
      message: "Competition date is required.",
    };
  }

  if (
    !Number.isFinite(entryFee) ||
    entryFee <= 0
  ) {
    return {
      success: false,
      message: "Entry fee must be greater than zero.",
    };
  }

  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const year =
    competitionDate.substring(0, 4);

  const id = `${year}-${slug}`;

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("competitions")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (existing) {
    return {
      success: false,
      message:
        "A competition with this name already exists for that year.",
    };
  }

  const { error } = await supabase
    .from("competitions")
    .insert({
      id,
      name,
      course,
      competition_date: competitionDate,
      entry_fee: entryFee,
      rollover: 0,
      status: "DRAFT",
      opens_at: opensAt,
    });

  if (error) {
    console.error(
      "Create competition failed:",
      error
    );

    return {
      success: false,
      message: "Unable to create competition.",
    };
  }

  return {
    success: true,
    message: `${name} created successfully.`,
    competitionId: id,
  };
}
