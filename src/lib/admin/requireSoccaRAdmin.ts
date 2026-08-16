import "server-only";

import { redirect } from "next/navigation";
import { createClient as createAdminClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

export type SoccaRAdminRole = "SUPER_ADMIN";

export type SoccaRAdmin = {
  adminId: string;
  memberId: string;
  authUserId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: SoccaRAdminRole;
};

/**
 * Protects SoccaR Admin server routes/pages.
 *
 * Access requires:
 * 1. A valid authenticated Supabase session.
 * 2. An ACTIVE SoccaR member account.
 * 3. An ACTIVE entry in soccar_admins.
 * 4. A recognised administrative role.
 *
 * The Supabase secret key is used only on the server.
 */
export async function requireSoccaRAdmin(): Promise<SoccaRAdmin> {
  /*
   * 1. Confirm authenticated session.
   */
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/sign-in");
  }

  /*
   * 2. Create secure server-only administrative client.
   */
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
   * 3. Confirm authenticated identity belongs
   * to an ACTIVE SoccaR member.
   */
  const {
    data: member,
    error: memberError,
  } = await supabaseAdmin
    .from("soccar_members")
    .select(
      `
        id,
        auth_user_id,
        first_name,
        last_name,
        email,
        account_status
      `
    )
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (
    memberError ||
    !member ||
    member.account_status !== "ACTIVE"
  ) {
    redirect("/sign-in");
  }

  /*
   * 4. Confirm explicit ACTIVE Admin authorization.
   */
  const {
    data: admin,
    error: adminError,
  } = await supabaseAdmin
    .from("soccar_admins")
    .select(
      `
        id,
        member_id,
        role,
        status
      `
    )
    .eq("member_id", member.id)
    .maybeSingle();

  if (
    adminError ||
    !admin ||
    admin.status !== "ACTIVE"
  ) {
    redirect("/dashboard");
  }

  /*
   * 5. Reject unknown or unsupported roles.
   *
   * v1 intentionally supports SUPER_ADMIN only.
   */
  if (admin.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  return {
    adminId: admin.id,
    memberId: member.id,
    authUserId: user.id,
    firstName: member.first_name,
    lastName: member.last_name,
    email: member.email,
    role: admin.role as SoccaRAdminRole,
  };
}