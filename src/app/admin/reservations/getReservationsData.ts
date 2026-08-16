import "server-only";

import { createClient as createAdminClient } from "@supabase/supabase-js";

export type AdminReservation = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string | null;
  memberType: string | null;
  status: string;
  createdAt: string;
};

export async function getReservationsData(): Promise<
  AdminReservation[]
> {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing required Supabase server environment variables."
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
    data,
    error,
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
    });

  if (error) {
    console.error(
      "SoccaR Admin Reservations query error:",
      error
    );

    throw new Error(
      "Could not retrieve Founder reservations."
    );
  }

  return (data ?? []).map(
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
      status: reservation.status,
      createdAt:
        reservation.created_at,
    })
  );
}