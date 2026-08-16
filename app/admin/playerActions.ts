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

type UpdatePlayerInput = {
  playerId: string;
  displayName: string;
  mobile: string;
  golfLinkNumber?: string;
  isAdmin: boolean;
};

async function requireAdmin() {
  const currentPlayer = await getCurrentPlayer();

  if (!currentPlayer?.is_admin) {
    return null;
  }

  return currentPlayer;
}

export async function createPlayer(
  input: CreatePlayerInput
) {
  const currentPlayer = await requireAdmin();

  if (!currentPlayer) {
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

  if (!/^\d{6}$/.test(temporaryPin)) {
    return {
      success: false,
      message: "Temporary PIN must be exactly 6 digits.",
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

export async function updatePlayer(
  input: UpdatePlayerInput
) {
  const currentPlayer = await requireAdmin();

  if (!currentPlayer) {
    return {
      success: false,
      message: "You are not authorised to edit players.",
    };
  }

  const displayName = input.displayName.trim();
  const mobile = input.mobile.trim();
  const golfLinkNumber =
    input.golfLinkNumber?.trim() || null;

  if (!displayName || !mobile) {
    return {
      success: false,
      message: "Name and mobile number are required.",
    };
  }

  const supabase = createAdminClient();

  const { data: duplicateMobile } = await supabase
    .from("players")
    .select("id")
    .eq("mobile", mobile)
    .neq("id", input.playerId)
    .maybeSingle();

  if (duplicateMobile) {
    return {
      success: false,
      message: "Another player already uses that mobile number.",
    };
  }

  const { error } = await supabase
    .from("players")
    .update({
      display_name: displayName,
      mobile,
      golf_link_number: golfLinkNumber,
      is_admin: input.isAdmin,
    })
    .eq("id", input.playerId);

  if (error) {
    console.error("Update player failed:", error);

    return {
      success: false,
      message: "Unable to update player.",
    };
  }

  return {
    success: true,
    message: `${displayName} updated successfully.`,
  };
}

export async function setPlayerActive(
  playerId: string,
  active: boolean
) {
  const currentPlayer = await requireAdmin();

  if (!currentPlayer) {
    return {
      success: false,
      message: "You are not authorised to manage players.",
    };
  }

  if (currentPlayer.id === playerId && !active) {
    return {
      success: false,
      message: "You cannot deactivate your own account.",
    };
  }

  const supabase = createAdminClient();

  const { data: player, error: lookupError } =
    await supabase
      .from("players")
      .select("display_name")
      .eq("id", playerId)
      .single();

  if (lookupError || !player) {
    return {
      success: false,
      message: "Player not found.",
    };
  }

  const { error } = await supabase
    .from("players")
    .update({
      active,
    })
    .eq("id", playerId);

  if (error) {
    console.error(
      "Update player active status failed:",
      error
    );

    return {
      success: false,
      message: "Unable to update player status.",
    };
  }

  return {
    success: true,
    message: active
      ? `${player.display_name} reactivated.`
      : `${player.display_name} deactivated.`,
  };
}

export async function resetPlayerPin(
  playerId: string,
  newPin: string
) {
  const currentPlayer = await requireAdmin();

  if (!currentPlayer) {
    return {
      success: false,
      message: "You are not authorised to reset PINs.",
    };
  }

  const pin = newPin.trim();

  if (!/^\d{6}$/.test(pin)) {
    return {
      success: false,
      message: "PIN must be exactly 6 digits.",
    };
  }

  const supabase = createAdminClient();

  const { data: player, error: playerError } =
    await supabase
      .from("players")
      .select(
        "display_name, auth_user_id"
      )
      .eq("id", playerId)
      .single();

  if (
    playerError ||
    !player ||
    !player.auth_user_id
  ) {
    return {
      success: false,
      message: "Player login account could not be found.",
    };
  }

  const { error: authError } =
    await supabase.auth.admin.updateUserById(
      player.auth_user_id,
      {
        password: pin,
      }
    );

  if (authError) {
    console.error(
      "Reset player PIN failed:",
      authError
    );

    return {
      success: false,
      message: "Unable to reset player PIN.",
    };
  }

  return {
    success: true,
    message: `${player.display_name}'s PIN has been reset.`,
  };
}
