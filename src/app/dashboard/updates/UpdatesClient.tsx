"use client";

import {
  useState,
} from "react";

import Link from "next/link";

import {
  BellRing,
  Box,
  Check,
  CheckCircle2,
  Gift,
  Grid2X2,
  LockKeyhole,
  Megaphone,
  Monitor,
  UsersRound,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import styles from "./UpdatesClient.module.css";

export type FounderUpdate = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;

  category: string;

  rawCategory:
    | "PLATFORM"
    | "FOUNDING_COMMUNITY"
    | "PRODUCT"
    | "EARLY_ACCESS"
    | "ANNOUNCEMENT"
    | string;

  date: string;
  time: string;

  unread: boolean;
  featured: boolean;

  visual:
    | "access"
    | "community"
    | "product"
    | "announcement";
};

export type UpdateCategoryCounts = {
  platform: number;
  foundingCommunity: number;
  product: number;
  earlyAccess: number;
  announcements: number;
};

type UpdatesClientProps = {
  featuredUpdate:
    | FounderUpdate
    | null;

  recentUpdates:
    FounderUpdate[];

  totalCount: number;
  unreadCount: number;
  readCount: number;

  categoryCounts:
    UpdateCategoryCounts;
};

type ReadResponse = {
  success: boolean;
  markedCount?: number;
  message?: string;
};

function UpdateVisual({
  type,
}: {
  type: FounderUpdate["visual"];
}) {
  if (type === "access") {
    return (
      <div
        className={`${styles.updateVisual} ${styles.accessVisual}`}
      >
        <LockKeyhole
          size={34}
          strokeWidth={1.4}
        />
      </div>
    );
  }

  if (type === "community") {
    return (
      <div
        className={`${styles.updateVisual} ${styles.communityVisual}`}
      >
        <UsersRound
          size={34}
          strokeWidth={1.4}
        />
      </div>
    );
  }

  if (type === "product") {
    return (
      <div
        className={`${styles.updateVisual} ${styles.productVisual}`}
      >
        <Monitor
          size={34}
          strokeWidth={1.4}
        />
      </div>
    );
  }

  return (
    <div
      className={`${styles.updateVisual} ${styles.announcementVisual}`}
    >
      <Megaphone
        size={34}
        strokeWidth={1.4}
      />
    </div>
  );
}

export default function UpdatesClient({
  featuredUpdate,
  recentUpdates,
  totalCount,
  unreadCount,
  readCount,
  categoryCounts,
}: UpdatesClientProps) {
  const router =
    useRouter();

  const [
    markingAll,
    setMarkingAll,
  ] = useState(false);

  const [
    actionError,
    setActionError,
  ] = useState<
    string | null
  >(null);

  async function markAllAsRead() {
    if (
      unreadCount === 0 ||
      markingAll
    ) {
      return;
    }

    try {
      setActionError(null);
      setMarkingAll(true);

      const response =
        await fetch(
          "/api/founder/updates/read",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              markAll: true,
            }),
          }
        );

      const result =
        (await response.json()) as ReadResponse;

      if (
        !response.ok ||
        !result.success
      ) {
        setActionError(
          result.message ||
            "We could not mark your Founder Updates as read."
        );

        return;
      }

      router.refresh();
    } catch (error) {
      console.error(
        "Mark all Founder Updates as read error:",
        error
      );

      setActionError(
        "Something unexpected happened while updating your Founder read status."
      );
    } finally {
      setMarkingAll(false);
    }
  }

  return (
    <div
      className={
        styles.updatesPage
      }
    >
      <section
        className={
          styles.pageHeader
        }
      >
        <div
          className={
            styles.pageHeaderCopy
          }
        >
          <p
            className={
              styles.pageEyebrow
            }
          >
            Updates from SoccaR
          </p>

          <h1
            className={
              styles.pageTitle
            }
          >
            Stay informed.
            <br />
            Stay ahead.
          </h1>

          <p
            className={
              styles.pageIntroduction
            }
          >
            Important updates,
            product progress and
            opportunities from the
            SoccaR team,
            exclusively for our
            Founding Community.
          </p>

          {actionError && (
            <p
              style={{
                marginTop: "12px",
                color: "#ff6259",
                fontSize: "11px",
                lineHeight: 1.5,
              }}
            >
              {actionError}
            </p>
          )}
        </div>

        <button
          type="button"
          className={
            styles.markAllButton
          }
          onClick={
            markAllAsRead
          }
          disabled={
            unreadCount === 0 ||
            markingAll
          }
        >
          <Check
            size={14}
            strokeWidth={2}
          />

          {markingAll
            ? "Updating…"
            : unreadCount === 0
            ? "All read"
            : "Mark all as read"}
        </button>
      </section>

      <div
        className={
          styles.pageGrid
        }
      >
        <div
          className={
            styles.primaryColumn
          }
        >
          {featuredUpdate && (
            <Link
              href={`/dashboard/updates/${featuredUpdate.slug}`}
              className={styles.featuredUpdate}
              aria-label={`Open ${featuredUpdate.title}`}
            >
              <div
                className={
                  styles.featuredGlow
                }
              />

              <div
                className={
                  styles.featuredGrid
                }
              >
                <div
                  className={
                    styles.featuredContent
                  }
                >
                  <div
                    className={
                      styles.featuredTop
                    }
                  >
                    <span
                      className={
                        styles.featuredLabel
                      }
                    >
                      <span
                        className={
                          styles.featuredIcon
                        }
                      >
                        ★
                      </span>

                      Featured Update
                    </span>

                    {featuredUpdate.unread && (
                      <span
                        className={
                          styles.newPill
                        }
                      >
                        New
                      </span>
                    )}
                  </div>

                  <div
                    className={
                      styles.featuredCopy
                    }
                  >
                    <h2>
                      {
                        featuredUpdate.title
                      }
                    </h2>

                    <p>
                      {
                        featuredUpdate.excerpt
                      }
                    </p>

                    <div
                      className={
                        styles.featuredMeta
                      }
                    >
                      <span
                        className={
                          styles.teamAvatar
                        }
                      >
                        ST
                      </span>

                      <span>
                        SoccaR Team
                      </span>

                      <span
                        className={
                          styles.metaDot
                        }
                      />

                      <span>
                        {
                          featuredUpdate.date
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={
                    styles.featuredArtwork
                  }
                  aria-hidden="true"
                >
                  <div
                    className={
                      styles.artGrid
                    }
                  />

                  <div
                    className={
                      styles.globeOuter
                    }
                  />

                  <div
                    className={
                      styles.globeMiddle
                    }
                  />

                  <div
                    className={
                      styles.globeCore
                    }
                  >
                    <span>S</span>
                  </div>

                  <div
                    className={
                      styles.footballOrb
                    }
                  >
                    ⚽
                  </div>

                  <div
                    className={
                      styles.artLightOne
                    }
                  />

                  <div
                    className={
                      styles.artLightTwo
                    }
                  />
                </div>
              </div>
            </Link>
          )}

          <section
            className={
              styles.recentSection
            }
          >
            <div
              className={
                styles.sectionHeading
              }
            >
              <p
                className={
                  styles.sectionLabel
                }
              >
                Recent Updates
              </p>

              <span
                className={
                  styles.sectionCount
                }
              >
                {
                  recentUpdates.length
                }{" "}
                {recentUpdates.length ===
                1
                  ? "update"
                  : "updates"}
              </span>
            </div>

            <div
              className={
                styles.updateList
              }
            >
              {recentUpdates.map(
                (update) => (
                  <Link
                    key={
                      update.id
                    }
                    href={`/dashboard/updates/${update.slug}`}
                    className={
                      styles.updateRow
                    }
                    aria-label={`Open ${update.title}`}
                  >
                    <div
                      className={
                        update.unread
                          ? styles.unreadDot
                          : styles.readDot
                      }
                    />

                    <UpdateVisual
                      type={
                        update.visual
                      }
                    />

                    <div
                      className={
                        styles.updateCopy
                      }
                    >
                      <p
                        className={
                          styles.updateCategory
                        }
                      >
                        {
                          update.category
                        }
                      </p>

                      <h3>
                        {
                          update.title
                        }
                      </h3>

                      <p
                        className={
                          styles.updateExcerpt
                        }
                      >
                        {
                          update.excerpt
                        }
                      </p>
                    </div>

                    <div
                      className={
                        styles.updateDate
                      }
                    >
                      <span>
                        {
                          update.date
                        }
                      </span>

                      <span>
                        {
                          update.time
                        }
                      </span>

                      {update.unread && (
                        <span
                          className={
                            styles.rowNewBadge
                          }
                        >
                          New
                        </span>
                      )}
                    </div>
                  </Link>
                )
              )}

              {recentUpdates.length ===
                0 && (
                <div
                  style={{
                    padding:
                      "36px 28px",
                    color:
                      "rgba(255,255,255,0.42)",
                    fontSize:
                      "12px",
                    lineHeight: 1.7,
                  }}
                >
                  No recent SoccaR
                  updates are
                  available yet.
                </div>
              )}
            </div>
          </section>
        </div>

        <aside
          className={
            styles.rightColumn
          }
        >
          <section
            className={
              styles.sideCard
            }
          >
            <div
              className={
                styles.sideCardHeader
              }
            >
              <p
                className={
                  styles.sideTitle
                }
              >
                Browse by category
              </p>

              <span>
                {totalCount} total
              </span>
            </div>

            <div
              className={
                styles.categoryList
              }
            >
              <div
                className={`${styles.categoryRow} ${styles.categoryActive}`}
              >
                <Grid2X2
                  size={16}
                  strokeWidth={1.7}
                />

                <span>
                  All Updates
                </span>

                <strong>
                  {totalCount}
                </strong>
              </div>

              <div
                className={
                  styles.categoryRow
                }
              >
                <Monitor
                  size={16}
                  strokeWidth={1.7}
                />

                <span>
                  Platform
                </span>

                <strong>
                  {
                    categoryCounts.platform
                  }
                </strong>
              </div>

              <div
                className={
                  styles.categoryRow
                }
              >
                <UsersRound
                  size={16}
                  strokeWidth={1.7}
                />

                <span>
                  Founding Community
                </span>

                <strong>
                  {
                    categoryCounts.foundingCommunity
                  }
                </strong>
              </div>

              <div
                className={
                  styles.categoryRow
                }
              >
                <Box
                  size={16}
                  strokeWidth={1.7}
                />

                <span>
                  Product
                </span>

                <strong>
                  {
                    categoryCounts.product
                  }
                </strong>
              </div>

              <div
                className={
                  styles.categoryRow
                }
              >
                <Gift
                  size={16}
                  strokeWidth={1.7}
                />

                <span>
                  Early Access
                </span>

                <strong>
                  {
                    categoryCounts.earlyAccess
                  }
                </strong>
              </div>

              <div
                className={
                  styles.categoryRow
                }
              >
                <Megaphone
                  size={16}
                  strokeWidth={1.7}
                />

                <span>
                  Announcements
                </span>

                <strong>
                  {
                    categoryCounts.announcements
                  }
                </strong>
              </div>
            </div>
          </section>

          <section
            className={
              styles.sideCard
            }
          >
            <p
              className={
                styles.sideTitle
              }
            >
              Your update summary
            </p>

            <div
              className={
                styles.summaryList
              }
            >
              <div
                className={
                  styles.summaryRow
                }
              >
                <div
                  className={`${styles.summaryIcon} ${styles.summaryUnread}`}
                >
                  <span />
                </div>

                <strong>
                  {unreadCount}
                </strong>

                <div>
                  <p>
                    Unread updates
                  </p>

                  <span>
                    New since your
                    last visit
                  </span>
                </div>
              </div>

              <div
                className={
                  styles.summaryRow
                }
              >
                <div
                  className={`${styles.summaryIcon} ${styles.summaryRead}`}
                >
                  <CheckCircle2
                    size={17}
                    strokeWidth={1.7}
                  />
                </div>

                <strong>
                  {readCount}
                </strong>

                <div>
                  <p>
                    Read updates
                  </p>

                  <span>
                    Previously viewed
                  </span>
                </div>
              </div>

              <div
                className={
                  styles.summaryRow
                }
              >
                <div
                  className={
                    styles.summaryIcon
                  }
                >
                  <BellRing
                    size={17}
                    strokeWidth={1.7}
                  />
                </div>

                <strong>
                  {totalCount}
                </strong>

                <div>
                  <p>
                    Total updates
                  </p>

                  <span>
                    Across all
                    categories
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section
            className={
              styles.directCard
            }
          >
            <div
              className={
                styles.directIcon
              }
            >
              <BellRing
                size={19}
                strokeWidth={1.6}
              />
            </div>

            <div>
              <p
                className={
                  styles.directEyebrow
                }
              >
                Founder communication
              </p>

              <h3>
                Direct updates to
                you.
              </h3>

              <p
                className={
                  styles.directCopy
                }
              >
                Important product,
                community and early
                access information
                from SoccaR in one
                place.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}