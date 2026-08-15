"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentPlayer } from "@/lib/currentPlayer";

type CreatePlayerInput = {
  displayName: string;
  mobile: string;
  golfLinkNumber?: string;
  temporaryPin: string;
  isAdmin?: boolean;
};

export async function createPlayer(
  input: CreatePlayerInput
) {
  const currentPlayer = await getCurrentPlayer();

  if (!currentPlayer?.is_admin) {
    return {
      success: false,
      message: "You are not authorised to add players.",
    };
  }

  const displayName = input.displayName.trim();
  const mobile = input.mobile.trim();
  const golfLinkNumber =
    input.golfLinkNumber?.trim() || null;
  const temporaryPin = input.temporaryPin.trim();
  const isAdmin = input.isAdmin ?? false;

  if (!displayName) {
    return {
      success: false,
      message: "Player name is required.",
    };
  }

  if (!mobile) {
    return {
      success: false,
      message: "Mobile number is required.",
    };
  }

  if (temporaryPin.length < 6) {
    return {
      success: false,
      message: "Temporary PIN must be at least 6 digits.",
    };
  }

  const supabase = createAdminClient();

  const { data: existingPlayer } = await supabase
    .from("players")
    .select("id")
    .eq("mobile", mobile)
    .maybeSingle();

  if (existingPlayer) {
    return {
      success: false,
      message: "A player already exists with that mobile number.",
    };
  }

  const internalEmail =
    `${crypto.randomUUID()}@lp5.internal`;

  const {
    data: authData,
    error: authError,
  } = await supabase.auth.admin.createUser({
    email: internalEmail,
    password: temporaryPin,
    email_confirm: true,
    user_metadata: {
      display_name: displayName,
    },
  });

  if (authError || !authData.user) {
    console.error(
      "Create Auth user failed:",
      authError
    );

    return {
      success: false,
      message: "Unable to create player login.",
    };
  }

  const authUserId = authData.user.id;

  const { error: playerError } = await supabase
    .from("players")
    .insert({
      id: crypto.randomUUID(),
      display_name: displayName,
      email: internalEmail,
      mobile,
      golf_link_number: golfLinkNumber,
      is_admin: isAdmin,
      active: true,
      auth_user_id: authUserId,
    });

  if (playerError) {
    console.error(
      "Create player row failed:",
      playerError
    );

    // Clean up the Auth account if the player row failed.
    await supabase.auth.admin.deleteUser(
      authUserId
    );

    return {
      success: false,
      message:
        "Unable to create player record. No account was saved.",
    };
  }

  return {
    success: true,
    message: `${displayName} created successfully.`,
  };
}
