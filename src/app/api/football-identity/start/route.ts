import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

type FootballRoleRequest = {
  primaryRoleId?: string;
  additionalRoleIds?: string[];
};

export async function POST(request: Request) {
  try {
    /*
     * 1. Confirm authenticated Supabase user.
     */
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

    /*
     * 2. Read and normalize request.
     */
    const body =
      (await request.json()) as FootballRoleRequest;

    const primaryRoleId = String(
      body.primaryRoleId ?? ""
    ).trim();

    const rawAdditionalRoleIds =
      Array.isArray(body.additionalRoleIds)
        ? body.additionalRoleIds
        : [];

    const additionalRoleIds =
      rawAdditionalRoleIds
        .map((roleId) =>
          String(roleId).trim()
        )
        .filter(Boolean);

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

    /*
     * Maximum of five additional roles.
     */
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

    /*
     * Remove accidental duplicates.
     */
    const uniqueAdditionalRoleIds =
      [...new Set(additionalRoleIds)];

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

    /*
     * Primary role cannot also appear as
     * an additional role.
     */
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

    /*
     * 3. Secure server-only admin client.
     */
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

    /*
     * 4. Resolve the authenticated SoccaR member.
     */
    const {
      data: member,
      error: memberError,
    } = await supabaseAdmin
      .from("soccar_members")
      .select(
        "id, account_status"
      )
      .eq(
        "auth_user_id",
        user.id
      )
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

    /*
     * 5. Confirm Football Identity state.
     */
    const {
      data: identity,
      error: identityError,
    } = await supabaseAdmin
      .from("football_identities")
      .select(
        "id, identity_status, current_step"
      )
      .eq(
        "member_id",
        member.id
      )
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

    /*
     * Never move an already-advanced member
     * backwards.
     */
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

    /*
     * 6. Validate every requested role against
     * the canonical active Football Role table.
     */
    const requestedRoleIds = [
      primaryRoleId,
      ...uniqueAdditionalRoleIds,
    ];

    const {
      data: validRoles,
      error: validRolesError,
    } = await supabaseAdmin
      .from("football_roles")
      .select(
        "id, name, is_active"
      )
      .in(
        "id",
        requestedRoleIds
      )
      .eq(
        "is_active",
        true
      );

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

    /*
     * 7. Preserve the current role relationships
     * in memory in case a database write fails.
     */
    const {
      data: existingRoles,
      error: existingRolesError,
    } = await supabaseAdmin
      .from("member_football_roles")
      .select(
        "role_id, role_type"
      )
      .eq(
        "member_id",
        member.id
      );

    if (existingRolesError) {
      console.error(
        "Existing Football Roles lookup error:",
        existingRolesError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not load your existing Football Roles.",
        },
        { status: 500 }
      );
    }

    /*
     * 8. Replace this member's role relationships
     * with the newly confirmed selection.
     *
     * Database constraints already guarantee:
     * - one PRIMARY role maximum
     * - no duplicate member/role pairs
     * - maximum five ADDITIONAL roles
     */
    const {
      error: deleteError,
    } = await supabaseAdmin
      .from("member_football_roles")
      .delete()
      .eq(
        "member_id",
        member.id
      );

    if (deleteError) {
      console.error(
        "Football Role replacement delete error:",
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
        "Football Role replacement insert error:",
        insertError
      );

      /*
       * Best-effort restoration of the member's
       * previous role relationships.
       */
      if (
        existingRoles &&
        existingRoles.length > 0
      ) {
        const restoreRows =
          existingRoles.map(
            (existingRole) => ({
              member_id:
                member.id,
              role_id:
                existingRole.role_id,
              role_type:
                existingRole.role_type,
            })
          );

        const {
          error: restoreError,
        } = await supabaseAdmin
          .from(
            "member_football_roles"
          )
          .insert(
            restoreRows
          );

        if (restoreError) {
          console.error(
            "Football Role restoration error:",
            restoreError
          );
        }
      }

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not save your Football Roles.",
        },
        { status: 500 }
      );
    }

    /*
     * 9. Advance Football Identity to Bio.
     */
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
      .eq(
        "id",
        identity.id
      )
      .eq(
        "member_id",
        member.id
      )
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