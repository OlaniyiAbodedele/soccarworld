import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

import { requireSoccaRAdmin } from "@/lib/admin/requireSoccaRAdmin";

type CreateCommunicationRequest = {
  title?: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  category?: string;
  isFeatured?: boolean;
};

const allowedCategories = new Set([
  "PLATFORM",
  "FOUNDING_COMMUNITY",
  "PRODUCT",
  "EARLY_ACCESS",
  "ANNOUNCEMENT",
]);

export async function POST(request: Request) {
  try {
    /*
     * 1. Require an authorised SoccaR administrator.
     */
    await requireSoccaRAdmin();

    /*
     * 2. Read and normalise the submitted draft.
     */
    const payload =
      (await request.json()) as CreateCommunicationRequest;

    const title = String(
      payload.title ?? ""
    ).trim();

    const slug = String(
      payload.slug ?? ""
    )
      .trim()
      .toLowerCase();

    const excerpt = String(
      payload.excerpt ?? ""
    ).trim();

    const body = String(
      payload.body ?? ""
    ).trim();

    const category = String(
      payload.category ?? ""
    )
      .trim()
      .toUpperCase();

    const isFeatured =
      payload.isFeatured === true;

    if (
      !title ||
      !slug ||
      !excerpt ||
      !body ||
      !category
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Complete all required communication fields.",
        },
        { status: 400 }
      );
    }

    if (
      !allowedCategories.has(category)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Select a valid communication category.",
        },
        { status: 400 }
      );
    }

    /*
     * Keep slugs URL-safe and predictable.
     */
    if (
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
        slug
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The article slug may contain only lowercase letters, numbers and hyphens.",
        },
        { status: 400 }
      );
    }

    /*
     * 3. Create the secure server-only Supabase client.
     */
    const supabaseUrl =
      process.env
        .NEXT_PUBLIC_SUPABASE_URL;

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
     * 4. Create DRAFT only.
     *
     * Publishing will be handled separately so an
     * unfinished article can never accidentally go live.
     */
    const {
      data: communication,
      error,
    } = await supabaseAdmin
      .from("founder_updates")
      .insert({
        title,
        slug,
        excerpt,
        body,
        category,
        status: "DRAFT",
        is_featured: isFeatured,
        published_at: null,
      })
      .select(
        `
          id,
          title,
          slug,
          status
        `
      )
      .single();

    if (error) {
      console.error(
        "SoccaR Admin communication creation error:",
        error
      );

      if (
        error.code === "23505"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "An article already uses this slug. Choose a different slug.",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not save this communication draft.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Communication saved as draft.",
        communication,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "SoccaR Admin communications API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "You are not authorised to create SoccaR communications.",
      },
      { status: 403 }
    );
  }
}
type UpdateCommunicationRequest = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  category?: string;
  isFeatured?: boolean;
};

export async function PATCH(
  request: Request
) {
  try {
    await requireSoccaRAdmin();

    const payload =
      (await request.json()) as UpdateCommunicationRequest;

    const id = String(
      payload.id ?? ""
    ).trim();

    const title = String(
      payload.title ?? ""
    ).trim();

    const slug = String(
      payload.slug ?? ""
    )
      .trim()
      .toLowerCase();

    const excerpt = String(
      payload.excerpt ?? ""
    ).trim();

    const body = String(
      payload.body ?? ""
    ).trim();

    const category = String(
      payload.category ?? ""
    )
      .trim()
      .toUpperCase();

    const isFeatured =
      payload.isFeatured === true;

    if (
      !id ||
      !title ||
      !slug ||
      !excerpt ||
      !body ||
      !category
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Complete all required communication fields.",
        },
        { status: 400 }
      );
    }

    if (
      !allowedCategories.has(category)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Select a valid communication category.",
        },
        { status: 400 }
      );
    }

    if (
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
        slug
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The article slug may contain only lowercase letters, numbers and hyphens.",
        },
        { status: 400 }
      );
    }

    const supabaseUrl =
      process.env
        .NEXT_PUBLIC_SUPABASE_URL;

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

    /*
     * Only DRAFT communications may be edited
     * through this endpoint.
     */
    const {
      data: existing,
      error: lookupError,
    } = await supabaseAdmin
      .from("founder_updates")
      .select("id, status")
      .eq("id", id)
      .maybeSingle();

    if (lookupError) {
      console.error(
        "SoccaR Admin communication lookup error:",
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

    if (existing.status !== "DRAFT") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only draft communications can be edited.",
        },
        { status: 409 }
      );
    }

    const {
      data: communication,
      error: updateError,
    } = await supabaseAdmin
      .from("founder_updates")
      .update({
        title,
        slug,
        excerpt,
        body,
        category,
        is_featured: isFeatured,
      })
      .eq("id", id)
      .eq("status", "DRAFT")
      .select(
        `
          id,
          title,
          slug,
          status
        `
      )
      .single();

    if (updateError) {
      console.error(
        "SoccaR Admin communication update error:",
        updateError
      );

      if (
        updateError.code === "23505"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Another article already uses this slug. Choose a different slug.",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not update this communication draft.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Communication draft updated.",
      communication,
    });
  } catch (error) {
    console.error(
      "SoccaR Admin communication update API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "You are not authorised to edit SoccaR communications.",
      },
      { status: 403 }
    );
  }
}