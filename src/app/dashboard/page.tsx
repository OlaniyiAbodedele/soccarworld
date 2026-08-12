import {
  createClient as createAdminClient,
} from "@supabase/supabase-js";

import DashboardShell from "./DashboardShell";

import {
  getFounderDashboardData,
} from "./getFounderDashboardData";

export default async function DashboardPage() {
  const founder =
    await getFounderDashboardData();

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
      "Unable to load published Founder Updates:",
      publishedError
    );

    throw new Error(
      "Could not calculate Founder Update totals."
    );
  }

  const {
    data: readRows,
    error: readsError,
  } = await supabaseAdmin
    .from(
      "founder_update_reads"
    )
    .select("update_id")
    .eq(
      "member_id",
      founder.memberId
    );

  if (readsError) {
    console.error(
      "Unable to load Founder Update read state:",
      readsError
    );

    throw new Error(
      "Could not calculate Founder read state."
    );
  }

  const readIds =
    new Set(
      (readRows ?? []).map(
        (row) =>
          row.update_id
      )
    );

  const unreadUpdates =
    (
      publishedUpdates ?? []
    ).filter(
      (update) =>
        !readIds.has(
          update.id
        )
    ).length;

  return (
    <DashboardShell
      firstName={
        founder.firstName
      }
      lastName={
        founder.lastName
      }
      founderNumber={
        founder.founderNumber
      }
      email={
        founder.email
      }
      memberType={
        founder.memberType
      }
      countryOfResidence={
        founder.countryOfResidence
      }
      countryOfOrigin={
        founder.countryOfOrigin
      }
      cityOfResidence={
        founder.cityOfResidence
      }
      username={
        founder.username
      }
      activeSection="dashboard"
      unreadUpdates={
        unreadUpdates
      }
    />
  );
}