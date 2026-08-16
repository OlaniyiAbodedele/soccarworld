import "server-only";

import { createClient as createAdminClient } from "@supabase/supabase-js";

export type AdminRecentReservation = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string | null;
  memberType: string | null;
  status: string;
  createdAt: string;
};

export type AdminOverviewData = {
  totalFounders: number;
  activeMembers: number;
  pendingVerification: number;
  pendingAccountActivation: number;
  currentFounderNumber: string;
  recentReservations: AdminRecentReservation[];
};

function formatFounderNumber(value: number) {
  return String(value).padStart(5, "0");
}

export async function getAdminOverviewData(): Promise<AdminOverviewData> {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing required Supabase server environment variables."
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
   * Total active Founder memberships.
   */
  const {
    count: totalFounders,
    error: founderCountError,
  } = await supabaseAdmin
    .from("founder_memberships")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("status", "ACTIVE");

  if (founderCountError) {
    throw new Error(
      "Could not retrieve Founder membership count."
    );
  }

  /*
   * Total active SoccaR member accounts.
   */
  const {
    count: activeMembers,
    error: activeMembersError,
  } = await supabaseAdmin
    .from("soccar_members")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("account_status", "ACTIVE");

  if (activeMembersError) {
    throw new Error(
      "Could not retrieve active member count."
    );
  }

  /*
   * Reservations still waiting for email verification.
   */
  const {
    count: pendingVerification,
    error: pendingVerificationError,
  } = await supabaseAdmin
    .from("founder_reservations")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq(
      "status",
      "PENDING_VERIFICATION"
    );

  if (pendingVerificationError) {
    throw new Error(
      "Could not retrieve pending verification count."
    );
  }

  /*
   * Founder members who exist but have not yet
   * completed their SoccaR account activation.
   */
  const {
    count: pendingAccountActivation,
    error: pendingActivationError,
  } = await supabaseAdmin
    .from("soccar_members")
    .select("id", {
      count: "exact",
      head: true,
    })
    .neq("account_status", "ACTIVE");

  if (pendingActivationError) {
    throw new Error(
      "Could not retrieve pending account activation count."
    );
  }

  /*
   * Current permanent Founder Number sequence.
   */
  const {
    data: founderCounter,
    error: founderCounterError,
  } = await supabaseAdmin
    .from("founder_number_counter")
    .select("last_number")
    .eq("id", 1)
    .maybeSingle();

  if (
    founderCounterError ||
    !founderCounter
  ) {
    throw new Error(
      "Could not retrieve Founder Number counter."
    );
  }

  /*
   * Most recent Founder reservations.
   */
  const {
    data: recentReservations,
    error: recentReservationsError,
  } = await supabaseAdmin
    .from("founder_reservations")
    .select(
      `
        id,
        first_name,
        last_name,
        email,
        country,
        member_type,
        status,
        created_at
      `
    )
    .order("created_at", {
      ascending: false,
    })
    .limit(8);

  if (recentReservationsError) {
    throw new Error(
      "Could not retrieve recent Founder reservations."
    );
  }

  return {
    totalFounders:
      totalFounders ?? 0,

    activeMembers:
      activeMembers ?? 0,

    pendingVerification:
      pendingVerification ?? 0,

    pendingAccountActivation:
      pendingAccountActivation ?? 0,

    currentFounderNumber:
      formatFounderNumber(
        Number(
          founderCounter.last_number
        )
      ),

    recentReservations:
      (recentReservations ?? []).map(
        (reservation) => ({
          id: reservation.id,
          firstName:
            reservation.first_name,
          lastName:
            reservation.last_name,
          email: reservation.email,
          country:
            reservation.country,
          memberType:
            reservation.member_type,
          status:
            reservation.status,
          createdAt:
            reservation.created_at,
        })
      ),
  };
}