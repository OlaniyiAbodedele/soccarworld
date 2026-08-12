"use client";

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

import styles from "./UpdatesClient.module.css";

type UpdateItem = {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  time: string;
  unread: boolean;
  visual:
    | "access"
    | "community"
    | "product"
    | "announcement";
};

const recentUpdates: UpdateItem[] = [
  {
    id: 1,
    category: "Early Access",
    title:
      "Early Access: Platform Preview Incoming",
    excerpt:
      "We’re preparing an early preview of the SoccaR platform for our Founders. More details coming soon.",
    date: "12 Aug 2026",
    time: "10:45 AM",
    unread: true,
    visual: "access",
  },
  {
    id: 2,
    category: "Founding Community",
    title:
      "Founder Spotlight: You Are the First",
    excerpt:
      "A message of gratitude to our Founders who are helping shape the future of global football.",
    date: "10 Aug 2026",
    time: "04:30 PM",
    unread: true,
    visual: "community",
  },
  {
    id: 3,
    category: "Product Update",
    title:
      "Platform Development Progress",
    excerpt:
      "A look at what our team has been building and what’s next on our roadmap.",
    date: "08 Aug 2026",
    time: "09:15 AM",
    unread: false,
    visual: "product",
  },
  {
    id: 4,
    category: "Announcement",
    title: "Join the Conversation",
    excerpt:
      "We’ve opened new channels for Founders to connect, share ideas and be part of the journey.",
    date: "05 Aug 2026",
    time: "11:20 AM",
    unread: false,
    visual: "announcement",
  },
];

function UpdateVisual({
  type,
}: {
  type: UpdateItem["visual"];
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

export default function UpdatesClient() {
  return (
    <div className={styles.updatesPage}>
      <section
        className={styles.pageHeader}
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
            SoccaR team, exclusively
            for our Founding
            Community.
          </p>
        </div>

        <button
          type="button"
          className={
            styles.markAllButton
          }
        >
          <Check
            size={14}
            strokeWidth={2}
          />
          Mark all as read
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
          <article
            className={
              styles.featuredUpdate
            }
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

                  <span
                    className={
                      styles.newPill
                    }
                  >
                    New
                  </span>
                </div>

                <div
                  className={
                    styles.featuredCopy
                  }
                >
                  <h2>
                    Welcome to the
                    Beginning.
                  </h2>

                  <p>
                    Thank you for
                    being part of the
                    earliest chapter
                    in SoccaR. Your
                    belief in our
                    mission fuels
                    everything we are
                    building.
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
                      12 Aug 2026
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
                  <span>
                    S
                  </span>
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
          </article>

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
                4 updates
              </span>
            </div>

            <div
              className={
                styles.updateList
              }
            >
              {recentUpdates.map(
                (update) => (
                  <article
                    key={
                      update.id
                    }
                    className={
                      styles.updateRow
                    }
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
                  </article>
                )
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
                12 total
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
                  12
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
                  4
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
                  4
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
                  3
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
                  1
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
                  2
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
                  3
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
                    strokeWidth={
                      1.7
                    }
                  />
                </div>

                <strong>
                  9
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
                    strokeWidth={
                      1.7
                    }
                  />
                </div>

                <strong>
                  12
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