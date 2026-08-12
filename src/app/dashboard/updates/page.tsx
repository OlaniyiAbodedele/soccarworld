import { createClient as createAdminClient } from "@supabase/supabase-js";

import DashboardShell from "../DashboardShell";
import {
  getFounderDashboardData,
} from "../getFounderDashboardData";

import UpdatesClient, {
  type FounderUpdate,
  type UpdateCategoryCounts,
} from "./UpdatesClient";

function formatUpdateDate(
  value: string
) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }
  ).format(new Date(value));
}

function formatUpdateTime(
  value: string
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    }
  ).format(new Date(value));
}

function getVisualType(
  category: string
): FounderUpdate["visual"] {
  switch (category) {
    case "EARLY_ACCESS":
      return "access";

    case "FOUNDING_COMMUNITY":
      return "community";

    case "PRODUCT":
    case "PLATFORM":
      return "product";

    case "ANNOUNCEMENT":
    default:
      return "announcement";
  }
}

function getCategoryLabel(
  category: string
) {
  switch (category) {
    case "PLATFORM":
      return "Platform";

    case "FOUNDING_COMMUNITY":
      return "Founding Community";

    case "PRODUCT":
      return "Product Update";

    case "EARLY_ACCESS":
      return "Early Access";

    case "ANNOUNCEMENT":
      return "Announcement";

    default:
      return category;
  }
}

export default async function UpdatesPage() {
  const founder =
    await getFounderDashboardData();

  const supabaseUrl =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SECRET_KEY;

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
    data: updateRows,
    error: updatesError,
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
        is_featured,
        published_at
      `
    )
    .eq("status", "PUBLISHED")
    .order(
      "published_at",
      {
        ascending: false,
      }
    );

  if (updatesError) {
    console.error(
      "Unable to load Founder Updates:",
      updatesError
    );

    throw new Error(
      "Could not load Founder Updates."
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
      "Could not load Founder Update read state."
    );
  }

  const readUpdateIds =
    new Set(
      (readRows ?? []).map(
        (row) => row.update_id
      )
    );

  const updates: FounderUpdate[] =
    (updateRows ?? [])
      .filter(
        (update) =>
          update.published_at !==
          null
      )
      .map((update) => ({
        id: update.id,

        slug: update.slug,

        title:
          update.title,

        excerpt:
          update.excerpt,

        body:
          update.body,

        category:
          getCategoryLabel(
            update.category
          ),

        rawCategory:
          update.category,

        date:
          formatUpdateDate(
            update.published_at!
          ),

        time:
          formatUpdateTime(
            update.published_at!
          ),

        unread:
          !readUpdateIds.has(
            update.id
          ),

        featured:
          update.is_featured,

        visual:
          getVisualType(
            update.category
          ),
      }));

  const featuredUpdate =
    updates.find(
      (update) =>
        update.featured
    ) ?? null;

  const recentUpdates =
    updates.filter(
      (update) =>
        !update.featured
    );

  const totalCount =
    updates.length;

  const unreadCount =
    updates.filter(
      (update) =>
        update.unread
    ).length;

  const readCount =
    totalCount -
    unreadCount;

  const categoryCounts: UpdateCategoryCounts =
    {
      platform:
        updates.filter(
          (update) =>
            update.rawCategory ===
            "PLATFORM"
        ).length,

      foundingCommunity:
        updates.filter(
          (update) =>
            update.rawCategory ===
            "FOUNDING_COMMUNITY"
        ).length,

      product:
        updates.filter(
          (update) =>
            update.rawCategory ===
            "PRODUCT"
        ).length,

      earlyAccess:
        updates.filter(
          (update) =>
            update.rawCategory ===
            "EARLY_ACCESS"
        ).length,

      announcements:
        updates.filter(
          (update) =>
            update.rawCategory ===
            "ANNOUNCEMENT"
        ).length,
    };

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
      activeSection="updates"
      unreadUpdates={
        unreadCount
      }
    >
      <UpdatesClient
        featuredUpdate={
          featuredUpdate
        }
        recentUpdates={
          recentUpdates
        }
        totalCount={
          totalCount
        }
        unreadCount={
          unreadCount
        }
        readCount={
          readCount
        }
        categoryCounts={
          categoryCounts
        }
      />
    </DashboardShell>
  );
}