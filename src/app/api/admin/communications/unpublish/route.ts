import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

import { requireSoccaRAdmin } from "@/lib/admin/requireSoccaRAdmin";

type UnpublishCommunicationRequest = {
  id?: string;
};

export async function POST(
  request: Request
) {
  try {
    await requireSoccaRAdmin();

    const payload =
      (await request.json()) as UnpublishCommunicationRequest;

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

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SECRET_KEY;

    if (
      !supabaseUrl ||
      !serviceRoleKey
    ) {
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
      data: existing,
      error: lookupError,
    } = await supabaseAdmin
      .from("founder_updates")
      .select("id, status")
      .eq("id", id)
      .maybeSingle();

    if (lookupError) {
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

    if (
      existing.status !==
      "PUBLISHED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only published communications can be unpublished.",
        },
        { status: 409 }
      );
    }

    const updatedAt =
      new Date().toISOString();

    const {
      data: communication,
      error: unpublishError,
    } = await supabaseAdmin
      .from("founder_updates")
      .update({
        status: "DRAFT",
        published_at: null,
        updated_at: updatedAt,
      })
      .eq("id", id)
      .eq("status", "PUBLISHED")
      .select(
        `
          id,
          title,
          slug,
          status,
          published_at,
          updated_at
        `
      )
      .single();

    if (unpublishError) {
      return NextResponse.json(
        {
          success: false,
          message:
            "We could not unpublish this communication.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Communication returned to draft.",
        communication,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "SoccaR Admin unpublish API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "You are not authorised to unpublish SoccaR communications.",
      },
      { status: 403 }
    );
  }
}