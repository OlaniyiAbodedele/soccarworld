import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

type ProfileUpdateRequest = {
  username?: string;
  countryOfOrigin?: string;
  cityOfResidence?: string;
};

function normalizeUsername(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be signed in to update your profile.",
        },
        { status: 401 }
      );
    }

    const body =
      (await request.json()) as ProfileUpdateRequest;

    const username = normalizeUsername(
      String(body.username ?? "")
    );

    const countryOfOrigin = String(
      body.countryOfOrigin ?? ""
    ).trim();

    const cityOfResidence = String(
      body.cityOfResidence ?? ""
    ).trim();

    if (
      !username ||
      !countryOfOrigin ||
      !cityOfResidence
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Username, country of origin and city of residence are required.",
        },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your SoccaR username must contain at least 3 characters.",
        },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9_]+$/.test(username)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your username may contain only letters, numbers and underscores.",
        },
        { status: 400 }
      );
    }

    if (
      countryOfOrigin.length > 80 ||
      cityOfResidence.length > 80 ||
      username.length > 30
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "One or more profile fields are too long.",
        },
        { status: 400 }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error(
        "Missing required Supabase server environment variables."
      );

      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error.",
        },
        { status: 500 }
      );
    }

    const supabaseAdmin = createAdminClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    /*
     * Find the SoccaR member linked to the
     * authenticated Supabase identity.
     */
    const {
      data: member,
      error: memberError,
    } = await supabaseAdmin
      .from("soccar_members")
      .select("id, account_status, username")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (memberError) {
      console.error(
        "Founder profile member lookup error:",
        memberError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not verify your SoccaR membership.",
        },
        { status: 500 }
      );
    }

    if (!member || member.account_status !== "ACTIVE") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your SoccaR membership is not currently active.",
        },
        { status: 403 }
      );
    }

    /*
     * Prevent duplicate usernames.
     */
    const {
      data: existingUsername,
      error: usernameLookupError,
    } = await supabaseAdmin
      .from("soccar_members")
      .select("id")
      .eq("username", username)
      .neq("id", member.id)
      .maybeSingle();

    if (usernameLookupError) {
      console.error(
        "Username availability lookup error:",
        usernameLookupError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not check username availability.",
        },
        { status: 500 }
      );
    }

    if (existingUsername) {
      return NextResponse.json(
        {
          success: false,
          message:
            "That SoccaR username is already in use. Please choose another.",
        },
        { status: 409 }
      );
    }

    /*
     * Update only the permitted editable fields.
     */
    const {
      error: updateError,
    } = await supabaseAdmin
      .from("soccar_members")
      .update({
        username,
        country_of_origin: countryOfOrigin,
        city_of_residence: cityOfResidence,
        updated_at: new Date().toISOString(),
      })
      .eq("id", member.id);

    if (updateError) {
      console.error(
        "Founder profile update database error:",
        updateError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not save your Founder profile.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Your Founder profile has been updated successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Founder profile update route error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something unexpected happened while updating your Founder profile.",
      },
      { status: 500 }
    );
  }
}