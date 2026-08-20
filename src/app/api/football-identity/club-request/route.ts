import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

type ClubRequestBody = {
  requestedName?: string;
  countryName?: string;
  city?: string;
  notes?: string;
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
      (await request.json()) as ClubRequestBody;

    const requestedName = String(
      body.requestedName ?? ""
    ).trim();

    const countryName = String(
      body.countryName ?? ""
    ).trim();

    const city = String(
      body.city ?? ""
    ).trim();

    const notes = String(
      body.notes ?? ""
    ).trim();

    if (!requestedName) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter the club name.",
        },
        { status: 400 }
      );
    }

    if (requestedName.length > 180) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The club name is too long.",
        },
        { status: 400 }
      );
    }

    if (countryName.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The country name is too long.",
        },
        { status: 400 }
      );
    }

    if (city.length > 120) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The city name is too long.",
        },
        { status: 400 }
      );
    }

    if (notes.length > 1000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The additional information is too long.",
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

    const {
      data: member,
      error: memberError,
    } = await supabaseAdmin
      .from("soccar_members")
      .select("id, account_status")
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

    /*
     * Avoid obvious duplicate pending requests
     * by the same member.
     */
    const {
      data: existingRequest,
      error: existingRequestError,
    } = await supabaseAdmin
      .from("football_club_requests")
      .select("id")
      .eq("member_id", member.id)
      .eq("status", "PENDING")
      .ilike(
        "requested_name",
        requestedName
      )
      .maybeSingle();

    if (existingRequestError) {
      console.error(
        "Club request duplicate lookup error:",
        existingRequestError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not check your existing club requests.",
        },
        { status: 500 }
      );
    }

    if (existingRequest) {
      return NextResponse.json(
        {
          success: true,
          alreadyRequested: true,
          message:
            "You have already submitted this club for review.",
        },
        { status: 200 }
      );
    }

    const {
      error: insertError,
    } = await supabaseAdmin
      .from("football_club_requests")
      .insert({
        member_id: member.id,
        requested_name: requestedName,
        country_name:
          countryName || null,
        city:
          city || null,
        notes:
          notes || null,
        status: "PENDING",
        updated_at:
          new Date().toISOString(),
      });

    if (insertError) {
      console.error(
        "Football Club request insert error:",
        insertError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not submit your club request.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Your club has been submitted to SoccaR for review.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Football Club request route error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something unexpected happened.",
      },
      { status: 500 }
    );
  }
}