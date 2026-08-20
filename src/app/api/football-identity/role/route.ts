import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

type FootballRoleRequest = {
  primaryRoleId?: string;
  additionalRoleIds?: string[];
};

export async function POST(request: Request) {
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
          message: "You must be signed in.",
        },
        { status: 401 }
      );
    }

    const body =
      (await request.json()) as FootballRoleRequest;

    const primaryRoleId = String(
      body.primaryRoleId ?? ""
    ).trim();

    const additionalRoleIds = Array.isArray(
      body.additionalRoleIds
    )
      ? body.additionalRoleIds
          .map((roleId) =>
            String(roleId).trim()
          )
          .filter(Boolean)
      : [];

    if (!primaryRoleId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please choose your Primary Football Role.",
        },
        { status: 400 }
      );
    }

    if (additionalRoleIds.length > 5) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You may choose up to five additional Football Roles.",
        },
        { status: 400 }
      );
    }

    const uniqueAdditionalRoleIds = [
      ...new Set(additionalRoleIds),
    ];

    if (
      uniqueAdditionalRoleIds.length !==
      additionalRoleIds.length
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The same additional role cannot be selected more than once.",
        },
        { status: 400 }
      );
    }

    if (
      uniqueAdditionalRoleIds.includes(
        primaryRoleId
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your Primary Role cannot also be selected as an additional role.",
        },
        { status: 400 }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Server configuration error.",
        },
        { status: 500 }
      );
    }

    const supabaseAdmin =
      createAdminClient(
        supabaseUrl,
        serviceRoleKey,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      );

    const {
      data: member,
      error: memberError,
    } = await supabaseAdmin
      .from("soccar_members")
      .select(
        "id, account_status"
      )
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (
      memberError ||
      !member ||
      member.account_status !== "ACTIVE"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your SoccaR membership is not currently active.",
        },
        { status: 403 }
      );
    }

    const {
      data: identity,
      error: identityError,
    } = await supabaseAdmin
      .from("football_identities")
      .select(
        "id, identity_status, current_step"
      )
      .eq("member_id", member.id)
      .maybeSingle();

    if (
      identityError ||
      !identity
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "We could not load your Football Identity.",
        },
        { status: 500 }
      );
    }

    if (
      identity.current_step !==
      "FOOTBALL_ROLE"
    ) {
      return NextResponse.json(
        {
          success: true,
          identityStatus:
            identity.identity_status,
          currentStep:
            identity.current_step,
        },
        { status: 200 }
      );
    }

    const requestedRoleIds = [
      primaryRoleId,
      ...uniqueAdditionalRoleIds,
    ];

    const {
      data: validRoles,
      error: validRolesError,
    } = await supabaseAdmin
      .from("football_roles")
      .select("id")
      .in(
        "id",
        requestedRoleIds
      )
      .eq("is_active", true);

    if (validRolesError) {
      console.error(
        "Football Role validation error:",
        validRolesError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not validate your Football Roles.",
        },
        { status: 500 }
      );
    }

    if (
      !validRoles ||
      validRoles.length !==
        requestedRoleIds.length
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "One or more selected Football Roles are not available.",
        },
        { status: 400 }
      );
    }

    const {
      error: deleteError,
    } = await supabaseAdmin
      .from("member_football_roles")
      .delete()
      .eq("member_id", member.id);

    if (deleteError) {
      console.error(
        "Football Role delete error:",
        deleteError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not update your Football Roles.",
        },
        { status: 500 }
      );
    }

    const newRoleRows = [
      {
        member_id: member.id,
        role_id: primaryRoleId,
        role_type: "PRIMARY",
      },

      ...uniqueAdditionalRoleIds.map(
        (roleId) => ({
          member_id: member.id,
          role_id: roleId,
          role_type: "ADDITIONAL",
        })
      ),
    ];

    const {
      error: insertError,
    } = await supabaseAdmin
      .from("member_football_roles")
      .insert(newRoleRows);

    if (insertError) {
      console.error(
        "Football Role insert error:",
        insertError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not save your Football Roles.",
        },
        { status: 500 }
      );
    }

    const now =
      new Date().toISOString();

    const {
      data: updatedIdentity,
      error: updateIdentityError,
    } = await supabaseAdmin
      .from("football_identities")
      .update({
        identity_status:
          "IN_PROGRESS",

        current_step:
          "FOOTBALL_BIO",

        updated_at:
          now,
      })
      .eq("id", identity.id)
      .eq("member_id", member.id)
      .select(
        "identity_status, current_step"
      )
      .single();

    if (updateIdentityError) {
      console.error(
        "Football Identity Role progression error:",
        updateIdentityError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Your roles were saved, but we could not advance your Football Identity.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,

        identityStatus:
          updatedIdentity.identity_status,

        currentStep:
          updatedIdentity.current_step,

        primaryRoleId,

        additionalRoleIds:
          uniqueAdditionalRoleIds,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Football Role route error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something unexpected happened while saving your Football Roles.",
      },
      { status: 500 }
    );
  }
}