import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

type ReadUpdateRequest = {
  updateId?: string;
  markAll?: boolean;
};

export async function POST(
  request: Request
) {
  try {
    /*
     * 1. Confirm the visitor has a
     * valid authenticated Supabase
     * session.
     */
    const supabase =
      await createClient();

    const {
      data: { user },
      error: userError,
    } =
      await supabase.auth.getUser();

    if (
      userError ||
      !user
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You must be signed in to update Founder read status.",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * 2. Read the requested action.
     */
    const body =
      (await request.json()) as ReadUpdateRequest;

    const updateId =
      typeof body.updateId ===
      "string"
        ? body.updateId.trim()
        : "";

    const markAll =
      body.markAll === true;

    if (
      !markAll &&
      !updateId
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No Founder Update was selected.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * 3. Create the secure
     * server-only admin client.
     */
    const supabaseUrl =
      process.env
        .NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env
        .SUPABASE_SECRET_KEY;

    if (
      !supabaseUrl ||
      !serviceRoleKey
    ) {
      console.error(
        "Missing required Supabase server environment variables."
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Founder Updates are temporarily unavailable.",
        },
        {
          status: 500,
        }
      );
    }

    const supabaseAdmin =
      createAdminClient(
        supabaseUrl,
        serviceRoleKey,
        {
          auth: {
            autoRefreshToken:
              false,
            persistSession:
              false,
          },
        }
      );

    /*
     * 4. Retrieve the authenticated
     * SoccaR member using the same
     * identity model as the Founder
     * Dashboard.
     */
    const {
      data: member,
      error: memberError,
    } = await supabaseAdmin
      .from("soccar_members")
      .select(
        `
          id,
          account_status
        `
      )
      .eq(
        "auth_user_id",
        user.id
      )
      .maybeSingle();

    if (
      memberError ||
      !member ||
      member.account_status !==
        "ACTIVE"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your active SoccaR Founder account could not be confirmed.",
        },
        {
          status: 403,
        }
      );
    }

    /*
     * 5A. MARK ALL PUBLISHED
     * UPDATES AS READ.
     */
    if (markAll) {
      const {
        data: publishedUpdates,
        error: publishedError,
      } = await supabaseAdmin
        .from(
          "founder_updates"
        )
        .select("id")
        .eq(
          "status",
          "PUBLISHED"
        );

      if (publishedError) {
        console.error(
          "Founder Updates lookup error:",
          publishedError
        );

        return NextResponse.json(
          {
            success: false,
            message:
              "We could not retrieve the current Founder Updates.",
          },
          {
            status: 500,
          }
        );
      }

      const updateIds =
        (
          publishedUpdates ?? []
        ).map(
          (update) =>
            update.id
        );

      if (
        updateIds.length === 0
      ) {
        return NextResponse.json(
          {
            success: true,
            markedCount: 0,
          },
          {
            status: 200,
          }
        );
      }

      const now =
        new Date().toISOString();

      const readRecords =
        updateIds.map(
          (id) => ({
            update_id: id,
            member_id:
              member.id,
            read_at: now,
          })
        );

      const {
        error: upsertError,
      } = await supabaseAdmin
        .from(
          "founder_update_reads"
        )
        .upsert(
          readRecords,
          {
            onConflict:
              "update_id,member_id",
            ignoreDuplicates:
              true,
          }
        );

      if (upsertError) {
        console.error(
          "Mark all Founder Updates as read error:",
          upsertError
        );

        return NextResponse.json(
          {
            success: false,
            message:
              "We could not update your Founder read status.",
          },
          {
            status: 500,
          }
        );
      }

      return NextResponse.json(
        {
          success: true,
          markedCount:
            updateIds.length,
        },
        {
          status: 200,
        }
      );
    }

    /*
     * 5B. MARK ONE PUBLISHED
     * UPDATE AS READ.
     */
    const {
      data: founderUpdate,
      error: updateError,
    } = await supabaseAdmin
      .from("founder_updates")
      .select(
        `
          id,
          status
        `
      )
      .eq(
        "id",
        updateId
      )
      .maybeSingle();

    if (
      updateError ||
      !founderUpdate ||
      founderUpdate.status !==
        "PUBLISHED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This Founder Update is not currently available.",
        },
        {
          status: 404,
        }
      );
    }

    const {
      error: readError,
    } = await supabaseAdmin
      .from(
        "founder_update_reads"
      )
      .upsert(
        {
          update_id:
            founderUpdate.id,
          member_id:
            member.id,
          read_at:
            new Date().toISOString(),
        },
        {
          onConflict:
            "update_id,member_id",
          ignoreDuplicates:
            true,
        }
      );

    if (readError) {
      console.error(
        "Mark Founder Update as read error:",
        readError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not update your Founder read status.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        updateId:
          founderUpdate.id,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Founder Updates read API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something unexpected happened while updating your Founder read status.",
      },
      {
        status: 500,
      }
    );
  }
}