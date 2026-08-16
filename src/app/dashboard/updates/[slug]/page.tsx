import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient as createAdminClient } from "@supabase/supabase-js";

import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
} from "lucide-react";

import DashboardShell from "../../DashboardShell";
import CommunicationRenderer from "@/app/admin/communications/CommunicationRenderer";

import {
  getFounderDashboardData,
} from "../../getFounderDashboardData";

import styles from "./UpdateArticle.module.css";

type IndividualUpdatePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatUpdateDate(
  value: string
) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "long",
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

export default async function IndividualUpdatePage({
  params,
}: IndividualUpdatePageProps) {
  const { slug } =
    await params;

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
    data: update,
    error: updateError,
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
    .eq(
      "slug",
      slug
    )
    .eq(
      "status",
      "PUBLISHED"
    )
    .maybeSingle();

  if (
    updateError ||
    !update ||
    !update.published_at
  ) {
    notFound();
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
          update.id,
        member_id:
          founder.memberId,
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
      "Unable to mark Founder Update as read:",
      readError
    );
  }

  const {
    data: publishedUpdates,
    error: publishedError,
  } = await supabaseAdmin
    .from("founder_updates")
    .select("id")
    .eq(
      "status",
      "PUBLISHED"
    );

  if (publishedError) {
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

  const unreadCount =
    (
      publishedUpdates ?? []
    ).filter(
      (item) =>
        !readIds.has(
          item.id
        )
    ).length;

  const categoryLabel =
    getCategoryLabel(
      update.category
    );

  const articleDate =
    formatUpdateDate(
      update.published_at
    );

  const articleTime =
    formatUpdateTime(
      update.published_at
    );

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
      contentMode="editorial"
    >
      <article
        className={
          styles.article
        }
      >
        <Link
          href="/dashboard/updates"
          className={
            styles.backLink
          }
        >
          <ArrowLeft
            size={16}
            strokeWidth={1.8}
          />

          Back to Founder Updates
        </Link>

        <div
          className={
            styles.articleGrid
          }
        >
          <main
            className={
              styles.articleMain
            }
          >
            <div
              className={
                styles.articleStatus
              }
            >
              <span
                className={
                  styles.category
                }
              >
                {categoryLabel}
              </span>

              <span
                className={
                  styles.statusDot
                }
              />

              <span
                className={
                  styles.readState
                }
              >
                <Check
                  size={12}
                  strokeWidth={2}
                />

                Read
              </span>
            </div>

            <h1
              className={
                styles.title
              }
            >
              {update.title}
            </h1>

            <p
              className={
                styles.excerpt
              }
            >
              {update.excerpt}
            </p>

            <div
              className={
                styles.headerRule
              }
            />

            <section
              className={
                styles.body
              }
            >
              <CommunicationRenderer
                content={String(
                  update.body
                )}
              />
            </section>

            <footer
              className={
                styles.footer
              }
            >
              <p
                className={
                  styles.footerLabel
                }
              >
                SoccaR Founding Community
              </p>

              <div
                className={
                  styles.footerBottom
                }
              >
                <p
                  className={
                    styles.footerCopy
                  }
                >
                  Founder communications,
                  opportunities and
                  platform developments
                  will continue to appear
                  in your SoccaR
                  Dashboard.
                </p>

                <Link
                  href="/dashboard/updates"
                  className={
                    styles.returnButton
                  }
                >
                  <ArrowLeft
                    size={14}
                    strokeWidth={1.8}
                  />

                  Return to Updates
                </Link>
              </div>
            </footer>
          </main>

          <aside
            className={
              styles.sideColumn
            }
          >
            <section
              className={
                styles.metaCard
              }
            >
              <div
                className={
                  styles.metaIdentity
                }
              >
                <span
                  className={
                    styles.teamAvatar
                  }
                >
                  ST
                </span>

                <div>
                  <p
                    className={
                      styles.teamName
                    }
                  >
                    SoccaR Team
                  </p>

                  <p
                    className={
                      styles.teamRole
                    }
                  >
                    Founder Communication
                  </p>
                </div>
              </div>

              <div
                className={
                  styles.metaDivider
                }
              />

              <div
                className={
                  styles.metaDetails
                }
              >
                <div
                  className={
                    styles.metaRow
                  }
                >
                  <CalendarDays
                    size={14}
                    strokeWidth={1.6}
                  />

                  {articleDate}
                </div>

                <div
                  className={
                    styles.metaRow
                  }
                >
                  <Clock3
                    size={14}
                    strokeWidth={1.6}
                  />

                  {articleTime}
                </div>
              </div>
            </section>

            <section
              className={
                styles.noteCard
              }
            >
              <p
                className={
                  styles.noteLabel
                }
              >
                Founder Note
              </p>

              <p
                className={
                  styles.noteCopy
                }
              >
                You were here at the
                beginning. This
                communication is part
                of your permanent
                Founder journey with
                SoccaR.
              </p>
            </section>
          </aside>
        </div>
      </article>
    </DashboardShell>
  );
}