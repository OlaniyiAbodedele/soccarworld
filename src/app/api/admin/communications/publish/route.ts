import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

import { requireSoccaRAdmin } from "@/lib/admin/requireSoccaRAdmin";

type PublishCommunicationRequest = {
  id?: string;
};

export async function POST(
  request: Request
) {
  try {
    /*
     * 1. Require explicit SoccaR Admin authorization.
     */
    await requireSoccaRAdmin();

    /*
     * 2. Read the communication ID.
     */
    const payload =
      (await request.json()) as PublishCommunicationRequest;

    const id = String(
      payload.id ?? ""
    ).trim();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A communication ID is required.",
        },
        { status: 400 }
      );
    }

    /*
     * 3. Create the secure server-only Supabase client.
     */
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SECRET_KEY;

    if (
      !supabaseUrl ||
      !serviceRoleKey
    ) {
      console.error(
        "Missing required Supabase administrative environment variables."
      );

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
     * 4. Retrieve the communication before publishing.
     */
    const {
      data: existing,
      error: lookupError,
    } = await supabaseAdmin
      .from("founder_updates")
      .select(
        `
          id,
          title,
          slug,
          excerpt,
          body,
          category,
          status,
          is_featured,
          published_at
        `
      )
      .eq("id", id)
      .maybeSingle();

    if (lookupError) {
      console.error(
        "SoccaR Admin publish lookup error:",
        lookupError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not retrieve this communication.",
        },
        { status: 500 }
      );
    }

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Communication not found.",
        },
        { status: 404 }
      );
    }

    /*
     * 5. Only drafts may be published.
     *
     * This prevents accidental re-publishing
     * or changing an already published record
     * through this endpoint.
     */
    if (existing.status !== "DRAFT") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only draft communications can be published.",
        },
        { status: 409 }
      );
    }

    /*
     * 6. Final content-integrity check.
     */
    if (
      !existing.title?.trim() ||
      !existing.slug?.trim() ||
      !existing.excerpt?.trim() ||
      !existing.body?.trim() ||
      !existing.category?.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This draft is incomplete and cannot be published.",
        },
        { status: 400 }
      );
    }

    /*
     * 7. Publish.
     *
     * The publication timestamp is generated
     * server-side at the exact moment of publishing.
     */
    const publishedAt =
      new Date().toISOString();

    const {
      data: communication,
      error: publishError,
    } = await supabaseAdmin
      .from("founder_updates")
      .update({
        status: "PUBLISHED",
        published_at: publishedAt,
        updated_at: publishedAt,
      })
      .eq("id", id)
      .eq("status", "DRAFT")
      .select(
        `
          id,
          title,
          slug,
          category,
          status,
          is_featured,
          published_at,
          updated_at
        `
      )
      .single();

    if (publishError) {
      console.error(
        "SoccaR Admin communication publish error:",
        publishError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not publish this communication.",
        },
        { status: 500 }
      );
    }

    /*
     * 8. Return the newly published record.
     */
    return NextResponse.json(
      {
        success: true,
        message:
          "Communication published successfully.",
        communication,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "SoccaR Admin publish API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "You are not authorised to publish SoccaR communications.",
      },
      { status: 403 }
    );
  }
}